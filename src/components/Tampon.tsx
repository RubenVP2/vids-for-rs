import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {POLICE_TITRE, tokens} from '../theme';

type Statut = keyof Omit<typeof tokens.statut, '$description'>;

// Le tampon ANNONCÉ / DISPONIBLE / RUMEUR, posé d'un coup sec.
export const Tampon: React.FC<{statut: Statut; debut?: number; taille?: number}> = ({statut, debut = 0, taille = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {label, couleur} = tokens.statut[statut];
  const s = spring({frame: frame - debut, fps, config: {damping: 12, stiffness: 260, mass: 0.5}});
  const echelle = interpolate(s, [0, 1], [2.2, 1]);
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: POLICE_TITRE,
        fontSize: 44 * taille,
        letterSpacing: 3,
        color: couleur,
        border: `${6 * taille}px solid ${couleur}`,
        borderRadius: 10,
        padding: `${4 * taille}px ${20 * taille}px`,
        transform: `rotate(-6deg) scale(${echelle})`,
        opacity: frame < debut ? 0 : Math.min(1, s * 1.5),
        mixBlendMode: 'multiply',
      }}
    >
      {label}
    </div>
  );
};
