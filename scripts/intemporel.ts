// Série intemporelle « Matou t'explique » : le sujet du jour, ou rien (brand/intemporels.json).
// Déterministe, comme la veille : même jour + mêmes épisodes → même sujet.
// Usage : npm run intemporel -- --rang second            le sujet si ce rang en a un aujourd'hui
//         npm run intemporel -- --suivant [--apres <id>]  le prochain sujet libre, quel que soit le jour
//         npm run intemporel -- --liste                   tous les sujets et l'épisode qui les a traités
// La dernière ligne est toujours « INTEMPOREL: <id> <question> » ou « INTEMPOREL: non (<raison>) ».
import fs from 'node:fs';
import path from 'node:path';
import {EPISODES, RACINE} from './lib/episode';

type Sujet = {id: string; question: string; angle: string; source: string};
const reglages = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'intemporels.json'), 'utf8')) as {rang: string; jours: number[]; sujets: Sujet[]};

const args = process.argv.slice(2);
const option = (nom: string) => (args.includes(nom) ? args[args.indexOf(nom) + 1] : undefined);

/** id du sujet → épisode qui le porte (champ « intemporel » de scenes.json). */
const faits = new Map<string, string>();
for (const d of fs.existsSync(EPISODES) ? fs.readdirSync(EPISODES).sort() : []) {
  try {
    const id = (JSON.parse(fs.readFileSync(path.join(EPISODES, d, 'scenes.json'), 'utf8')) as {intemporel?: string}).intemporel;
    if (id) faits.set(id, d);
  } catch {
    /* dossier sans scenes.json lisible : pas un épisode fini */
  }
}

if (args.includes('--liste')) {
  for (const s of reglages.sujets) console.log(`${faits.has(s.id) ? `fait (${faits.get(s.id)})` : 'libre'.padEnd(6)}  ${s.id}  ${s.question}`);
  process.exit(0);
}

const refuser = (raison: string): never => {
  console.log(`INTEMPOREL: non (${raison})`);
  process.exit(0);
};
if (!args.includes('--suivant')) {
  const rang = option('--rang') ?? 'principal';
  // 1 = lundi … 7 = dimanche, heure de Paris
  const jour = {Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7}[new Intl.DateTimeFormat('en-US', {timeZone: 'Europe/Paris', weekday: 'short'}).format(new Date())] as number;
  if (rang !== reglages.rang) refuser(`la série remplace l'épisode ${reglages.rang}, pas le ${rang}`);
  if (!reglages.jours.includes(jour)) refuser(`pas un jour de la série : jours ${reglages.jours.join(', ')}`);
}
// --apres <id> : le sujet <id> n'a pas pu être sourcé, on prend le suivant de la liste.
const apres = option('--apres');
const debut = apres ? reglages.sujets.findIndex((s) => s.id === apres) + 1 : 0;
const sujet = reglages.sujets.slice(debut).find((s) => !faits.has(s.id));
if (!sujet) refuser('plus de sujet libre : en ajouter dans brand/intemporels.json');
else {
  console.log(`Sujet : ${sujet.question}\nAngle : ${sujet.angle}\nSource à trouver : ${sujet.source}\nChamp à mettre dans scenes.json : "intemporel": "${sujet.id}"`);
  console.log(`INTEMPOREL: ${sujet.id} ${sujet.question}`);
}
