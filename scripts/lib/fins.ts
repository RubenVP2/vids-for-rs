// Où un mot finit VRAIMENT : la transcription (Whisper) date souvent la fin d'un mot trop tôt,
// de 50 à 300 ms sur une fin de phrase (mesuré le 12/11/2026 sur les épisodes 010 à 030).
// Tout ce qui se cale sur cette fin (coupe d'une réplique en duo, « Ma-tou ! » final,
// sous-titres) coupait alors la dernière syllabe. Ici, la fin est lue dans le son : le mot
// dure tant que le volume reste au-dessus du seuil, jusqu'au début du mot suivant.
import {execFileSync} from 'node:child_process';

const TAUX = 16000;
const PAS = 0.01; // fenêtres de 10 ms
/** Sous le pic de la voix (95e centile) moins ce seuil, c'est du silence. */
const SEUIL_DB = 35;
/** Un creux plus court que ça au milieu d'un mot (occlusive, « t » final) n'est pas la fin. */
const CREUX_MAX = 0.06;

export type Niveaux = {db: Float32Array; seuil: number};

/** Le volume de la voix, en dB, par fenêtre de 10 ms. */
export const niveaux = (fichier: string): Niveaux => {
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', fichier, '-ac', '1', '-ar', String(TAUX), '-f', 'f32le', '-'], {maxBuffer: 1 << 28});
  const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
  const n = Math.round(TAUX * PAS);
  const db = new Float32Array(Math.floor(x.length / n));
  for (let i = 0; i < db.length; i++) {
    let s = 0;
    for (let k = i * n; k < (i + 1) * n; k++) s += x[k] * x[k];
    db[i] = 10 * Math.log10(s / n + 1e-12);
  }
  const tries = [...db].sort((a, b) => a - b);
  return {db, seuil: tries[Math.floor(tries.length * 0.95)] - SEUIL_DB};
};

/** La vraie fin d'un son commencé avant `depuis` (s), sans dépasser `limite` (s). */
export const finDuSon = (v: Niveaux, depuis: number, limite: number) => {
  const iLimite = Math.min(v.db.length, Math.floor(limite / PAS));
  let fin = depuis;
  let creux = 0;
  for (let i = Math.floor(depuis / PAS); i < iLimite; i++) {
    if (v.db[i] > v.seuil) {
      fin = (i + 1) * PAS;
      creux = 0;
    } else if (++creux * PAS > CREUX_MAX) break;
  }
  return Math.min(limite, Math.max(depuis, fin));
};

/** Le moment le plus calme entre `a` et `b` (s) : là où couper une prise sans entamer un mot. */
export const creuxEntre = (v: Niveaux, a: number, b: number) => {
  const ia = Math.max(0, Math.floor(a / PAS));
  const ib = Math.min(v.db.length - 1, Math.ceil(b / PAS));
  if (ib <= ia) return (a + b) / 2;
  let meilleur = ia;
  for (let i = ia; i <= ib; i++) if (v.db[i] < v.db[meilleur]) meilleur = i;
  return (meilleur + 0.5) * PAS;
};

/**
 * Prolonge la fin de chaque mot jusqu'à la vraie fin du son (sans mordre sur le mot suivant).
 * Ne raccourcit jamais un mot.
 */
export const prolongerFins = <T extends {debut: number; fin: number}>(fichier: string, mots: T[], v = niveaux(fichier)): T[] =>
  mots.map((m, i) => {
    const suivant = mots[i + 1]?.debut ?? v.db.length * PAS;
    const fin = finDuSon(v, m.fin, Math.max(m.fin, suivant - 0.02));
    return fin > m.fin ? {...m, fin: Math.round(fin * 1000) / 1000} : m;
  });
