// Étape « voix » : script → voix.mp3 + timings.json (minutage de chaque mot).
// 1. synthèse vocale de tout le texte d'un coup (prosodie naturelle) via OpenRouter ;
// 2. transcription horodatée (OpenRouter, Whisper) ;
// 3. alignement des mots du script sur les mots entendus ;
// 4. enveloppe du volume par image, pour animer la bouche de Matou.
// Usage : npm run voice -- <épisode> [--force] [--voix modele:voix]
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {texteAffiche, texteParle, type Timings} from '../src/schema';
import {aligner, normaliser} from './lib/alignement';
import {dossierEpisode, lireEpisode, RACINE} from './lib/episode';
import {dureeAudio, synthetiser, transcrire, type ReglagesVoix} from './lib/openrouter';
import tokens from '../brand/tokens.json';

const args = process.argv.slice(2);
const dossier = dossierEpisode(args.find((a) => !a.startsWith('--')));
const force = args.includes('--force');
const episode = lireEpisode(dossier);
const reglages = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'voix.json'), 'utf8')) as ReglagesVoix & {
  transcription: string;
  secours: ReglagesVoix[];
};

// Texte lu : les scènes bout à bout. Chaque mot garde sa scène et son surlignage.
type MotScript = {texte: string; scene: number; surligne: boolean};
const motsScript: MotScript[] = [];
episode.scenes.forEach((s, iScene) => {
  const morceaux = texteAffiche(s.texte).trim().split(/==(.+?)==/g);
  morceaux.forEach((m, k) => {
    for (const w of m.split(/\s+/).filter(Boolean)) {
      // la ponctuation isolée (« : », « ? ») se colle au mot précédent
      if (!normaliser(w) && motsScript.length) {
        // « , » et « . » se collent ; « ? ! : ; » gardent l'espace (typographie française)
        motsScript[motsScript.length - 1].texte += /^[,.…)]/.test(w) ? w : ` ${w}`;
      }
      else motsScript.push({texte: w, scene: iScene, surligne: k % 2 === 1});
    }
  });
});
const texte = episode.scenes.map((s) => texteParle(s.texte).trim()).join(' ');

const mp3 = path.join(dossier, 'voix.mp3');
if (!fs.existsSync(mp3) || force) {
  const essais = [reglages, ...reglages.secours];
  let ok = false;
  for (const r of essais) {
    try {
      console.log(`Voix : ${r.modele} / ${r.voix}…`);
      await synthetiser(texte, r, mp3);
      ok = true;
      reglages.modele = r.modele;
      reglages.voix = r.voix;
      break;
    } catch (e) {
      console.warn(`  échec : ${(e as Error).message.slice(0, 200)}`);
    }
  }
  if (!ok) throw new Error('Aucune voix n’a fonctionné.');
  // coupe les silences au début et à la fin, normalise le volume (-16 LUFS, norme réseaux sociaux)
  const tmp = mp3.replace(/\.mp3$/, '.tmp.mp3');
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', mp3,
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11',
    '-ar', '44100', '-b:a', '96k', tmp,
  ]);
  fs.renameSync(tmp, mp3);
} else {
  console.log('voix.mp3 existe déjà (--force pour la refaire).');
}

const duree = dureeAudio(mp3);
console.log(`Durée de la voix : ${duree.toFixed(1)} s`);
console.log(`Transcription horodatée (${reglages.transcription})…`);
const entendus = await transcrire(mp3, reglages.transcription);
const alignes = aligner(motsScript.map((m) => m.texte), entendus, duree);
const retrouves = alignes.filter((a) => a.trouve).length;
console.log(`Alignement : ${retrouves}/${alignes.length} mots retrouvés à l'oreille, le reste interpolé.`);

// enveloppe du volume, une valeur par image
const fps = tokens.format.fps;
const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '24000', '-f', 'f32le', '-'], {
  maxBuffer: 1 << 28,
});
const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
const parImage = 24000 / fps;
const rms: number[] = [];
for (let i = 0; i < x.length; i += parImage) {
  let s = 0;
  const fin = Math.min(x.length, i + parImage);
  for (let k = i; k < fin; k++) s += x[k] * x[k];
  rms.push(Math.sqrt(s / Math.max(1, fin - i)));
}
const tries = [...rms].sort((p, q) => p - q);
const haut = tries[Math.floor(tries.length * 0.95)] || 1;
const enveloppe = rms.map((v) => Math.round(Math.min(1, v / haut) * 100) / 100);

const mots = alignes.map((a, i) => ({
  texte: a.texte,
  debut: Math.round(a.debut * 1000) / 1000,
  fin: Math.round(a.fin * 1000) / 1000,
  scene: motsScript[i].scene,
  surligne: motsScript[i].surligne,
}));
const scenes = episode.scenes.map((_, i) => {
  const ms = mots.filter((m) => m.scene === i);
  return {debut: ms[0]?.debut ?? 0, fin: ms[ms.length - 1]?.fin ?? 0};
});
const timings: Timings = {
  audio: 'voix.mp3',
  duree: Math.round(duree * 1000) / 1000,
  voix: {modele: reglages.modele, voix: reglages.voix},
  alignement: Math.round((retrouves / alignes.length) * 100) / 100,
  mots,
  scenes,
  enveloppe,
};
fs.writeFileSync(path.join(dossier, 'timings.json'), JSON.stringify(timings, null, 1));
scenes.forEach((s, i) =>
  console.log(`  scène ${i + 1} (${episode.scenes[i].type}) : ${s.debut.toFixed(2)} → ${s.fin.toFixed(2)} s`),
);
console.log(`OK : ${path.relative(RACINE, path.join(dossier, 'timings.json'))}`);
