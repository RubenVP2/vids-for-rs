// Vérifie un épisode AVANT la voix et le rendu : schéma, longueur, rituels, règles éditoriales.
// Usage : npm run validate -- <épisode>
// Sortie : « ERREUR » bloque la suite ; « ATTENTION » est à relire, pas forcément à corriger.
import fs from 'node:fs';
import path from 'node:path';
import {texteParle} from '../src/schema';
import {dossierEpisode, lireEpisode} from './lib/episode';
import {normaliser} from './lib/alignement';

const dossier = dossierEpisode(process.argv[2]);
const erreurs: string[] = [];
const alertes: string[] = [];

let episode;
try {
  episode = lireEpisode(dossier);
} catch (e) {
  console.error(`ERREUR ${(e as Error).message}`);
  process.exit(1);
}

const compter = (t: string) => texteParle(t).split(/\s+/).filter((w) => normaliser(w)).length;
const mots = episode.scenes.reduce((n, s) => n + compter(s.texte), 0);
// La voix de Matou lit ~3,4 mots/s (mesuré sur la bande-annonce #000).
const DEBIT = 3.4;
const estimation = mots / DEBIT + 1.4;
const bornes = episode.serie === 'flash' ? [80, 110] : [110, 150];
if (mots < bornes[0]) alertes.push(`Script court : ${mots} mots (viser ${bornes[0]}–${bornes[1]} pour la série ${episode.serie}).`);
if (mots > bornes[1]) erreurs.push(`Script trop long : ${mots} mots (max ${bornes[1]} pour la série ${episode.serie}).`);

const hook = episode.scenes[0];
if (compter(hook.texte) > 16) erreurs.push(`Hook trop long à l'oral : ${compter(hook.texte)} mots (max 16, il doit tenir en ~3 s).`);
if (hook.type === 'hook' && compter(hook.titre) > 7) alertes.push(`Titre du hook long : ${compter(hook.titre)} mots (viser 2 à 7).`);
episode.scenes.forEach((s, i) => {
  const n = compter(s.texte);
  if (n > 40) erreurs.push(`Scène ${i + 1} (${s.type}) : ${n} mots, trop pour une seule scène (max 40). Couper en deux.`);
  if (/==[^=]*$|^[^=]*==[^=]*$/.test(s.texte.replace(/==.+?==/g, ''))) erreurs.push(`Scène ${i + 1} : marqueur == non refermé.`);
});

const tout = episode.scenes.map((s) => texteParle(s.texte)).join(' ');
const fin = episode.scenes[episode.scenes.length - 1];
if (!/c'était matou, et c'est tout/i.test(texteParle(fin.texte).replace(/’/g, "'")))
  erreurs.push('La scène « fin » doit contenir « C’était Matou, et c’est tout. »');
if (!/en fait/i.test(tout)) alertes.push('Le rituel « En fait… » n’apparaît pas dans le script.');
if (episode.statut === 'rumeur' && !/rumeur/i.test(tout)) erreurs.push('Statut « rumeur » : Matou doit dire clairement que c’est une rumeur.');

const verdict = episode.scenes.find((s) => s.type === 'verdict');
const LIBELLES = {buzz: 'pur buzz', prometteur: 'prometteur', gameChanger: 'game changer'};
if (verdict && !normaliser(texteParle(verdict.texte)).includes(normaliser(LIBELLES[episode.verdict])))
  alertes.push(`Le verdict (${LIBELLES[episode.verdict]}) n’est pas prononcé dans la scène verdict.`);

// Source : le fichier doit exister, porter l'URL, et contenir les chiffres cités.
const fichierSource = path.join(dossier, 'source.md');
if (!fs.existsSync(fichierSource)) {
  erreurs.push('source.md manquant : y coller le texte de l’article et son URL.');
} else {
  const source = fs.readFileSync(fichierSource, 'utf8');
  if (!source.includes(episode.source.url)) alertes.push('L’URL de scenes.json n’apparaît pas dans source.md.');
  const affiche = JSON.stringify(episode.scenes);
  const nombres = new Set((affiche.match(/\d+(?:[.,]\d+)?/g) ?? []).filter((n) => n !== String(episode!.numero)));
  const sourceNorm = source.replace(/\s/g, '');
  const absents = [...nombres].filter((n) => !sourceNorm.includes(n) && !sourceNorm.includes(n.replace(',', '.')));
  if (absents.length)
    alertes.push(`Chiffres absents de source.md : ${absents.join(', ')}. Vérifier qu’ils viennent bien de la source (sinon les retirer).`);
}

console.log(`Épisode ${path.basename(dossier)} : ${episode.scenes.length} scènes, ${mots} mots, ~${estimation.toFixed(0)} s estimées.`);
alertes.forEach((a) => console.log(`ATTENTION ${a}`));
erreurs.forEach((e) => console.log(`ERREUR ${e}`));
if (erreurs.length) process.exit(1);
console.log(alertes.length ? 'Valide, avec des points à relire.' : 'Valide.');
