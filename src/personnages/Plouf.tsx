import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {FILTRE_BOUILLONNE} from '../components/Bouillonne';
import {type EtatPlouf, PloufSvg} from './PloufSvg';

const clignementA = (frame: number) => {
  const cycle = 113;
  const t = frame % cycle;
  const d = t - (70 + ((Math.floor(frame / cycle) * 29) % 19));
  return d >= 0 && d < 4 ? 1 : 0;
};

export type PloufProps = {
  etat: EtatPlouf;
  /** Volume de la voix de Plouf par image (0–1), depuis timings.json. */
  enveloppe?: number[];
  /** Image du dernier changement d'expression, pour le petit saut. */
  changement?: number;
  largeur?: number;
  style?: React.CSSProperties;
};

/** Plouf animé : le bocal flotte, le poisson nage, bulles, clignements, bouche sur sa voix. */
export const Plouf: React.FC<PloufProps> = ({etat, enveloppe, changement = -100, largeur = 330, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const volume = enveloppe && frame < enveloppe.length ? enveloppe[frame] : 0;
  const bouche = volume < 0.12 ? 0 : volume < 0.4 ? 0.4 : 1;
  const etatAffiche: EtatPlouf = etat === 'neutre' && bouche > 0 ? 'parle' : etat;
  const depuis = frame - changement;
  const saut = depuis >= 0 && depuis < 10 ? Math.sin((depuis / 10) * Math.PI) * -20 : 0;
  const flotte = Math.sin((frame / fps) * Math.PI * 0.8) * 4;
  return (
    <div style={{width: largeur, height: (largeur * 420) / 400, transform: `translateY(${saut + flotte}px)`, ...style}}>
      <PloufSvg
        etat={etatAffiche}
        bouche={bouche}
        clignement={clignementA(frame)}
        nage={Math.sin(frame / 38) * 14}
        bulles={(frame / 70) % 1}
        filtre={FILTRE_BOUILLONNE}
        width={largeur}
        height={(largeur * 420) / 400}
      />
    </div>
  );
};
