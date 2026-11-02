// Mesure objective d'une prise de voix, pour refuser une lecture monotone ou précipitée.
// La synthèse (Gemini TTS via OpenRouter) n'est pas déterministe : deux prises du même texte
// peuvent donner une voix posée ou un débit rapide et plat. On mesure, on garde la meilleure.
//
// Trois indicateurs, aucun ne demande de tendre l'oreille :
//   - débit (mots/min) : la parole utile (premier au dernier mot) ;
//   - mélodie : 90e centile de la fréquence fondamentale (f0) rapporté à sa médiane. Une voix
//     plate tourne autour de 1,2 ; une voix qui module passe 1,4 ;
//   - pauses : silences >= 250 ms (une respiration toutes les deux phrases, environ).
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

export type QualiteVoix = {
  secondes: number;
  motsParMinute: number;
  medianeHz: number;
  melodieHz: number;
  ratioMelodie: number;
  pauses: number;
};

/** Seuils de refus. Mesurés sur les épisodes 007 à 010 (02/11/2026) :
 *  débit 167 à 190 mots/min, ratio 1,23 (monotone, #010) à 1,65. */
export const SEUILS = {motsParMinute: 185, ratioMelodie: 1.35, pauses: 6};

/** Fréquence fondamentale par autocorrélation sur des fenêtres de 40 ms (pas 20 ms). */
const hauteurs = (x: Float32Array, sr: number): number[] => {
  const n = Math.round(sr * 0.04);
  const pas = Math.round(sr * 0.02);
  const min = Math.round(sr / 400);
  const max = Math.round(sr / 70);
  const f0: number[] = [];
  for (let i = 0; i + n + max < x.length; i += pas) {
    let energie = 0;
    for (let k = i; k < i + n; k++) energie += x[k] * x[k];
    if (Math.sqrt(energie / n) < 0.01) continue; // silence : pas de hauteur
    let moyenne = 0;
    for (let k = i; k < i + n; k++) moyenne += x[k];
    moyenne /= n;
    let meilleur = 0;
    let decalage = 0;
    for (let d = min; d <= max; d++) {
      let corr = 0;
      for (let k = i; k < i + n; k++) corr += (x[k] - moyenne) * (x[k + d] - moyenne);
      if (corr > meilleur) {
        meilleur = corr;
        decalage = d;
      }
    }
    if (decalage > 0) f0.push(sr / decalage);
  }
  return f0;
};

/** Durée du fichier, en secondes (ffprobe). */
const dureeFichier = (mp3: string): number =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', mp3]).toString().trim());

const centile = (valeurs: number[], p: number): number => {
  if (!valeurs.length) return 0;
  const tri = [...valeurs].sort((a, b) => a - b);
  return tri[Math.min(tri.length - 1, Math.floor(tri.length * p))];
};

/** Nombre de silences >= 250 ms, d'après le filtre silencedetect de ffmpeg. */
const compterPauses = (mp3: string): number => {
  const sortie = execFileSync('sh', [
    '-c',
    `ffmpeg -hide_banner -nostats -i "${mp3}" -af silencedetect=noise=-35dB:d=0.25 -f null - 2>&1 | grep -c silence_start || true`,
  ]).toString();
  return Number(sortie.trim()) || 0;
};

/**
 * Mesure une prise. `mots` = nombre de mots du script, `debut`/`fin` = bornes du premier et du
 * dernier mot (temps de parole utile, fourni par l'alignement Whisper).
 */
export const mesurer = (mp3: string, mots: number, debut: number, fin: number): QualiteVoix => {
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], {
    maxBuffer: 1 << 28,
  });
  const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
  const sr = 16000;
  const f0 = hauteurs(x, sr);
  const mediane = centile(f0, 0.5);
  const melodie = centile(f0, 0.9);
  const utile = Math.max(0.5, fin - debut);
  return {
    secondes: Math.round((x.length / sr) * 100) / 100,
    motsParMinute: Math.round((mots / utile) * 60),
    medianeHz: Math.round(mediane),
    melodieHz: Math.round(melodie),
    ratioMelodie: mediane ? Math.round((melodie / mediane) * 100) / 100 : 0,
    pauses: compterPauses(mp3),
  };
};

/** Motifs de refus (vide : la prise est bonne) : voix plate ou hachée. Le débit n'en fait pas
 *  partie — une voix rapide reste intelligible et le texte, lui, ne change pas d'une prise à
 *  l'autre : il se recale (calerDebit) et, s'il reste rapide, se règle à l'écriture du script. */
export const defauts = (q: QualiteVoix): string[] => {
  const d: string[] = [];
  if (q.ratioMelodie < SEUILS.ratioMelodie) d.push(`voix plate (mélodie ${q.ratioMelodie} / plancher ${SEUILS.ratioMelodie})`);
  if (q.pauses < SEUILS.pauses) d.push(`${q.pauses} pauses seulement (min ${SEUILS.pauses})`);
  return d;
};

/** Écart au profil de la voix : une prise qui s'éloigne trop de la hauteur de référence n'est
 *  pas Matou (autre locuteur, autre modèle), même si elle est bien articulée. */
export const ecartVoix = (q: QualiteVoix, profil: {medianeHz: number; tolerance: number}): string[] => {
  const mini = profil.medianeHz * (1 - profil.tolerance);
  const maxi = profil.medianeHz * (1 + profil.tolerance);
  return q.medianeHz < mini || q.medianeHz > maxi
    ? [`timbre éloigné (médiane ${q.medianeHz} Hz, attendu ${Math.round(mini)}-${Math.round(maxi)})`]
    : [];
};

/** Débit trop rapide : signalé, jamais bloquant (le texte est le même d'une prise à l'autre :
 *  on le recale avec calerDebit, sinon c'est le script qu'il faut raccourcir). */
export const avertissements = (q: QualiteVoix): string[] =>
  q.motsParMinute > SEUILS.motsParMinute ? [`débit ${q.motsParMinute} mots/min (viser ${SEUILS.motsParMinute})`] : [];

/** Score de comparaison entre prises : plus haut = mieux (mélodie d'abord, puis débit). */
export const score = (q: QualiteVoix): number =>
  q.ratioMelodie * 100 - Math.max(0, q.motsParMinute - 150) * 0.2 + Math.min(q.pauses, 20) * 0.5;

/** Ralentit la prise si le débit dépasse le seuil (atempo : la hauteur et le timbre sont gardés).
 *  Plancher 0,92 : au-delà, la voix traîne et siffle — mieux vaut alors raccourcir le script. */
export const calerDebit = (mp3: string, q: QualiteVoix, mots: number): QualiteVoix => {
  if (q.motsParMinute <= SEUILS.motsParMinute) return q;
  const facteur = Math.max(0.92, SEUILS.motsParMinute / q.motsParMinute);
  if (facteur > 0.985) return q;
  const tmp = mp3.replace(/\.mp3$/, '.debit.mp3');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp3, '-af', `atempo=${facteur.toFixed(3)}`, '-ar', '44100', '-b:a', '96k', tmp]);
  fs.renameSync(tmp, mp3);
  return mesurer(mp3, mots, 0, dureeFichier(mp3));
};

export const resume = (q: QualiteVoix): string =>
  `${q.motsParMinute} mots/min, mélodie ${q.ratioMelodie}, ${q.pauses} pauses, médiane ${q.medianeHz} Hz`;
