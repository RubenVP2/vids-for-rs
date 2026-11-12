// Mesure objective d'une prise de voix : voix plate, hachée ou trop lente/précipitée se voient dans les
// chiffres avant de s'entendre. La synthèse (Gemini TTS via OpenRouter) n'est pas déterministe :
// deux prises du même texte peuvent donner une lecture vive et modulée ou un débit lent et monotone.
//
// Trois indicateurs :
//   - débit (mots/min) sur la parole utile (premier au dernier mot) ;
//   - intonation : écart p20-p80 de la fréquence fondamentale, en demi-tons. Une lecture plate
//     tient dans 3-4 demi-tons, une voix qui module en fait 5,5 et plus ;
//   - pauses : silences >= 150 ms, rapportés au nombre de phrases.
//
// La hauteur est estimée par corrélation croisée normalisée (NCCF) : une trame n'est retenue que
// si son pic dépasse VOISEMENT, et c'est le premier pic proche du maximum qui donne la période
// (prendre le maximum global tombe souvent sur la double période, une octave trop bas).
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import {DEBIT_RAPIDE, type Debit} from './rythme';

export type QualiteVoix = {
  secondes: number;
  motsParMinute: number;
  medianeHz: number;
  /** Écart p20-p80 de la hauteur, en demi-tons : mesure de l'intonation. */
  melodieDemiTons: number;
  pauses: number;
  /** Phrases du script, pour rapporter les pauses. */
  phrases: number;
};

/** Seuils, calibrés sur #000 et les épisodes 000-017 :
 *  - débit : entre 198 et 230 mots/min utiles (cible 204 mots/min ~ 3,4 mots/s, vivant mais lisible) ;
 *  - intonation : avec le lissage, Puck donne 5,8 à 9,6 demi-tons d'écart p20-p80, une prise
 *    volontairement plate de Puck 3,2 à 4,8, la voix de secours MAI « Marc » 4,3 — seuil 5,5 ;
 *  - pauses : au moins 0,5 pause >= 150 ms par phrase (blancs internes > 260 ms ramenés à 220 ms,
 *    et respirations inter-scènes préservées à 350 ms pour laisser le temps de lire les cartes). */
export const SEUILS = {
  ...DEBIT_RAPIDE,
  melodieDemiTons: 5.5,
  pausesParPhrase: 0.5,
};

const FENETRE = 0.04; // 40 ms
const PAS = 0.02; // 20 ms
const VOISEMENT = 0.5; // NCCF minimal d'une trame voisée

/** Durée du fichier, en secondes (ffprobe). */
export const duree = (mp3: string): number =>
  Number(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', mp3])
      .toString()
      .trim(),
  );

/** Fréquence fondamentale des trames voisées (NCCF, premier pic proche du maximum). */
const hauteurs = (x: Float32Array, sr: number): number[] => {
  const n = Math.round(sr * FENETRE);
  const pas = Math.round(sr * PAS);
  const minLag = Math.round(sr / 400); // 400 Hz
  const maxLag = Math.round(sr / 70); // 70 Hz
  const energie = new Float32Array(x.length + 1);
  for (let k = 0; k < x.length; k++) energie[k + 1] = energie[k] + x[k] * x[k];
  const energieDe = (debut: number, largeur: number) => energie[debut + largeur] - energie[debut];
  const f0: number[] = [];
  for (let i = 0; i + n + maxLag < x.length; i += pas) {
    const ea = energieDe(i, n);
    if (Math.sqrt(ea / n) < 0.02) continue; // silence ou souffle faible (-34 dBFS)
    let moyenne = 0;
    for (let k = 0; k < n; k++) moyenne += x[i + k];
    moyenne /= n;
    let maximum = 0;
    const correlation = new Float32Array(maxLag + 1);
    for (let d = minLag; d <= maxLag; d++) {
      let produit = 0;
      for (let k = 0; k < n; k++) produit += (x[i + k] - moyenne) * (x[i + k + d] - moyenne);
      const eb = energieDe(i + d, n);
      const normalise = ea > 1e-9 && eb > 1e-9 ? produit / Math.sqrt(ea * eb) : 0;
      correlation[d] = normalise;
      if (normalise > maximum) maximum = normalise;
    }
    if (maximum < VOISEMENT) continue; // trame non voisée (fricative, bruit)
    for (let d = minLag + 1; d < maxLag; d++) {
      if (
        correlation[d] >= 0.9 * maximum &&
        correlation[d] >= correlation[d - 1] &&
        correlation[d] >= correlation[d + 1]
      ) {
        f0.push(sr / d);
        break;
      }
    }
  }
  return f0;
};

/**
 * Lisse la suite de hauteurs : une octave parasite isolée (pic à la demi-période) est écartée
 * en comparant chaque trame à la médiane de ses voisines (fenêtre 5) et en refusant les sauts
 * de plus de 7 demi-tons d'une trame à l'autre.
 */
const lisser = (f0: number[]): number[] => {
  if (f0.length < 5) return f0;
  const mediane = (valeurs: number[]) => [...valeurs].sort((a, b) => a - b)[Math.floor(valeurs.length / 2)];
  const sortie: number[] = [];
  for (let i = 0; i < f0.length; i++) {
    const fenetre = f0.slice(Math.max(0, i - 2), Math.min(f0.length, i + 3));
    const med = mediane(fenetre);
    if (f0[i] < 0.6 * med || f0[i] > 1.7 * med) continue; // octave ou valeur aberrante
    if (sortie.length) {
      const ecart = Math.abs(12 * Math.log2(f0[i] / sortie[sortie.length - 1]));
      if (ecart > 7) continue; // saut impossible entre deux trames voisines
    }
    sortie.push(f0[i]);
  }
  return sortie;
};

const centile = (valeurs: number[], p: number): number => {
  if (!valeurs.length) return 0;
  const tri = [...valeurs].sort((a, b) => a - b);
  return tri[Math.min(tri.length - 1, Math.floor(tri.length * p))];
};

/** Nombre de silences >= 150 ms (silencedetect de ffmpeg écrit sur stderr). */
const compterPauses = (mp3: string): number => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', mp3, '-af', 'silencedetect=noise=-35dB:d=0.15', '-f', 'null', '-'], {
    encoding: 'utf8',
  });
  return (String(r.stderr ?? '').match(/silence_start/g) ?? []).length;
};

export type CoupeSilence = {debut: number; fin: number};

/**
 * Raccourcit les silences internes excessifs (> 260 ms) à `maxPause` (220 ms par défaut),
 * tout en préservant `pauseScene` (350 ms) aux frontières de scènes pour laisser le temps
 * de lire chaque carte avant la transition suivante.
 * Opère en PCM avec un fondu enchaîné de 8 ms.
 */
/**
 * Filtre ffmpeg qui rogne le silence au début et à la fin d'une prise, puis normalise à -16 LUFS.
 * Seuil bas (-55 dB) et traîne gardée (0,25 s à la fin, 0,05 s au début) : à -45 dB sans traîne
 * (jusqu'au 12/11/2026), la retombée de la dernière syllabe partait avec le silence et chaque
 * prise finissait sèchement, comme coupée (0,38 s retirées sur une prise de 4,2 s).
 */
export const ROGNER_SILENCES =
  'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.25,areverse,loudnorm=I=-16:TP=-1.5:LRA=11';

export const raccourcirSilences = (mp3: string, maxPause = 0.22, frontieres: number[] = [], pauseScene = 0.35): CoupeSilence[] => {
  const det = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', mp3, '-af', 'silencedetect=noise=-38dB:d=0.25', '-f', 'null', '-'], {
    encoding: 'utf8',
  });
  const log = String(det.stderr ?? '');
  const debuts = [...log.matchAll(/silence_start:\s*([\d.]+)/g)].map((m) => Number(m[1]));
  const fins = [...log.matchAll(/silence_end:\s*([\d.]+)/g)].map((m) => Number(m[1]));
  const coupes: CoupeSilence[] = [];
  for (let i = 0; i < Math.min(debuts.length, fins.length); i++) {
    const d = debuts[i],
      f = fins[i];
    const estFrontiere = frontieres.some((fr) => fr >= d - 0.28 && fr <= f + 0.28);
    const cible = estFrontiere ? pauseScene : maxPause;
    // La traîne d'une fin de phrase (souffle, consonne finale douce) passe sous -38 dB avant
    // d'être finie : on en garde plus (60 % de la pause) que de l'attaque du mot suivant (40 %).
    if (d > 0.05 && f - d > cible + 0.04) {
      coupes.push({debut: d + cible * 0.6, fin: f - cible * 0.4});
    }
  }
  if (!coupes.length) return [];

  const sr = 44100;
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', String(sr), '-f', 'f32le', '-'], {
    maxBuffer: 1 << 28,
  });
  const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
  const fondu = Math.round(sr * 0.008);
  const morceaux: Float32Array[] = [];
  let curseur = 0;
  for (const c of coupes) {
    const iDebut = Math.min(x.length, Math.max(curseur, Math.round(c.debut * sr)));
    const iFin = Math.min(x.length, Math.max(iDebut, Math.round(c.fin * sr)));
    if (iDebut > curseur) {
      const bout = x.slice(curseur, iDebut);
      for (let k = 0; k < Math.min(fondu, bout.length); k++) {
        bout[bout.length - 1 - k] *= k / fondu;
      }
      morceaux.push(bout);
    }
    curseur = Math.max(curseur, iFin);
    if (curseur < x.length) {
      for (let k = 0; k < Math.min(fondu, x.length - curseur); k++) {
        x[curseur + k] *= k / fondu;
      }
    }
  }
  if (curseur < x.length) morceaux.push(x.slice(curseur));
  const total = morceaux.reduce((n, m) => n + m.length, 0);
  const out = new Float32Array(total);
  let pos = 0;
  for (const m of morceaux) {
    out.set(m, pos);
    pos += m.length;
  }
  const tmp = mp3.replace(/\.mp3$/, '.silences.mp3');
  try {
    execFileSync(
      'ffmpeg',
      ['-y', '-loglevel', 'error', '-f', 'f32le', '-ar', String(sr), '-ac', '1', '-i', 'pipe:0', '-ar', String(sr), '-b:a', '96k', tmp],
      {input: Buffer.from(out.buffer, out.byteOffset, out.byteLength), maxBuffer: 1 << 28},
    );
    fs.renameSync(tmp, mp3);
  } finally {
    fs.rmSync(tmp, {force: true});
  }
  return coupes;
};

/** Projette un temps `t` (en secondes) après suppression des `coupes` et application de `facteur` (atempo). */
export const projeterTemps = (t: number, coupes: CoupeSilence[], facteur = 1): number => {
  let retire = 0;
  for (const c of coupes) {
    if (t > c.debut) retire += Math.min(t, c.fin) - c.debut;
  }
  return Math.max(0, (t - retire) / facteur);
};

/**
 * Mesure une prise. `mots` = mots réellement prononcés, `debut`/`fin` = bornes de la parole
 * utile (fournies par l'alignement Whisper quand il existe), `phrases` = phrases du script.
 */
export const mesurer = (mp3: string, mots: number, debut: number, fin: number, phrases = 1): QualiteVoix => {
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], {
    maxBuffer: 1 << 28,
  });
  const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
  const f0 = lisser(hauteurs(x, 16000));
  const p20 = centile(f0, 0.2);
  const p80 = centile(f0, 0.8);
  const utile = Math.max(0.5, fin > debut ? fin - debut : x.length / 16000);
  return {
    secondes: Math.round((x.length / 16000) * 100) / 100,
    motsParMinute: Math.round((mots / utile) * 60),
    medianeHz: Math.round(centile(f0, 0.5)),
    melodieDemiTons: p20 > 0 ? Math.round(12 * Math.log2(p80 / p20) * 10) / 10 : 0,
    pauses: compterPauses(mp3),
    phrases: Math.max(1, phrases),
  };
};

/** Motifs de refus (vide : la prise est bonne) : voix plate ou hachée. Le débit n'en fait pas
 *  partie, il se recale après coup (calerDebit) ; s'il reste rapide, c'est le texte qu'il faut
 *  raccourcir, pas une autre prise qu'il faut demander. */
export const defauts = (q: QualiteVoix): string[] => {
  const d: string[] = [];
  if (q.melodieDemiTons < SEUILS.melodieDemiTons) {
    d.push(`voix plate (intonation ${q.melodieDemiTons} demi-tons, plancher ${SEUILS.melodieDemiTons})`);
  }
  const plancher = Math.floor(q.phrases * SEUILS.pausesParPhrase);
  if (q.pauses < plancher) d.push(`${q.pauses} pauses pour ${q.phrases} phrases (min ${plancher})`);
  return d;
};

/** Débit hors plage : signalé, jamais bloquant. */
export const avertissements = (q: QualiteVoix, debit: Debit = SEUILS): string[] => {
  if (q.motsParMinute > debit.motsParMinute) return [`débit ${q.motsParMinute} mots/min (viser ${debit.motsParMinuteCible})`];
  if (q.motsParMinute < debit.motsParMinuteMin) return [`débit lent ${q.motsParMinute} mots/min (viser ${debit.motsParMinuteCible})`];
  return [];
};

/** Score entre deux prises sans défaut : intonation d'abord, puis proximité du débit cible. */
export const score = (q: QualiteVoix, debit: Debit = SEUILS): number =>
  q.melodieDemiTons * 10 - Math.abs(q.motsParMinute - debit.motsParMinuteCible) * 0.1 + Math.min(q.pauses, 20) * 0.3;

/** Écart au profil de voix : ALERTE, jamais un refus. La hauteur seule ne prouve pas l'identité
 *  du locuteur (une autre voix d'homme tombe dans la même plage) ; c'est le modèle qui fait foi. */
export const alerteTimbre = (q: QualiteVoix, profil: {medianeHz: number; tolerance: number}): string[] => {
  const mini = profil.medianeHz * (1 - profil.tolerance);
  const maxi = profil.medianeHz * (1 + profil.tolerance);
  return q.medianeHz < mini || q.medianeHz > maxi
    ? [`hauteur inhabituelle (médiane ${q.medianeHz} Hz, plage ${Math.round(mini)}-${Math.round(maxi)})`]
    : [];
};

/** Recale le débit dans la plage [motsParMinuteMin, motsParMinute] (cible 204 mots/min, ou celle
 *  du rythme de l'épisode : `debit`, scripts/lib/rythme.ts).
 *  Accélère une prise trop lente (plafond 1,14×) et ralentit une prise précipitée (plancher 0,92×). */
export const calerDebit = (
  mp3: string,
  q: QualiteVoix,
  mots: number,
  debut = 0,
  fin = 0,
  debit: Debit = SEUILS,
): QualiteVoix & {facteur: number} => {
  let facteur = 1;
  if (q.motsParMinute < debit.motsParMinuteMin) {
    facteur = Math.min(1.14, debit.motsParMinuteCible / Math.max(1, q.motsParMinute));
  } else if (q.motsParMinute > debit.motsParMinute) {
    facteur = Math.max(0.92, debit.motsParMinute / q.motsParMinute);
  }
  if (Math.abs(facteur - 1) < 0.015) return {...q, facteur: 1};
  const tmp = mp3.replace(/\.mp3$/, '.debit.mp3');
  try {
    execFileSync('ffmpeg', [
      '-y',
      '-loglevel',
      'error',
      '-i',
      mp3,
      '-af',
      `atempo=${facteur.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11`,
      '-ar',
      '44100',
      '-b:a',
      '96k',
      tmp,
    ]);
    fs.renameSync(tmp, mp3);
  } finally {
    fs.rmSync(tmp, {force: true});
  }
  // atempo > 1 accélère (durée divisée par facteur), atempo < 1 ralentit.
  return {...mesurer(mp3, mots, debut / facteur, fin / facteur, q.phrases), facteur};
};

export const resume = (q: QualiteVoix): string =>
  `${q.motsParMinute} mots/min, intonation ${q.melodieDemiTons} demi-tons, ${q.pauses}/${q.phrases} pauses, médiane ${q.medianeHz} Hz`;
