import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DefsBouillonne, FILTRE_BOUILLONNE} from '../components/Bouillonne';
import {FondCahier} from '../components/FondCahier';
import {TexteMarque} from '../components/TexteMarque';
import {chargerPolices} from '../fonts';
import {Matou} from '../mascot/Matou';
import type {EtatMatou} from '../mascot/MatouSvg';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import {type EtatPerso, type NomPerso, PERSONNAGES} from './Bande';

chargerPolices();

// Planches du prototype « la bande de Matou » (docs/personnages.md) :
// npm run stills -- planches → docs/images/planche-bande.png et bande-scenes.png.

const texte = (taille: number): React.CSSProperties => ({
  fontFamily: POLICE_TEXTE,
  fontVariationSettings: AXES_TEXTE,
  fontWeight: 800,
  fontSize: taille,
  lineHeight: 1.2,
  color: C.encre,
});
const titre = (taille: number): React.CSSProperties => ({fontFamily: POLICE_TITRE, fontSize: taille, lineHeight: 1.05, color: C.encre});

const Perso: React.FC<{nom: NomPerso; etat: EtatPerso; largeur: number; style?: React.CSSProperties}> = ({nom, etat, largeur, style}) => {
  const P = PERSONNAGES[nom].composant;
  return <P etat={etat} width={largeur} height={(largeur * 420) / 400} filtre={FILTRE_BOUILLONNE} style={style} />;
};

const LEGENDES: Record<EtatPerso, string> = {neutre: 'neutre', parle: 'parle', surpris: 'surpris', signature: 'signature'};

export const PlancheBande: React.FC = () => (
  <AbsoluteFill>
    <FondCahier />
    <DefsBouillonne />
    <div style={{position: 'absolute', inset: '70px 50px 40px 140px'}}>
      <div style={titre(80)}>
        La bande de <TexteMarque texte="==Matou==" debut={-50} />
      </div>
      <div style={{...texte(28), marginTop: 6, opacity: 0.8}}>4 seconds rôles · prototype</div>
      {(Object.keys(PERSONNAGES) as NomPerso[]).map((n) => (
        <div key={n} style={{marginTop: 34}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
            <div style={{...titre(56), background: C.surligneur, padding: '0 14px', transform: 'rotate(-2deg)'}}>{PERSONNAGES[n].nom}</div>
            <div style={texte(30)}>{PERSONNAGES[n].role}</div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 34, padding: '0 10px'}}>
            {(['neutre', 'surpris', 'signature'] as EtatPerso[]).map((e) => (
              <div key={e} style={{width: 250, textAlign: 'center'}}>
                <Perso nom={n} etat={e} largeur={210} />
                <div style={{...texte(22), opacity: 0.7, marginTop: 4}}>{e === 'signature' ? `« ${PERSONNAGES[n].signature} »` : LEGENDES[e]}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const Bulle: React.FC<{texte: string; queue: 'gauche' | 'droite' | 'bas-droite' | 'bas-gauche'; style?: React.CSSProperties; taille?: number; police?: 'titre' | 'texte'}> = ({
  texte: t,
  queue,
  style,
  taille = 64,
  police = 'titre',
}) => {
  const enBas = queue.startsWith('bas');
  const aDroite = queue.endsWith('droite');
  return (
    <div style={{position: 'absolute', ...style}}>
      <div
        style={{
          ...(police === 'titre' ? titre(taille) : texte(taille)),
          background: C.blanc,
          border: `8px solid ${C.encre}`,
          borderRadius: 44,
          padding: '26px 34px',
          textAlign: 'center',
        }}
      >
        <TexteMarque texte={t} debut={-50} />
      </div>
      <svg
        width={80}
        height={70}
        style={{
          position: 'absolute',
          ...(enBas ? {bottom: -60} : {top: '40%'}),
          ...(aDroite ? {right: enBas ? 90 : -62} : {left: enBas ? 90 : -62}),
          transform: enBas ? (aDroite ? undefined : 'scaleX(-1)') : aDroite ? 'rotate(-90deg)' : 'rotate(90deg) scaleX(-1)',
        }}
      >
        <path d="M 6 0 L 70 64 L 40 0" fill={C.blanc} stroke={C.encre} strokeWidth={8} strokeLinejoin="round" />
        <rect x={10} y={-10} width={26} height={14} fill={C.blanc} />
      </svg>
    </div>
  );
};

type Scene = {
  nom: NomPerso;
  etiquette: string;
  replique: string;
  matou: EtatMatou;
  reponse: string;
  serie: string;
};

const SCENES: Scene[] = [
  {nom: 'coco', etiquette: 'Le hook', replique: "L'IA va remplacer ==ton médecin== !!!", matou: 'sceptique', reponse: 'En fait… pas vraiment.', serie: 'Actu : Coco lit le communiqué, Matou trie'},
  {nom: 'plouf', etiquette: 'La question', replique: "C'est quoi ==un agent IA== ?", matou: 'enFait', reponse: 'En fait, c’est une IA qui agit.', serie: '« Matou t’explique » : Plouf demande'},
  {nom: 'bip', etiquette: 'La démo', replique: 'Bien sûr ! Napoléon a inventé ==le Wi-Fi==.', matou: 'surpris', reponse: 'Il dit faux… avec aplomb.', serie: 'Les limites : Bip se trompe en direct'},
  {nom: 'cookie', etiquette: "L'arnaque", replique: 'Accepte ==tous les cookies==, voyons…', matou: 'sceptique', reponse: 'Lis avant de cliquer.', serie: 'Vie privée, arnaques : Cookie piège'},
];

/** Une image de vidéo (1080×1920) avec Matou et un second rôle. */
const ImageScene: React.FC<{scene: Scene}> = ({scene}) => (
  <AbsoluteFill>
    <FondCahier />
    <div style={{position: 'absolute', top: 236, left: 100, ...titre(46), background: C.encre, color: C.blanc, padding: '4px 20px', transform: 'rotate(-2deg)'}}>
      {PERSONNAGES[scene.nom].nom.toUpperCase()} · {scene.etiquette.toUpperCase()}
    </div>
    <div style={{position: 'absolute', top: 320, left: 100, right: 170, ...texte(32), opacity: 0.75}}>{scene.serie}</div>
    <Bulle texte={scene.replique} queue="bas-droite" style={{top: 400, left: 90, right: 170}} taille={78} />
    <Perso nom={scene.nom} etat="signature" largeur={470} style={{position: 'absolute', top: 760, right: 150}} />
    <Matou etat={scene.matou} largeur={420} style={{position: 'absolute', top: 1140, left: 70}} />
    <Bulle texte={scene.reponse} queue="gauche" police="texte" taille={50} style={{top: 1250, left: 520, width: 410}} />
  </AbsoluteFill>
);

/** Les quatre seconds rôles en situation, en quatre images de vidéo réduites. */
export const ScenesBande: React.FC = () => (
  <AbsoluteFill style={{background: C.encre}}>
    <DefsBouillonne />
    {SCENES.map((s, i) => (
      <div
        key={s.nom}
        style={{
          position: 'absolute',
          width: 1080,
          height: 1920,
          left: (i % 2) * 540,
          top: Math.floor(i / 2) * 960,
          transform: 'scale(0.5)',
          transformOrigin: 'top left',
          outline: `6px solid ${C.encre}`,
        }}
      >
        <ImageScene scene={s} />
      </div>
    ))}
  </AbsoluteFill>
);
