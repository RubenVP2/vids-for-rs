import React from 'react';
import {C} from '../theme';
import {FILTRE_BOUILLONNE} from './Bouillonne';

// Une feuille blanche posée sur le cahier, contour au feutre, morceau de scotch.
export const Carte: React.FC<{
  children: React.ReactNode;
  largeur: number;
  hauteur: number;
  rotation?: number;
  fond?: string;
  scotch?: boolean;
  style?: React.CSSProperties;
}> = ({children, largeur, hauteur, rotation = -1, fond = C.blanc, scotch = true, style}) => {
  const m = 10;
  // contour légèrement irrégulier, comme tracé à main levée
  const d = `M ${m + 2} ${m + 4} L ${largeur - m - 3} ${m} L ${largeur - m} ${hauteur - m - 3} L ${m} ${hauteur - m} Z`;
  return (
    <div style={{position: 'relative', width: largeur, height: hauteur, transform: `rotate(${rotation}deg)`, ...style}}>
      <svg width={largeur} height={hauteur} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d={d} transform="translate(9 11)" fill={C.encre} opacity={0.12} />
        <g filter={`url(#${FILTRE_BOUILLONNE})`}>
          <path d={d} fill={fond} stroke={C.encre} strokeWidth={8} strokeLinejoin="round" />
        </g>
      </svg>
      {scotch ? (
        <div
          style={{
            position: 'absolute',
            top: -22,
            left: largeur / 2 - 80,
            width: 160,
            height: 46,
            background: 'rgba(255, 236, 160, 0.72)',
            transform: 'rotate(-3deg)',
            boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
          }}
        />
      ) : null}
      <div style={{position: 'absolute', inset: 0, padding: '48px 56px', display: 'flex', flexDirection: 'column'}}>
        {children}
      </div>
    </div>
  );
};
