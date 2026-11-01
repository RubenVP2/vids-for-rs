import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DefsBouillonne} from './components/Bouillonne';
import {EnTete} from './components/EnTete';
import {FondCahier} from './components/FondCahier';
import {MiseEnPage} from './components/MiseEnPage';
import {SousTitres} from './components/SousTitres';
import {Tampon} from './components/Tampon';
import {chargerPolices} from './fonts';
import {Matou} from './mascot/Matou';
import type {EtatMatou} from './mascot/MatouSvg';
import {rang} from './rotation';
import {imageSignature, MATOU_PAR_DEFAUT, type MotScene, SceneVue, ZONE} from './scenes/Scenes';
import type {EpisodeProps, Scene} from './schema';
import {tokens} from './theme';

chargerPolices();

/**
 * Après le dernier mot : le temps du « Ma-tou ! » (1,6 s, joué après la voix, voir
 * `imageSignature`), pour que la fin se pose au lieu de tomber. Avec 1 s et le jingle sous
 * la voix (essai du 01/11), la phrase finissait sur un silence et la vidéo semblait coupée.
 */
export const QUEUE_SECONDES = 2;
/** Les visuels arrivent un poil avant la voix : l'œil précède l'oreille. */
const AVANCE = 4;

type Placement = {x: number; y: number; largeur: number};
// Position de Matou (coin haut-gauche) selon la scène. Toujours au-dessus de la marge du bas.
// En miroir (un épisode sur deux, src/rotation.ts), il passe de l'autre côté du centre.
const BAS = 1920 - tokens.safeZone.bottom;
const CENTRE = (tokens.safeZone.left + 1080 - tokens.safeZone.right) / 2;
const placements = (miroir: boolean): Record<Scene['type'], Placement> => {
  const place = (largeur: number, cx: number): Placement => {
    const x = miroir ? 2 * CENTRE - cx : cx;
    return {largeur, x: x - largeur / 2, y: BAS - (largeur * 400) / 520};
  };
  return {
    hook: place(460, CENTRE),
    source: place(440, 310),
    fenetre: place(420, 310),
    point: place(440, 310),
    chiffre: place(440, 310),
    liste: place(420, 640),
    comparaison: place(440, CENTRE),
    pourquoi: place(440, 310),
    verdict: place(420, CENTRE),
    fin: place(460, CENTRE),
  };
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

  const miroir = rang(episode.numero, 2) === 1;
  const PLACEMENTS = useMemo(() => placements(miroir), [miroir]);
  const iScene = Math.max(0, debuts.findLastIndex((d) => frame >= d));
  const scene = episode.scenes[iScene];
  const etat: EtatMatou = scene.matou ?? MATOU_PAR_DEFAUT[scene.type];
  // Sans scène « source » (format actuel), le tampon de statut s'incruste sur la 2e scène.
  const incrustation = !episode.scenes.some((sc) => sc.type === 'source');
  const iVerdict = episode.scenes.findIndex((sc) => sc.type === 'verdict');

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
    <MiseEnPage.Provider value={{miroir}}>
      <AbsoluteFill>
        <FondCahier />
        <DefsBouillonne />
          <EnTete
          episode={episode}
          apparition={debuts[1]}
          verdict={iVerdict >= 0 ? debuts[iVerdict] : undefined}
          fin={debuts[debuts.length - 1]}
        />

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
              {incrustation && i === 1 ? (
                <>
                  <div style={{position: 'absolute', top: ZONE.top - 50, [miroir ? 'left' : 'right']: tokens.safeZone.right - 40}}>
                    <Tampon statut={episode.statut} debut={12} taille={0.85} />
                  </div>
                  <Sequence from={12} layout="none">
                    <Audio src={staticFile(SONS.tampon)} volume={tokens.audio.bruitagesVolume} />
                  </Sequence>
                </>
              ) : null}
              {sc.type === 'verdict' ? (
                <Sequence from={30} layout="none">
                  <Audio src={staticFile(SONS.verdict)} volume={tokens.audio.bruitagesVolume} />
                </Sequence>
              ) : null}
              {sc.type === 'fin' ? (
                <Sequence from={imageSignature(mots)} layout="none">
                  <Audio src={staticFile(SONS.signature)} volume={tokens.audio.bruitagesVolume * 1.2} />
                </Sequence>
              ) : null}
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
    </MiseEnPage.Provider>
  );
};

const iconeVerdict = (v: EpisodeProps['episode']['verdict']) =>
  v === 'buzz' ? 'bulle' : v === 'prometteur' ? 'pousse' : 'fusee';
