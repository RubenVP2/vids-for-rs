// Étape « carrousel » : scenes.json → diapos 4:5 pour LinkedIn (document à feuilleter).
// Une diapo par idée : couverture, scènes de contenu, Hype-mètre, fin (src/Carrousel.tsx).
// Usage : npm run carrousel -- <épisode>   → episodes/<dossier>/rendu/carrousel/NN.png
import fs from 'node:fs';
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {diapos} from '../src/Carrousel';
import {dossierEpisode, lireEpisode, RACINE} from './lib/episode';
import {empaqueter, navigateur} from './lib/remotion';

const dossier = dossierEpisode(process.argv.slice(2).find((a) => !a.startsWith('--')));
const episode = lireEpisode(dossier);
const dest = path.join(dossier, 'rendu', 'carrousel');
fs.rmSync(dest, {recursive: true, force: true});
fs.mkdirSync(dest, {recursive: true});

const serveUrl = await empaqueter();
const browserExecutable = navigateur();
const total = diapos(episode).length;
for (let index = 0; index < total; index++) {
  const inputProps = {episode, index};
  const composition = await selectComposition({serveUrl, id: 'DiapoCarrousel', inputProps, browserExecutable, logLevel: 'error', timeoutInMilliseconds: 120000});
  const output = path.join(dest, `${String(index + 1).padStart(2, '0')}.png`);
  await renderStill({serveUrl, composition, inputProps, output, browserExecutable, logLevel: 'error', timeoutInMilliseconds: 120000});
  console.log(path.relative(RACINE, output));
}
console.log(`Carrousel : ${total} diapos.`);
