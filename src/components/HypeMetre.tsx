import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Episode} from '../schema';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from '../theme';
import {FILTRE_BOUILLONNE} from './Bouillonne';
import {Icone, type IconeNom} from './Icones';

const NIVEAUX = ['buzz', 'prometteur', 'gameChanger'] as const;

// Le Hype-mètre : la flèche hésite, puis s'arrête sur le verdict, entouré au stylo rouge.
export const HypeMetre: React.FC<{verdict: Episode['verdict']; largeur?: number; image?: number}> = ({
  verdict,
  largeur = 860,
  image,
}) => {
  const courante = useCurrentFrame();
  const frame = image ?? courante;
  const {fps} = useVideoConfig();
  const cible = NIVEAUX.indexOf(verdict);
  const case_ = largeur / 3;
  const hauteur = 300;

  // la flèche balaie, dépasse un peu, puis se pose (≈ 1 s)
  const balayage = interpolate(frame, [6, 22], [0, 2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const pose = spring({frame: frame - 22, fps, config: {damping: 9, stiffness: 120}});
  const position = frame < 22 ? balayage : interpolate(pose, [0, 1], [2, cible]);
  const flecheX = case_ * position + case_ / 2;

  const entoure = interpolate(frame, [34, 48], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const choisi = frame >= 30;

  return (
    <div style={{position: 'relative', width: largeur, height: hauteur + 120}}>
      <div
        style={{
          fontFamily: POLICE_TITRE,
          fontSize: 64,
          color: C.encre,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        HYPE-MÈTRE
      </div>
      <svg width={largeur} height={hauteur} style={{overflow: 'visible'}}>
        <g filter={`url(#${FILTRE_BOUILLONNE})`}>
          {NIVEAUX.map((n, i) => (
            <rect
              key={n}
              x={i * case_ + 8}
              y={70}
              width={case_ - 16}
              height={hauteur - 80}
              rx={18}
              fill={choisi && i === cible ? tokens.hypeMetre[n].fluo : C.blanc}
              stroke={C.encre}
              strokeWidth={8}
            />
          ))}
        </g>
        {/* flèche */}
        <g transform={`translate(${flecheX} 0)`}>
          <path d="M 0 60 L -22 20 L -8 20 L -8 -10 L 8 -10 L 8 20 L 22 20 Z" fill={C.encre} />
        </g>
        {/* entourage au stylo rouge */}
        <ellipse
          cx={cible * case_ + case_ / 2}
          cy={70 + (hauteur - 80) / 2}
          rx={case_ / 2 + 34}
          ry={(hauteur - 80) / 2 + 44}
          fill="none"
          stroke={C.stylo.rouge}
          strokeWidth={9}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={entoure}
          transform={`rotate(-4 ${cible * case_ + case_ / 2} ${70 + (hauteur - 80) / 2})`}
          opacity={frame >= 34 ? 1 : 0}
        />
      </svg>
      <div style={{position: 'absolute', top: 64 + 70 + 16, left: 0, width: largeur, display: 'flex'}}>
        {NIVEAUX.map((n) => (
          <div
            key={n}
            style={{
              width: case_,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              fontFamily: POLICE_TEXTE,
              fontVariationSettings: AXES_TEXTE,
              fontWeight: 800,
              fontSize: 36,
              color: C.encre,
              textAlign: 'center',
              lineHeight: 1.05,
            }}
          >
            <Icone nom={tokens.hypeMetre[n].icone as IconeNom} taille={96} />
            {tokens.hypeMetre[n].label}
          </div>
        ))}
      </div>
    </div>
  );
};
