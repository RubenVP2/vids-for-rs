// Retrouver et lire un épisode : episodes/<numéro>-<slug>/
import fs from 'node:fs';
import path from 'node:path';
import {episodeSchema, timingsSchema, type Episode, type Timings} from '../../src/schema';

export const RACINE = path.resolve(import.meta.dirname, '..', '..');
export const EPISODES = path.join(RACINE, 'episodes');

/** Accepte « 000 », « 0 », « 000-slug » ou un chemin. */
export const dossierEpisode = (arg: string | undefined) => {
  if (!arg) throw new Error('Préciser l’épisode : numéro (ex. 000) ou dossier.');
  if (fs.existsSync(arg) && fs.statSync(arg).isDirectory()) return path.resolve(arg);
  const numero = /^\d+$/.test(arg) ? arg.padStart(3, '0') : arg;
  const trouve = fs.existsSync(EPISODES)
    ? fs.readdirSync(EPISODES).filter((d) => d === numero || d.startsWith(`${numero}-`))
    : [];
  if (trouve.length !== 1) throw new Error(`Épisode « ${arg} » introuvable (ou ambigu) dans episodes/.`);
  return path.join(EPISODES, trouve[0]);
};

export const lireEpisode = (dossier: string): Episode => {
  const brut = JSON.parse(fs.readFileSync(path.join(dossier, 'scenes.json'), 'utf8'));
  const r = episodeSchema.safeParse(brut);
  if (!r.success) {
    const details = r.error.issues.map((i) => `  - ${i.path.join('.') || '(épisode)'} : ${i.message}`).join('\n');
    throw new Error(`scenes.json invalide :\n${details}`);
  }
  return r.data;
};

/**
 * Budget de durée d'un épisode : celui de sa série, ou le format long (jusqu'à ~60 s) quand
 * `long` en donne la raison. Au débit recalé (~205 mots/min = 3,4 mots/s), 65–88 mots donnent
 * ~19–26 s de voix en `flash` (vidéo ~20–27 s, cible de rétention maximale).
 */
export const budgetDe = (episode: Episode) =>
  episode.long
    ? {nom: 'format long', viser: [120, 165], max: 190, voix: 62, video: 66}
    : episode.serie === 'flash'
      ? {nom: 'série flash', viser: [65, 88], max: 110, voix: 36, video: 40}
      : {nom: 'série decrypte', viser: [90, 115], max: 140, voix: 46, video: 50};

/**
 * Âge maximal de l'info, en jours calendaires (heure de Paris), entre la date de la source et
 * le jour où la vidéo sort. Au-delà, elle ne passe plus pour l'actu du jour (docs/decisions.md, 09/11).
 */
export const FRAICHEUR_MAX = 2;
export const jourParis = (t: string) => new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Paris'}).format(new Date(t));

/**
 * Âge de l'info le jour où la vidéo sort : celui de postiz-envoi.json (déjà envoyée), sinon `date`
 * (AAAA-MM-JJ, comme `npm run postiz -- --date`), sinon aujourd'hui : sans --date, la vidéo part le
 * jour même, jamais le lendemain.
 */
/** Date d'envoi du journal Postiz, ou rien si le fichier manque ou ne se lit pas (rattrapage manuel). */
const journalLisible = (fichier: string) => {
  if (!fs.existsSync(fichier)) return undefined;
  try {
    const d = (JSON.parse(fs.readFileSync(fichier, 'utf8')) as {date?: string}).date;
    // Une date illisible vaut absence de journal : mieux vaut un calcul explicite (« aujourd'hui »)
    // qu'un NaN ou une valeur aberrante qui laisserait passer un épisode périmé.
    return d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d : undefined;
  } catch {
    return undefined;
  }
};

export const fraicheur = (dossier: string, episode: Episode, date?: string) => {
  const journal = path.join(dossier, 'postiz-envoi.json');
  const envoi = journalLisible(journal);
  const [sortie, selon] = envoi
    ? [jourParis(envoi), 'postiz-envoi.json']
    : date
      ? [date.slice(0, 10), '--date']
      : [jourParis(new Date().toISOString()), "aujourd'hui"];
  const jours = Math.round((Date.parse(sortie) - Date.parse(episode.source.date)) / 86_400_000);
  return {jours, sortie, selon};
};

export const lireTimings = (dossier: string): Timings =>
  timingsSchema.parse(JSON.parse(fs.readFileSync(path.join(dossier, 'timings.json'), 'utf8')));

export const nomEpisode = (dossier: string) => path.basename(dossier);
