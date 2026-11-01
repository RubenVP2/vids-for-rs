import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
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

// En-tête : numéro d'épisode, Hype-mètre à venir, et la source (règle : toujours citer).
// Il descend après le hook (`apparition`) et remonte pour la fin (`fin`) : la 1re et la
// dernière image sont toutes au hook, et la boucle ne se voit pas. Jusqu'au verdict
// (`verdict`), la pastille « Hype-mètre ? » annonce la fin (boucle ouverte) ; sans ces
// images (ancien rendu), l'en-tête est là d'un bout à l'autre, avec la série.
export const EnTete: React.FC<{episode: Episode; apparition?: number; verdict?: number; fin?: number}> = ({
  episode,
  apparition,
  verdict,
  fin,
}) => {
  const {safeZone} = tokens;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ressort = (debut: number) => spring({frame: frame - debut, fps, config: tokens.mouvement.ressort});
  const s = (apparition === undefined ? 1 : ressort(apparition)) - (fin === undefined ? 0 : ressort(fin));
  const teaser = verdict !== undefined && frame < verdict;
  const pastille: React.CSSProperties = {
    fontFamily: POLICE_TEXTE,
    fontVariationSettings: AXES_TEXTE,
    fontWeight: 800,
    fontSize: 24,
    letterSpacing: 1,
    color: C.encre,
    border: `4px solid ${C.encre}`,
    borderRadius: 30,
    padding: '2px 12px',
    whiteSpace: 'nowrap',
  };
  return (
    <div
      style={{
        position: 'absolute',
        top: safeZone.top,
        left: safeZone.left,
        right: safeZone.right + 16,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        transform: `translateY(${interpolate(s, [0, 1], [-160, 0])}px)`,
        opacity: s <= 0.01 ? 0 : 1,
      }}
    >
      <div
        style={{
          fontFamily: POLICE_TITRE,
          fontSize: 40,
          color: C.encre,
          background: C.surligneur,
          padding: '2px 16px',
          transform: 'rotate(-2deg)',
          whiteSpace: 'nowrap',
        }}
      >
        MATOU {numeroEpisode(episode.numero)}
      </div>
      {teaser ? (
        <div style={{...pastille, background: C.blanc}}>
          HYPE-MÈTRE{' '}
          <span style={{display: 'inline-block', color: C.stylo.rouge, transform: `rotate(${Math.sin(frame / 5) * 14}deg)`}}>?</span>
        </div>
      ) : verdict === undefined ? (
        <div style={pastille}>{episode.serie === 'flash' ? 'FLASH' : 'DÉCRYPTÉ'}</div>
      ) : null}
      <div
        style={{
          marginLeft: 'auto',
          fontFamily: POLICE_TEXTE,
          fontVariationSettings: AXES_TEXTE,
          fontWeight: 700,
          fontSize: tokens.typo.tailles.source - 4,
          color: C.encre,
          opacity: 0.85,
          textAlign: 'right',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
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
