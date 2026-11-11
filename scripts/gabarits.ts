// Les gabarits d'un épisode, en rotation sur le numéro : montage de la vidéo (skill
// ecriture-matou) et textes de publication (skill publication), un par réseau.
// Usage : npm run gabarits -- <numéro>     (ex. 008 ; l'épisode n'a pas besoin d'exister)
// Réglages : brand/montage.json et brand/publication.json ; règles : docs/viralite.md et docs/publication.md.
import {attendus, reglages, RESEAUX} from './lib/gabarits';
import {montageAttendu} from './lib/montage';
import {estDuo, reglagesDuo} from './lib/duo';
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
if (estDuo(n) && reglagesDuo) {
  const r = reglagesDuo.repliques;
  console.log(`# Duo : OUI, Matou et Plouf (test brand/duo.json, un jour sur deux)\n`);
  console.log(`Plouf, le poisson rouge, dit ${r.min} à ${r.max} répliques (champ « plouf » des scènes, ${r.motsParReplique} mots max chacune, ${r.motsTotal} en tout) : la question du spectateur dans le hook, une relance (« Et pour moi, ça change quoi ? »), et souvent l'oubli de la fin (« Attends… c'était quoi la question ? »). Matou explique et garde le verdict. Mettre "decor": "${reglagesDuo.decor}". Skill ecriture-matou, section « Duo avec Plouf ».\n`);
} else if (reglagesDuo && n >= reglagesDuo.de && n <= reglagesDuo.a) console.log('# Duo : non (épisode solo du test brand/duo.json : Plouf ne parle pas)\n');
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
