// Outils communs pour piloter Remotion depuis les scripts (bundle, navigateur, props).
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import type {EpisodeProps} from '../../src/schema';
import {lireEpisode, lireTimings, nomEpisode, RACINE} from './episode';

/** Navigateur : $REMOTION_BROWSER, sinon celui de Playwright s'il existe, sinon Remotion télécharge le sien. */
export const navigateur = (): string | null => {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const base = '/opt/pw-browsers';
  if (fs.existsSync(base)) {
    for (const d of fs.readdirSync(base).filter((x) => x.startsWith('chromium_headless_shell'))) {
      for (const sous of fs.readdirSync(path.join(base, d))) {
        const exe = path.join(base, d, sous, 'chrome-headless-shell');
        if (fs.existsSync(exe)) return exe;
      }
    }
  }
  for (const p of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
    if (fs.existsSync(p)) return p;
  }
  return null;
};

export const empaqueter = async () => {
  process.stdout.write('Préparation du moteur (bundle)… ');
  const url = await bundle({entryPoint: path.join(RACINE, 'src', 'index.ts'), publicDir: path.join(RACINE, 'public')});
  console.log('ok');
  return url;
};

/** Copie la voix dans public/ (Remotion ne sert que ce dossier) et construit les props. */
export const propsEpisode = (dossier: string): EpisodeProps => {
  const nom = nomEpisode(dossier);
  const dest = path.join(RACINE, 'public', 'episodes', nom);
  fs.mkdirSync(dest, {recursive: true});
  const timings = lireTimings(dossier);
  fs.copyFileSync(path.join(dossier, timings.audio), path.join(dest, timings.audio));
  return {episode: lireEpisode(dossier), timings, audio: `episodes/${nom}/${timings.audio}`};
};
