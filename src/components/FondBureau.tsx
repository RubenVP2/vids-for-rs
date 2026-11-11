import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, H, W} from '../theme';

// Décor alternatif (prototype, docs/personnages.md) : « le bureau de Matou ». Un lieu fixe
// qu'on reconnaît d'un coup d'œil, comme un plateau : le mur en liège où Matou punaise ses
// cartes, et le bureau en bois où il est assis avec Plouf. Les cartes, l'encre et le
// surligneur restent ceux du cahier : seul le monde autour change.

export const LIEGE = '#D7AE76';
const LIEGE_FONCE = '#B98A50';
const LIEGE_CLAIR = '#E9C894';
const BOIS_DESSUS = '#B9773F';
const BOIS_FACE = '#94592C';
const BOIS_VEINE = '#7B4721';
/** Le dessus du bureau : Matou et Plouf y sont posés. */
export const HAUT_BUREAU = 1452;

// Grain du liège : des points pseudo-aléatoires, toujours les mêmes (pas de scintillement).
const alea = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const GRAINS = Array.from({length: 900}, (_, i) => ({
  x: alea(i) * W,
  y: alea(i + 1000) * HAUT_BUREAU,
  r: 1.5 + alea(i + 2000) * 3.5,
  clair: alea(i + 3000) > 0.6,
}));

const Punaise: React.FC<{x: number; y: number; couleur: string}> = ({x, y, couleur}) => (
  <g>
    <ellipse cx={x + 4} cy={y + 8} rx={13} ry={7} fill="rgba(60,30,10,0.25)" />
    <circle cx={x} cy={y} r={14} fill={couleur} stroke={C.encre} strokeWidth={5} />
    <circle cx={x - 4} cy={y - 4} r={4} fill="rgba(255,255,255,0.7)" />
  </g>
);

export const FondBureau: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: LIEGE}}>
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <g>
        {GRAINS.map((g, i) => (
          <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={g.clair ? LIEGE_CLAIR : LIEGE_FONCE} opacity={0.55} />
        ))}
      </g>
      {/* punaises décoratives, hors des zones de texte */}
      <Punaise x={1010} y={330} couleur={C.fluo.rose} />
      <Punaise x={40} y={900} couleur={C.fluo.bleu} />
      <Punaise x={1020} y={1180} couleur={C.fluo.vert} />
      {/* le bureau */}
      <rect x={0} y={HAUT_BUREAU + 34} width={W} height={H - HAUT_BUREAU} fill={BOIS_FACE} />
      <g fill="none" stroke={BOIS_VEINE} strokeWidth={4} strokeLinecap="round" opacity={0.7}>
        <path d={`M 0 ${HAUT_BUREAU + 110} C 260 ${HAUT_BUREAU + 90} 520 ${HAUT_BUREAU + 140} 1080 ${HAUT_BUREAU + 112}`} />
        <path d={`M 0 ${HAUT_BUREAU + 210} C 300 ${HAUT_BUREAU + 240} 700 ${HAUT_BUREAU + 190} 1080 ${HAUT_BUREAU + 220}`} />
        <path d={`M 0 ${HAUT_BUREAU + 330} C 400 ${HAUT_BUREAU + 310} 640 ${HAUT_BUREAU + 360} 1080 ${HAUT_BUREAU + 330}`} />
        <path d={`M 420 ${HAUT_BUREAU + 150} C 470 ${HAUT_BUREAU + 130} 540 ${HAUT_BUREAU + 170} 580 ${HAUT_BUREAU + 150}`} />
      </g>
      <path
        d={`M 0 ${HAUT_BUREAU} L ${W} ${HAUT_BUREAU - 6} L ${W} ${HAUT_BUREAU + 34} L 0 ${HAUT_BUREAU + 38} Z`}
        fill={BOIS_DESSUS}
        stroke={C.encre}
        strokeWidth={8}
        strokeLinejoin="round"
      />
    </svg>
    {/* lumière de la lampe, en haut à droite */}
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse 80% 55% at 85% 0%, rgba(255,240,200,0.45) 0%, rgba(255,240,200,0) 70%), radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 60%, rgba(60,30,10,0.22) 100%)',
      }}
    />
  </AbsoluteFill>
);
