import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DefsBouillonne} from './components/Bouillonne';
import {FondCahier} from './components/FondCahier';
import {HypeMetre} from './components/HypeMetre';
import {ICONES, Icone} from './components/Icones';
import {Tampon} from './components/Tampon';
import {TexteMarque} from './components/TexteMarque';
import {chargerPolices} from './fonts';
import {Matou} from './mascot/Matou';
import {ETATS} from './mascot/MatouSvg';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from './theme';

chargerPolices();

// Planches du design system, rendues en PNG pour docs/design-system.md (npm run stills -- planches).

const Titre: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: POLICE_TITRE, fontSize: 46, color: C.encre, margin: '28px 0 12px'}}>{children}</div>
);
const Petit: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: POLICE_TEXTE, fontVariationSettings: AXES_TEXTE, fontWeight: 700, fontSize: 24, color: C.encre, ...style}}>
    {children}
  </div>
);

const NUANCIER: [string, string][] = [
  ['papier', C.papier],
  ['carreau', C.carreau],
  ['marge', C.marge],
  ['encre', C.encre],
  ['graphite', C.graphite],
  ['surligneur', C.surligneur],
  ['main', C.main],
  ['stylo bleu', C.stylo.bleu],
  ['stylo vert', C.stylo.vert],
  ['stylo rouge', C.stylo.rouge],
  ['fluo rose', C.fluo.rose],
  ['fluo vert', C.fluo.vert],
  ['fluo bleu', C.fluo.bleu],
  ['fluo orange', C.fluo.orange],
];

export const PlancheMarque: React.FC = () => (
  <AbsoluteFill>
    <FondCahier />
    <DefsBouillonne />
    <div style={{position: 'absolute', inset: '70px 60px 60px 150px'}}>
      <div style={{fontFamily: POLICE_TITRE, fontSize: 84, lineHeight: 1}}>
        Le cahier de <TexteMarque texte="==Matou==" debut={-50} />
      </div>
      <Petit style={{fontSize: 30, marginTop: 8}}>Design system · @matou.ai</Petit>

      <Titre>Couleurs</Titre>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 14}}>
        {NUANCIER.map(([nom, c]) => (
          <div key={nom} style={{width: 106}}>
            <div style={{height: 70, background: c, border: `4px solid ${C.encre}`, borderRadius: 10}} />
            <Petit style={{fontSize: 19, marginTop: 4}}>{nom}</Petit>
            <Petit style={{fontSize: 16, opacity: 0.6}}>{c}</Petit>
          </div>
        ))}
      </div>

      <Titre>Typographies</Titre>
      <div style={{fontFamily: POLICE_TITRE, fontSize: 60, lineHeight: 1.1}}>Permanent Marker : titres</div>
      <div style={{fontFamily: POLICE_TEXTE, fontVariationSettings: AXES_TEXTE, fontWeight: 800, fontSize: 44, marginTop: 6}}>
        Shantell Sans : sous-titres, <TexteMarque texte="==mots clés==" debut={-50} />, cartes.
      </div>
      <Petit style={{marginTop: 6, opacity: 0.7}}>Accents vérifiés : é è ê à ç ù ô œ « » …</Petit>

      <Titre>Statut de l'info</Titre>
      <div style={{display: 'flex', gap: 28, alignItems: 'center', height: 80}}>
        <Tampon statut="annonce" debut={-30} taille={0.8} />
        <Tampon statut="disponible" debut={-30} taille={0.8} />
        <Tampon statut="rumeur" debut={-30} taille={0.8} />
      </div>

      <Titre>Icônes</Titre>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 18}}>
        {ICONES.map((n) => (
          <div key={n} style={{width: 92, textAlign: 'center'}}>
            <Icone nom={n} taille={72} />
            <Petit style={{fontSize: 17}}>{n}</Petit>
          </div>
        ))}
      </div>

      <div style={{transform: 'scale(0.78)', transformOrigin: '0 0', marginTop: 30}}>
        <HypeMetre verdict="prometteur" largeur={860} image={90} />
      </div>
    </div>
  </AbsoluteFill>
);

const LEGENDES: Record<(typeof ETATS)[number], string> = {
  neutre: 'neutre',
  parle: 'parle',
  enFait: '« En fait… »',
  surpris: 'surpris (hook)',
  sceptique: 'sceptique (rumeur)',
  reflechit: 'réfléchit',
  content: 'content (fin)',
  verdict: 'verdict',
};

export const PlancheMatou: React.FC = () => (
  <AbsoluteFill>
    <FondCahier />
    <DefsBouillonne />
    <div style={{position: 'absolute', inset: '70px 60px 60px 150px'}}>
      <div style={{fontFamily: POLICE_TITRE, fontSize: 84, lineHeight: 1}}>
        Les têtes de <TexteMarque texte="==Matou==" debut={-50} />
      </div>
      <Petit style={{fontSize: 30, marginTop: 8}}>8 expressions · verres = écrans</Petit>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 20px', marginTop: 40}}>
        {ETATS.map((e) => (
          <div key={e}>
            <Matou etat={e} largeur={400} verres={e === 'verdict' ? 'fusee' : undefined} />
            <Petit style={{fontSize: 30, marginTop: 12, textAlign: 'center'}}>{LEGENDES[e]}</Petit>
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
