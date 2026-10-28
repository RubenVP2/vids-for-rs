import React from 'react';
import type {Episode} from '../schema';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from '../theme';

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export const dateCourte = (iso: string) => {
  const [a, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
};
export const numeroEpisode = (n: number) => `#${String(n).padStart(3, '0')}`;
const TYPES: Record<Episode['source']['type'], string> = {
  blog: 'blog',
  article: 'article',
  papier: 'papier de recherche',
  communique: 'communiqué',
  video: 'vidéo',
  post: 'post',
};

// En-tête toujours visible : numéro d'épisode, série, et la source (règle : toujours citer).
export const EnTete: React.FC<{episode: Episode}> = ({episode}) => {
  const {safeZone} = tokens;
  return (
    <div
      style={{
        position: 'absolute',
        top: safeZone.top,
        left: safeZone.left,
        right: safeZone.right,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          fontFamily: POLICE_TITRE,
          fontSize: 46,
          color: C.encre,
          background: C.surligneur,
          padding: '2px 16px',
          transform: 'rotate(-2deg)',
        }}
      >
        MATOU {numeroEpisode(episode.numero)}
      </div>
      <div
        style={{
          fontFamily: POLICE_TEXTE,
          fontVariationSettings: AXES_TEXTE,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
          color: C.encre,
          border: `4px solid ${C.encre}`,
          borderRadius: 30,
          padding: '2px 16px',
        }}
      >
        {episode.serie === 'flash' ? 'FLASH' : 'DÉCRYPTÉ'}
      </div>
      <div
        style={{
          marginLeft: 'auto',
          fontFamily: POLICE_TEXTE,
          fontVariationSettings: AXES_TEXTE,
          fontWeight: 700,
          fontSize: tokens.typo.tailles.source,
          color: C.encre,
          opacity: 0.85,
          textAlign: 'right',
          lineHeight: 1.1,
        }}
      >
        Source : {episode.source.nom}
        <br />
        <span style={{fontSize: 26, opacity: 0.8}}>
          {TYPES[episode.source.type]} · {dateCourte(episode.source.date)}
        </span>
      </div>
    </div>
  );
};
