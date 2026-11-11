import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {DefsBouillonne, FILTRE_BOUILLONNE} from '../components/Bouillonne';
import {dateSource} from '../components/EnTete';
import {FondCahier} from '../components/FondCahier';
import {HypeMetre} from '../components/HypeMetre';
import {Tampon} from '../components/Tampon';
import {Matou} from '../mascot/Matou';
import type {EtatMatou} from '../mascot/MatouSvg';
import {MATOU_PAR_DEFAUT} from '../scenes/Scenes';
import type {EpisodeProps, Timings} from '../schema';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from '../theme';

// Format « Matou t'écrit » (essai, docs/formats.md) : tout l'épisode est un fil de messages.
// Chaque phrase que Matou dit est une bulle qui arrive quand il la commence ; le mot prononcé
// passe au fluo (la bulle EST le sous-titre : rien d'autre à lire). `reponse` d'une scène : la
// bulle du spectateur, à la fin de la scène. Le verdict arrive comme une image envoyée.

const SONS = {pop: 'brand/sons/pop.wav', verdict: 'brand/sons/verdict.wav', signature: 'brand/sons/signature.wav', musique: 'brand/sons/musique.mp3'};
const S = tokens.safeZone;
const HAUT_FIL = S.top + 250; // sous l'en-tête de la conversation
const BAS_FIL = 1920 - S.bottom;
const LARGEUR = 1080 - S.left - S.right;

type Mot = Timings['mots'][number];
type Bulle =
  | {genre: 'matou'; image: number; mots: Mot[]}
  | {genre: 'toi'; image: number; texte: string}
  | {genre: 'hype'; image: number}
  | {genre: 'signature'; image: number};

/** Les bulles du fil, dans l'ordre, avec leur image d'arrivée. */
const construire = ({episode, timings}: EpisodeProps, fps: number): Bulle[] => {
  const bulles: Bulle[] = [];
  episode.scenes.forEach((scene, i) => {
    const mots = timings.mots.filter((m) => m.scene === i);
    if (!mots.length) return;
    if (scene.type === 'verdict') bulles.push({genre: 'hype', image: Math.max(0, Math.round(mots[0].debut * fps) - 2)});
    // une bulle par phrase : elle arrive 2 images avant son premier mot
    let phrase: Mot[] = [];
    mots.forEach((m, k) => {
      phrase.push(m);
      if (/[.?!…]$/.test(m.texte) || k === mots.length - 1) {
        bulles.push({genre: 'matou', image: Math.max(0, Math.round(phrase[0].debut * fps) - 2), mots: phrase});
        phrase = [];
      }
    });
    const fin = Math.round(mots[mots.length - 1].fin * fps);
    if (scene.reponse) bulles.push({genre: 'toi', image: fin + 3, texte: scene.reponse});
    if (scene.type === 'fin') bulles.push({genre: 'signature', image: fin + 3});
  });
  return bulles;
};

const texte: React.CSSProperties = {fontFamily: POLICE_TEXTE, fontVariationSettings: AXES_TEXTE, fontWeight: 800, color: C.encre, lineHeight: 1.18};

/** Une bulle qui pousse le fil en s'ouvrant (grille 0fr → 1fr : la hauteur s'anime sans la mesurer). */
const Arrivee: React.FC<{image: number; cote: 'gauche' | 'droite'; children: React.ReactNode}> = ({image, cote, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < image) return null;
  const s = spring({frame: frame - image, fps, config: {damping: 14, stiffness: 220, mass: 0.6}});
  return (
    <div style={{display: 'grid', gridTemplateRows: `${Math.min(1, s)}fr`}}>
      <div style={{minHeight: 0, overflow: 'visible', display: 'flex', justifyContent: cote === 'gauche' ? 'flex-start' : 'flex-end', paddingBottom: 22}}>
        <div style={{transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`, transformOrigin: cote === 'gauche' ? 'bottom left' : 'bottom right', opacity: Math.min(1, s * 2)}}>
          {children}
        </div>
      </div>
    </div>
  );
};

const cadre = (fond: string, cote: 'gauche' | 'droite'): React.CSSProperties => ({
  ...texte,
  fontSize: 50,
  maxWidth: LARGEUR - 90,
  padding: '20px 30px',
  background: fond,
  border: `6px solid ${C.encre}`,
  borderRadius: cote === 'gauche' ? '34px 34px 34px 8px' : '34px 34px 8px 34px',
  boxShadow: `6px 7px 0 rgba(28,27,26,0.14)`,
});

const BulleMatou: React.FC<{mots: Mot[]}> = ({mots}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <div style={cadre(C.blanc, 'gauche')}>
      {mots.map((m, i) => {
        const actif = t >= m.debut && t < m.fin + 0.05;
        return (
          <React.Fragment key={i}>
            {i > 0 ? ' ' : null}
            <span
              style={{
                color: m.surligne ? C.stylo.bleu : C.encre,
                opacity: t < m.debut - 0.05 ? 0.38 : 1,
                backgroundImage: actif ? `linear-gradient(${C.surligneur}, ${C.surligneur})` : undefined,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 58%',
                backgroundPosition: '0 82%',
              }}
            >
              {m.texte}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const EpisodeMessages: React.FC<EpisodeProps> = (props) => {
  const {episode, timings, audio} = props;
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const bulles = useMemo(() => construire(props, fps), [props, fps]);
  const iScene = Math.max(0, timings.scenes.findLastIndex((s) => frame >= Math.round(s.debut * fps) - 2));
  const scene = episode.scenes[iScene];
  const etat: EtatMatou = scene.matou ?? MATOU_PAR_DEFAUT[scene.type];
  const parle = (timings.enveloppe[frame] ?? 0) > 0.08;

  return (
    <AbsoluteFill>
      <FondCahier />
      <DefsBouillonne />

      {/* En-tête de la conversation : Matou (il parle, sa bouche suit la voix), et la source. */}
      <div style={{position: 'absolute', top: S.top - 10, left: S.left - 20, right: S.right - 60, height: 236}}>
        <div style={{position: 'absolute', inset: 0, background: C.blanc, border: `7px solid ${C.encre}`, borderRadius: 36, filter: `url(#${FILTRE_BOUILLONNE})`, boxShadow: `8px 9px 0 rgba(28,27,26,0.12)`}} />
        <div style={{position: 'absolute', left: 22, top: 26, width: 190, height: 190, borderRadius: '50%', background: C.surligneur, border: `6px solid ${C.encre}`, overflow: 'hidden'}}>
          <Matou etat={etat} enveloppe={timings.enveloppe} largeur={236} style={{marginLeft: -24, marginTop: 14}} />
        </div>
        <div style={{position: 'absolute', left: 240, top: 34, fontFamily: POLICE_TITRE, fontSize: 74, color: C.encre, lineHeight: 1}}>Matou</div>
        <div style={{...texte, position: 'absolute', left: 244, top: 118, fontSize: 34, color: parle ? C.stylo.vert : C.encre, opacity: parle ? 1 : 0.6}}>
          {parle ? 'écrit…' : 'en ligne'}
        </div>
        <div style={{...texte, position: 'absolute', left: 244, top: 168, fontSize: 28, letterSpacing: 1, opacity: 0.85}}>
          SOURCE : {episode.source.nom.toUpperCase()} · {dateSource(episode.source)}
        </div>
        <div style={{position: 'absolute', right: 28, top: 40}}>
          <Tampon statut={episode.statut} debut={Math.round((timings.scenes[1]?.debut ?? 1) * fps) + 10} taille={0.7} />
        </div>
      </div>

      {/* Le fil : calé en haut tant qu'il tient, puis les bulles poussent les anciennes hors du cadre. */}
      <div style={{position: 'absolute', top: HAUT_FIL, left: S.left, width: LARGEUR, height: BAS_FIL - HAUT_FIL, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '10px 8px 0'}}>
          {bulles.map((b, i) =>
            b.genre === 'matou' ? (
              <Arrivee key={i} image={i === 0 ? -20 : b.image} cote="gauche">
                <BulleMatou mots={b.mots} />
              </Arrivee>
            ) : b.genre === 'toi' ? (
              <Arrivee key={i} image={b.image} cote="droite">
                <div style={cadre(C.fluo.bleu, 'droite')}>{b.texte}</div>
              </Arrivee>
            ) : b.genre === 'hype' ? (
              <Arrivee key={i} image={b.image} cote="gauche">
                <div style={{...cadre(C.blanc, 'gauche'), padding: '18px 18px 8px'}}>
                  <HypeMetre verdict={episode.verdict} largeur={LARGEUR - 150} image={frame - b.image} />
                </div>
              </Arrivee>
            ) : (
              <Arrivee key={i} image={b.image} cote="gauche">
                <div style={{fontFamily: POLICE_TITRE, fontSize: 64, color: C.encre, background: C.surligneur, padding: '6px 28px', transform: 'rotate(-4deg)', margin: '6px 0 0 10px'}}>
                  Ma-tou !
                </div>
              </Arrivee>
            ),
          )}
        </div>
      </div>

      {bulles.map((b, i) =>
        i === 0 ? null : (
          <Sequence key={`son-${i}`} from={b.image} layout="none">
            <Audio
              src={staticFile(b.genre === 'hype' ? SONS.verdict : b.genre === 'signature' ? SONS.signature : SONS.pop)}
              volume={tokens.audio.bruitagesVolume * (b.genre === 'signature' ? 1.2 : b.genre === 'hype' ? 1 : b.genre === 'toi' ? 0.7 : 0.4)}
            />
          </Sequence>
        ),
      )}
      <Audio src={staticFile(audio)} />
      {episode.musique ? (
        <Audio
          src={staticFile(SONS.musique)}
          loop
          volume={(f) => tokens.audio.musiqueVolume * interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        />
      ) : null}
    </AbsoluteFill>
  );
};
