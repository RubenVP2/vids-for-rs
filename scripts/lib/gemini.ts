// Accès à Google AI Studio (API Gemini directe, clé GEMINI_API_KEY) : synthèse vocale (TTS)
// et transcription avec horodatage des mots (STT). Même modèle et même voix qu'OpenRouter :
// zéro dérive vocale (validée à l'oreille, docs/decisions.md).
// Patron de style : directive « Speak in a… » en anglais, NON prononcée (les instructions
// en français dans le prompt sont, elles, lues à voix haute — vérifié par transcription).
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type {MotTranscrit, ReglagesVoix} from './openrouter';

const BASE = 'https://generativelanguage.googleapis.com/v1beta';

export type ReglagesGemini = ReglagesVoix & {
  /** Style en anglais (patron « Speak in a… »), inclus en tête de prompt et non prononcé. */
  directive?: string;
};

export const cleGemini = () => {
  const cle = process.env.GEMINI_API_KEY;
  if (!cle) throw new Error('Clé Google AI Studio absente : définir GEMINI_API_KEY (~/.config/vids-for-rs/env).');
  return cle;
};

const api = async (chemin: string, corps: unknown): Promise<Record<string, unknown>> => {
  const rep = await fetch(`${BASE}/${chemin}`, {
    method: 'POST',
    headers: {'x-goog-api-key': cleGemini(), 'Content-Type': 'application/json'},
    body: JSON.stringify(corps),
  });
  if (!rep.ok) throw new Error(`Gemini ${chemin} : HTTP ${rep.status} ${await rep.text()}`);
  return (await rep.json()) as Record<string, unknown>;
};

const texteReponse = (rep: Record<string, unknown>) =>
  (((rep.candidates as {content?: {parts?: {text?: string}[]}}[])?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? '')
    .join(''));

/** Synthétise `texte` en MP3 dans `sortie` (PCM s16le renvoyé par Gemini, converti par ffmpeg). */
export const synthetiser = async (texte: string, r: ReglagesGemini, sortie: string) => {
  const modele = r.modele.replace(/^google\//, '');
  const prompt = r.directive ? `${r.directive}"${texte}"` : texte;
  const rep = await api(`models/${modele}:generateContent`, {
    contents: [{parts: [{text: prompt}]}],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {voiceConfig: {prebuiltVoiceConfig: {voiceName: r.voix}}},
    },
  });
  const parts = ((rep.candidates as {content?: {parts?: {inlineData?: {data?: string}}[]}}[])?.[0]?.content?.parts ?? []) as {inlineData?: {data?: string}}[];
  const data = parts[0]?.inlineData?.data;
  if (!data) throw new Error(`TTS ${modele}/${r.voix} : pas d'audio dans la réponse.`);
  const brut = path.join(os.tmpdir(), `matou-${process.pid}.pcm`);
  fs.writeFileSync(brut, Buffer.from(data, 'base64'));
  fs.mkdirSync(path.dirname(sortie), {recursive: true});
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(r.frequencePcm ?? 24000), '-ac', '1', '-i', brut, '-b:a', '192k', sortie]);
  fs.rmSync(brut);
  return sortie;
};

/** Transcrit un MP3 et renvoie les mots avec leur début et leur fin, en secondes. */
export const transcrire = async (fichier: string, modele = 'gemini-3-flash-preview'): Promise<MotTranscrit[]> => {
  const audio = fs.readFileSync(fichier).toString('base64');
  const rep = await api(`models/${modele.replace(/^google\//, '')}:generateContent`, {
    contents: [
      {
        parts: [
          {inlineData: {mimeType: 'audio/mpeg', data: audio}},
          {
            text:
              "Transcris cet audio en français. Réponds UNIQUEMENT avec un tableau JSON " +
              '[{"mot": "...", "debut": 0.0, "fin": 0.0}] : un objet par mot prononcé, dans ' +
              "l'ordre, debut et fin en secondes (nombres décimaux, chronologie plausible sur " +
              "la durée totale). Aucun autre texte, aucun commentaire.",
          },
        ],
      },
    ],
  });
  const texte = texteReponse(rep);
  const deb = texte.indexOf('[');
  const fin = texte.lastIndexOf(']');
  if (deb < 0 || fin <= deb) throw new Error(`STT ${modele} : pas de tableau JSON dans la réponse.`);
  const brut = JSON.parse(texte.slice(deb, fin + 1)) as unknown;
  if (!Array.isArray(brut) || !brut.length) throw new Error(`STT ${modele} : tableau vide.`);
  return (brut as {mot?: unknown; debut?: unknown; fin?: unknown}[]).map((w) => ({
    mot: String(w.mot ?? '').trim(),
    debut: Number(w.debut) || 0,
    fin: Number(w.fin) || 0,
  }));
};

export const dureeAudio = (fichier: string) =>
  Number(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fichier]).toString().trim(),
  );

export type {MotTranscrit, ReglagesVoix};
