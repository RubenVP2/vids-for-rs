import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FILTRE_BOUILLONNE} from '../components/Bouillonne';
import {dateCourte} from '../components/EnTete';
import {TexteMarque} from '../components/TexteMarque';
import type {Episode} from '../schema';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from '../theme';

// Format « Matou contre le titre » (essai, docs/formats.md) : la 1re image est une coupure de
// presse (le gros titre que le spectateur a déjà vu passer), Matou y pose son tampon à la fin :
// VRAI, EXAGÉRÉ ou FAUX. Le Hype-mètre des épisodes d'actu devient ce tampon.

export const VERDICTS_TITRE = {
  vrai: {label: 'VRAI', couleur: C.stylo.vert},
  exagere: {label: 'EXAGÉRÉ', couleur: '#E07A00'},
  faux: {label: 'FAUX', couleur: C.stylo.rouge},
} as const;

const LARGEUR = 1080 - tokens.safeZone.left - tokens.safeZone.right;

/** La coupure de presse, scotchée sur le cahier. `tampon` : image où Matou tamponne (absent : pas encore). */
export const Coupure: React.FC<{episode: Episode; tampon?: number; largeur?: number}> = ({episode, tampon, largeur = LARGEUR - 10}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = episode.titrePresse;
  if (!p) return null;
  const v = VERDICTS_TITRE[p.verdict];
  const s = spring({frame: frame - (tampon ?? 1e6), fps, config: {damping: 11, stiffness: 240, mass: 0.6}});
  const taille = p.titre.length > 90 ? 58 : p.titre.length > 60 ? 68 : 80;
  return (
    <div style={{position: 'relative', width: largeur, transform: 'rotate(-1.5deg)'}}>
      <div style={{position: 'absolute', inset: 0, transform: 'translate(10px, 12px)', background: C.encre, opacity: 0.14}} />
      <div style={{position: 'absolute', inset: 0, background: '#FFFEF9', border: `7px solid ${C.encre}`, filter: `url(#${FILTRE_BOUILLONNE})`}} />
      <div style={{position: 'absolute', top: -24, left: largeur / 2 - 90, width: 180, height: 50, background: 'rgba(255, 236, 160, 0.78)', transform: 'rotate(-3deg)'}} />
      <div style={{position: 'relative', padding: '40px 46px 44px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, borderBottom: `5px solid ${C.encre}`, paddingBottom: 14}}>
          <div style={{fontFamily: POLICE_TITRE, fontSize: 40, color: C.blanc, background: C.encre, padding: '2px 18px'}}>{p.media.toUpperCase()}</div>
          <div style={{fontFamily: POLICE_TEXTE, fontVariationSettings: AXES_TEXTE, fontWeight: 800, fontSize: 30, color: C.encre, opacity: 0.7}}>
            {dateCourte(episode.source.date)}
          </div>
        </div>
        {/* Titre en serif : il doit se lire comme un journal, pas comme une carte de Matou. */}
        <div style={{fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: taille, lineHeight: 1.12, color: C.encre, marginTop: 26}}>
          <TexteMarque texte={`« ${p.titre} »`} debut={4} />
        </div>
      </div>
      {tampon !== undefined && frame >= tampon ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            fontFamily: POLICE_TITRE,
            fontSize: Math.min(150, Math.round((largeur * 0.82) / (v.label.length * 0.62))),
            letterSpacing: 6,
            color: v.couleur,
            border: `14px solid ${v.couleur}`,
            borderRadius: 18,
            padding: '0 34px',
            background: 'rgba(255,254,249,0.82)',
            whiteSpace: 'nowrap',
            transform: `translate(-50%, -50%) rotate(-9deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`,
            opacity: Math.min(1, s * 1.6),
          }}
        >
          {v.label}
        </div>
      ) : null}
    </div>
  );
};

/** Les trois tampons possibles, sous la coupure : celui qui clignote change, la question reste ouverte. */
const Suspens: React.FC<{choisi?: keyof typeof VERDICTS_TITRE}> = ({choisi}) => {
  const frame = useCurrentFrame();
  const tour = Math.floor(frame / 7) % 3;
  return (
    <div style={{display: 'flex', gap: 18, marginTop: 34, transform: 'rotate(1deg)'}}>
      {(Object.keys(VERDICTS_TITRE) as (keyof typeof VERDICTS_TITRE)[]).map((k, i) => {
        const v = VERDICTS_TITRE[k];
        const allume = choisi ? k === choisi : i === tour;
        return (
          <div
            key={k}
            style={{
              fontFamily: POLICE_TITRE,
              fontSize: 42,
              letterSpacing: 1,
              whiteSpace: 'nowrap',
              color: allume ? C.blanc : v.couleur,
              background: allume ? v.couleur : 'transparent',
              border: `6px solid ${v.couleur}`,
              borderRadius: 10,
              padding: '2px 16px',
              opacity: choisi && !allume ? 0.3 : 1,
              transform: `scale(${allume ? 1.08 : 1})`,
            }}
          >
            {v.label}
            {choisi ? '' : ' ?'}
          </div>
        );
      })}
    </div>
  );
};

const zone = (haute: boolean): React.CSSProperties => ({
  position: 'absolute',
  top: haute ? tokens.safeZone.top + 20 : 370,
  height: haute ? 1000 - tokens.safeZone.top - 20 : 630,
  left: tokens.safeZone.left,
  right: tokens.safeZone.right,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

/** Hook : la coupure dès l'image 0, les trois tampons en suspens. `tampon` : la fin reprend le hook, tamponné. */
export const SceneHookTitre: React.FC<{episode: Episode; tampon?: number}> = ({episode, tampon}) => {
  const frame = useCurrentFrame();
  const echelle = interpolate(frame, [0, 5, 9], [0.94, 1.03, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={zone(true)}>
      <div style={{transform: `scale(${echelle})`}}>
        <Coupure episode={episode} tampon={tampon} />
      </div>
      <Suspens choisi={tampon !== undefined && frame >= tampon ? episode.titrePresse?.verdict : undefined} />
    </div>
  );
};

/** Image (relative à la scène verdict) où le tampon tombe : le même repère que le son. */
export const IMAGE_TAMPON = 16;

/** Verdict : la coupure revient, le tampon tombe, la raison s'écrit dessous. */
export const SceneVerdictTitre: React.FC<{episode: Episode; raison: string}> = ({episode, raison}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - IMAGE_TAMPON - 10, fps, config: tokens.mouvement.ressort});
  return (
    <div style={zone(false)}>
      <Coupure episode={episode} tampon={IMAGE_TAMPON} largeur={LARGEUR - 60} />
      <div
        style={{
          fontFamily: POLICE_TEXTE,
          fontVariationSettings: AXES_TEXTE,
          fontWeight: 800,
          fontSize: 44,
          lineHeight: 1.15,
          color: C.encre,
          textAlign: 'center',
          marginTop: 30,
          maxWidth: LARGEUR - 20,
          background: '#FFFDF5',
          border: `4px solid ${C.encre}`,
          boxShadow: `6px 6px 0 ${C.encre}`,
          padding: '14px 26px',
          transform: `rotate(1deg) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
          opacity: frame < IMAGE_TAMPON + 10 ? 0 : 1,
        }}
      >
        <TexteMarque texte={raison} debut={IMAGE_TAMPON + 14} />
      </div>
    </div>
  );
};
