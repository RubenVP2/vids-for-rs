// Compare des voix masculines françaises d'OpenRouter sur une même phrase de Matou.
// Pour chaque voix : MP3, durée, débit (mots/s), hauteur moyenne de la voix, et
// fidélité (la transcription retrouve-t-elle le texte ?).
// Usage : npm run voices:compare [-- --sortie dossier]
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {dureeAudio, synthetiser, transcrire, type ReglagesVoix} from './lib/openrouter';

const PHRASE =
  "L'actu de l'IA va trop vite ? En fait, c'est simple. Moi, c'est Matou, et chaque jour je t'explique une annonce en trente secondes. C'était Matou, et c'est tout.";
const CONSIGNE =
  'Voix masculine française, jeune et complice, pédagogue, rythme vif mais articulé, petit sourire dans la voix, humour pince-sans-rire.';

const CANDIDATES: (ReglagesVoix & {nom: string})[] = [
  {nom: 'mai-marc', modele: 'microsoft/mai-voice-2.1', voix: 'fr-FR-Marc:MAI-Voice-2.1', format: 'mp3'},
  {nom: 'mai-grant', modele: 'microsoft/mai-voice-2.1', voix: 'fr-FR-Grant:MAI-Voice-2.1', format: 'mp3'},
  {nom: 'aura-hector', modele: 'deepgram/aura-2', voix: 'aura-2-hector-fr', format: 'mp3'},
  {nom: 'eleven-v3-george', modele: 'elevenlabs/eleven-v3', voix: 'george', format: 'mp3'},
  {nom: 'eleven-v3-liam', modele: 'elevenlabs/eleven-v3', voix: 'liam', format: 'mp3'},
  {nom: 'eleven-ml2-brian', modele: 'elevenlabs/eleven-multilingual-v2', voix: 'brian', format: 'mp3'},
  {nom: 'gemini-puck', modele: 'google/gemini-3.8-flash-tts', voix: 'Puck', format: 'pcm', frequencePcm: 24000, instructions: CONSIGNE},
  {nom: 'gemini-charon', modele: 'google/gemini-3.8-flash-tts', voix: 'Charon', format: 'pcm', frequencePcm: 24000, instructions: CONSIGNE},
  {nom: 'gemini-fenrir', modele: 'google/gemini-3.8-flash-tts', voix: 'Fenrir', format: 'pcm', frequencePcm: 24000, instructions: CONSIGNE},
  {nom: 'grok-rex', modele: 'x-ai/grok-voice-tts-1.0', voix: 'rex', format: 'mp3'},
  {nom: 'grok-leo', modele: 'x-ai/grok-voice-tts-1.0', voix: 'leo', format: 'mp3'},
];

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);

/** Hauteur médiane de la voix (Hz), par autocorrélation sur des fenêtres voisées. */
const hauteurMediane = (mp3: string) => {
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']);
  const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
  const n = 640;
  const f0s: number[] = [];
  for (let i = 0; i + n < x.length; i += 320) {
    let e = 0;
    for (let k = 0; k < n; k++) e += x[i + k] * x[i + k];
    if (e / n < 1e-3) continue;
    let meilleur = 0,
      lagMeilleur = 0;
    for (let lag = 40; lag <= 200; lag++) {
      let c = 0;
      for (let k = 0; k < n - lag; k++) c += x[i + k] * x[i + k + lag];
      if (c > meilleur) {
        meilleur = c;
        lagMeilleur = lag;
      }
    }
    if (meilleur / e > 0.5) f0s.push(16000 / lagMeilleur);
  }
  f0s.sort((a, b) => a - b);
  return f0s.length ? Math.round(f0s[Math.floor(f0s.length / 2)]) : 0;
};

const sortie = process.argv.includes('--sortie') ? process.argv[process.argv.indexOf('--sortie') + 1] : 'brand/voix/essais';
fs.mkdirSync(sortie, {recursive: true});
const attendus = norm(PHRASE);
const lignes: string[] = [];
for (const c of CANDIDATES) {
  const fichier = path.join(sortie, `${c.nom}.mp3`);
  try {
    if (!fs.existsSync(fichier)) await synthetiser(PHRASE, c, fichier);
    const duree = dureeAudio(fichier);
    const mots = await transcrire(fichier);
    const entendus = new Set(norm(mots.map((m) => m.mot).join(' ')));
    const fidelite = attendus.filter((m) => entendus.has(m)).length / attendus.length;
    const ligne = `| ${c.nom} | \`${c.modele}\` / \`${c.voix}\` | ${duree.toFixed(1)} s | ${(attendus.length / duree).toFixed(2)} | ${hauteurMediane(fichier)} Hz | ${Math.round(fidelite * 100)} % |`;
    lignes.push(ligne);
    console.log(ligne);
  } catch (e) {
    console.log(`| ${c.nom} | ${c.modele} / ${c.voix} | échec : ${(e as Error).message.slice(0, 120)} |`);
  }
}
fs.writeFileSync(
  path.join(sortie, 'comparatif.md'),
  `# Essais de voix\n\nPhrase : « ${PHRASE} »\n\n| Essai | Modèle / voix | Durée | Mots/s | Hauteur | Fidélité |\n| --- | --- | --- | --- | --- | --- |\n${lignes.join('\n')}\n`,
);
