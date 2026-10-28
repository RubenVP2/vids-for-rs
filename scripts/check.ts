// Contrôle qualité APRÈS le rendu : la vidéo est-elle publiable ?
// Usage : npm run check -- <épisode>
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {dossierEpisode, lireEpisode, lireTimings, nomEpisode} from './lib/episode';

const dossier = dossierEpisode(process.argv[2]);
const nom = nomEpisode(dossier);
const episode = lireEpisode(dossier);
const timings = lireTimings(dossier);
const ok: string[] = [];
const ko: string[] = [];
const verifier = (cond: boolean, bien: string, mal: string) => (cond ? ok : ko).push(cond ? bien : mal);

const mp4 = path.join(dossier, 'rendu', `${nom}.mp4`);
const png = path.join(dossier, 'rendu', `${nom}-miniature.png`);
verifier(fs.existsSync(mp4), 'Vidéo rendue', `Vidéo absente (${path.relative(dossier, mp4)}) : lancer npm run render`);
verifier(fs.existsSync(png), 'Miniature rendue', 'Miniature absente');

if (fs.existsSync(mp4)) {
  const info = JSON.parse(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height,codec_name', '-of', 'json', mp4]).toString(),
  );
  const duree = Number(info.format.duration);
  const max = episode.serie === 'flash' ? 40 : 50;
  verifier(duree <= max, `Durée ${duree.toFixed(1)} s (max ${max} s)`, `Trop long : ${duree.toFixed(1)} s (max ${max} s pour ${episode.serie})`);
  const video = info.streams.find((s: {codec_name: string}) => s.codec_name === 'h264');
  verifier(video?.width === 1080 && video?.height === 1920, 'Format 1080×1920 H.264', 'Format inattendu (attendu 1080×1920 H.264)');
  verifier(info.streams.some((s: {codec_name: string}) => s.codec_name === 'aac'), 'Piste audio AAC', 'Pas de piste audio');
  const sortie = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i "${mp4}" -af loudnorm=print_format=json -f null - 2>&1 | tail -12`]).toString();
  const lufs = Number(/"input_i" : "(-?[\d.]+)"/.exec(sortie)?.[1]);
  verifier(Math.abs(lufs + 14) <= 1.5, `Volume ${lufs} LUFS`, `Volume ${lufs} LUFS (viser -14)`);
}
const alignement = timings.alignement ?? 0;
verifier(alignement >= 0.85, `Voix fidèle au script (${Math.round(alignement * 100)} % des mots retrouvés)`, `Voix douteuse : ${Math.round(alignement * 100)} % des mots retrouvés. Réécouter, refaire la voix (npm run voice -- ${nom} --force).`);

const pub = path.join(dossier, 'publication.md');
if (!fs.existsSync(pub)) {
  ko.push('publication.md absent (description + hashtags)');
} else {
  const texte = fs.readFileSync(pub, 'utf8');
  verifier(texte.includes(episode.source.url), 'Source citée dans la description', 'L’URL de la source manque dans publication.md');
  for (const plateforme of ['TikTok', 'Instagram', 'YouTube']) {
    const bloc = texte.split(/^## /m).find((b) => b.startsWith(plateforme)) ?? '';
    const tags = bloc.match(/#[\p{L}_][\p{L}\d_]*/gu) ?? [];
    verifier(tags.length >= 3 && tags.length <= 8, `${plateforme} : ${tags.length} hashtags`, `${plateforme} : ${tags.length} hashtags (viser 3 à 8)`);
  }
}

ok.forEach((m) => console.log(`OK  ${m}`));
ko.forEach((m) => console.log(`KO  ${m}`));
console.log(ko.length ? `\n${ko.length} point(s) à corriger avant publication.` : '\nPrêt pour la relecture humaine.');
process.exit(ko.length ? 1 : 0);
