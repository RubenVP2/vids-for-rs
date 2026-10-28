import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Carte} from '../components/Carte';
import {dateCourte} from '../components/EnTete';
import {HypeMetre} from '../components/HypeMetre';
import {Icone} from '../components/Icones';
import {Tampon} from '../components/Tampon';
import {TexteMarque} from '../components/TexteMarque';
import type {Episode, Scene} from '../schema';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from '../theme';

// Chaque scène occupe la zone de contenu (sous l'en-tête, au-dessus des sous-titres).
// Les temps sont en images, relatifs au début de la scène.

export type MotScene = {texte: string; debut: number; fin: number};
export type SceneProps<T extends Scene['type']> = {
  scene: Extract<Scene, {type: T}>;
  episode: Episode;
  /** Mots prononcés pendant la scène, en images relatives au début de la scène. */
  mots: MotScene[];
  duree: number;
};

export const ZONE = {top: 370, hauteur: 630};

const normaliser = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9%]/g, '');

/** Image où Matou prononce `quand` (début du mot), ou `defaut`. */
export const imageDuMot = (mots: MotScene[], quand: string | undefined, defaut: number) => {
  if (!quand) return defaut;
  const cible = normaliser(quand.split(/\s+/)[0]);
  const m = mots.find((x) => normaliser(x.texte).startsWith(cible));
  return m ? m.debut : defaut;
};

const useEntree = (debut = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - debut, fps, config: tokens.mouvement.ressort});
};

const Entree: React.FC<{children: React.ReactNode; debut?: number; de?: 'bas' | 'gauche' | 'droite' | 'zoom'}> = ({
  children,
  debut = 0,
  de = 'bas',
}) => {
  const frame = useCurrentFrame();
  const s = useEntree(debut);
  const d = interpolate(s, [0, 1], [1, 0]);
  const transform =
    de === 'zoom'
      ? `scale(${interpolate(s, [0, 1], [0.6, 1])})`
      : de === 'gauche'
        ? `translateX(${-d * 700}px) rotate(${-d * 8}deg)`
        : de === 'droite'
          ? `translateX(${d * 700}px) rotate(${d * 8}deg)`
          : `translateY(${d * 500}px) rotate(${d * 6}deg)`;
  return <div style={{transform, opacity: frame < debut ? 0 : 1}}>{children}</div>;
};

const texteStyle = (taille: number): React.CSSProperties => ({
  fontFamily: POLICE_TEXTE,
  fontVariationSettings: AXES_TEXTE,
  fontWeight: 800,
  fontSize: taille,
  lineHeight: 1.15,
  color: C.encre,
});

const titreStyle = (taille: number): React.CSSProperties => ({
  fontFamily: POLICE_TITRE,
  fontSize: taille,
  lineHeight: 1.08,
  color: C.encre,
});

const Zone: React.FC<{children: React.ReactNode; centre?: boolean}> = ({children, centre = true}) => (
  <div
    style={{
      position: 'absolute',
      top: ZONE.top,
      height: ZONE.hauteur,
      left: tokens.safeZone.left,
      right: tokens.safeZone.right,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: centre ? 'center' : 'flex-start',
    }}
  >
    {children}
  </div>
);

const LARGEUR = 1080 - tokens.safeZone.left - tokens.safeZone.right;

export const SceneHook: React.FC<SceneProps<'hook'>> = ({scene}) => {
  const frame = useCurrentFrame();
  // le titre est déjà là à l'image 0 (lecture auto sur les réseaux), il « claque » juste un peu
  const echelle = interpolate(frame, [0, 5, 9], [0.92, 1.04, 1], {extrapolateRight: 'clamp'});
  return (
    <Zone>
      {scene.icone ? (
        <Entree de="zoom" debut={4}>
          <Icone nom={scene.icone} taille={170} style={{marginBottom: 24}} />
        </Entree>
      ) : null}
      <div style={{...titreStyle(tokens.typo.tailles.hook), textAlign: 'center', transform: `scale(${echelle}) rotate(-2deg)`}}>
        <TexteMarque texte={scene.titre} debut={3} />
      </div>
    </Zone>
  );
};

export const SceneSource: React.FC<SceneProps<'source'>> = ({scene, episode}) => (
  <Zone>
    <Entree de="droite">
      <Carte largeur={LARGEUR - 20} hauteur={520} rotation={1.5}>
        <div style={{...texteStyle(30), opacity: 0.7, letterSpacing: 2}}>
          {episode.source.nom.toUpperCase()} · {dateCourte(episode.source.date)}
        </div>
        <div style={{...titreStyle(64), marginTop: 18, flex: 1}}>
          <TexteMarque texte={scene.titreArticle} debut={10} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div style={{...texteStyle(26), opacity: 0.6, maxWidth: 480, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
            {episode.source.url.replace(/^https?:\/\/(www\.)?/, '')}
          </div>
          <Tampon statut={episode.statut} debut={14} />
        </div>
      </Carte>
    </Entree>
  </Zone>
);

export const ScenePoint: React.FC<SceneProps<'point'>> = ({scene}) => (
  <Zone>
    <Entree>
      <Carte largeur={LARGEUR - 20} hauteur={scene.corps ? 560 : 420} rotation={-1.2}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
          {scene.icone ? <Icone nom={scene.icone} taille={120} /> : null}
          <div style={{...titreStyle(tokens.typo.tailles.titre - 8), flex: 1}}>
            <TexteMarque texte={scene.titre} debut={8} />
          </div>
        </div>
        {scene.corps ? (
          <div style={{...texteStyle(tokens.typo.tailles.carte - 6), marginTop: 30}}>
            <TexteMarque texte={scene.corps} debut={14} />
          </div>
        ) : null}
      </Carte>
    </Entree>
  </Zone>
);

export const SceneChiffre: React.FC<SceneProps<'chiffre'>> = ({scene, mots, duree}) => {
  const debut = Math.min(imageDuMot(mots, scene.quand, 0), duree - 20);
  const frame = useCurrentFrame();
  const s = useEntree(debut);
  return (
    <Zone>
      <div
        style={{
          ...titreStyle(tokens.typo.tailles.chiffre),
          transform: `scale(${interpolate(s, [0, 1], [2.4, 1])}) rotate(-3deg)`,
          opacity: frame < debut ? 0 : 1,
          textShadow: `8px 8px 0 ${C.surligneur}`,
        }}
      >
        {scene.valeur}
      </div>
      <Entree debut={debut + 6}>
        <div style={{...texteStyle(tokens.typo.tailles.carte), textAlign: 'center', marginTop: 10, maxWidth: LARGEUR - 40}}>
          <TexteMarque texte={scene.legende} debut={debut + 12} />
        </div>
      </Entree>
    </Zone>
  );
};

export const SceneListe: React.FC<SceneProps<'liste'>> = ({scene, mots, duree}) => {
  const n = scene.elements.length;
  return (
    <Zone centre={false}>
      <Entree de="zoom">
        <div style={{...titreStyle(tokens.typo.tailles.titre - 12), textAlign: 'center', margin: '20px 0 30px'}}>
          <TexteMarque texte={scene.titre} debut={6} />
        </div>
      </Entree>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, width: LARGEUR - 40}}>
        {scene.elements.map((el, i) => {
          const repli = Math.round(8 + (i * (duree * 0.75)) / n);
          // jamais dans les 20 dernières images : l'élément doit avoir fini d'entrer avant la scène suivante
          const debut = Math.min(imageDuMot(mots, el.quand, repli), duree - 20);
          return (
            <Entree key={i} debut={debut} de={i % 2 ? 'droite' : 'gauche'}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)`}}>
                {el.icone ? (
                  <Icone nom={el.icone} taille={88} />
                ) : (
                  <div style={{...titreStyle(64), width: 88, textAlign: 'center', color: C.stylo.bleu}}>{i + 1}.</div>
                )}
                <div style={{...texteStyle(tokens.typo.tailles.carte), flex: 1}}>
                  <TexteMarque texte={el.texte} debut={debut + 6} />
                </div>
              </div>
            </Entree>
          );
        })}
      </div>
    </Zone>
  );
};

export const SceneComparaison: React.FC<SceneProps<'comparaison'>> = ({scene, mots, duree}) => {
  const debutApres = Math.min(imageDuMot(mots, scene.apres.quand, Math.round(duree * 0.45)), duree - 20);
  const col = (LARGEUR - 50) / 2;
  const bloc = (titre: string, texte: string, couleur: string, debut: number, de: 'gauche' | 'droite', rot: number) => (
    <Entree debut={debut} de={de}>
      <Carte largeur={col} hauteur={520} rotation={rot} scotch={false}>
        <div style={{...titreStyle(56), color: couleur, textAlign: 'center', marginBottom: 20}}>{titre}</div>
        <div style={{...texteStyle(46), textAlign: 'center'}}>
          <TexteMarque texte={texte} debut={debut + 8} />
        </div>
      </Carte>
    </Entree>
  );
  return (
    <Zone>
      <div style={{display: 'flex', gap: 50, alignItems: 'center'}}>
        {bloc(scene.avant.titre, scene.avant.texte, C.stylo.rouge, 0, 'gauche', -2)}
        {bloc(scene.apres.titre, scene.apres.texte, C.stylo.vert, debutApres, 'droite', 2)}
      </div>
    </Zone>
  );
};

export const ScenePourquoi: React.FC<SceneProps<'pourquoi'>> = ({scene}) => (
  <Zone>
    <Entree de="zoom">
      <div style={{...titreStyle(tokens.typo.tailles.titre), textAlign: 'center', marginBottom: 30, transform: 'rotate(-2deg)'}}>
        <TexteMarque texte={`==${scene.titre.replace(/==/g, '')}==`} debut={4} />
      </div>
    </Entree>
    <Entree debut={8}>
      <Carte largeur={LARGEUR - 20} hauteur={380} rotation={1} fond="#FFFDF5">
        <div style={{display: 'flex', alignItems: 'center', gap: 26, height: '100%'}}>
          {scene.icone ? <Icone nom={scene.icone} taille={120} /> : null}
          <div style={{...texteStyle(tokens.typo.tailles.carte - 4), flex: 1}}>
            <TexteMarque texte={scene.corps} debut={16} />
          </div>
        </div>
      </Carte>
    </Entree>
  </Zone>
);

export const SceneVerdict: React.FC<SceneProps<'verdict'>> = ({scene, episode}) => (
  <Zone>
    <Entree de="zoom">
      <HypeMetre verdict={episode.verdict} largeur={LARGEUR - 20} />
    </Entree>
    <Entree debut={40}>
      <div style={{...texteStyle(48), textAlign: 'center', marginTop: 10, maxWidth: LARGEUR - 20}}>
        <TexteMarque texte={scene.raison} debut={46} />
      </div>
    </Entree>
  </Zone>
);

export const SceneFin: React.FC<SceneProps<'fin'>> = ({episode}) => (
  <Zone>
    <Entree de="zoom">
      <div style={{...titreStyle(96), textAlign: 'center', transform: 'rotate(-2deg)'}}>
        C'était <TexteMarque texte="==Matou==" debut={6} />,
        <br />
        et c'est tout.
      </div>
    </Entree>
    <Entree debut={14}>
      <div style={{...texteStyle(46), textAlign: 'center', marginTop: 40}}>
        Abonne-toi : l'épisode #{String(episode.numero + 1).padStart(3, '0')} arrive.
      </div>
    </Entree>
  </Zone>
);

export const SceneVue: React.FC<SceneProps<Scene['type']>> = (props) => {
  switch (props.scene.type) {
    case 'hook':
      return <SceneHook {...(props as SceneProps<'hook'>)} />;
    case 'source':
      return <SceneSource {...(props as SceneProps<'source'>)} />;
    case 'point':
      return <ScenePoint {...(props as SceneProps<'point'>)} />;
    case 'chiffre':
      return <SceneChiffre {...(props as SceneProps<'chiffre'>)} />;
    case 'liste':
      return <SceneListe {...(props as SceneProps<'liste'>)} />;
    case 'comparaison':
      return <SceneComparaison {...(props as SceneProps<'comparaison'>)} />;
    case 'pourquoi':
      return <ScenePourquoi {...(props as SceneProps<'pourquoi'>)} />;
    case 'verdict':
      return <SceneVerdict {...(props as SceneProps<'verdict'>)} />;
    case 'fin':
      return <SceneFin {...(props as SceneProps<'fin'>)} />;
  }
};

/** Expression de Matou par défaut selon le type de scène. */
export const MATOU_PAR_DEFAUT: Record<Scene['type'], NonNullable<Scene['matou']>> = {
  hook: 'surpris',
  source: 'neutre',
  point: 'enFait',
  chiffre: 'surpris',
  liste: 'neutre',
  comparaison: 'reflechit',
  pourquoi: 'enFait',
  verdict: 'verdict',
  fin: 'content',
};
