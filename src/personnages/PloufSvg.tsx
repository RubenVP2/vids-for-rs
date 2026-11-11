import React from 'react';
import tokens from '../../brand/tokens.json';
import {Icone} from '../components/Icones';

// Plouf, le poisson rouge (prototype, docs/personnages.md) : le partenaire de Matou, sur le
// modèle des duos de vulgarisation où l'un pose les questions du public et l'autre explique.
// Il apporte la question, relance (« et pour moi, ça change quoi ? »), et oublie tout trois
// secondes après. Dessiné comme Matou : feutre noir, une seule couleur d'accent (orange).

const {encre, blanc, graphite, fluo, stylo} = tokens.colors;
const T = 12;
const trait = {fill: 'none', stroke: encre, strokeWidth: T, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const plein = (fill: string, epaisseur = T) => ({...trait, fill, strokeWidth: epaisseur});

export const ETATS_PLOUF = ['neutre', 'parle', 'surpris', 'question', 'compris'] as const;
export type EtatPlouf = (typeof ETATS_PLOUF)[number];

export type PloufSvgProps = {
  etat: EtatPlouf;
  /** Ouverture de la bouche, 0 à 1. */
  bouche?: number;
  clignement?: number;
  /** Le poisson nage dans son bocal : décalage horizontal, en unités du dessin. */
  nage?: number;
  /** Phase des bulles (0 à 1, boucle). */
  bulles?: number;
  filtre?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

const BOCAL = 'M 108 104 C 40 160 36 320 126 372 C 170 396 230 396 274 372 C 364 320 360 160 292 104 Z';

export const PloufSvg: React.FC<PloufSvgProps> = ({etat, bouche = 0, clignement = 0, nage = 0, bulles = 0, filtre, width = 400, height = 420, style}) => {
  const o = etat === 'parle' || etat === 'question' ? Math.max(bouche, 0.35) : etat === 'surpris' ? Math.max(bouche, 0.6) : bouche;
  const id = `plouf-eau-${etat}`;
  const yeuxFermes = clignement > 0.6;
  return (
    <svg viewBox="0 0 400 420" width={width} height={height} style={{overflow: 'visible', ...style}} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={id}>
          <path d={BOCAL} />
        </clipPath>
      </defs>
      <g filter={filtre ? `url(#${filtre})` : undefined}>
        <path fill={blanc} opacity={0.7} d={BOCAL} />
        <g clipPath={`url(#${id})`}>
          <path fill={fluo.bleu} opacity={0.55} d="M 20 168 C 120 182 260 156 380 170 L 380 420 L 20 420 Z" />
          <path fill="none" stroke={stylo.bleu} strokeWidth={6} strokeLinecap="round" d="M 20 168 C 120 182 260 156 380 170" />
          <g fill={graphite}>
            <circle cx={150} cy={378} r={10} />
            <circle cx={176} cy={384} r={8} />
            <circle cx={226} cy={382} r={11} />
            <circle cx={256} cy={374} r={8} />
          </g>
          {/* bulles qui montent depuis la bouche */}
          <g {...trait} strokeWidth={6}>
            {[0, 0.5].map((dec) => {
              const p = (bulles + dec) % 1;
              return <circle key={dec} cx={104 + nage - p * 14} cy={262 - p * 90} r={5 + p * 6} opacity={1 - p * 0.6} />;
            })}
          </g>
        </g>
        <g transform={`translate(${nage} 0)`}>
          <path {...plein(fluo.orange, 10)} d="M 252 262 C 284 230 312 226 320 236 C 310 262 310 286 320 306 C 308 316 280 306 252 284 Z" />
          <path {...plein(fluo.orange, 10)} d="M 158 230 C 176 196 218 200 228 236 Z" />
          <path {...plein(fluo.orange)} d="M 108 272 C 116 222 200 210 252 250 C 264 262 264 282 252 294 C 200 334 116 322 108 272 Z" />
          <path {...trait} strokeWidth={8} d="M 214 258 C 224 272 222 290 210 300" />
          {(
            [
              [196, 250, 21],
              [150, 256, 25],
            ] as const
          ).map(([x, y, r]) => (
            <g key={x}>
              <circle cx={x} cy={y} r={r} {...plein(blanc, 8)} />
              {etat === 'compris' ? (
                <path {...trait} strokeWidth={8} d={`M ${x - 12} ${y + 4} C ${x - 6} ${y - 8} ${x + 6} ${y - 8} ${x + 12} ${y + 4}`} />
              ) : yeuxFermes ? (
                <path {...trait} strokeWidth={8} d={`M ${x - 11} ${y} L ${x + 11} ${y}`} />
              ) : etat === 'question' ? (
                <circle cx={x - 4} cy={y - 9} r={8} fill={encre} />
              ) : (
                <>
                  <circle cx={x - 5} cy={y + 3} r={etat === 'surpris' ? 13 : 9} fill={encre} />
                  {etat === 'surpris' ? <circle cx={x - 1} cy={y - 2} r={4} fill={blanc} /> : null}
                </>
              )}
            </g>
          ))}
          {o > 0.05 ? (
            <ellipse cx={120} cy={286} rx={9} ry={6 + 10 * o} fill={encre} />
          ) : etat === 'compris' ? (
            <path {...trait} strokeWidth={7} d="M 112 282 C 116 292 126 292 130 282" />
          ) : (
            <circle cx={120} cy={284} r={7} {...trait} strokeWidth={7} />
          )}
        </g>
        {/* le bocal */}
        <path {...trait} d="M 108 104 C 40 160 36 320 126 372 C 170 396 230 396 274 372 C 364 320 360 160 292 104" />
        <path {...trait} d="M 96 104 C 150 90 250 90 304 104 C 250 118 150 118 96 104 Z" />
        <path fill="none" stroke={blanc} strokeWidth={10} strokeLinecap="round" d="M 300 160 C 322 200 326 250 312 290" opacity={0.9} />
        {etat === 'question' ? (
          <g>
            <path {...trait} strokeWidth={14} d="M 168 26 C 166 -8 232 -14 234 18 C 236 42 204 44 202 70" />
            <circle cx={202} cy={92} r={9} fill={encre} />
          </g>
        ) : null}
        {etat === 'compris' ? (
          <g transform="translate(160 -6)">
            <Icone nom="ampoule" taille={84} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
