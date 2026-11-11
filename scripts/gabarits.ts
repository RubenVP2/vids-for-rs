// Les gabarits d'un épisode, en rotation sur le numéro : montage de la vidéo (skill
// ecriture-matou) et textes de publication (skill publication), un par réseau.
// Usage : npm run gabarits -- <numéro>     (ex. 008 ; l'épisode n'a pas besoin d'exister)
// Réglages : brand/montage.json et brand/publication.json ; règles : docs/viralite.md et docs/publication.md.
import {attendus, reglages, RESEAUX} from './lib/gabarits';
import {montageAttendu} from './lib/montage';
import {rythmeDe} from './lib/rythme';

const n = Number(process.argv[2]);
if (!Number.isInteger(n)) throw new Error('Préciser le numéro de l’épisode (ex. npm run gabarits -- 008).');

const {ouverture, corps} = montageAttendu(n);
console.log(`Gabarits de l'épisode #${String(n).padStart(3, '0')}\n`);
const rythme = rythmeDe(n);
if (rythme.budgets) {
  const b = rythme.budgets;
  console.log(`# Rythme : posé (test de débit, brand/voix.json)\n`);
  console.log(`Voix à ~${rythme.debit.motsParMinuteCible} mots/min, vidéo de ~30 s. Budget de mots : flash ${b.flash.viser.join('–')} (max ${b.flash.max}), decrypte ${b.decrypte.viser.join('–')} (max ${b.decrypte.max}). Le temps gagné va à l'explication (« En fait… »), pas à une idée de plus.\n`);
} else console.log('# Rythme : courant (~204 mots/min, budgets habituels du skill ecriture-matou)\n');
console.log('# Montage (scenes.json)\n');
console.log(`## Ouverture : ${ouverture.id}\n${ouverture.consigne}. Exemple : ${ouverture.exemple}\n`);
console.log(`## Corps : ${corps.id}\n${corps.consigne}.\n`);
console.log('Champ à mettre dans scenes.json (un autre gabarit seulement avec sa raison) :');
console.log(`"gabarit": {"ouverture": "${ouverture.id}", "corps": "${corps.id}"}\n`);

const prevus = attendus(n);
console.log('# Textes (publication.md)\n');
for (const r of RESEAUX) {
  const f = prevus[r];
  console.log(`## ${reglages.reseaux[r].section} : ${f.id}\n${f.consigne}. Exemple : ${f.exemple}\n`);
}
console.log('Ligne à mettre en tête de publication.md (un autre gabarit seulement avec sa raison entre parenthèses) :');
console.log(`Gabarits : ${RESEAUX.map((r) => `${r}=${prevus[r].id}`).join(' · ')}`);
