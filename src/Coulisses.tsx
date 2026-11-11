import React from 'react';
import {AbsoluteFill} from 'remotion';
import {z} from 'zod';
import {DefsBouillonne} from './components/Bouillonne';
import {Carte} from './components/Carte';
import {Icone, ICONES} from './components/Icones';
import {TexteMarque} from './components/TexteMarque';
import {chargerPolices} from './fonts';
import {Matou} from './mascot/Matou';
import {ETATS} from './mascot/MatouSvg';
import {FondCahier} from './components/FondCahier';
import {AXES_TEXTE, C, POLICE_TEXTE, POLICE_TITRE} from './theme';

chargerPolices();

// Post LinkedIn de la semaine (brand/linkedin.json, skill linkedin) : un carrousel 4:5 écrit
// par l'agent dans linkedin/<semaine>/post.json, rendu par npm run linkedin. Deux modes :
// « reponse » (retour d'expérience tiré de la réponse de la semaine) et « coulisses » (une
// histoire vraie du dépôt : décision, panne, chiffre d'un bilan).

const diapo = z.object({
  /** Le titre de la diapo, 2 à 8 mots ; ==mot== surligne. */
  titre: z.string().min(1).max(60),
  /** Une ou deux phrases. */
  texte: z.string().min(1).max(220),
  /** Un chiffre géant, s'il porte la diapo (tiré des sources). */
  chiffre: z.string().min(1).max(10).optional(),
  icone: z.enum(ICONES).optional(),
});

export const postLinkedinSchema = z.object({
  /** Semaine ISO, « 2026-S46 » : le nom du dossier. */
  semaine: z.string().regex(/^\d{4}-S\d{2}$/),
  mode: z.enum(['reponse', 'coulisses']),
  /** Mode reponse : l'id de la question (brand/linkedin.json). */
  question: z.string().optional(),
  /** La couverture : la promesse du carrousel, 3 à 9 mots. */
  titre: z.string().min(1).max(70),
  matou: z.enum(ETATS).default('enFait'),
  diapos: z.array(diapo).min(3).max(6),
  /** Dernière diapo de contenu : ce qu'on en retient. */
  lecon: z.object({titre: z.string().min(1).max(60), texte: z.string().min(1).max(220)}),
  /** Le texte du post LinkedIn (accroche ≤ 210 caractères, question finale, ≤ 3 hashtags, aucune URL). */
  texte: z.string().min(200).max(3000),
  /** D'où vient chaque fait : « réponse de la semaine », ou un fichier du dépôt (docs/decisions.md…). */
  sources: z.array(z.string().min(3)).min(1),
});
export type PostLinkedin = z.infer<typeof postLinkedinSchema>;

export const DIAPO_LI = {largeur: 1080, hauteur: 1350};
const MARGE = 90;
/** Couverture, une diapo par idée, la leçon, la fin. */
export const nombreDiapos = (post: PostLinkedin) => post.diapos.length + 3;

export const diapoLinkedinProps = z.object({post: postLinkedinSchema, index: z.number().int().min(0)});

const texte = (taille: number): React.CSSProperties => ({
  fontFamily: POLICE_TEXTE,
  fontVariationSettings: AXES_TEXTE,
  fontWeight: 800,
  fontSize: taille,
  lineHeight: 1.22,
  color: C.encre,
});
const titre = (taille: number): React.CSSProperties => ({fontFamily: POLICE_TITRE, fontSize: taille, lineHeight: 1.08, color: C.encre});
const M: React.FC<{t: string}> = ({t}) => <TexteMarque texte={t} debut={-100} />;

export const DiapoLinkedin: React.FC<z.infer<typeof diapoLinkedinProps>> = ({post, index}) => {
  const total = nombreDiapos(post);
  const i = Math.min(index, total - 1);
  const derniere = i === total - 1;
  const bandeau = post.mode === 'reponse' ? "RETOUR D'EXPÉRIENCE" : 'COULISSES DE MATOU';
  const contenu = i >= 1 && i <= post.diapos.length ? post.diapos[i - 1] : undefined;
  return (
    <AbsoluteFill>
      <FondCahier />
      <DefsBouillonne />
      <div style={{position: 'absolute', top: 70, left: MARGE, right: MARGE, display: 'flex', alignItems: 'center'}}>
        <div style={{...titre(42), background: C.surligneur, padding: '2px 18px', transform: 'rotate(-2deg)'}}>{bandeau}</div>
        <div style={{...texte(36), marginLeft: 'auto', opacity: 0.7}}>
          {i + 1}/{total}
        </div>
      </div>

      <div style={{position: 'absolute', top: 200, bottom: 190, left: MARGE, right: MARGE, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {i === 0 ? (
          <>
            <div style={{...titre(post.titre.length > 45 ? 100 : 118), textAlign: 'center', transform: 'rotate(-2deg)'}}>
              <M t={post.titre} />
            </div>
            <Matou etat={post.matou} largeur={460} style={{marginTop: 50}} />
          </>
        ) : contenu ? (
          <>
            <div style={{...titre(64), color: C.stylo.bleu, alignSelf: 'flex-start', marginBottom: 10}}>{String(i).padStart(2, '0')}</div>
            {contenu.chiffre ? (
              <div style={{...titre(230), transform: 'rotate(-3deg)', marginBottom: 20}}>
                <M t={`==${contenu.chiffre}==`} />
              </div>
            ) : contenu.icone ? (
              <Icone nom={contenu.icone} taille={170} style={{marginBottom: 30}} />
            ) : null}
            <div style={{...titre(86), textAlign: 'center', transform: 'rotate(-1.5deg)'}}>
              <M t={contenu.titre} />
            </div>
            <Carte largeur={880} hauteur={contenu.texte.length > 140 ? 400 : 330} style={{marginTop: 50}}>
              <div style={{...texte(contenu.texte.length > 140 ? 44 : 50), margin: 'auto 0'}}>
                <M t={contenu.texte} />
              </div>
            </Carte>
          </>
        ) : !derniere ? (
          <>
            <div style={{...titre(56), background: C.encre, color: C.blanc, padding: '4px 22px', transform: 'rotate(-2deg)', marginBottom: 40}}>
              CE QU'ON EN RETIENT
            </div>
            <div style={{...titre(96), textAlign: 'center', transform: 'rotate(-1.5deg)'}}>
              <M t={post.lecon.titre} />
            </div>
            <Carte largeur={880} hauteur={360} fond={C.surligneur} rotation={1.5} style={{marginTop: 50}}>
              <div style={{...texte(50), margin: 'auto 0'}}>
                <M t={post.lecon.texte} />
              </div>
            </Carte>
          </>
        ) : (
          <>
            <Matou etat="content" largeur={440} />
            <div style={{...titre(90), textAlign: 'center', marginTop: 30}}>
              <M t="L'IA, ==testée pour de vrai==, chaque semaine" />
            </div>
            <div style={{...texte(50), textAlign: 'center', marginTop: 36}}>Et toi, tu en as fait quoi ? Dis-le en commentaire ☝️</div>
          </>
        )}
      </div>

      <div style={{position: 'absolute', bottom: 70, left: MARGE, right: MARGE, display: 'flex', alignItems: 'flex-end'}}>
        <div style={{...texte(28), opacity: 0.8, whiteSpace: 'nowrap'}}>Matou AI · {post.mode === 'reponse' ? 'du vécu' : 'nos propres chiffres'}</div>
        {derniere ? null : <div style={{...titre(56), marginLeft: 'auto', whiteSpace: 'nowrap', transform: 'rotate(-3deg)'}}>Glisse →</div>}
      </div>
    </AbsoluteFill>
  );
};
