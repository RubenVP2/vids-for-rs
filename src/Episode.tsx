import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DefsBouillonne} from './components/Bouillonne';
import {EnTete} from './components/EnTete';
import {FondCahier} from './components/FondCahier';
import {SousTitres} from './components/SousTitres';
import {chargerPolices} from './fonts';
import {Matou} from './mascot/Matou';
import type {EtatMatou} from './mascot/MatouSvg';
import {MATOU_PAR_DEFAUT, type MotScene, SceneVue} from './scenes/Scenes';
import type {EpisodeProps, Scene} from './schema';
import {tokens} from './theme';

chargerPolices();

/** Silence après le dernier mot, pour laisser l'écran de fin respirer. */
export const QUEUE_SECONDES = 1.4;
/** Les visuels arrivent un poil avant la voix : l'œil précède l'oreille. */
const AVANCE = 4;

type Placement = {x: number; y: number; largeur: number};
// Position de Matou (coin haut-gauche) selon la scène. Toujours au-dessus de la marge du bas.
const BAS = 1920 - tokens.safeZone.bottom;
const place = (largeur: number, cx: number): Placement => ({largeur, x: cx - largeur / 2, y: BAS - (largeur * 400) / 520});
const CENTRE = (tokens.safeZone.left + 1080 - tokens.safeZone.right) / 2;
const PLACEMENTS: Record<Scene['type'], Placement> = {
  hook: place(460, CENTRE),
  source: place(440, 310),
  point: place(440, 310),
  chiffre: place(440, 310),
  liste: place(420, 640),
  comparaison: place(440, CENTRE),
  pourquoi: place(440, 310),
  verdict: place(420, CENTRE),
  fin: place(460, CENTRE),
};

export const SONS = {
  transition: 'brand/sons/transition.wav',
  tampon: 'brand/sons/tampon.wav',
  pop: 'brand/sons/pop.wav',
  verdict: 'brand/sons/verdict.wav',
  signature: 'brand/sons/signature.wav',
  musique: 'brand/sons/musique.mp3',
};

export const calculerDebuts = (props: EpisodeProps, fps: number) =>
  props.timings.scenes.map((s, i) => (i === 0 ? 0 : Math.max(0, Math.round(s.debut * fps) - AVANCE)));

export const dureeEnImages = (props: EpisodeProps, fps: number) =>
  Math.ceil((props.timings.duree + QUEUE_SECONDES) * fps);

export const EpisodeVideo: React.FC<EpisodeProps> = (props) => {
  const {episode, timings, audio} = props;
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const debuts = useMemo(() => calculerDebuts(props, fps), [props, fps]);

  const iScene = Math.max(0, debuts.findLastIndex((d) => frame >= d));
  const scene = episode.scenes[iScene];
  const etat: EtatMatou = scene.matou ?? MATOU_PAR_DEFAUT[scene.type];

  // Matou glisse d'une place à l'autre au changement de scène
  const precedent = PLACEMENTS[episode.scenes[Math.max(0, iScene - 1)].type];
  const actuel = PLACEMENTS[scene.type];
  const s = spring({frame: frame - debuts[iScene], fps, config: {damping: 16, stiffness: 140}});
  const pos = {
    x: interpolate(s, [0, 1], [precedent.x, actuel.x]),
    y: interpolate(s, [0, 1], [precedent.y, actuel.y]),
    largeur: interpolate(s, [0, 1], [precedent.largeur, actuel.largeur]),
  };
  const verres = scene.type === 'verdict' && frame - debuts[iScene] > 30 ? iconeVerdict(episode.verdict) : undefined;

  return (
    <AbsoluteFill>
      <FondCahier />
      <DefsBouillonne />
      <EnTete episode={episode} />

      {episode.scenes.map((sc, i) => {
        const debut = debuts[i];
        const fin = i + 1 < debuts.length ? debuts[i + 1] : durationInFrames;
        const mots: MotScene[] = timings.mots
          .filter((m) => m.scene === i)
          .map((m) => ({texte: m.texte, debut: Math.round(m.debut * fps) - debut, fin: Math.round(m.fin * fps) - debut}));
        return (
          <Sequence key={i} from={debut} durationInFrames={fin - debut} name={`${i + 1}. ${sc.type}`}>
            <SceneVue scene={sc} episode={episode} mots={mots} duree={fin - debut} />
            {i > 0 ? <Audio src={staticFile(SONS.transition)} volume={tokens.audio.bruitagesVolume * 0.6} /> : null}
            {sc.type === 'source' ? (
              <Sequence from={14} layout="none">
                <Audio src={staticFile(SONS.tampon)} volume={tokens.audio.bruitagesVolume} />
              </Sequence>
            ) : null}
            {sc.type === 'verdict' ? (
              <Sequence from={30} layout="none">
                <Audio src={staticFile(SONS.verdict)} volume={tokens.audio.bruitagesVolume} />
              </Sequence>
            ) : null}
            {sc.type === 'fin' ? <Audio src={staticFile(SONS.signature)} volume={tokens.audio.bruitagesVolume * 1.2} /> : null}
          </Sequence>
        );
      })}

      <SousTitres timings={timings} top={1010} />

      <div style={{position: 'absolute', left: pos.x, top: pos.y}}>
        <Matou
          etat={etat}
          enveloppe={timings.enveloppe}
          changement={debuts[iScene]}
          verres={verres}
          largeur={pos.largeur}
        />
      </div>

      <Audio src={staticFile(audio)} />
      {episode.musique ? (
        <Audio
          src={staticFile(SONS.musique)}
          loop
          volume={(f) =>
            tokens.audio.musiqueVolume *
            interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};

const iconeVerdict = (v: EpisodeProps['episode']['verdict']) =>
  v === 'buzz' ? 'bulle' : v === 'prometteur' ? 'pousse' : 'fusee';
