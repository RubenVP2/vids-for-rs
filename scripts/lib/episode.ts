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

/** Journal Postiz d'un épisode : ses postes, leurs statuts et leurs dates programmées. */
type Envoi = {date?: string; statut?: string; postes?: {date?: string; statut?: string}[]};

/** Jour de sortie retenu pour un envoi, et s'il est déjà parti (aucun brouillon en attente). */
export type Sortie = {sortie: string; parti: boolean};

/**
 * Date AAAA-MM-JJ (heure tolérée) qui existe vraiment : « 2026-13-45 » passe le regex, « 2026-02-30 »
 * est relu au 2 mars par Date.parse. On teste le parse avant `toISOString`, qui lèverait.
 */
const dateLisible = (d: unknown): d is string => {
  if (typeof d !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(d)) return false;
  const jour = d.slice(0, 10);
  if (!Number.isFinite(Date.parse(d))) return false;
  if (!Number.isFinite(Date.parse(`${jour}T00:00:00Z`))) return false;
  return new Date(`${jour}T00:00:00Z`).toISOString().startsWith(jour);
};

/**
 * Jour de sortie réel d'un envoi : le plus tardif des postes encore à venir, sinon des postes partis.
 * Un brouillon du 9 repoussé au 12 vaut le 12 ; un poste en brouillon daté d'hier vaut aujourd'hui,
 * car il partira au plus tôt maintenant. `parti` n'est vrai que si plus rien n'attend en brouillon :
 * c'est la seule situation où « déjà envoyée » peut dispenser du garde-fou.
 * Absent, illisible ou sans date exploitable, le journal ne vaut rien : `undefined`.
 */
const sortiePrevue = (fichier: string): Sortie | undefined => {
  if (!fs.existsSync(fichier)) return undefined;
  try {
    const e = JSON.parse(fs.readFileSync(fichier, 'utf8')) as Envoi;
    const auj = jourParis(new Date().toISOString());
    const postes = (e.postes ?? []).filter((p) => dateLisible(p.date)).map((p) => ({jour: jourParis(p.date as string), parti: p.statut === 'programmé'}));
    const attente = postes.filter((p) => !p.parti).map((p) => p.jour);
    if (attente.length) return {sortie: [...attente, auj].sort().at(-1) as string, parti: false};
    const partis = postes.filter((p) => p.parti).map((p) => p.jour);
    if (partis.length) return {sortie: partis.sort().at(-1) as string, parti: true};
    // Journal muet sur ses postes : seule sa propre ligne compte, et seulement si elle dit « programmé ».
    if (e.statut === 'programmé' && dateLisible(e.date)) return {sortie: jourParis(e.date), parti: true};
    return undefined;
  } catch {
    return undefined;
  }
};

export const fraicheur = (dossier: string, episode: Episode, date?: string) => {
  const journal = path.join(dossier, 'postiz-envoi.json');
  const s = sortiePrevue(journal);
  const [sortie, selon, parti] = s
    ? [s.sortie, 'postiz-envoi.json', s.parti]
    : date
      ? [date.slice(0, 10), '--date', false]
      : [jourParis(new Date().toISOString()), "aujourd'hui", false];
  const jours = Math.round((Date.parse(sortie) - Date.parse(episode.source.date)) / 86_400_000);
  return {jours, sortie, selon, parti};
};

export const lireTimings = (dossier: string): Timings =>
  timingsSchema.parse(JSON.parse(fs.readFileSync(path.join(dossier, 'timings.json'), 'utf8')));

export const nomEpisode = (dossier: string) => path.basename(dossier);
