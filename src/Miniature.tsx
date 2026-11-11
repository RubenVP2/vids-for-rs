import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DefsBouillonne} from './components/Bouillonne';
import {numeroEpisode} from './components/EnTete';
import {FondBureau, HAUT_BUREAU} from './components/FondBureau';
import {FondCahier} from './components/FondCahier';
import {TexteMarque} from './components/TexteMarque';
import {chargerPolices} from './fonts';
import {Matou} from './mascot/Matou';
import {Plouf} from './personnages/Plouf';
import type {EpisodeProps} from './schema';
import {C, POLICE_TITRE, tokens} from './theme';

chargerPolices();

// Couverture de l'épisode (TikTok, Reels, Shorts) : gros titre, Matou, numéro.
export const Miniature: React.FC<EpisodeProps> = ({episode}) => {
  const hook = episode.scenes.find((s) => s.type === 'hook');
  const titre = episode.miniature ?? (hook && 'titre' in hook ? hook.titre : '');
  const duo = episode.scenes.some((s) => s.plouf);
  return (
    <AbsoluteFill>
      {episode.decor === 'bureau' ? <FondBureau /> : <FondCahier />}
      <DefsBouillonne />
      <div
        style={{
          position: 'absolute',
          top: tokens.safeZone.top + 110,
          left: tokens.safeZone.left,
          fontFamily: POLICE_TITRE,
          fontSize: 64,
          background: C.surligneur,
          padding: '4px 22px',
          transform: 'rotate(-3deg)',
        }}
      >
        MATOU {numeroEpisode(episode.numero)}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 540,
          left: tokens.safeZone.left,
          right: tokens.safeZone.right - 40,
          fontFamily: POLICE_TITRE,
          fontSize: 132,
          lineHeight: 1.05,
          textAlign: 'center',
          color: C.encre,
          transform: 'rotate(-2deg)',
        }}
      >
        <TexteMarque texte={titre} debut={-100} />
      </div>
      {duo ? (
        <>
          {/* Plouf pose la question, Matou va répondre : posés sur le bureau */}
          <div style={{position: 'absolute', left: tokens.safeZone.left, top: HAUT_BUREAU + 30 - (380 * 392) / 400}}>
            <Plouf etat="question" largeur={380} />
          </div>
          <div style={{position: 'absolute', left: 430, top: HAUT_BUREAU + 24 - 400}}>
            <Matou etat={episode.verdict === 'buzz' ? 'sceptique' : 'enFait'} largeur={520} />
          </div>
        </>
      ) : (
        <div style={{position: 'absolute', left: 1080 / 2 - 300 - 30, top: 1060}}>
          <Matou etat={episode.verdict === 'buzz' ? 'sceptique' : 'surpris'} largeur={600} />
        </div>
      )}
    </AbsoluteFill>
  );
};
