// La voix d'un épisode en duo (brand/duo.json, docs/personnages.md) : Matou et Plouf.
//
// Chacun est enregistré D'UN SEUL TENANT (prosodie naturelle, 2 appels de synthèse) : Matou
// par voice.ts comme d'habitude (voix-matou.mp3), Plouf ici (voix-plouf.mp3, toutes ses
// répliques à la suite). Les deux prises sont transcrites et alignées sur le script, puis
// découpées dans les silences et intercalées : dans chaque scène, la réplique de Plouf, puis
// celle de Matou. Résultat : voix.mp3 (le mélange), et des mots qui savent qui les dit.
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import tokens from '../../brand/tokens.json';
import {texteAffiche, texteParle, type Episode, type Timings} from '../../src/schema';
import {aligner, normaliser} from './alignement';
import {dureeAudio, synthetiser, transcrire, type ReglagesVoix} from './openrouter';

const TAUX = 44100;
/** Silence entre la réplique de Plouf et la réponse de Matou (en plus du demi-silence de la prise de Matou). */
const RELANCE = 0.12;
/** Marges autour d'une réplique de Plouf, coupée dans sa prise. */
const AVANT_PLOUF = 0.06;
const APRES_PLOUF = 0.14;
const SEUIL_ALIGNEMENT = 0.75;

export type MotScript = {texte: string; scene: number; surligne: boolean};

/** Les mots affichés d'un texte de scène, avec leur surlignage (mêmes règles que voice.ts). */
export const decouper = (texte: string, scene: number, dans: MotScript[] = []) => {
  const morceaux = texteAffiche(texte).trim().split(/==(.+?)==/g);
  morceaux.forEach((m, k) => {
    for (const w of m.split(/\s+/).filter(Boolean)) {
      // la ponctuation isolée se colle au mot précédent (« , » et « . » sans espace)
      if (!normaliser(w) && dans.length) dans[dans.length - 1].texte += /^[,.…)]/.test(w) ? w : ` ${w}`;
      else dans.push({texte: w, scene, surligne: k % 2 === 1});
    }
  });
  return dans;
};

const empreinte = (f: string) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');

const lirePcm = (fichier: string) => {
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', fichier, '-ac', '1', '-ar', String(TAUX), '-f', 'f32le', '-'], {maxBuffer: 1 << 29});
  return new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
};

const normaliserVolume = (f: string) => {
  const tmp = f.replace(/\.mp3$/, '.tmp.mp3');
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', f,
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11',
    '-ar', '44100', '-b:a', '96k', tmp,
  ]);
  fs.renameSync(tmp, f);
};

type Reglages = ReglagesVoix & {transcription: string};
export type MetaPlouf = {modele: string; voix: string; texte: string; sha256: string};

/**
 * Enregistre (ou reprend) la prise de Plouf et l'aligne. Une prise déjà faite pour le même
 * texte et la même voix est reprise sans nouvel appel (voix.meta.json → plouf).
 */
const prisePlouf = async (dossier: string, episode: Episode, r: Reglages, ancienne: MetaPlouf | undefined, force: boolean) => {
  const fichier = path.join(dossier, 'voix-plouf.mp3');
  const repliques = episode.scenes.map((s, i) => ({scene: i, texte: s.plouf})).filter((x): x is {scene: number; texte: string} => !!x.texte);
  const texte = repliques.map((x) => texteParle(x.texte).trim()).join(' ');
  const motsScript: MotScript[] = [];
  repliques.forEach((x) => decouper(x.texte, x.scene, motsScript));
  const reprise = !force && ancienne && ancienne.texte === texte && ancienne.voix === r.voix && fs.existsSync(fichier) && empreinte(fichier) === ancienne.sha256;
  for (let prise = 1; prise <= (reprise ? 1 : 2); prise++) {
    if (!reprise) {
      let obtenu = false;
      for (let appel = 1; appel <= 3 && !obtenu; appel++) {
        try {
          console.log(`Voix de Plouf : ${r.modele} / ${r.voix}, prise ${prise}${appel > 1 ? ` (appel ${appel})` : ''}…`);
          await synthetiser(texte, r, fichier);
          obtenu = true;
        } catch (e) {
          console.warn(`  échec : ${(e as Error).message.slice(0, 200)}`);
          if (appel < 3) await new Promise((f) => setTimeout(f, 15000));
        }
      }
      // Pas de voix de secours pour Plouf non plus : sa voix fait partie du personnage.
      if (!obtenu) throw new Error(`Voix de Plouf indisponible (${r.modele} / ${r.voix}) : relancer npm run voice plus tard.`);
      normaliserVolume(fichier);
    } else console.log('Voix de Plouf : prise reprise (même texte, même voix).');
    const duree = dureeAudio(fichier);
    const alignes = aligner(motsScript.map((m) => m.texte), await transcrire(fichier, r.transcription), duree);
    const taux = alignes.filter((a) => a.trouve).length / Math.max(1, alignes.length);
    console.log(`  Plouf : ${duree.toFixed(1)} s, alignement ${Math.round(taux * 100)} %`);
    if (taux >= SEUIL_ALIGNEMENT || prise === 2) {
      if (taux < SEUIL_ALIGNEMENT) throw new Error(`Voix de Plouf mal lue (alignement ${Math.round(taux * 100)} %) après 2 prises : relancer npm run voice -- ${path.basename(dossier)} --force.`);
      const meta: MetaPlouf = {modele: r.modele, voix: r.voix, texte, sha256: empreinte(fichier)};
      return {fichier, meta, mots: alignes.map((a, i) => ({...motsScript[i], debut: a.debut, fin: a.fin}))};
    }
  }
  throw new Error('inatteignable');
};

/**
 * Assemble voix.mp3 à partir de la prise de Matou (déjà alignée, `motsMatou`) et de celle de
 * Plouf. Renvoie les champs de timings.json qui changent.
 */
export const assemblerDuo = async (opts: {
  dossier: string;
  episode: Episode;
  priseMatou: string;
  motsMatou: Timings['mots'];
  reglagesPlouf: Reglages;
  anciennePlouf?: MetaPlouf;
  force: boolean;
}) => {
  const {dossier, episode, priseMatou, motsMatou} = opts;
  const plouf = await prisePlouf(dossier, episode, opts.reglagesPlouf, opts.anciennePlouf, opts.force);
  const m = lirePcm(priseMatou);
  const p = lirePcm(plouf.fichier);
  const dureeM = m.length / TAUX;
  const n = episode.scenes.length;

  // Prise de Matou : coupée au milieu du silence entre deux scènes (elle se recolle à l'identique).
  const bornes = [0];
  for (let i = 1; i < n; i++) {
    const avant = motsMatou.filter((w) => w.scene === i - 1).at(-1);
    const apres = motsMatou.find((w) => w.scene === i);
    bornes.push(avant && apres ? (avant.fin + apres.debut) / 2 : bornes[i - 1]);
  }
  bornes.push(dureeM);

  const morceaux: Float32Array[] = [];
  const qui: {debut: number; fin: number; locuteur: 'matou' | 'plouf'}[] = [];
  const mots: Timings['mots'] = [];
  let t = 0;
  const ajouter = (x: Float32Array, locuteur: 'matou' | 'plouf' | null) => {
    morceaux.push(x);
    if (locuteur) qui.push({debut: t, fin: t + x.length / TAUX, locuteur});
    t += x.length / TAUX;
  };
  const silence = (s: number) => new Float32Array(Math.round(s * TAUX));
  const tranche = (x: Float32Array, a: number, b: number) => x.subarray(Math.max(0, Math.round(a * TAUX)), Math.min(x.length, Math.round(b * TAUX)));

  for (let i = 0; i < n; i++) {
    const motsP = plouf.mots.filter((w) => w.scene === i);
    if (motsP.length) {
      if (i > 0) ajouter(silence(0.05), null);
      const a = Math.max(0, motsP[0].debut - AVANT_PLOUF);
      const b = Math.min(p.length / TAUX, motsP.at(-1)!.fin + APRES_PLOUF);
      const depart = t;
      ajouter(tranche(p, a, b), 'plouf');
      for (const w of motsP) mots.push({texte: w.texte, debut: arrondi(depart + w.debut - a), fin: arrondi(depart + w.fin - a), scene: i, surligne: w.surligne, locuteur: 'plouf'});
      ajouter(silence(RELANCE), null);
    }
    const depart = t;
    ajouter(tranche(m, bornes[i], bornes[i + 1]), 'matou');
    for (const w of motsMatou.filter((x) => x.scene === i))
      mots.push({...w, debut: arrondi(depart + w.debut - bornes[i]), fin: arrondi(depart + w.fin - bornes[i]), locuteur: 'matou'});
  }

  const total = morceaux.reduce((s, x) => s + x.length, 0);
  const signal = new Float32Array(total);
  let o = 0;
  for (const x of morceaux) {
    signal.set(x, o);
    o += x.length;
  }
  const sortie = path.join(dossier, 'voix.mp3');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'f32le', '-ar', String(TAUX), '-ac', '1', '-i', '-', '-b:a', '96k', sortie], {
    input: Buffer.from(signal.buffer, signal.byteOffset, signal.byteLength),
    maxBuffer: 1 << 29,
  });

  // Bouches : le volume par image, attribué à celui qui parle.
  const fps = tokens.format.fps;
  const parImage = TAUX / fps;
  const rms: number[] = [];
  for (let i = 0; i < signal.length; i += parImage) {
    let s = 0;
    const fin = Math.min(signal.length, Math.floor(i + parImage));
    for (let k = Math.floor(i); k < fin; k++) s += signal[k] * signal[k];
    rms.push(Math.sqrt(s / Math.max(1, fin - Math.floor(i))));
  }
  const haut = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.95)] || 1;
  const niveau = rms.map((v) => Math.round(Math.min(1, v / haut) * 100) / 100);
  const locuteur = (f: number) => qui.find((q) => f / fps >= q.debut && f / fps < q.fin)?.locuteur;
  const enveloppe = niveau.map((v, f) => (locuteur(f) === 'matou' ? v : 0));
  const enveloppePlouf = niveau.map((v, f) => (locuteur(f) === 'plouf' ? v : 0));
  const scenes = episode.scenes.map((_, i) => {
    const ms = mots.filter((w) => w.scene === i);
    return {debut: ms[0]?.debut ?? 0, fin: ms.at(-1)?.fin ?? 0};
  });
  return {duree: arrondi(dureeAudio(sortie)), mots, scenes, enveloppe, enveloppePlouf, plouf: plouf.meta, sha256: empreinte(sortie)};
};

const arrondi = (x: number) => Math.round(x * 1000) / 1000;
