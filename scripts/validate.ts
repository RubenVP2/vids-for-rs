// Vérifie un épisode AVANT la voix et le rendu : schéma, longueur, rituels, règles éditoriales.
// Usage : npm run validate -- <épisode>
// Sortie : « ERREUR » bloque la suite ; « ATTENTION » est à relire, pas forcément à corriger.
import fs from 'node:fs';
import path from 'node:path';
import {texteParle} from '../src/schema';
import {budgetDe, dossierEpisode, FRAICHEUR_MAX, fraicheur, jourParis, lireEpisode} from './lib/episode';
import {normaliser} from './lib/alignement';
import {controlerMontage, montage} from './lib/montage';

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

// Fraîcheur (même règle que npm run check) : le dire AVANT la voix et le rendu, pour changer de sujet.
const age = fraicheur(dossier, episode);
// Sortie passée = la vidéo est de l'histoire. Sinon (brouillon du jour, poste repoussé) la règle s'applique.
const passe = age.selon === 'postiz-envoi.json' && age.sortie < jourParis(new Date().toISOString());
if (passe) {
  // déjà publiée : la date est de l'histoire, la fraîcheur n'est plus un critère
} else if (!Number.isFinite(age.jours)) erreurs.push(`Date de la source illisible (${episode.source.date}) : attendu AAAA-MM-JJ, date existante.`);
else if (age.jours > FRAICHEUR_MAX)
  erreurs.push(`Info trop vieille : source du ${episode.source.date}, sortie le ${age.sortie} (${age.jours} jours, max ${FRAICHEUR_MAX}). Prendre un sujet plus récent.`);
else if (age.jours < 0) erreurs.push(`Date de la source (${episode.source.date}) dans le futur : vérifier source.md.`);

const compter = (t: string) => texteParle(t).split(/\s+/).filter((w) => normaliser(w)).length;
const mots = episode.scenes.reduce((n, s) => n + compter(s.texte), 0);
// Le débit de la voix est recalé dans [195, 225] mots/min (~3,25 à 3,75 mots/s, cible 205 mots/min).
const [DEBIT_LENT, DEBIT_RAPIDE] = [3.2, 3.6];
const [rapide, lente] = [mots / DEBIT_RAPIDE + 1.25, mots / DEBIT_LENT + 1.25];
const budget = budgetDe(episode);
if (mots < budget.viser[0]) alertes.push(`Script court : ${mots} mots (viser ${budget.viser[0]}–${budget.viser[1]} en ${budget.nom}).`);
if (mots > budget.max) erreurs.push(`Script trop long : ${mots} mots (max ${budget.max} en ${budget.nom}, viser ${budget.viser[0]}–${budget.viser[1]}${episode.long ? '' : ' ; un sujet qui le demande peut passer en format long : champ « long » avec sa raison'}).`);
else if (mots > budget.viser[1]) alertes.push(`Script long : ${mots} mots, la voix peut dépasser la cible Nerveuse (viser ${budget.viser[0]}–${budget.viser[1]}).`);

// Format de montage actuel (docs/viralite.md) : gabarit en rotation, pas de scène source,
// fin en boucle. Les épisodes d'avant `depuis` gardent l'ancien format.
const actuel = episode.numero >= montage.depuis;

const hook = episode.scenes[0];
if (compter(hook.texte) > 16) erreurs.push(`Hook trop long à l'oral : ${compter(hook.texte)} mots (max 16, viser ≤ 12 pour tenir en ~2,5 s).`);
else if (compter(hook.texte) > 12) alertes.push(`Hook un peu long : ${compter(hook.texte)} mots (viser ≤ 12 mots pour frapper en < 2,5 s).`);
if (hook.type === 'hook' && compter(hook.titre) > 6) alertes.push(`Titre du hook long : ${compter(hook.titre)} mots (viser 2 à 6, il complète la voix).`);
episode.scenes.forEach((s, i) => {
  const n = compter(s.texte);
  if (n > 40) erreurs.push(`Scène ${i + 1} (${s.type}) : ${n} mots, trop pour une seule scène (max 40). Couper en deux.`);
  if (/==[^=]*$|^[^=]*==[^=]*$/.test(s.texte.replace(/==.+?==/g, ''))) erreurs.push(`Scène ${i + 1} : marqueur == non refermé.`);
});

const tout = episode.scenes.map((s) => texteParle(s.texte)).join(' ');
const fin = episode.scenes[episode.scenes.length - 1];
const texteFin = texteParle(fin.texte).replace(/’/g, "'");
if (actuel) {
  // La fin boucle sur le hook : un appel à s'abonner ou une formule d'adieu fait balayer.
  if (/abonne/i.test(texteFin)) erreurs.push('La scène « fin » ne demande pas de s’abonner (signal de fin : on balaie). Finir par la phrase qui renvoie au hook.');
  if (/c'était matou/i.test(texteFin)) erreurs.push('La scène « fin » ne dit plus « C’était Matou… » : la signature est le « Ma-tou ! » sonore. Finir par la phrase qui renvoie au hook.');
  if (/^\s*bref\b/i.test(texteFin)) alertes.push('La scène « fin » commence par « Bref, » (signal de fin qui fait balayer avant la boucle) : attaquer directement la chute.');
  // Une phrase en suspens (« … ») sonne coupée au 1er visionnage : la boucle vient de l'image.
  if (/(…|\.\.\.|,)\s*$/.test(texteFin)) erreurs.push('La phrase de fin reste en suspens (« … ») : la vidéo semble coupée. Une phrase complète, qui reprend un mot du hook.');
  const motsDe = (t: string) => new Set(texteParle(t).split(/\s+/).map(normaliser).filter((w) => w.length >= 4));
  const communs = [...motsDe(fin.texte)].filter((w) => motsDe(hook.texte).has(w));
  if (!communs.length) alertes.push('La fin ne reprend aucun mot du hook : la dernière phrase doit y renvoyer, pour que la vidéo reparte en boucle.');
  if (episode.scenes.some((s) => s.type === 'source'))
    erreurs.push('Plus de scène « source » : le tampon s’incruste sur la 2e scène, et Matou dit qui annonce en une demi-phrase.');
  const debut = episode.scenes.slice(0, 3).map((s) => normaliser(texteParle(s.texte))).join(' ');
  if (!debut.includes(normaliser(episode.source.nom.split(/\s+/)[0])))
    alertes.push(`« ${episode.source.nom} » n’est pas dit dans les 3 premières scènes : dire qui annonce (une demi-phrase suffit).`);
  // Garde-fou anti-décrochage à 8 s : la 2e scène ne doit ni répéter le hook ni s'ouvrir par « X l'annonce : ».
  const scene2 = episode.scenes[1];
  if (scene2) {
    const t2 = texteParle(scene2.texte).replace(/’/g, "'");
    if (/^[^,.!?]{1,28}\b(l'annonce|le rapporte|annonce que)\s*:/i.test(t2)) {
      alertes.push('Scène 2 : éviter d’ouvrir par « X l’annonce : » ou « X le rapporte : » (ralentit à 4 s). Glisser la source dans l’action (« Selon X, … », « Chez X, … »).');
    }
    const motsHook = motsDe(hook.texte);
    const motsSc2 = [...motsDe(scene2.texte)];
    const redits = motsSc2.filter((w) => motsHook.has(w) && w !== normaliser(episode.source.nom.split(/\s+/)[0]));
    if (motsHook.size >= 3 && redits.length / motsHook.size >= 0.6) {
      alertes.push(`Scène 2 : répète trop le hook (${redits.join(', ')}). Dès 3 s, donner le « comment » ou un fait nouveau au lieu de paraphraser l’accroche.`);
    }
  }
  for (const e of controlerMontage(episode)) erreurs.push(`Gabarit de montage : ${e}.`);
} else if (!/c'était matou, et c'est tout/i.test(texteFin)) {
  erreurs.push('La scène « fin » doit contenir « C’était Matou, et c’est tout. »');
}
if (!/en fait/i.test(tout)) alertes.push('Le rituel « En fait… » n’apparaît pas dans le script.');
if (episode.statut === 'rumeur' && !/rumeur/i.test(tout)) erreurs.push('Statut « rumeur » : Matou doit dire clairement que c’est une rumeur.');

const verdict = episode.scenes.find((s) => s.type === 'verdict');
const LIBELLES = {buzz: 'pur buzz', prometteur: 'prometteur', gameChanger: 'game changer'};
if (verdict && !normaliser(texteParle(verdict.texte)).includes(normaliser(LIBELLES[episode.verdict])))
  alertes.push(`Le verdict (${LIBELLES[episode.verdict]}) n’est pas prononcé dans la scène verdict.`);
if (actuel && verdict && !/\b(je|moi|mon|ma|mes)\b|\bj'/i.test(texteParle(verdict.texte).replace(/’/g, "'")))
  alertes.push('Le verdict ne dit pas l’avis de Matou (« moi, je… », « mon avis ») : une position assumée, pas un résumé.');

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

console.log(`Épisode ${path.basename(dossier)} : ${episode.scenes.length} scènes, ${mots} mots, ~${rapide.toFixed(0)} à ${lente.toFixed(0)} s estimées.`);
alertes.forEach((a) => console.log(`ATTENTION ${a}`));
erreurs.forEach((e) => console.log(`ERREUR ${e}`));
if (erreurs.length) process.exit(1);
console.log(alertes.length ? 'Valide, avec des points à relire.' : 'Valide.');
