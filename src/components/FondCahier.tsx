import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, H, W, tokens} from '../theme';

// Le fond « cahier de Matou » : papier crème, petits carreaux bleus, marge rouge.
export const FondCahier: React.FC<{decalage?: number}> = ({decalage = 0}) => {
  const pas = tokens.grille.carreau;
  const lignes = [];
  for (let x = (decalage % pas) - pas; x < W + pas; x += pas) {
    lignes.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />);
  }
  for (let y = (decalage % pas) - pas; y < H + pas; y += pas) {
    lignes.push(<line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />);
  }
  return (
    <AbsoluteFill style={{backgroundColor: C.papier}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <g stroke={C.carreau} strokeWidth={2} opacity={0.75}>
          {lignes}
        </g>
        <line x1={tokens.grille.margeX} y1={0} x2={tokens.grille.margeX} y2={H} stroke={C.marge} strokeWidth={4} opacity={0.8} />
      </svg>
      {/* grain du papier, très léger */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0) 55%, rgba(120,100,60,0.10) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
