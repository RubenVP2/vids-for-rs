// Rythme de la voix d'un épisode : le débit courant (« rapide », ~204 mots/min, vidéos de ~20–27 s)
// ou, pendant un test, le débit « posé » (~180 mots/min, vidéos de ~30 s) un épisode sur deux.
// Réglages : brand/voix.json → testDebit ; raison : docs/decisions.md (09/11/2026).
// Ce fichier ne dépend d'aucune autre lib (episode.ts et qualite-voix.ts le lisent tous deux).
import fs from 'node:fs';
import path from 'node:path';

export type Debit = {motsParMinuteMin: number; motsParMinuteCible: number; motsParMinute: number};
type Budget = {viser: [number, number]; max: number; voix: number; video: number};
type Test = {de: number; a: number; pose: {instructions: string; debit: Debit; budgets: Record<'flash' | 'decrypte', Budget>}};

/** Débit courant : entre 198 et 230 mots/min utiles, cible 204 (~3,4 mots/s). */
export const DEBIT_RAPIDE: Debit = {motsParMinuteMin: 198, motsParMinuteCible: 204, motsParMinute: 230};

const test = (JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '..', '..', 'brand', 'voix.json'), 'utf8')) as {testDebit?: Test}).testDebit;

/**
 * Un épisode sur deux du test est « posé ». ⌊n/2⌋ + n : les deux épisodes d'un même jour (n pair
 * puis impair) n'ont jamais le même rythme, et le rythme posé change de rang d'un jour à l'autre
 * (sans quoi il se confondrait avec le créneau du matin ou du soir).
 */
export const estPose = (numero: number) => !!test && numero >= test.de && numero <= test.a && (Math.floor(numero / 2) + numero) % 2 === 0;

export const rythmeDe = (numero: number) =>
  estPose(numero) && test
    ? {id: 'posé' as const, debit: test.pose.debit, instructions: test.pose.instructions as string | undefined, budgets: test.pose.budgets as Record<string, Budget> | undefined}
    : {id: 'rapide' as const, debit: DEBIT_RAPIDE, instructions: undefined, budgets: undefined};

/** « posé », « rapide », ou « — » avant le débit accéléré du 05/11/2026 (#016) : pour le bilan. */
export const nomRythme = (numero: number) => (numero < 16 ? '—' : rythmeDe(numero).id);
