import React from 'react';
import {useCurrentFrame} from 'remotion';
import tokens from '../../brand/tokens.json';

// Le « trait qui bouillonne » : un léger déplacement du contour, recalculé
// ~10 fois par seconde. C'est ce qui donne vie au dessin, même immobile.

export const FILTRE_BOUILLONNE = 'matou-bouillonne';

export const DefsBouillonne: React.FC<{intensite?: number}> = ({intensite = 1}) => {
  const frame = useCurrentFrame();
  const pas = Math.round(tokens.format.fps / tokens.trait.bouillonnementFps);
  const graine = Math.floor(frame / pas) % 8;
  return (
    <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
      <defs>
        <filter id={FILTRE_BOUILLONNE} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={graine} result="bruit" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="bruit"
            scale={tokens.trait.bouillonnementAmplitude * intensite}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};
