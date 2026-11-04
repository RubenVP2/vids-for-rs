// Lecture unique de `brand/voix.json` : la voix de Matou et son profil de hauteur.
// Un seul endroit pour le schéma : `voice.ts` synthétise, `check.ts` vérifie la même source.
import fs from 'node:fs';
import path from 'node:path';
import {z} from 'zod';
import {RACINE} from './episode';
import type {ReglagesVoix} from './openrouter';

const schema = z.object({
  modele: z.string().min(1),
  voix: z.string().min(1),
  format: z.enum(['mp3', 'pcm']),
  frequencePcm: z.number().int().positive().optional(),
  instructions: z.string().optional(),
  vitesse: z.number().positive().optional(),
  transcription: z.string().min(1),
  /** Plage de hauteur attendue : sert d'ALERTE, jamais de refus (voir check.ts). */
  profil: z.object({medianeHz: z.number().positive(), tolerance: z.number().positive().max(0.5)}).optional(),
  secours: z
    .array(z.object({modele: z.string().min(1), voix: z.string().min(1), format: z.enum(['mp3', 'pcm']), frequencePcm: z.number().optional()}))
    .default([]),
});

export type ReglagesVoixComplets = z.infer<typeof schema> & ReglagesVoix;

let cache: ReglagesVoixComplets | undefined;

/** Réglages de voix validés. Mis en cache : un seul fichier lu par exécution. */
export const lireReglagesVoix = (): ReglagesVoixComplets => {
  if (cache) return cache;
  const fichier = path.join(RACINE, 'brand', 'voix.json');
  const brut = JSON.parse(fs.readFileSync(fichier, 'utf8'));
  const lu = schema.safeParse(brut);
  if (!lu.success) {
    throw new Error(`brand/voix.json invalide : ${lu.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join(' ; ')}`);
  }
  cache = lu.data as ReglagesVoixComplets;
  return cache;
};
