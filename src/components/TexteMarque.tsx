import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, tokens} from '../theme';

// Affiche un texte où ==mot== est surligné au fluo. Le surlignage se « dessine »
// de gauche à droite à partir de l'image `debut` (relative à la séquence).

export const Surligne: React.FC<{
  children: React.ReactNode;
  debut?: number;
  couleur?: string;
}> = ({children, debut = 0, couleur = C.surligneur}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - debut, [0, tokens.mouvement.surlignage], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(100deg, ${couleur}00 0%, ${couleur} 2%, ${couleur} 97%, ${couleur}00 100%)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${p}% 62%`,
        backgroundPosition: '0 78%',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
        padding: '0 0.08em',
        margin: '0 -0.08em',
      }}
    >
      {children}
    </span>
  );
};

export const TexteMarque: React.FC<{texte: string; debut?: number; couleur?: string}> = ({
  texte,
  debut = 0,
  couleur,
}) => {
  const morceaux = texte.split(/==(.+?)==/g);
  return (
    <>
      {morceaux.map((m, i) =>
        i % 2 === 1 ? (
          <Surligne key={i} debut={debut + 4 + i * 3} couleur={couleur}>
            {m}
          </Surligne>
        ) : (
          <React.Fragment key={i}>{m}</React.Fragment>
        ),
      )}
    </>
  );
};
