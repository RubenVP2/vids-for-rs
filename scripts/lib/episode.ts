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

export const lireTimings = (dossier: string): Timings =>
  timingsSchema.parse(JSON.parse(fs.readFileSync(path.join(dossier, 'timings.json'), 'utf8')));

export const nomEpisode = (dossier: string) => path.basename(dossier);
