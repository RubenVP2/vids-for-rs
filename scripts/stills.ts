// Images de contrôle : une image par scène (au milieu de la scène), avec la surcouche
// de l'interface des réseaux pour vérifier les zones de sécurité.
// Usage : npm run stills -- <épisode>        → episodes/<dossier>/controle/*.png
//         npm run stills -- planches         → docs/images/planche-*.png
import fs from 'node:fs';
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {calculerDebuts} from '../src/Episode';
import {dossierEpisode, RACINE} from './lib/episode';
import {empaqueter, navigateur, propsEpisode} from './lib/remotion';

const arg = process.argv.slice(2).find((a) => !a.startsWith('--'));
const serveUrl = await empaqueter();
const browserExecutable = navigateur();

if (arg === 'planches') {
  const dest = path.join(RACINE, 'docs', 'images');
  fs.mkdirSync(dest, {recursive: true});
  for (const [id, fichier] of [
    ['PlancheMarque', 'planche-marque.png'],
    ['PlancheMatou', 'planche-matou.png'],
  ]) {
    const composition = await selectComposition({serveUrl, id, browserExecutable, logLevel: 'error'});
    await renderStill({serveUrl, composition, output: path.join(dest, fichier), browserExecutable, logLevel: 'error'});
    console.log(`docs/images/${fichier}`);
  }
} else {
  const dossier = dossierEpisode(arg);
  const props = propsEpisode(dossier);
  const dest = path.join(dossier, 'controle');
  fs.rmSync(dest, {recursive: true, force: true});
  fs.mkdirSync(dest, {recursive: true});
  const composition = await selectComposition({serveUrl, id: 'EpisodeAvecInterface', inputProps: props, browserExecutable, logLevel: 'error'});
  const debuts = calculerDebuts(props, composition.fps);
  const images = props.episode.scenes.map((s, i) => {
    const fin = i + 1 < debuts.length ? debuts[i + 1] : composition.durationInFrames;
    // vers la fin de la scène : tout est arrivé à l'écran
    return {frame: Math.max(debuts[i], Math.round(debuts[i] + (fin - debuts[i]) * 0.8)), nom: `${String(i + 1).padStart(2, '0')}-${s.type}`};
  });
  images.unshift({frame: 0, nom: '00-premiere-image'});
  for (const im of images) {
    const output = path.join(dest, `${im.nom}.png`);
    await renderStill({serveUrl, composition, inputProps: props, frame: im.frame, output, browserExecutable, scale: 0.5, logLevel: 'error'});
    console.log(path.relative(RACINE, output));
  }
}
