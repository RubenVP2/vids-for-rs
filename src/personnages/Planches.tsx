import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DefsBouillonne, FILTRE_BOUILLONNE} from '../components/Bouillonne';
import {FondCahier} from '../components/FondCahier';
import {TexteMarque} from '../components/TexteMarque';
import {chargerPolices} from '../fonts';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE} from '../theme';
import {ETATS_PLOUF, type EtatPlouf, PloufSvg} from './PloufSvg';

chargerPolices();

// Planche de Plouf (prototype, docs/personnages.md) : npm run stills -- planches → docs/images/planche-plouf.png.

const LEGENDES: Record<EtatPlouf, string> = {
  neutre: 'neutre (il écoute)',
  parle: 'parle',
  surpris: 'surpris',
  question: 'il pose la question',
  compris: 'il a compris',
};

export const PlanchePlouf: React.FC = () => (
  <AbsoluteFill>
    <FondCahier />
    <DefsBouillonne />
    <div style={{position: 'absolute', inset: '70px 60px 60px 150px'}}>
      <div style={{fontFamily: POLICE_TITRE, fontSize: 84, lineHeight: 1, color: C.encre}}>
        Les têtes de <TexteMarque texte="==Plouf==" debut={-50} />
      </div>
      <div style={{fontFamily: POLICE_TEXTE, fontVariationSettings: AXES_TEXTE, fontWeight: 700, fontSize: 30, marginTop: 8, color: C.encre}}>
        Il pose tes questions à Matou, puis il les oublie
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px 20px', marginTop: 70}}>
        {ETATS_PLOUF.map((e) => (
          <div key={e} style={{textAlign: 'center'}}>
            <PloufSvg etat={e} width={330} height={346} filtre={FILTRE_BOUILLONNE} bouche={e === 'parle' ? 0.6 : 0} />
            <div style={{fontFamily: POLICE_TEXTE, fontVariationSettings: AXES_TEXTE, fontWeight: 700, fontSize: 30, marginTop: 14, color: C.encre}}>
              {LEGENDES[e]}
            </div>
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
