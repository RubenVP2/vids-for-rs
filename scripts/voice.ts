// Étape « voix » : script → voix.mp3 + timings.json (minutage de chaque mot).
// 1. synthèse vocale de tout le texte d'un coup (prosodie naturelle) via OpenRouter ;
// 2. raccourcissement des silences internes (> 260 ms → 220 ms, 350 ms entre scènes) et calage du débit (~204 mots/min) ;
// 3. mesure de chaque prise (débit, intonation, pauses) et reprise si la voix est plate ;
// 4. transcription horodatée (OpenRouter, Whisper) puis alignement des mots du script ;
// 5. enveloppe du volume par image, pour animer la bouche de Matou et affiner les débuts de scène.
// Usage : npm run voice -- <épisode> [--force] [--recaler]
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {texteAffiche, texteParle, type Timings} from '../src/schema';
import {aligner, normaliser} from './lib/alignement';
import {dossierEpisode, lireEpisode, lireTimings, RACINE} from './lib/episode';
import {dureeAudio, synthetiser, transcrire} from './lib/openrouter';
import {
  avertissements,
  calerDebit,
  defauts,
  mesurer,
  projeterTemps,
  raccourcirSilences,
  resume,
  score,
  type QualiteVoix,
} from './lib/qualite-voix';
import {lireReglagesVoix} from './lib/reglages-voix';
import {rythmeDe} from './lib/rythme';
import tokens from '../brand/tokens.json';

const args = process.argv.slice(2);
const dossier = dossierEpisode(args.find((a) => !a.startsWith('--')));
const force = args.includes('--force');
const recaler = args.includes('--recaler');
/** --secours : une seule prise avec la première voix de secours, pour écoute seulement. */
const secoursDemande = args.includes('--secours');
/** empreinte d'un fichier : lie la provenance au CONTENU de voix.mp3. */
const empreinte = (f: string) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
/** La synthèse varie d'une prise à l'autre : on en essaie trois au plus. */
const PRISES_MAX = 3;
/** Tentatives sur le modèle principal avant de passer à une voix de secours (API capricieuse). */
const ESSAIS_API = 3;
const episode = lireEpisode(dossier);
// Rythme de l'épisode (brand/voix.json → testDebit) : la consigne et la plage de débit du rythme
// « posé » remplacent celles du fichier ; la voix (modèle, timbre) ne change jamais.
const rythme = rythmeDe(episode.numero);
const base = lireReglagesVoix();
const reglages = rythme.instructions ? {...base, instructions: rythme.instructions} : base;
if (rythme.id === 'posé') console.log(`Rythme posé (test de débit) : cible ${rythme.debit.motsParMinuteCible} mots/min.`);
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

const calculerEnveloppe = (fichierAudio: string) => {
  const fps = tokens.format.fps;
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', fichierAudio, '-ac', '1', '-ar', '24000', '-f', 'f32le', '-'], {
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
  return rms.map((v) => Math.round(Math.min(1, v / haut) * 100) / 100);
};

/**
 * Si le 1er mot d'une scène a absorbé le silence inter-scène (quand Whisper a raté le mot),
 * on avance son `debut` jusqu'à la reprise de voix qui suit ce creux silencieux dans `enveloppe`.
 * Ainsi la scène précédente garde sa pause de lecture jusqu'au bout au lieu d'être coupée tôt.
 */
const affinerDebutsScenes = <T extends {debut: number; fin: number; scene: number}>(mots: T[], enveloppe: number[]): T[] => {
  const fps = tokens.format.fps;
  return mots.map((m, i) => {
    const debutScene = i > 0 && m.scene > mots[i - 1].scene;
    if (!debutScene || m.fin - m.debut < 0.25) return m;
    const f0 = Math.max(0, Math.floor(m.debut * fps));
    const f1 = Math.min(enveloppe.length - 1, Math.ceil(m.fin * fps));
    let silence = 0;
    for (let f = f0; f <= f1; f++) {
      if (enveloppe[f] <= 0.04) {
        silence++;
      } else if (silence >= 3 && enveloppe[f] >= 0.08) {
        const nouveauDebut = Math.min(m.fin - 0.08, Math.max(m.debut, (f - 0.5) / fps));
        return {...m, debut: Math.round(nouveauDebut * 1000) / 1000};
      } else if (f > f0 + 2) {
        break; // déjà en pleine parole dès le début du mot
      }
    }
    return m;
  });
};

// Mode --recaler : resserre les silences internes (> 260 ms → 220 ms, tout en gardant 350 ms entre scènes)
// et recale le débit (~204 mots/min) sur un voix.mp3 + timings.json existants.
if (recaler) {
  if (!fs.existsSync(mp3) || !fs.existsSync(path.join(dossier, 'timings.json'))) {
    throw new Error('--recaler nécessite voix.mp3 et timings.json existants.');
  }
  const ancien = lireTimings(dossier);
  const avant = mesurer(mp3, ancien.mots.length, ancien.mots[0]?.debut ?? 0, ancien.mots.at(-1)?.fin ?? ancien.duree, phrases);
  console.log(`Avant recalage : ${ancien.duree.toFixed(1)} s — ${resume(avant)}`);
  const envAncienne = calculerEnveloppe(mp3);
  const motsCorriges = affinerDebutsScenes(ancien.mots, envAncienne);
  const frontieres = episode.scenes
    .map((_, i) => {
      const ms = motsCorriges.filter((m) => m.scene === i);
      return ms[ms.length - 1]?.fin ?? 0;
    })
    .slice(0, -1);
  const coupes = raccourcirSilences(mp3, 0.22, frontieres, 0.35);
  const debutApresCoupes = projeterTemps(motsCorriges[0]?.debut ?? 0, coupes);
  const finApresCoupes = projeterTemps(motsCorriges.at(-1)?.fin ?? ancien.duree, coupes);
  const qSansBlancs = mesurer(mp3, motsCorriges.length, debutApresCoupes, finApresCoupes, phrases);
  const {facteur, ...qFinale} = calerDebit(mp3, qSansBlancs, motsCorriges.length, debutApresCoupes, finApresCoupes, rythme.debit);
  const dureeFinale = dureeAudio(mp3);
  const enveloppe = calculerEnveloppe(mp3);
  const motsProjetes = motsCorriges.map((m, i) => ({
    texte: motsScript[i]?.texte ?? m.texte,
    debut: Math.round(projeterTemps(m.debut, coupes, facteur) * 1000) / 1000,
    fin: Math.round(projeterTemps(m.fin, coupes, facteur) * 1000) / 1000,
    scene: motsScript[i]?.scene ?? m.scene,
    surligne: motsScript[i]?.surligne ?? m.surligne,
  }));
  const mots = affinerDebutsScenes(motsProjetes, enveloppe);
  const scenes = episode.scenes.map((_, i) => {
    const ms = mots.filter((m) => m.scene === i);
    return {debut: ms[0]?.debut ?? 0, fin: ms[ms.length - 1]?.fin ?? 0};
  });
  const debutParole = mots[0]?.debut ?? 0;
  const finParole = mots.at(-1)?.fin ?? dureeFinale;
  const mesure: QualiteVoix = {
    ...qFinale,
    secondes: Math.round(dureeFinale * 100) / 100,
    motsParMinute: Math.round((mots.length / Math.max(0.5, finParole - debutParole)) * 60),
  };
  const timings: Timings = {
    ...ancien,
    duree: Math.round(dureeFinale * 1000) / 1000,
    qualite: mesure,
    mots,
    scenes,
    enveloppe,
  };
  fs.writeFileSync(path.join(dossier, 'timings.json'), JSON.stringify(timings, null, 1));
  if (fs.existsSync(provenance)) {
    const meta = JSON.parse(fs.readFileSync(provenance, 'utf8'));
    fs.writeFileSync(provenance, JSON.stringify({...meta, sha256: empreinte(mp3)}, null, 1) + '\n');
  }
  console.log(`Après recalage : ${dureeFinale.toFixed(1)} s (${coupes.length} silence(s) raccourci(s), atempo ×${facteur.toFixed(2)}) — ${resume(mesure)}`);
  scenes.forEach((s, i) =>
    console.log(`  scène ${i + 1} (${episode.scenes[i].type}) : ${s.debut.toFixed(2)} → ${s.fin.toFixed(2)} s`),
  );
  process.exit(0);
}

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
    for (const f of fs.readdirSync(path.dirname(mp3)).filter((x) => /\.(prise\d+|tmp|debit|silences|secours)\.mp3$/.test(x))) {
      fs.rmSync(path.join(path.dirname(mp3), f), {force: true});
    }
  };
  try {
    let conforme: {fichier: string; q: QualiteVoix} | undefined; // prise sans défaut
    let moindre: {fichier: string; q: QualiteVoix} | undefined; // meilleure des prises défectueuses
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
      if (!obtenu) break;
      // Une réponse tronquée est traitée comme un échec de prise, pas comme un arrêt de la commande.
      let q: QualiteVoix;
      try {
        normaliserVolume(candidat);
        raccourcirSilences(candidat);
        q = mesurer(candidat, nombreMots, 0, 0, phrases);
      } catch (e) {
        console.warn(`  prise illisible : ${(e as Error).message.slice(0, 200)}`);
        fs.rmSync(candidat, {force: true});
        continue;
      }
      // Le débit se recale AVANT de juger : la mesure qui décide doit porter sur l'audio final.
      let final = q;
      if (avertissements(q, rythme.debit).length) {
        const {facteur: _, ...recale} = calerDebit(candidat, q, nombreMots, 0, 0, rythme.debit);
        final = recale;
      }
      const defautsPrise = defauts(final);
      console.log(`  ${resume(final)}${defautsPrise.length ? ` — ${defautsPrise.join(' ; ')}` : ' — OK'}`);
      if (!defautsPrise.length) {
        conforme = {fichier: candidat, q: final};
        break; // une prise conforme : inutile d'en produire d'autres
      }
      // Aucune prise conforme pour l'instant : on garde la plus vivante.
      if (!moindre || score(q, rythme.debit) > score(moindre.q, rythme.debit)) {
        if (moindre) fs.rmSync(moindre.fichier, {force: true});
        moindre = {fichier: candidat, q: final};
      } else {
        fs.rmSync(candidat, {force: true});
      }
    }
    if (!conforme && !moindre && reglages.secours?.length) {
      for (const secours of reglages.secours) {
        console.warn(`Modèle principal ${reglages.modele} indisponible. Essai voix de secours : ${secours.modele} / ${secours.voix}…`);
        const candidat = mp3.replace(/\.mp3$/, '.secours.mp3');
        try {
          await synthetiser(texte, secours, candidat);
          normaliserVolume(candidat);
          raccourcirSilences(candidat);
          const q = mesurer(candidat, nombreMots, 0, 0, phrases);
          let final = q;
          if (avertissements(q).length) {
            const {facteur: _, ...recale} = calerDebit(candidat, q, nombreMots);
            final = recale;
          }
          const defautsPrise = defauts(final);
          console.log(`  secours ${resume(final)}${defautsPrise.length ? ` — ${defautsPrise.join(' ; ')}` : ' — OK'}`);
          if (!defautsPrise.length) {
            conforme = {fichier: candidat, q: final};
            voix = {modele: secours.modele, voix: secours.voix, secours: true};
            console.warn(`Voix de secours conforme retenue (${secours.modele} / ${secours.voix}).`);
            break;
          } else if (!moindre || score(final) > score(moindre.q)) {
            if (moindre) fs.rmSync(moindre.fichier, {force: true});
            moindre = {fichier: candidat, q: final};
            voix = {modele: secours.modele, voix: secours.voix, secours: true};
          }
        } catch (e) {
          console.warn(`  échec voix de secours ${secours.modele} : ${(e as Error).message.slice(0, 200)}`);
          fs.rmSync(candidat, {force: true});
        }
      }
      if (!conforme && moindre && voix?.secours) {
        conforme = moindre;
        moindre = undefined;
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
    const infoVoix = voix ?? {modele: reglages.modele, voix: reglages.voix};
    fs.writeFileSync(provenance, JSON.stringify({...infoVoix, sha256: empreinte(mp3)}, null, 1) + '\n');
    voix = infoVoix;
    fs.rmSync(path.join(dossier, 'voix.secours.mp3'), {force: true}); // un secours périmé ne doit pas rester
    const av = avertissements(qualite, rythme.debit);
    if (av.length) console.warn(`  ${av.join(' ; ')} : texte dense, à raccourcir plutôt qu’à refaire.`);
  } finally {
    nettoyer();
  }
} else {
  console.log('voix.mp3 existe déjà (--force pour la refaire, --recaler pour resserrer les silences et le débit).');
  // Provenance : le fichier doit être celui qu'on a écrit (même empreinte).
  let meta: {modele?: string; voix?: string; secours?: boolean; sha256?: string} | undefined;
  try {
    meta = JSON.parse(fs.readFileSync(provenance, 'utf8'));
  } catch {
    meta = undefined;
  }
  if (meta?.sha256) {
    if (meta.sha256 !== empreinte(mp3)) {
      throw new Error('voix.mp3 ne correspond pas à sa provenance (voix.meta.json) : fichier modifié à la main ? Relancer avec --force.');
    }
    voix = {modele: meta.modele ?? reglages.modele, voix: meta.voix ?? reglages.voix, secours: meta.secours};
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
const enveloppe = calculerEnveloppe(mp3);

const motsBruts = alignes.map((a, i) => ({
  texte: a.texte,
  debut: Math.round(a.debut * 1000) / 1000,
  fin: Math.round(a.fin * 1000) / 1000,
  scene: motsScript[i].scene,
  surligne: motsScript[i].surligne,
}));
const mots = affinerDebutsScenes(motsBruts, enveloppe);
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
