// Gabarits des textes de publication.md : lequel pour quel épisode, et le texte le suit-il ?
// Réglages : brand/publication.json ; règles et raisons : docs/publication.md.
import fs from 'node:fs';
import path from 'node:path';
import {RACINE} from './episode';

type Partie = 'ligne1' | 'question' | 'titre' | 'texte';
type Formule = {id: string; partie: Partie; motif: string; consigne: string; exemple: string};
type Reglages = {depuis: number; ouiNon: string; reseaux: Record<string, {section: string; formules: Formule[]}>};

export const reglages = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'publication.json'), 'utf8')) as Reglages;
export const RESEAUX = Object.keys(reglages.reseaux);
const veille = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'veille.json'), 'utf8')) as {entites: Record<string, string>};
const NOMS_CONNUS = [...new Set([...Object.keys(veille.entites), ...Object.values(veille.entites)])];

export const numeroDe = (dossier: string) => Number(/^(\d+)/.exec(path.basename(dossier))?.[1] ?? NaN);

/**
 * Le gabarit de chaque réseau pour l'épisode n : rotation sur le numéro, sans tirage.
 * Principal et second alternent pairs et impairs : ⌊n/2⌋ avance d'un cran par jour pour
 * chacun des deux (avec n seul, 4 formules → le principal n'en verrait que 2), et + n % 2
 * décale le second pour que les deux épisodes du jour n'aient pas le même.
 */
export const attendus = (n: number) =>
  Object.fromEntries(RESEAUX.map((r) => {
    const f = reglages.reseaux[r].formules;
    return [r, f[(Math.floor(n / 2) + (n % 2)) % f.length]];
  })) as Record<string, Formule>;

/** Ligne « Gabarits : tiktok=camp · youtube=chiffre (raison) … » de publication.md. */
export const lireDeclares = (texte: string) => {
  const ligne = /^Gabarits\s*:\s*(.+)$/m.exec(texte)?.[1] ?? '';
  return Object.fromEntries(
    [...ligne.matchAll(/([\w-]+)=([\w-]+)(?:\s*\(([^)]*)\))?/g)].map(([, r, id, raison]) => [r, {id, raison: raison?.trim()}]),
  ) as Record<string, {id: string; raison?: string}>;
};

const sansHashtags = (t: string) => t.split('\n').filter((l) => !/^\s*(#[\p{L}\d_]+\s*)+$/u.test(l)).join('\n');
const premiereLigne = (t: string) => sansHashtags(t).split('\n').map((l) => l.trim()).find((l) => l && !/^\*\*Titre\*\*/.test(l)) ?? '';
/** Dernière phrase finie par « ? » (après un point, un retour à la ligne ou un deux-points). */
export const derniereQuestion = (t: string) => (sansHashtags(t).match(/[^.!?:\n]*\?/g) ?? []).map((q) => q.trim()).filter(Boolean).at(-1) ?? '';
const titreDe = (t: string) => /^\*\*Titre\*\*\s*:\s*(.+)$/m.exec(t)?.[1].trim() ?? '';

const partie = (bloc: string, p: Partie) =>
  p === 'ligne1' ? premiereLigne(bloc) : p === 'question' ? derniereQuestion(bloc) : p === 'titre' ? titreDe(bloc) : bloc;
const cite = (s: string) => `« ${s.length > 70 ? s.slice(0, 67) + '…' : s} »`;
const nomConnu = (s: string) => NOMS_CONNUS.some((n) => new RegExp(`\\b${n}`, 'iu').test(s));

/**
 * Contrôles des textes (gabarit déclaré, motif, question ouverte, nom connu…).
 * `section(titre)` rend le texte d'une section de publication.md.
 */
export const controler = (texte: string, n: number, section: (titre: string) => string | undefined) => {
  const ok: string[] = [];
  const ko: string[] = [];
  const verifier = (cond: boolean, bien: string, mal: string) => (cond ? ok : ko).push(cond ? bien : mal);
  const declares = lireDeclares(texte);
  const prevus = attendus(n);
  const ouiNon = new RegExp(reglages.ouiNon, 'iu');

  for (const r of RESEAUX) {
    const {section: titre, formules} = reglages.reseaux[r];
    const bloc = section(titre);
    if (bloc === undefined) continue; // la section absente est déjà signalée par check
    const d = declares[r];
    const f = formules.find((x) => x.id === d?.id);
    // Le gabarit prévu, ou un autre avec sa raison (comme le veto de la veille).
    const permis = d && f && (d.id === prevus[r].id || d.raison);
    if (!permis) {
      ko.push(`${titre} : gabarit ${d ? `« ${d.id} » ${f ? 'sans raison' : 'inconnu'}` : 'non déclaré'} (prévu : ${prevus[r].id}, npm run gabarits -- ${n})`);
      continue;
    }
    const morceau = partie(bloc, f.partie);
    verifier(new RegExp(f.motif, 'imu').test(morceau), `${titre} : gabarit ${f.id}`, `${titre} : gabarit ${f.id} non suivi (${f.consigne.toLowerCase()}) : ${cite(morceau || '(vide)')}`);
    const question = derniereQuestion(bloc);
    if (question) verifier(!ouiNon.test(question), `${titre} : question ouverte`, `${titre} : question fermée (oui/non) ${cite(question)} : demander un choix, un chiffre ou un récit`);
  }

  const threads = section('Threads');
  if (threads !== undefined) verifier(threads.includes('?'), 'Threads : une question', 'Threads : aucune question (Threads vit des réponses)');
  const tiktok = section('TikTok');
  if (tiktok !== undefined) {
    const l1 = premiereLigne(tiktok);
    verifier(nomConnu(l1), 'TikTok : nom connu dans la 1re phrase', `TikTok : aucun nom connu (ChatGPT, Google…) dans ${cite(l1)} : c'est ce que les gens cherchent`);
  }
  const instagram = section('Instagram');
  if (instagram !== undefined) {
    const l1 = premiereLigne(instagram);
    verifier(l1.length <= 125, 'Instagram : 1re ligne avant la coupure', `Instagram : 1re ligne de ${l1.length} caractères (coupée à ~125)`);
    verifier(/envoie-la/iu.test(instagram), 'Instagram : invitation à envoyer', 'Instagram : finir par « Envoie-la à quelqu’un qui… » (le signal le plus fort du Reel)');
  }
  const youtube = section('YouTube');
  if (youtube !== undefined) {
    const t = titreDe(youtube);
    const debut = t.split(/\s+/).slice(0, 3).join(' ');
    verifier(t.length <= 60, `YouTube : titre de ${t.length} caractères`, `YouTube : titre de ${t.length} caractères (max 60)`);
    verifier(!/#\d/.test(t), 'YouTube : titre sans numéro', 'YouTube : retirer « #NNN » du titre (personne ne le cherche)');
    verifier(nomConnu(debut), 'YouTube : nom connu en tête du titre', `YouTube : nom connu absent des 3 premiers mots ${cite(t)}`);
  }
  return {ok, ko};
};
