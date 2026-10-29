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
  // Une section par réseau (skill publication, docs/reseaux.md). « ## Threads » n'attrape pas « ## Threads relance ».
  const blocs = texte.split(/^## /m).slice(1);
  const section = (titre: string) => {
    const bloc = blocs.find((b) => b.slice(0, b.indexOf('\n')).replace(/\s*\(.*\)\s*$/, '').trim() === titre);
    return bloc === undefined ? undefined : bloc.slice(bloc.indexOf('\n') + 1).trim();
  };
  const hashtags = (t: string) => t.match(/#[\p{L}_][\p{L}\d_]*/gu) ?? [];
  // [section, hashtags min, max, caractères max, URL permise]
  const regles: [string, number, number, number, boolean][] = [
    ['TikTok', 3, 5, 2000, false],
    ['Instagram', 3, 5, 2200, false], // Instagram ne garde que 5 hashtags
    ['YouTube', 2, 4, 5000, true],
    ['LinkedIn', 0, 3, 3000, false], // lien en commentaire : LinkedIn freine les posts avec lien
    ['Threads', 0, 1, 500, false], // un seul sujet (tag) par post sur Threads
    ['Threads relance', 0, 1, 500, false],
  ];
  for (const [titre, min, max, limite, url] of regles) {
    const bloc = section(titre);
    if (!bloc) {
      ko.push(`Section « ## ${titre} » absente de publication.md`);
      continue;
    }
    const n = hashtags(bloc).length;
    const lien = !url && /https?:\/\//.test(bloc);
    verifier(
      n >= min && n <= max && bloc.length <= limite && !lien,
      `${titre} : ${bloc.length} caractères, ${n} hashtag(s)`,
      `${titre} : ${bloc.length} caractères (max ${limite}), ${n} hashtag(s) (viser ${min} à ${max})${lien ? ', URL dans le texte (la mettre dans le commentaire)' : ''}`,
    );
  }
  // LinkedIn coupe après ~210 caractères (« … voir plus ») : l'accroche doit tenir avant.
  const accroche = (section('LinkedIn') ?? '').split(/\n\s*\n/)[0];
  verifier(accroche.length <= 210, 'LinkedIn : accroche avant « voir plus »', `LinkedIn : le 1er paragraphe fait ${accroche.length} caractères (max 210, avant « voir plus »)`);
  verifier((section('Threads relance') ?? '').includes('?'), 'Threads relance : une question', 'Threads relance : doit poser une question (elle sert à faire répondre)');
  const carrousel = path.join(dossier, 'rendu', 'carrousel');
  const diapos = fs.existsSync(carrousel) ? fs.readdirSync(carrousel).filter((f) => f.endsWith('.png')).length : 0;
  verifier(diapos >= 2, `Carrousel LinkedIn : ${diapos} diapos`, 'Carrousel LinkedIn absent : lancer npm run carrousel');
  // X et Bluesky (pas connectés aujourd'hui) : facultatif, 280 caractères (limite de X).
  const court = section('Court');
  if (court !== undefined) verifier(court.length <= 280, `Court (X, Bluesky) : ${court.length} caractères`, `Court (X, Bluesky) : ${court.length} caractères (max 280)`);
}

ok.forEach((m) => console.log(`OK  ${m}`));
ko.forEach((m) => console.log(`KO  ${m}`));
console.log(ko.length ? `\n${ko.length} point(s) à corriger avant publication.` : '\nPrêt pour la relecture humaine.');
process.exit(ko.length ? 1 : 0);
