import React from 'react';
import {AbsoluteFill, Composition, Still} from 'remotion';
import demoEpisode from '../episodes/000-bande-annonce/scenes.json';
import demoTimings from '../episodes/000-bande-annonce/timings.json';
import {DIAPO, DiapoCarrousel, diapoPropsSchema} from './Carrousel';
import {SurcoucheReseaux} from './components/SurcoucheReseaux';
import {DIAPO_LI, DiapoLinkedin, diapoLinkedinProps, type PostLinkedin} from './Coulisses';
import {dureeEnImages, EpisodeVideo} from './Episode';
import {Miniature} from './Miniature';
import {Avatar, PlancheMarque, PlancheMatou} from './Planches';
import {PlancheBande, ScenesBande} from './personnages/Planches';
import {episodePropsSchema, type EpisodeProps} from './schema';
import {FPS, H, W} from './theme';

// Props par défaut (Studio) : la bande-annonce #000. Le rendu passe les props de l'épisode voulu.
const demo = {
  episode: demoEpisode,
  timings: demoTimings,
  audio: 'episodes/000-bande-annonce/voix.mp3',
} as unknown as EpisodeProps;

const EpisodeAvecInterface: React.FC<EpisodeProps> = (p) => (
  <AbsoluteFill>
    <EpisodeVideo {...p} />
    <SurcoucheReseaux />
  </AbsoluteFill>
);

/** Studio seulement : le rendu passe le post de la semaine. */
const POST_DEMO: PostLinkedin = {
  semaine: '2026-S46',
  mode: 'coulisses',
  titre: 'Exemple',
  matou: 'enFait',
  diapos: [1, 2, 3].map((n) => ({titre: `Idée ${n}`, texte: 'Une phrase.'})),
  lecon: {titre: 'La leçon', texte: 'Une phrase.'},
  texte: 'x'.repeat(200),
  sources: ['docs/decisions.md'],
};

export const Racine: React.FC = () => (
  <>
    <Composition
      id="Episode"
      component={EpisodeVideo}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={300}
      schema={episodePropsSchema}
      defaultProps={demo}
      calculateMetadata={({props}) => ({durationInFrames: dureeEnImages(props, FPS)})}
    />
    <Composition
      id="EpisodeAvecInterface"
      component={EpisodeAvecInterface}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={300}
      schema={episodePropsSchema}
      defaultProps={demo}
      calculateMetadata={({props}) => ({durationInFrames: dureeEnImages(props, FPS)})}
    />
    <Still id="Miniature" component={Miniature} width={W} height={H} schema={episodePropsSchema} defaultProps={demo} />
    <Still
      id="DiapoCarrousel"
      component={DiapoCarrousel}
      width={DIAPO.largeur}
      height={DIAPO.hauteur}
      schema={diapoPropsSchema}
      defaultProps={{episode: demo.episode, index: 0}}
    />
    <Still
      id="DiapoLinkedin"
      component={DiapoLinkedin}
      width={DIAPO_LI.largeur}
      height={DIAPO_LI.hauteur}
      schema={diapoLinkedinProps}
      defaultProps={{post: POST_DEMO, index: 0}}
    />
    <Still id="PlancheMarque" component={PlancheMarque} width={W} height={H} />
    <Still id="PlancheMatou" component={PlancheMatou} width={W} height={H} />
    <Still id="Avatar" component={Avatar} width={1080} height={1080} />
    <Still id="PlancheBande" component={PlancheBande} width={W} height={H} />
    <Still id="ScenesBande" component={ScenesBande} width={W} height={H} />
  </>
);
