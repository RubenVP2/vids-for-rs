// Étape « rendu » : scenes.json + timings.json + voix.mp3 → MP4 + miniature.
// Usage : npm run render -- <épisode> [--brouillon]   (brouillon = demi-résolution, plus rapide)
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {dossierEpisode, nomEpisode, RACINE} from './lib/episode';
import {empaqueter, navigateur, propsEpisode} from './lib/remotion';

const args = process.argv.slice(2);
const dossier = dossierEpisode(args.find((a) => !a.startsWith('--')));
const brouillon = args.includes('--brouillon');
const props = propsEpisode(dossier);
const sortie = path.join(dossier, 'rendu');
fs.mkdirSync(sortie, {recursive: true});

const serveUrl = await empaqueter();
const browserExecutable = navigateur();
const composition = await selectComposition({serveUrl, id: 'Episode', inputProps: props, browserExecutable, logLevel: 'error', timeoutInMilliseconds: 120000});
const nom = nomEpisode(dossier);
const mp4 = path.join(sortie, `${nom}${brouillon ? '-brouillon' : ''}.mp4`);
let dernier = -1;
await renderMedia({
  serveUrl,
  composition,
  inputProps: props,
  codec: 'h264',
  crf: brouillon ? 28 : 18,
  pixelFormat: 'yuv420p',
  audioBitrate: '192k',
  scale: brouillon ? 0.5 : 1,
  outputLocation: mp4,
  browserExecutable,
  logLevel: 'error',
  timeoutInMilliseconds: 120000,
  delayRenderTimeoutInMilliseconds: 120000,
  // Peu de mémoire (Raspberry Pi, 4 Go) : une seule page Chromium, sinon les images dépassent le délai.
  concurrency: os.totalmem() < 6e9 ? 1 : Math.max(1, Math.min(4, os.cpus().length)),
  onProgress: ({progress}) => {
    const p = Math.floor(progress * 10);
    if (p !== dernier) {
      dernier = p;
      process.stdout.write(`${p * 10}% `);
    }
  },
});
// volume final à -14 LUFS, le niveau attendu par TikTok, Reels et Shorts (vidéo copiée telle quelle)
const tmp = mp4.replace(/\.mp4$/, '.tmp.mp4');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', tmp]);
fs.renameSync(tmp, mp4);
console.log(`\nVidéo : ${path.relative(RACINE, mp4)} (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);

const stillComp = await selectComposition({serveUrl, id: 'Miniature', inputProps: props, browserExecutable, logLevel: 'error', timeoutInMilliseconds: 120000});
const png = path.join(sortie, `${nom}-miniature.png`);
await renderStill({serveUrl, composition: stillComp, inputProps: props, output: png, browserExecutable, logLevel: 'error', timeoutInMilliseconds: 120000, delayRenderTimeoutInMilliseconds: 120000});
console.log(`Miniature : ${path.relative(RACINE, png)}`);
