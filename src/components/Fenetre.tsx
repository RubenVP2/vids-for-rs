import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE, tokens} from '../theme';
import {FILTRE_BOUILLONNE} from './Bouillonne';
import {useMiroir} from './MiseEnPage';
import {TexteMarque} from './TexteMarque';

type Message = {de: 'toi' | 'app'; texte: string};

// Fenêtre d'app dessinée au feutre : montrer la chose plutôt que la raconter. C'est une
// reconstitution (mention en bas à droite) : les messages disent ce que la source annonce.
export const Fenetre: React.FC<{
  app: string;
  messages: Message[];
  /** Image d'apparition de chaque bulle (relative à la scène) ; absent : toutes déjà là. */
  apparitions?: number[];
  largeur: number;
  rotation?: number;
}> = ({app, messages, apparitions, largeur, rotation = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const penche = useMiroir() ? -rotation : rotation;
  const texte: React.CSSProperties = {fontFamily: POLICE_TEXTE, fontVariationSettings: AXES_TEXTE, fontWeight: 800, color: C.encre};
  return (
    <div style={{position: 'relative', width: largeur, transform: `rotate(${penche}deg)`, padding: '0 0 30px'}}>
      <div style={{position: 'absolute', inset: 0, transform: 'translate(9px, 11px)', background: C.encre, opacity: 0.12, borderRadius: 30}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.blanc,
          border: `8px solid ${C.encre}`,
          borderRadius: 30,
          filter: `url(#${FILTRE_BOUILLONNE})`,
        }}
      />
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '26px 34px 22px', borderBottom: `6px solid ${C.encre}`}}>
        {[C.fluo.rose, C.fluo.jaune, C.fluo.vert].map((c) => (
          <div key={c} style={{width: 26, height: 26, borderRadius: 13, background: c, border: `4px solid ${C.encre}`}} />
        ))}
        <div style={{fontFamily: POLICE_TITRE, fontSize: 46, marginLeft: 14, color: C.encre}}>{app}</div>
      </div>
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 22, padding: '28px 34px 0'}}>
        {messages.map((m, i) => {
          const debut = apparitions?.[i] ?? -100;
          const s = spring({frame: frame - debut, fps, config: tokens.mouvement.ressort});
          const toi = m.de === 'toi';
          return (
            <div
              key={i}
              style={{
                ...texte,
                fontSize: 44,
                lineHeight: 1.15,
                alignSelf: toi ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                padding: '16px 26px',
                borderRadius: 26,
                border: `5px solid ${C.encre}`,
                background: toi ? C.fluo.bleu : '#F3F0E8',
                opacity: frame < debut ? 0 : 1,
                transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                transformOrigin: toi ? 'bottom right' : 'bottom left',
              }}
            >
              <TexteMarque texte={m.texte} debut={debut + 6} />
            </div>
          );
        })}
      </div>
      <div style={{...texte, position: 'relative', fontSize: 22, fontWeight: 700, opacity: 0.5, textAlign: 'right', padding: '14px 34px 0'}}>
        reconstitution
      </div>
    </div>
  );
};
