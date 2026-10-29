import React from 'react';
import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {DefsBouillonne} from './components/Bouillonne';
import {Carte} from './components/Carte';
import {dateCourte, numeroEpisode} from './components/EnTete';
import {FondCahier} from './components/FondCahier';
import {HypeMetre} from './components/HypeMetre';
import {Icone} from './components/Icones';
import {TexteMarque} from './components/TexteMarque';
import {chargerPolices} from './fonts';
import {Matou} from './mascot/Matou';
import {episodeSchema, type Episode, type Scene} from './schema';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE} from './theme';

chargerPolices();

// Carrousel LinkedIn (document à feuilleter, 4:5) : une diapo par idée de l'épisode,
// tirée de scenes.json, sans texte à écrire en plus. Rendu : npm run carrousel.
export const DIAPO = {largeur: 1080, hauteur: 1350};
const MARGE = 90;

type Contenu = Extract<Scene, {type: 'point' | 'chiffre' | 'liste' | 'comparaison' | 'pourquoi'}>;
export type Diapo = {type: 'couverture'} | {type: 'scene'; scene: Contenu} | {type: 'verdict'} | {type: 'fin'};

const CONTENUS = ['point', 'chiffre', 'liste', 'comparaison', 'pourquoi'];
/** Les diapos de l'épisode : couverture, une par scène de contenu, Hype-mètre, fin. */
export const diapos = (episode: Episode): Diapo[] => [
  {type: 'couverture'},
  ...episode.scenes.filter((s): s is Contenu => CONTENUS.includes(s.type)).map((scene) => ({type: 'scene' as const, scene})),
  {type: 'verdict'},
  {type: 'fin'},
];

export const diapoPropsSchema = z.object({episode: episodeSchema, index: z.number().int().min(0)});
type DiapoProps = z.infer<typeof diapoPropsSchema>;

const texte = (taille: number): React.CSSProperties => ({
  fontFamily: POLICE_TEXTE,
  fontVariationSettings: AXES_TEXTE,
  fontWeight: 800,
  fontSize: taille,
  lineHeight: 1.2,
  color: C.encre,
});
const titre = (taille: number): React.CSSProperties => ({fontFamily: POLICE_TITRE, fontSize: taille, lineHeight: 1.08, color: C.encre});
// Image fixe : -100 fait apparaître les surlignages déjà tracés.
const Marque: React.FC<{t: string}> = ({t}) => <TexteMarque texte={t} debut={-100} />;

const Scene: React.FC<{scene: Contenu}> = ({scene}) => {
  switch (scene.type) {
    case 'chiffre':
      return (
        <>
          <div style={{...titre(300), transform: 'rotate(-3deg)'}}>
            <Marque t={`==${scene.valeur}==`} />
          </div>
          <div style={{...texte(58), textAlign: 'center', marginTop: 40}}>
            <Marque t={scene.legende} />
          </div>
        </>
      );
    case 'liste':
      return (
        <>
          <div style={{...titre(92), textAlign: 'center', marginBottom: 50}}>
            <Marque t={scene.titre} />
          </div>
          {scene.elements.map((e) => (
            <div key={e.texte} style={{...texte(52), display: 'flex', alignItems: 'center', gap: 28, alignSelf: 'stretch', marginBottom: 30}}>
              {e.icone ? <Icone nom={e.icone} taille={90} /> : <span style={titre(70)}>→</span>}
              <span>
                <Marque t={e.texte} />
              </span>
            </div>
          ))}
        </>
      );
    case 'comparaison':
      return (
        <>
          {[scene.avant, scene.apres].map((c, i) => (
            <Carte key={c.titre} largeur={820} hauteur={330} rotation={i ? 1.5 : -1.5} fond={i ? C.surligneur : C.blanc} style={{marginBottom: 50}}>
              <div style={titre(64)}>{c.titre}</div>
              <div style={{...texte(46), marginTop: 16}}>
                <Marque t={c.texte} />
              </div>
            </Carte>
          ))}
        </>
      );
    default:
      return (
        <>
          {scene.icone ? <Icone nom={scene.icone} taille={190} style={{marginBottom: 40}} /> : null}
          <div style={{...titre(104), textAlign: 'center', transform: 'rotate(-2deg)'}}>
            <Marque t={scene.titre} />
          </div>
          {scene.corps ? (
            <Carte largeur={860} hauteur={330} style={{marginTop: 60}}>
              <div style={{...texte(52), margin: 'auto 0'}}>
                <Marque t={scene.corps} />
              </div>
            </Carte>
          ) : null}
        </>
      );
  }
};

export const DiapoCarrousel: React.FC<DiapoProps> = ({episode, index}) => {
  const liste = diapos(episode);
  const diapo = liste[Math.min(index, liste.length - 1)];
  const derniere = index >= liste.length - 1;
  const verdict = episode.scenes.find((s): s is Extract<Scene, {type: 'verdict'}> => s.type === 'verdict');
  const hook = episode.scenes.find((s): s is Extract<Scene, {type: 'hook'}> => s.type === 'hook');
  return (
    <AbsoluteFill>
      <FondCahier />
      <DefsBouillonne />
      {/* bandeau : numéro, et la page pour donner envie de feuilleter */}
      <div style={{position: 'absolute', top: 70, left: MARGE, right: MARGE, display: 'flex', alignItems: 'center'}}>
        <div style={{...titre(48), background: C.surligneur, padding: '2px 18px', transform: 'rotate(-2deg)'}}>MATOU {numeroEpisode(episode.numero)}</div>
        <div style={{...texte(36), marginLeft: 'auto', opacity: 0.7}}>
          {index + 1}/{liste.length}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 200,
          bottom: 190,
          left: MARGE,
          right: MARGE,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {diapo.type === 'couverture' ? (
          <>
            <div style={{...titre(124), textAlign: 'center', transform: 'rotate(-2deg)'}}>
              <Marque t={episode.miniature ?? hook?.titre ?? ''} />
            </div>
            <Matou etat={episode.verdict === 'buzz' ? 'sceptique' : 'surpris'} largeur={470} style={{marginTop: 40}} />
          </>
        ) : diapo.type === 'scene' ? (
          <Scene scene={diapo.scene} />
        ) : diapo.type === 'verdict' ? (
          <>
            <HypeMetre verdict={episode.verdict} image={200} largeur={780} />
            {verdict ? (
              <div style={{...texte(54), textAlign: 'center', marginTop: 40}}>
                <Marque t={verdict.raison} />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <Matou etat="content" largeur={440} />
            <div style={{...titre(92), textAlign: 'center', marginTop: 30}}>
              <Marque t="L'actu de l'IA, ==expliquée simplement== chaque jour" />
            </div>
            <div style={{...texte(50), textAlign: 'center', marginTop: 36}}>Suis Matou pour la suite ☝️</div>
          </>
        )}
      </div>

      {/* pied : la source sur chaque diapo (règle : toujours citer) */}
      <div style={{position: 'absolute', bottom: 70, left: MARGE, right: MARGE, display: 'flex', alignItems: 'flex-end'}}>
        <div style={{...texte(32), opacity: 0.85, lineHeight: 1.15}}>
          Source : {episode.source.nom}
          <br />
          <span style={{fontSize: 26, opacity: 0.8}}>{dateCourte(episode.source.date)} · lien en commentaire</span>
        </div>
        {derniere ? null : <div style={{...titre(56), marginLeft: 'auto', transform: 'rotate(-3deg)'}}>Glisse →</div>}
      </div>
    </AbsoluteFill>
  );
};
