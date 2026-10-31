// Les gabarits de texte d'un épisode (skill publication) : un par réseau, en rotation sur le numéro.
// Usage : npm run gabarits -- <numéro>     (ex. 008 ; l'épisode n'a pas besoin d'exister)
// Réglages : brand/publication.json ; règles : docs/publication.md.
import {attendus, reglages, RESEAUX} from './lib/gabarits';

const n = Number(process.argv[2]);
if (!Number.isInteger(n)) throw new Error('Préciser le numéro de l’épisode (ex. npm run gabarits -- 008).');

const prevus = attendus(n);
console.log(`Gabarits de l'épisode #${String(n).padStart(3, '0')}\n`);
for (const r of RESEAUX) {
  const f = prevus[r];
  console.log(`## ${reglages.reseaux[r].section} : ${f.id}\n${f.consigne}. Exemple : ${f.exemple}\n`);
}
console.log('Ligne à mettre en tête de publication.md (un autre gabarit seulement avec sa raison entre parenthèses) :');
console.log(`Gabarits : ${RESEAUX.map((r) => `${r}=${prevus[r].id}`).join(' · ')}`);
