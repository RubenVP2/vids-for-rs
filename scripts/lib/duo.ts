// Le duo Matou et Plouf (brand/duo.json, docs/personnages.md) : quels épisodes, quelles règles.
// Ce fichier ne dépend d'aucune autre lib du dépôt (episode.ts et validate.ts le lisent).
import fs from 'node:fs';
import path from 'node:path';

type Budget = {viser: [number, number]; max: number; voix: number; video: number};
export type ReglagesDuo = {
  de: number;
  a: number;
  decor: 'bureau' | 'cahier';
  repliques: {min: number; max: number; motsParReplique: number; motsTotal: number};
  budget: Budget;
};

const fichier = path.resolve(import.meta.dirname, '..', '..', 'brand', 'duo.json');
export const reglagesDuo: ReglagesDuo | undefined = fs.existsSync(fichier) ? JSON.parse(fs.readFileSync(fichier, 'utf8')) : undefined;

/**
 * Un jour sur deux du test, les deux épisodes du jour sont en duo : ⌊n/2⌋ impair. Ni le créneau
 * (n pair le matin, impair le soir) ni le rythme posé du test de débit (⌊n/2⌋ + n pair) ne se
 * confondent avec lui.
 */
export const estDuo = (numero: number) => !!reglagesDuo && numero >= reglagesDuo.de && numero <= reglagesDuo.a && Math.floor(numero / 2) % 2 === 1;

/** « duo » ou « solo » (« — » avant le test) : pour le bilan. */
export const nomFormule = (numero: number) => (!reglagesDuo || numero < reglagesDuo.de ? '—' : estDuo(numero) ? 'duo' : 'solo');
