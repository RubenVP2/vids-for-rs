import React from 'react';
import tokens from '../../brand/tokens.json';

// Petites icônes dessinées au feutre, dans l'esprit de Matou.
// On n'utilise pas d'emoji à l'écran : le style reste homogène et nous appartient.

export const ICONES = [
  'bulle',
  'pousse',
  'fusee',
  'ampoule',
  'loupe',
  'eclair',
  'attention',
  'coche',
  'croix',
  'horloge',
  'euro',
  'cadenas',
  'cerveau',
  'robot',
  'document',
  'graphique',
] as const;
export type IconeNom = (typeof ICONES)[number];

const {encre, blanc, fluo, stylo} = tokens.colors;

const t = {
  fill: 'none',
  stroke: encre,
  strokeWidth: 6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const dessins: Record<IconeNom, React.ReactNode> = {
  bulle: (
    <>
      <circle cx={50} cy={52} r={34} {...t} fill={fluo.rose} fillOpacity={0.9} />
      <path {...t} stroke={blanc} strokeWidth={7} d="M 32 40 C 36 30 44 26 52 25" />
      <circle cx={84} cy={20} r={8} {...t} fill={blanc} />
    </>
  ),
  pousse: (
    <>
      <path {...t} d="M 50 88 L 50 46" />
      <path {...t} fill={fluo.vert} d="M 50 54 C 30 56 16 44 14 24 C 34 22 48 34 50 54 Z" />
      <path {...t} fill={fluo.vert} d="M 50 46 C 56 26 72 16 90 18 C 88 38 72 48 50 46 Z" />
      <path {...t} d="M 26 88 L 74 88" />
    </>
  ),
  fusee: (
    <>
      <path {...t} fill={fluo.orange} d="M 30 74 C 22 82 20 90 16 96 C 22 92 30 90 38 82" />
      <path {...t} fill={blanc} d="M 34 70 C 40 44 60 18 90 10 C 82 40 56 60 30 66 Z" />
      <circle cx={62} cy={38} r={8} {...t} fill={stylo.bleu} />
      <path {...t} fill={fluo.orange} d="M 36 50 L 18 50 L 30 36 L 48 34" />
      <path {...t} fill={fluo.orange} d="M 50 64 L 50 82 L 64 70 L 66 52" />
    </>
  ),
  ampoule: (
    <>
      <path {...t} fill={fluo.jaune} d="M 50 12 C 30 12 18 28 20 44 C 22 58 34 62 36 76 L 64 76 C 66 62 78 58 80 44 C 82 28 70 12 50 12 Z" />
      <path {...t} d="M 38 86 L 62 86" />
      <path {...t} d="M 42 95 L 58 95" />
    </>
  ),
  loupe: (
    <>
      <circle cx={42} cy={42} r={26} {...t} fill={fluo.bleu} fillOpacity={0.7} />
      <path {...t} strokeWidth={10} d="M 62 62 L 88 88" />
    </>
  ),
  eclair: <path {...t} fill={fluo.jaune} d="M 58 8 L 22 56 L 46 56 L 38 92 L 78 40 L 52 40 Z" />,
  attention: (
    <>
      <path {...t} fill={fluo.orange} d="M 50 10 L 92 86 L 8 86 Z" />
      <path {...t} d="M 50 36 L 50 60" />
      <circle cx={50} cy={74} r={4} fill={encre} />
    </>
  ),
  coche: <path {...t} stroke={stylo.vert} strokeWidth={11} d="M 14 52 L 40 78 L 88 20" />,
  croix: <path {...t} stroke={stylo.rouge} strokeWidth={11} d="M 18 18 L 82 82 M 82 18 L 18 82" />,
  horloge: (
    <>
      <circle cx={50} cy={50} r={38} {...t} fill={blanc} />
      <path {...t} d="M 50 26 L 50 50 L 68 60" />
    </>
  ),
  euro: (
    <>
      <path {...t} strokeWidth={8} d="M 78 24 C 70 16 60 14 52 14 C 32 14 20 32 20 50 C 20 68 32 86 52 86 C 60 86 70 84 78 76" />
      <path {...t} d="M 10 42 L 56 42 M 10 58 L 52 58" />
    </>
  ),
  cadenas: (
    <>
      <path {...t} d="M 32 44 L 32 32 C 32 20 40 12 50 12 C 60 12 68 20 68 32 L 68 44" />
      <path {...t} fill={fluo.jaune} d="M 20 44 L 80 44 L 80 88 L 20 88 Z" />
      <path {...t} d="M 50 60 L 50 72" />
    </>
  ),
  cerveau: (
    <>
      <path {...t} fill={fluo.rose} d="M 50 18 C 40 8 22 12 22 28 C 10 32 10 50 18 56 C 12 68 22 84 36 80 C 42 90 50 88 50 82 C 50 88 58 90 64 80 C 78 84 88 68 82 56 C 90 50 90 32 78 28 C 78 12 60 8 50 18 Z" />
      <path {...t} d="M 50 18 L 50 82 M 34 40 C 40 42 42 48 40 54 M 66 40 C 60 42 58 48 60 54" />
    </>
  ),
  robot: (
    <>
      <path {...t} fill={fluo.bleu} d="M 20 34 L 80 34 L 80 82 L 20 82 Z" />
      <path {...t} d="M 50 34 L 50 18" />
      <circle cx={50} cy={14} r={5} fill={encre} />
      <circle cx={37} cy={54} r={6} fill={encre} />
      <circle cx={63} cy={54} r={6} fill={encre} />
      <path {...t} d="M 38 70 L 62 70" />
    </>
  ),
  document: (
    <>
      <path {...t} fill={blanc} d="M 24 10 L 62 10 L 78 26 L 78 90 L 24 90 Z" />
      <path {...t} d="M 34 40 L 68 40 M 34 54 L 68 54 M 34 68 L 56 68" />
    </>
  ),
  graphique: (
    <>
      <path {...t} d="M 14 86 L 88 86" />
      <path {...t} fill={fluo.vert} d="M 20 86 L 20 60 L 36 60 L 36 86" />
      <path {...t} fill={fluo.jaune} d="M 44 86 L 44 42 L 60 42 L 60 86" />
      <path {...t} fill={fluo.orange} d="M 68 86 L 68 18 L 84 18 L 84 86" />
    </>
  ),
};

export const Icone: React.FC<{nom: IconeNom; taille?: number; style?: React.CSSProperties}> = ({
  nom,
  taille = 100,
  style,
}) => (
  <svg viewBox="0 0 100 100" width={taille} height={taille} style={{overflow: 'visible', ...style}}>
    {dessins[nom]}
  </svg>
);
