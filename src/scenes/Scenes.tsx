import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Carte} from '../components/Carte';
import {dateCourte} from '../components/EnTete';
import {Fenetre} from '../components/Fenetre';
import {HypeMetre} from '../components/HypeMetre';
import {Icone} from '../components/Icones';
import {useMiroir} from '../components/MiseEnPage';
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
  // en miroir (mise en page de l'épisode), on entre par l'autre bord
  const miroir = useMiroir();
  const sens = miroir && de === 'gauche' ? 'droite' : miroir && de === 'droite' ? 'gauche' : de;
  const transform =
    sens === 'zoom'
      ? `scale(${interpolate(s, [0, 1], [0.6, 1])})`
      : sens === 'gauche'
        ? `translateX(${-d * 700}px) rotate(${-d * 8}deg)`
        : sens === 'droite'
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

// `haute` : la zone remonte sous la marge du haut (hook avec visuel, l'en-tête n'est pas encore là).
const Zone: React.FC<{children: React.ReactNode; centre?: boolean; haute?: boolean}> = ({children, centre = true, haute = false}) => (
  <div
    style={{
      position: 'absolute',
      top: haute ? tokens.safeZone.top + 20 : ZONE.top,
      height: haute ? ZONE.top + ZONE.hauteur - tokens.safeZone.top - 20 : ZONE.hauteur,
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

export const SceneHook: React.FC<SceneProps<'hook'>> = ({scene, mots}) => {
  const frame = useCurrentFrame();
  // le titre est déjà là à l'image 0 (lecture auto sur les réseaux), il « claque » juste un peu
  const echelle = interpolate(frame, [0, 5, 9], [0.92, 1.04, 1], {extrapolateRight: 'clamp'});
  const v = scene.visuel;
  if (v) {
    // La 1re image montre la chose (fenêtre d'app) ou le chiffre, avec le titre : gabarit d'ouverture.
    const titre = (
      <div style={{...titreStyle(tokens.typo.tailles.hook - 30), textAlign: 'center', transform: `scale(${echelle}) rotate(-2deg)`}}>
        <TexteMarque texte={scene.titre} debut={3} />
      </div>
    );
    if (v.type === 'chiffre') {
      // dès l'image 0 en entier dans le cadre, il claque juste un peu ; la taille suit la longueur
      const claque = interpolate(frame, [0, 4, 8], [1.1, 0.96, 1], {extrapolateRight: 'clamp'});
      const taille = Math.min(tokens.typo.tailles.chiffre + 40, Math.round(1100 / Math.max(3, v.valeur.length)));
      return (
        <Zone haute>
          <div style={{...titreStyle(taille), transform: `scale(${claque}) rotate(-3deg)`, textShadow: `8px 8px 0 ${C.surligneur}`}}>
            {v.valeur}
          </div>
          {titre}
        </Zone>
      );
    }
    // 1re bulle presque posée dès l'image 0, les suivantes au mot `quand` (sinon au fil du hook)
    const apparitions = v.messages.map((m, i) => (i === 0 ? -6 : imageDuMot(mots, m.quand, 20 * i)));
    return (
      <Zone haute>
        {titre}
        <div style={{marginTop: 30}}>
          <Fenetre app={v.app} messages={v.messages} apparitions={apparitions} largeur={LARGEUR - 40} />
        </div>
      </Zone>
    );
  }
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
      <Carte largeur={LARGEUR - 20} hauteur={scene.corps ? 560 : 330} rotation={-1.2}>
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
      <div style={{...texteStyle(48), textAlign: 'center', marginTop: 40, maxWidth: LARGEUR - 20}}>
        <TexteMarque texte={scene.raison} debut={46} />
      </div>
    </Entree>
  </Zone>
);

export const SceneFenetre: React.FC<SceneProps<'fenetre'>> = ({scene, mots, duree}) => {
  const n = scene.messages.length;
  // chaque bulle au mot `quand`, sinon au fil de la scène ; jamais dans les 20 dernières images
  const apparitions = scene.messages.map((m, i) =>
    Math.min(imageDuMot(mots, m.quand, Math.round(6 + (i * duree * 0.6) / n)), duree - 20),
  );
  return (
    <Zone>
      <Entree>
        <Fenetre app={scene.app} messages={scene.messages} apparitions={apparitions} largeur={LARGEUR - 30} rotation={-1} />
      </Entree>
    </Zone>
  );
};

/** Image (relative à la scène de fin) où part le « Ma-tou ! » : juste après le dernier mot, jamais dessous. */
export const imageSignature = (mots: MotScene[]) => (mots.at(-1)?.fin ?? 0) + 6;

/**
 * La fin reprend l'image du hook pendant la phrase de boucle : quand la vidéo repart, le
 * raccord ne se voit pas. Pas d'appel à s'abonner (il fait balayer) ; la signature est le
 * « Ma-tou ! » sonore, avec son tampon, après la dernière phrase.
 */
export const SceneFin: React.FC<SceneProps<'fin'>> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hook = props.episode.scenes[0];
  const signature = imageSignature(props.mots);
  const s = spring({frame: frame - signature, fps, config: {damping: 12, stiffness: 260, mass: 0.5}});
  return (
    <>
      {hook.type === 'hook' ? <SceneHook {...props} scene={hook} /> : null}
      <div
        style={{
          position: 'absolute',
          top: ZONE.top + ZONE.hauteur - 100,
          right: tokens.safeZone.right + 30,
          fontFamily: POLICE_TITRE,
          fontSize: 58,
          color: C.encre,
          background: C.surligneur,
          padding: '4px 24px',
          transform: `rotate(-6deg) scale(${interpolate(s, [0, 1], [2, 1])})`,
          opacity: frame < signature ? 0 : 1,
        }}
      >
        Ma-tou !
      </div>
    </>
  );
};

export const SceneVue: React.FC<SceneProps<Scene['type']>> = (props) => {
  switch (props.scene.type) {
    case 'hook':
      return <SceneHook {...(props as SceneProps<'hook'>)} />;
    case 'source':
      return <SceneSource {...(props as SceneProps<'source'>)} />;
    case 'fenetre':
      return <SceneFenetre {...(props as SceneProps<'fenetre'>)} />;
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
  fenetre: 'parle',
  point: 'enFait',
  chiffre: 'surpris',
  liste: 'neutre',
  comparaison: 'reflechit',
  pourquoi: 'enFait',
  verdict: 'verdict',
  fin: 'content',
};
