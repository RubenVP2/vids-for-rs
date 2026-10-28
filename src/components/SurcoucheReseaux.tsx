import React from 'react';
import {AbsoluteFill} from 'remotion';
import {tokens} from '../theme';

// Simule l'interface de TikTok / Reels / Shorts par-dessus la vidéo, pour vérifier
// que rien d'important n'est caché (zones de sécurité). Jamais dans le rendu final.
export const SurcoucheReseaux: React.FC = () => {
  const {safeZone} = tokens;
  const gris = 'rgba(0,0,0,0.38)';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* zones masquées */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: safeZone.top, background: gris}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: safeZone.bottom, background: gris}} />
      <div style={{position: 'absolute', top: safeZone.top, bottom: safeZone.bottom, right: 0, width: safeZone.right, background: gris}} />
      {/* boutons à droite */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{position: 'absolute', right: 30, top: 900 + i * 150, width: 90, height: 90, borderRadius: 45, background: 'rgba(255,255,255,0.75)'}}
        />
      ))}
      {/* pseudo + description en bas */}
      <div style={{position: 'absolute', left: 40, bottom: 250, width: 640, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.8)'}} />
      <div style={{position: 'absolute', left: 40, bottom: 190, width: 820, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.65)'}} />
      <div style={{position: 'absolute', left: 40, bottom: 140, width: 560, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.65)'}} />
      {/* onglets en haut */}
      <div style={{position: 'absolute', top: 90, left: 330, width: 420, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.7)'}} />
      <div style={{position: 'absolute', inset: 0, border: '4px dashed rgba(211,58,44,0.8)', margin: `${safeZone.top}px ${safeZone.right}px ${safeZone.bottom}px ${safeZone.left}px`}} />
    </AbsoluteFill>
  );
};
