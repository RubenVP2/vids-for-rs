// Étape « voix » : script → voix.mp3 + timings.json (minutage de chaque mot).
// 1. synthèse vocale de tout le texte d'un coup (prosodie naturelle) via OpenRouter ;
// 2. mesure de chaque prise (débit, intonation, pauses) et reprise si la voix est plate ;
// 3. transcription horodatée (OpenRouter, Whisper) puis alignement des mots du script ;
// 4. enveloppe du volume par image, pour animer la bouche de Matou.
// Usage : npm run voice -- <épisode> [--force]
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {texteAffiche, texteParle, type Timings} from '../src/schema';
import {aligner, normaliser} from './lib/alignement';
import {dossierEpisode, lireEpisode, RACINE} from './lib/episode';
import {dureeAudio, synthetiser, transcrire} from './lib/openrouter';
import {avertissements, calerDebit, defauts, mesurer, resume, score, type QualiteVoix} from './lib/qualite-voix';
import {lireReglagesVoix} from './lib/reglages-voix';
import tokens from '../brand/tokens.json';

const args = process.argv.slice(2);
const dossier = dossierEpisode(args.find((a) => !a.startsWith('--')));
const force = args.includes('--force');
/** --secours : une seule prise avec la première voix de secours, pour écoute seulement. */
const secoursDemande = args.includes('--secours');
/** empreinte d'un fichier : lie la provenance au CONTENU de voix.mp3. */
const empreinte = (f: string) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
/** La synthèse varie d'une prise à l'autre : on en essaie trois au plus. */
const PRISES_MAX = 3;
/** Tentatives sur le modèle principal avant de passer à une voix de secours (API capricieuse). */
const ESSAIS_API = 3;
const episode = lireEpisode(dossier);
const reglages = lireReglagesVoix();
/** Une phrase par scène : sert à rapporter le nombre de pauses. */
const phrases = episode.scenes.length;

// Texte lu : les scènes bout à bout. Chaque mot garde sa scène et son surlignage.
type MotScript = {texte: string; scene: number; surligne: boolean};
const motsScript: MotScript[] = [];
episode.scenes.forEach((s, iScene) => {
  const morceaux = texteAffiche(s.texte).trim().split(/==(.+?)==/g);
  morceaux.forEach((m, k) => {
    for (const w of m.split(/\s+/).filter(Boolean)) {
      // la ponctuation isolée (deux-points, point d'interrogation) se colle au mot précédent
      if (!normaliser(w) && motsScript.length) {
        // « , » et « . » se collent ; les autres gardent l'espace (typographie française)
        motsScript[motsScript.length - 1].texte += /^[,.…)]/.test(w) ? w : ` ${w}`;
      } else motsScript.push({texte: w, scene: iScene, surligne: k % 2 === 1});
    }
  });
});
const texte = episode.scenes.map((s) => texteParle(s.texte).trim()).join(' ');
const nombreMots = motsScript.length;

const mp3 = path.join(dossier, 'voix.mp3');
/** Provenance de la voix : écrite avant Whisper, pour survivre à un échec de transcription. */
const provenance = path.join(dossier, 'voix.meta.json');
let qualite: QualiteVoix | undefined;
let voix: {modele: string; voix: string; secours?: boolean} | undefined;

if (secoursDemande) {
  const r = reglages.secours[0];
  if (!r) throw new Error('Aucune voix de secours dans brand/voix.json.');
  const f = path.join(dossier, 'voix.secours.mp3');
  console.warn(`Prise d'écoute avec ${r.modele} / ${r.voix} : elle ne remplacera jamais voix.mp3.`);
  await synthetiser(texte, r, f);
  throw new Error(`Voix de secours écrite dans ${path.basename(f)} (écoute seulement) : voix.mp3 intact.`);
}

if (!fs.existsSync(mp3) || force) {
  // Coupe les silences au début et à la fin, normalise le volume (-16 LUFS, norme réseaux sociaux).
  const normaliserVolume = (f: string) => {
    const tmp = f.replace(/\.mp3$/, '.tmp.mp3');
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-i', f,
      '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11',
      '-ar', '44100', '-b:a', '96k', tmp,
    ]);
    fs.renameSync(tmp, f);
  };
  // Aucune prise intermédiaire ne doit rester dans l'épisode (elle partirait dans git).
  const nettoyer = () => {
    for (const f of fs.readdirSync(path.dirname(mp3)).filter((x) => /\.(prise\d+|tmp|debit)\.mp3$/.test(x))) {
      fs.rmSync(path.join(path.dirname(mp3), f), {force: true});
    }
  };
  try {
    let conforme: {fichier: string; q: QualiteVoix} | undefined; // prise sans défaut
    let moindre: {fichier: string; q: QualiteVoix} | undefined; // meilleure des prises défectueuses
    let panne = false;
    for (let prise = 1; prise <= PRISES_MAX && !conforme; prise++) {
      const candidat = mp3.replace(/\.mp3$/, `.prise${prise}.mp3`);
      let obtenu = false;
      // Panne passagère : on réessaie le même modèle (une voix de secours n'est pas Matou).
      for (let appel = 1; appel <= ESSAIS_API && !obtenu; appel++) {
        try {
          console.log(`Voix : ${reglages.modele} / ${reglages.voix}, prise ${prise}/${PRISES_MAX}${appel > 1 ? ` (appel ${appel})` : ''}…`);
          await synthetiser(texte, reglages, candidat);
          obtenu = true;
        } catch (e) {
          console.warn(`  échec : ${(e as Error).message.slice(0, 200)}`);
          if (appel < ESSAIS_API) await new Promise((f) => setTimeout(f, 15000));
        }
      }
      if (!obtenu) {
        panne = true;
        break;
      }
      // Une réponse tronquée est traitée comme un échec de prise, pas comme un arrêt de la commande.
      let q: QualiteVoix;
      try {
        normaliserVolume(candidat);
        q = mesurer(candidat, nombreMots, 0, 0, phrases);
      } catch (e) {
        console.warn(`  prise illisible : ${(e as Error).message.slice(0, 200)}`);
        fs.rmSync(candidat, {force: true});
        continue;
      }
      // Le débit se recale AVANT de juger : la mesure qui décide doit porter sur l'audio final.
      let final = q;
      if (avertissements(q).length) final = calerDebit(candidat, q, nombreMots);
      const defautsPrise = defauts(final);
      console.log(`  ${resume(final)}${defautsPrise.length ? ` — ${defautsPrise.join(' ; ')}` : ' — OK'}`);
      if (!defautsPrise.length) {
        conforme = {fichier: candidat, q: final};
        break; // une prise conforme : inutile d'en produire d'autres
      }
      // Aucune prise conforme pour l'instant : on garde la plus vivante.
      if (!moindre || score(q) > score(moindre.q)) {
        if (moindre) fs.rmSync(moindre.fichier, {force: true});
        moindre = {fichier: candidat, q: final};
      } else {
        fs.rmSync(candidat, {force: true});
      }
    }
    if (!conforme && moindre) {
      // Aucune prise conforme : on ne touche pas à voix.mp3, on met la meilleure à part.
      fs.rmSync(path.join(dossier, 'voix.refaire.mp3'), {force: true});
      fs.renameSync(moindre.fichier, path.join(dossier, 'voix.refaire.mp3'));
      throw new Error(
        `Aucune prise conforme (${defauts(moindre.q).join(' ; ')}) : la meilleure est dans voix.refaire.mp3, voix.mp3 laissé intact. Refaire la voix plus tard.`,
      );
    }
    if (!conforme) {
      throw new Error(
        `Modèle ${reglages.modele} indisponible après ${ESSAIS_API} appels par prise : voix.mp3 laissé intact. Relancer plus tard (ou npm run voice -- ${path.basename(dossier)} --secours pour une prise d'écoute).`,
      );
    }
    fs.renameSync(conforme.fichier, mp3);
    qualite = conforme.q;
    // Provenance liée au CONTENU du fichier : un mp3 déplacé à la main ne passera pas `check`.
    fs.writeFileSync(provenance, JSON.stringify({modele: reglages.modele, voix: reglages.voix, sha256: empreinte(mp3)}, null, 1) + '\n');
    voix = {modele: reglages.modele, voix: reglages.voix};
    fs.rmSync(path.join(dossier, 'voix.secours.mp3'), {force: true}); // un secours périmé ne doit pas rester
    const av = avertissements(qualite);
    if (av.length) console.warn(`  ${av.join(' ; ')} : texte dense, à raccourcir plutôt qu’à refaire.`);
  } finally {
    nettoyer();
  }
} else {
  console.log('voix.mp3 existe déjà (--force pour la refaire).');
  // Provenance : le fichier doit être celui qu'on a écrit (même empreinte).
  let meta: {modele?: string; voix?: string; sha256?: string} | undefined;
  try {
    meta = JSON.parse(fs.readFileSync(provenance, 'utf8'));
  } catch {
    meta = undefined;
  }
  if (meta?.sha256) {
    if (meta.sha256 !== empreinte(mp3)) {
      throw new Error('voix.mp3 ne correspond pas à sa provenance (voix.meta.json) : fichier modifié à la main ? Relancer avec --force.');
    }
    voix = {modele: meta.modele ?? reglages.modele, voix: meta.voix ?? reglages.voix};
  } else {
    console.warn('Provenance absente (épisode antérieur au 02/11) : identité de la voix non vérifiable.');
    const ancienne = ((): undefined | {modele: string; voix: string} => {
      try {
        return (JSON.parse(fs.readFileSync(path.join(dossier, 'timings.json'), 'utf8')) as {voix?: {modele: string; voix: string}}).voix;
      } catch {
        return undefined;
      }
    })();
    voix = ancienne ?? {modele: reglages.modele, voix: reglages.voix};
  }
}

const duree = dureeAudio(mp3);
if (!qualite) qualite = mesurer(mp3, nombreMots, 0, 0, phrases);
console.log(`Durée de la voix : ${duree.toFixed(1)} s — ${resume(qualite)}`);
console.log(`Transcription horodatée (${reglages.transcription})…`);
const entendus = await transcrire(mp3, reglages.transcription);
const alignes = aligner(motsScript.map((m) => m.texte), entendus, duree);
const retrouves = alignes.filter((a) => a.trouve).length;
console.log(`Alignement : ${retrouves}/${alignes.length} mots retrouvés à l'oreille, le reste interpolé.`);

// Débit définitif sur la parole utile réelle (bornes des premier et dernier mots alignés) :
// la mesure d'avant Whisper servait à choisir la prise, celle-ci fait foi dans timings.json.
const debutParole = alignes[0]?.debut ?? 0;
const finParole = alignes[alignes.length - 1]?.fin ?? duree;
const mesure: QualiteVoix = {...qualite, motsParMinute: Math.round((nombreMots / Math.max(0.5, finParole - debutParole)) * 60)};

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
  voix: voix ?? {modele: reglages.modele, voix: reglages.voix},
  alignement: Math.round((retrouves / alignes.length) * 100) / 100,
  qualite: mesure,
  mots,
  scenes,
  enveloppe,
};
fs.writeFileSync(path.join(dossier, 'timings.json'), JSON.stringify(timings, null, 1));
scenes.forEach((s, i) =>
  console.log(`  scène ${i + 1} (${episode.scenes[i].type}) : ${s.debut.toFixed(2)} → ${s.fin.toFixed(2)} s`),
);
console.log(`OK : ${path.relative(RACINE, path.join(dossier, 'timings.json'))}`);
