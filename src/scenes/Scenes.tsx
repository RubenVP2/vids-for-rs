import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Carte} from '../components/Carte';
import {dateSource} from '../components/EnTete';
import {Fenetre} from '../components/Fenetre';
import {HypeMetre} from '../components/HypeMetre';
import {Icone} from '../components/Icones';
import {useMiroir} from '../components/MiseEnPage';
import {Tampon} from '../components/Tampon';
import {TexteMarque} from '../components/TexteMarque';
import type {Episode, Scene} from '../schema';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from '../theme';
import {SceneHookTitre, SceneVerdictTitre} from '../formats/Titre';

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

/**
 * Temps minimal de lecture garanti à l'écran (en images à 30 i/s) :
 * tout élément qui apparaît en cours de scène doit laisser au moins ~2,5 s (75 images)
 * au spectateur pour être lu confortablement avant la transition suivante, et apparaître
 * dans le premier quart de la scène.
 */
const LECTURE_MIN_IMAGES = 75;

const bornerLecture = (imageCible: number, duree: number, min = 6, maxPart = 0.26) =>
  Math.max(min, Math.min(imageCible, Math.round(duree * maxPart), Math.max(min, duree - LECTURE_MIN_IMAGES)));

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

/**
 * Images (relatives au début de la scène) où un second temps visuel « claque » à l'écran :
 * sert à la fois aux composants de scène et aux petits bruitages `pop` dans Episode.tsx.
 */
export const imagesPop = (scene: Scene, mots: MotScene[], duree: number): number[] => {
  switch (scene.type) {
    case 'hook':
      if (scene.visuel?.type === 'fenetre' && scene.visuel.messages.length > 1) {
        return scene.visuel.messages.slice(1).map((m, i) => bornerLecture(imageDuMot(mots, m.quand, 14 * (i + 1)), duree, 10, 0.25));
      }
      return [];
    case 'point':
      return scene.corps ? [10] : [];
    case 'pourquoi':
      return [6];
    case 'comparaison':
      return [bornerLecture(imageDuMot(mots, scene.apres.quand, 20), duree, 14, 0.25)];
    case 'liste':
      return scene.elements.map((el, i) =>
        i === 0
          ? 6
          : bornerLecture(
              imageDuMot(mots, el.quand, Math.round(6 + (i * (duree * 0.32)) / Math.max(1, scene.elements.length - 1))),
              duree,
              16 * i,
              0.32,
            ),
      );
    case 'chiffre': {
      const d = bornerLecture(imageDuMot(mots, scene.quand, 0), duree, 0, 0.2);
      return d >= 4 ? [d] : [];
    }
    case 'fenetre':
      return scene.messages
        .map((m, i) => (i === 0 ? 4 : bornerLecture(imageDuMot(mots, m.quand, 16 * i), duree, 12 * i, 0.32)))
        .filter((d) => d >= 4);
    default:
      return [];
  }
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

export const SceneHook: React.FC<SceneProps<'hook'>> = ({scene, episode, mots, duree}) => {
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
    // 1re bulle posée dès l'image 0, la 2e dès ~0,4 s (bornée pour laisser >= 2,5 s de lecture)
    const apparitions = v.messages.map((m, i) =>
      i === 0 ? -6 : bornerLecture(imageDuMot(mots, m.quand, 14 * i), duree, 10, 0.25),
    );
    return (
      <Zone haute>
        {titre}
        <div style={{marginTop: 30}}>
          <Fenetre app={v.app} messages={v.messages} apparitions={apparitions} largeur={LARGEUR - 40} />
        </div>
      </Zone>
    );
  }
  // Ouverture sans visuel (« toi » ou « question ») : affiche-choc encadrée dès l'image 0
  // avec pastille d'icône et étiquette de source pour ne jamais laisser la page vide.
  return (
    <Zone haute>
      {scene.icone ? (
        <div
          style={{
            background: C.surligneur,
            border: `${tokens.trait.epaisseur}px solid ${C.encre}`,
            borderRadius: '50%',
            padding: 22,
            boxShadow: `6px 6px 0 ${C.encre}`,
            transform: `scale(${echelle}) rotate(-4deg)`,
            marginBottom: -28,
            zIndex: 2,
          }}
        >
          <Icone nom={scene.icone} taille={136} />
        </div>
      ) : null}
      <div style={{transform: `scale(${echelle})`}}>
        <Carte largeur={LARGEUR - 20} hauteur={370} rotation={-1.5}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 18,
              paddingTop: scene.icone ? 16 : 0,
            }}
          >
            <div style={{...titreStyle(tokens.typo.tailles.hook - 16), textAlign: 'center'}}>
              <TexteMarque texte={scene.titre} debut={3} />
            </div>
            <div
              style={{
                ...texteStyle(30),
                background: '#FFFDF5',
                border: `3px solid ${C.encre}`,
                padding: '4px 18px',
                transform: 'rotate(1deg)',
                opacity: 0.9,
                letterSpacing: 1.5,
              }}
            >
              {episode.source.nom.toUpperCase()} · {dateSource(episode.source)}
            </div>
          </div>
        </Carte>
      </div>
    </Zone>
  );
};

export const SceneSource: React.FC<SceneProps<'source'>> = ({scene, episode}) => (
  <Zone>
    <Entree de="droite">
      <Carte largeur={LARGEUR - 20} hauteur={520} rotation={1.5}>
        <div style={{...texteStyle(30), opacity: 0.7, letterSpacing: 2}}>
          {episode.source.nom.toUpperCase()} · {dateSource(episode.source)}
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
    <Entree de="gauche">
      <Carte largeur={LARGEUR - 20} hauteur={scene.corps ? 500 : 330} rotation={-1.2}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 28}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            {scene.icone ? <Icone nom={scene.icone} taille={116} /> : null}
            <div style={{...titreStyle(tokens.typo.tailles.titre - 6), flex: 1}}>
              <TexteMarque texte={scene.titre} debut={4} />
            </div>
          </div>
          {scene.corps ? (
            <Entree debut={10} de="zoom">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  background: '#FFFDF5',
                  border: `4px solid ${C.encre}`,
                  boxShadow: `6px 6px 0 ${C.encre}`,
                  padding: '22px 28px',
                  transform: 'rotate(1deg)',
                }}
              >
                <span style={{...titreStyle(56), color: C.stylo.rouge, lineHeight: 1}}>➔</span>
                <div style={{...texteStyle(tokens.typo.tailles.carte + 2), textAlign: 'center'}}>
                  <TexteMarque texte={scene.corps} debut={14} />
                </div>
              </div>
            </Entree>
          ) : null}
        </div>
      </Carte>
    </Entree>
  </Zone>
);

export const SceneChiffre: React.FC<SceneProps<'chiffre'>> = ({scene, mots, duree}) => {
  const debut = bornerLecture(imageDuMot(mots, scene.quand, 0), duree, 0, 0.2);
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
          <TexteMarque texte={scene.titre} debut={4} />
        </div>
      </Entree>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, width: LARGEUR - 40}}>
        {scene.elements.map((el, i) => {
          const repli = Math.round(6 + (i * (duree * 0.32)) / Math.max(1, n - 1));
          const debut = i === 0 ? 6 : bornerLecture(imageDuMot(mots, el.quand, repli), duree, 16 * i, 0.32);
          return (
            <Entree key={i} debut={debut} de={i % 2 ? 'droite' : 'gauche'}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  background: '#FFFDF5',
                  border: `4px solid ${C.encre}`,
                  boxShadow: `6px 6px 0 ${C.encre}`,
                  padding: '16px 24px',
                  transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)`,
                }}
              >
                {el.icone ? (
                  <Icone nom={el.icone} taille={84} />
                ) : (
                  <div style={{...titreStyle(64), width: 84, textAlign: 'center', color: C.stylo.bleu}}>{i + 1}.</div>
                )}
                <div style={{...texteStyle(tokens.typo.tailles.carte), flex: 1}}>
                  <TexteMarque texte={el.texte} debut={debut + 5} />
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
  // La 2e carte (« après ») arrive dès le 1er quart de la scène (~0,6 à 0,9 s) pour laisser >= 2,7 s de lecture
  const debutApres = bornerLecture(imageDuMot(mots, scene.apres.quand, 20), duree, 14, 0.25);
  const col = (LARGEUR - 44) / 2;
  const bloc = (titre: string, texte: string, couleur: string, debut: number, de: 'gauche' | 'droite', rot: number, fond = C.blanc) => (
    <Entree debut={debut} de={de}>
      <Carte largeur={col} hauteur={470} rotation={rot} scotch={false} fond={fond}>
        <div
          style={{
            ...titreStyle(50),
            color: C.blanc,
            background: couleur,
            border: `3px solid ${C.encre}`,
            padding: '4px 14px',
            textAlign: 'center',
            marginBottom: 24,
            transform: `rotate(${rot > 0 ? -1 : 1}deg)`,
          }}
        >
          {titre}
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <div style={{...texteStyle(48), textAlign: 'center'}}>
            <TexteMarque texte={texte} debut={debut + 6} />
          </div>
        </div>
      </Carte>
    </Entree>
  );
  return (
    <Zone>
      <div style={{display: 'flex', gap: 44, alignItems: 'center', position: 'relative'}}>
        {bloc(scene.avant.titre, scene.avant.texte, C.stylo.rouge, 0, 'gauche', -2)}
        {bloc(scene.apres.titre, scene.apres.texte, C.stylo.vert, debutApres, 'droite', 2, '#FFFDF5')}
      </div>
    </Zone>
  );
};

export const ScenePourquoi: React.FC<SceneProps<'pourquoi'>> = ({scene}) => (
  <Zone>
    <Entree de="zoom">
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26, transform: 'rotate(-2deg)'}}>
        {scene.icone ? <Icone nom={scene.icone} taille={112} /> : null}
        <div style={{...titreStyle(tokens.typo.tailles.titre), textAlign: 'center'}}>
          <TexteMarque texte={`==${scene.titre.replace(/==/g, '')}==`} debut={3} />
        </div>
      </div>
    </Entree>
    <Entree debut={6} de="droite">
      <Carte largeur={LARGEUR - 20} hauteur={310} rotation={1.2} fond="#FFFDF5">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <div style={{...texteStyle(tokens.typo.tailles.carte + 4), textAlign: 'center'}}>
            <TexteMarque texte={scene.corps} debut={12} />
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
    <Entree debut={10} de="zoom">
      <div
        style={{
          ...texteStyle(46),
          textAlign: 'center',
          marginTop: 34,
          maxWidth: LARGEUR - 20,
          background: '#FFFDF5',
          border: `4px solid ${C.encre}`,
          boxShadow: `6px 6px 0 ${C.encre}`,
          padding: '16px 28px',
          transform: 'rotate(-1deg)',
        }}
      >
        <TexteMarque texte={scene.raison} debut={14} />
      </div>
    </Entree>
  </Zone>
);

export const SceneFenetre: React.FC<SceneProps<'fenetre'>> = ({scene, mots, duree}) => {
  // chaque bulle dès le 1er tiers de la scène pour laisser le temps de lire
  const apparitions = scene.messages.map((m, i) =>
    i === 0 ? 4 : bornerLecture(imageDuMot(mots, m.quand, 16 * i), duree, 12 * i, 0.32),
  );
  return (
    <Zone>
      <Entree>
        <Fenetre app={scene.app} messages={scene.messages} apparitions={apparitions} largeur={LARGEUR - 30} rotation={-1} />
      </Entree>
    </Zone>
  );
};

/** Image (relative à la scène de fin) où part le « Ma-tou ! » : 3 images (0,1 s) après le dernier mot. */
/**
 * Le « Ma-tou ! » sonne juste après la dernière syllabe. La fin du dernier mot est lue dans le son
 * depuis le 12/11/2026 (scripts/lib/fins.ts) ; les 4 images de marge couvrent les anciens minutages.
 */
export const imageSignature = (mots: MotScene[]) => (mots.at(-1)?.fin ?? 0) + 4;

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
      {props.episode.format === 'titre' ? (
        <SceneHookTitre episode={props.episode} tampon={-100} />
      ) : hook.type === 'hook' ? (
        <SceneHook {...props} scene={hook} />
      ) : null}
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
  // Format « Matou contre le titre » : le hook et le verdict montrent la coupure de presse.
  if (props.episode.format === 'titre') {
    if (props.scene.type === 'hook') return <SceneHookTitre episode={props.episode} />;
    if (props.scene.type === 'verdict') return <SceneVerdictTitre episode={props.episode} raison={props.scene.raison} />;
  }
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
