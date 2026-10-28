import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FILTRE_BOUILLONNE} from '../components/Bouillonne';
import {type EtatMatou, MatouSvg, type MatouSvgProps} from './MatouSvg';

// Matou animé : trait qui bouillonne, respiration, clignements, bouche calée sur
// le volume de la voix, petit saut quand il change d'expression.

export type MatouProps = {
  etat: EtatMatou;
  /** Volume de la voix par image (0–1), depuis timings.json. Absent = bouche fermée. */
  enveloppe?: number[];
  /** Décalage entre l'image courante et l'index dans l'enveloppe (séquences imbriquées). */
  decalageEnveloppe?: number;
  /** Image (absolue) du dernier changement d'expression, pour le petit saut. */
  changement?: number;
  verres?: MatouSvgProps['verres'];
  largeur?: number;
  style?: React.CSSProperties;
};

const clignementA = (frame: number) => {
  // un clignement toutes les ~3 s, durée 4 images, pseudo-aléatoire mais stable
  const cycle = 97;
  const t = frame % cycle;
  const decal = (Math.floor(frame / cycle) * 37) % 23;
  const d = t - (60 + decal);
  return d >= 0 && d < 4 ? 1 : 0;
};

export const Matou: React.FC<MatouProps> = ({
  etat,
  enveloppe,
  decalageEnveloppe = 0,
  changement = -100,
  verres,
  largeur = 460,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iEnv = frame + decalageEnveloppe;
  const volume = enveloppe && iEnv >= 0 && iEnv < enveloppe.length ? enveloppe[iEnv] : 0;
  // bouche : ouverte selon le volume, en paliers pour garder l'aspect « dessin animé »
  const bouche = volume < 0.12 ? 0 : volume < 0.35 ? 0.35 : volume < 0.6 ? 0.65 : 1;
  const parle = bouche > 0;
  const etatAffiche: EtatMatou = etat === 'neutre' && parle ? 'parle' : etat;

  const respiration = Math.sin((frame / fps) * Math.PI * 0.9) * 0.012;
  const depuis = frame - changement;
  const saut = depuis >= 0 && depuis < 10 ? Math.sin((depuis / 10) * Math.PI) * -26 : 0;
  const chargement = (frame * 12) % 360;
  const regardX = Math.round(Math.sin(frame / 45) * 2);

  return (
    <div
      style={{
        position: 'relative',
        width: largeur,
        height: (largeur * 400) / 520,
        transform: `translateY(${saut}px) scale(${1 + respiration}, ${1 - respiration})`,
        transformOrigin: '50% 100%',
        ...style,
      }}
    >
      <MatouSvg
        etat={etatAffiche}
        bouche={bouche}
        verres={verres}
        chargement={chargement}
        clignement={etatAffiche === 'content' ? 0 : clignementA(frame)}
        regard={[regardX, 0]}
        filtre={FILTRE_BOUILLONNE}
        width="100%"
        height="100%"
      />
      {/* ombre au sol */}
      <div
        style={{
          position: 'absolute',
          left: '22%',
          right: '18%',
          bottom: -14,
          height: 22,
          borderRadius: '50%',
          background: 'rgba(28,27,26,0.10)',
          transform: `scaleX(${interpolate(saut, [-26, 0], [0.8, 1])})`,
        }}
      />
    </div>
  );
};
