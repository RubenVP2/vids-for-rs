// Accès à OpenRouter : synthèse vocale (TTS) et transcription avec horodatage des mots (STT).
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = 'https://openrouter.ai/api/v1';

export const cleOpenRouter = () => {
  const cle = process.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_KEY;
  if (!cle) throw new Error('Clé OpenRouter absente : définir OPENROUTER_API_KEY (ou OPENROUTER_KEY).');
  return cle;
};

export type ReglagesVoix = {
  modele: string;
  voix: string;
  instructions?: string;
  vitesse?: number;
  format: 'mp3' | 'pcm';
  /** Fréquence d'échantillonnage du PCM brut renvoyé par le modèle (ex. 24000 pour Gemini). */
  frequencePcm?: number;
};

/** Synthétise `texte` et écrit un MP3 dans `sortie`. */
export const synthetiser = async (texte: string, r: ReglagesVoix, sortie: string) => {
  const corps: Record<string, unknown> = {model: r.modele, input: texte, voice: r.voix, response_format: r.format};
  if (r.instructions) corps.instructions = r.instructions;
  if (r.vitesse && r.vitesse !== 1) corps.speed = r.vitesse;
  const rep = await fetch(`${BASE}/audio/speech`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${cleOpenRouter()}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(corps),
  });
  if (!rep.ok) throw new Error(`TTS ${r.modele}/${r.voix} : HTTP ${rep.status} ${await rep.text()}`);
  const octets = Buffer.from(await rep.arrayBuffer());
  fs.mkdirSync(path.dirname(sortie), {recursive: true});
  if (r.format === 'mp3') {
    fs.writeFileSync(sortie, octets);
  } else {
    const brut = path.join(os.tmpdir(), `matou-${process.pid}.pcm`);
    fs.writeFileSync(brut, octets);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(r.frequencePcm ?? 24000), '-ac', '1', '-i', brut, '-b:a', '192k', sortie]);
    fs.rmSync(brut);
  }
  return sortie;
};

export type MotTranscrit = {mot: string; debut: number; fin: number};

/** Transcrit un MP3 et renvoie les mots avec leur début et leur fin, en secondes. */
export const transcrire = async (fichier: string, modele = 'openai/whisper-large-v3'): Promise<MotTranscrit[]> => {
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(fichier)], {type: 'audio/mpeg'}), path.basename(fichier));
  form.append('model', modele);
  form.append('language', 'fr');
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'word');
  const rep = await fetch(`${BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${cleOpenRouter()}`},
    body: form,
  });
  if (!rep.ok) throw new Error(`STT ${modele} : HTTP ${rep.status} ${await rep.text()}`);
  const json = (await rep.json()) as {text?: string; words?: {word: string; start: number; end: number}[]};
  if (!json.words?.length) throw new Error(`STT ${modele} : pas d'horodatage des mots dans la réponse.`);
  return json.words.map((w) => ({mot: w.word.trim(), debut: w.start, fin: w.end}));
};

export const dureeAudio = (fichier: string) =>
  Number(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fichier]).toString().trim(),
  );
