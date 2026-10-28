import React from 'react';
import tokens from '../../brand/tokens.json';
import {Icone, type IconeNom} from '../components/Icones';

// Matou, redessiné en vectoriel depuis brand/references/matou-reference.png.
// Ce composant est « pur » (aucune dépendance à Remotion) : il sert à la fois
// au moteur vidéo et à l'export des SVG statiques (npm run brand).

export const ETATS = [
  'neutre',
  'parle',
  'enFait',
  'surpris',
  'sceptique',
  'reflechit',
  'content',
  'verdict',
] as const;
export type EtatMatou = (typeof ETATS)[number];

export type MatouSvgProps = {
  etat: EtatMatou;
  /** Ouverture de la bouche, de 0 (fermée) à 1 (grande ouverte). */
  bouche?: number;
  /** Ce qu'affichent les verres : les yeux, une icône, ou un chargement. */
  verres?: 'yeux' | 'chargement' | IconeNom;
  /** Rotation du chargement dans les verres, en degrés. */
  chargement?: number;
  /** Id du filtre « trait qui bouillonne » à appliquer (défini par le parent). */
  filtre?: string;
  /** Clignement des yeux, de 0 (ouverts) à 1 (fermés). */
  clignement?: number;
  /** Décalage du regard en unités du dessin (x, y). */
  regard?: [number, number];
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

const {encre, blanc, graphite, main, mainContour} = tokens.colors;
const T = 12; // épaisseur du feutre, en unités du dessin (viewBox 520×400)

const trait = {
  fill: 'none',
  stroke: encre,
  strokeWidth: T,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Verres : rectangles un peu de travers, comme au feutre.
const VERRE_G = 'M 76 128 L 209 125 L 211 219 L 78 222 Z';
const VERRE_D = 'M 306 127 L 430 125 L 429 214 L 307 217 Z';
const CENTRE_G: [number, number] = [143, 174];
const CENTRE_D: [number, number] = [368, 171];

// Silhouette blanche (tête + corps d'un seul bloc), sous les traits.
const SILHOUETTE =
  'M 104 110 C 112 75 140 44 165 41 C 186 40 206 62 226 76 L 309 76 C 326 60 345 38 361 37 C 388 40 414 78 426 108 ' +
  'L 430 225 C 428 245 420 258 412 270 C 398 290 384 315 381 352 L 165 358 C 152 350 149 330 150 280 L 150 224 L 104 112 Z';

const Tete = () => (
  <path
    {...trait}
    d="M 104 112 C 110 80 138 46 165 41 C 186 40 205 60 226 76 L 309 76 C 326 60 345 39 361 37 C 386 40 412 76 426 106"
  />
);

const Corps = () => (
  <>
    {/* flanc gauche, sous la main */}
    <path {...trait} d="M 150 282 C 149 305 150 330 153 348 C 156 356 162 359 168 358" />
    {/* bas du corps, deux petites pattes */}
    <path {...trait} d="M 168 358 C 200 354 240 356 270 355 C 310 354 345 353 381 352 C 384 344 382 328 383 318" />
    <path {...trait} d="M 214 357 C 216 348 222 345 228 352" strokeWidth={T * 0.7} />
    <path {...trait} d="M 322 354 C 326 346 333 344 338 351" strokeWidth={T * 0.7} />
    {/* joue droite qui file vers le bras */}
    <path {...trait} d="M 429 232 C 428 246 422 258 414 266" />
    {/* bras droit replié */}
    <path {...trait} d="M 366 274 C 382 270 400 268 414 266" />
    {/* flanc droit */}
    <path {...trait} d="M 408 276 C 398 290 388 302 384 318" />
  </>
);

const Moustaches = () => (
  <g {...trait} strokeWidth={T * 0.85}>
    <path d="M 28 148 L 62 158" />
    <path d="M 20 178 L 62 176" />
    <path d="M 30 204 L 62 192" />
    <path d="M 474 150 L 444 159" />
    <path d="M 492 178 L 446 176" />
    <path d="M 482 204 L 446 191" />
  </g>
);

const Rayures = () => (
  <g {...trait} stroke={graphite} strokeWidth={T * 0.8}>
    <path d="M 238 94 L 240 126" />
    <path d="M 260 94 L 261 128" />
    <path d="M 288 94 L 286 124" />
  </g>
);

// La « cicatrice de bug » sur le ventre.
const Cicatrice = () => (
  <g {...trait} stroke={graphite} strokeWidth={T * 0.75}>
    <path d="M 248 308 L 262 322" />
    <path d="M 262 306 L 249 324" />
  </g>
);

const Bouche = ({ouverture, etat}: {ouverture: number; etat: EtatMatou}) => {
  const o = Math.max(0, Math.min(1, ouverture));
  if (etat === 'sceptique' && o < 0.05) {
    // bouche en biais, une seule dent qui dépasse
    return (
      <g>
        <path {...trait} d="M 222 236 C 248 232 272 228 300 222" />
        <path {...trait} fill={blanc} strokeWidth={T * 0.8} d="M 252 233 L 254 254 L 272 252 L 271 230" />
      </g>
    );
  }
  const haut = 228;
  const creux = 10 + o * 46; // profondeur de la bouche ouverte
  const sourire = etat === 'content' ? 10 : 0;
  return (
    <g>
      {o > 0.05 || etat === 'content' || etat === 'surpris' ? (
        <path
          d={`M 216 ${haut} C 240 ${haut + 2} 280 ${haut + 2} 300 ${haut} C 296 ${haut + creux + sourire} 272 ${haut + creux + 8 + sourire} 258 ${haut + creux + 8 + sourire} C 242 ${haut + creux + 8 + sourire} 222 ${haut + creux + sourire} 216 ${haut} Z`}
          fill={encre}
          stroke={encre}
          strokeWidth={T * 0.8}
          strokeLinejoin="round"
        />
      ) : null}
      {/* lèvre du haut */}
      <path {...trait} d={`M 214 ${haut - 2} C 240 ${haut} 276 ${haut + 1} 302 ${haut - 1}`} />
      {/* les deux dents de lapin, accrochées à la lèvre du haut */}
      <path
        {...trait}
        fill={blanc}
        strokeWidth={T * 0.8}
        d={`M 228 ${haut} L 230 ${haut + 32} L 278 ${haut + 31} L 279 ${haut}`}
      />
      <path {...trait} strokeWidth={T * 0.7} d={`M 254 ${haut + 2} L 254 ${haut + 30}`} />
    </g>
  );
};

const Yeux = ({
  etat,
  clignement,
  regard,
}: {
  etat: EtatMatou;
  clignement: number;
  regard: [number, number];
}) => {
  const [rx, ry] = regard;
  if (etat === 'content') {
    return (
      <g {...trait} strokeWidth={T * 0.85}>
        <path d="M 120 190 C 128 176 146 176 154 190" />
        <path d="M 360 188 C 368 174 386 174 394 188" />
      </g>
    );
  }
  if (clignement > 0.6) {
    return (
      <g {...trait} strokeWidth={T * 0.8}>
        <path d={`M ${116 + rx} ${192 + ry} L ${140 + rx} ${192 + ry}`} />
        <path d={`M ${374 + rx} ${190 + ry} L ${398 + rx} ${190 + ry}`} />
      </g>
    );
  }
  const r = etat === 'surpris' ? 15 : 10;
  // Position de base des pupilles : en bas, vers l'extérieur (comme le dessin).
  let gx = 128,
    gy = 192,
    dx = 386,
    dy = 190;
  if (etat === 'reflechit') {
    gx = 168;
    gy = 150;
    dx = 404;
    dy = 148;
  }
  if (etat === 'surpris') {
    gx = 143;
    gy = 176;
    dx = 368;
    dy = 172;
  }
  return (
    <g>
      <circle cx={gx + rx} cy={gy + ry} r={r} fill={encre} />
      <circle cx={dx + rx} cy={dy + ry} r={r} fill={encre} />
      {etat === 'surpris' ? (
        <>
          <circle cx={gx + rx + 5} cy={gy + ry - 5} r={4} fill={blanc} />
          <circle cx={dx + rx + 5} cy={dy + ry - 5} r={4} fill={blanc} />
        </>
      ) : null}
      {etat === 'sceptique' ? (
        // paupière lourde sur l'œil droit
        <path {...trait} strokeWidth={T * 0.8} d={`M ${dx - 22} ${dy - 6} L ${dx + 22} ${dy - 2}`} />
      ) : null}
    </g>
  );
};

// Sourcils au-dessus des lunettes : ils portent l'émotion.
const Sourcils = ({etat}: {etat: EtatMatou}) => {
  const s = {...trait, strokeWidth: T * 0.8};
  switch (etat) {
    case 'surpris':
      return (
        <g {...s}>
          <path d="M 110 100 C 128 88 152 88 170 98" />
          <path d="M 336 96 C 354 86 378 86 396 96" />
        </g>
      );
    case 'sceptique':
      return (
        <g {...s}>
          <path d="M 112 110 C 130 104 150 104 168 110" />
          <path d="M 336 104 C 356 108 376 112 396 118" />
        </g>
      );
    case 'enFait':
    case 'verdict':
      return (
        <g {...s}>
          <path d="M 112 108 C 130 98 150 98 168 106" />
          <path d="M 336 104 C 354 96 376 96 394 104" />
        </g>
      );
    default:
      return null;
  }
};

// La main jaune ☝️, redessinée (pas l'emoji) : poing avec l'index levé.
export const Main = ({leve, x, y, rotation = 0}: {leve: boolean; x: number; y: number; rotation?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    {/* poing */}
    <path
      d="M -34 -6 C -40 -22 -26 -32 -12 -28 L 18 -30 C 32 -30 38 -18 36 -4 C 38 14 30 32 10 36 C -10 40 -30 32 -36 14 Z"
      fill={main}
      stroke={mainContour}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    {/* plis des doigts repliés */}
    <g fill="none" stroke={mainContour} strokeWidth={4.5} strokeLinecap="round">
      <path d="M -24 -4 C -26 6 -24 14 -20 18" />
      <path d="M -10 -2 C -12 8 -10 16 -6 20" />
      <path d="M 4 0 C 2 10 4 18 8 22" />
    </g>
    {leve ? (
      // index levé
      <path
        d="M 6 -26 C 4 -48 6 -66 14 -74 C 22 -80 32 -74 32 -62 C 32 -48 30 -38 30 -26"
        fill={main}
        stroke={mainContour}
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ) : (
      <path d="M 8 -28 C 16 -40 30 -38 32 -26" fill={main} stroke={mainContour} strokeWidth={6} strokeLinecap="round" />
    )}
  </g>
);

const Verres = ({
  verres,
  chargement,
}: {
  verres: NonNullable<MatouSvgProps['verres']>;
  chargement: number;
}) => {
  if (verres === 'yeux') return null;
  if (verres === 'chargement') {
    return (
      <g>
        {[CENTRE_G, CENTRE_D].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${chargement})`}>
            <path d="M 0 -28 A 28 28 0 1 1 -28 0" fill="none" stroke={encre} strokeWidth={9} strokeLinecap="round" />
          </g>
        ))}
      </g>
    );
  }
  return (
    <g>
      {[CENTRE_G, CENTRE_D].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx - 38} ${cy - 38})`}>
          <Icone nom={verres} taille={76} />
        </g>
      ))}
    </g>
  );
};

export const MatouSvg: React.FC<MatouSvgProps> = ({
  etat,
  bouche = 0,
  verres = 'yeux',
  chargement = 0,
  filtre,
  clignement = 0,
  regard = [0, 0],
  width = 520,
  height = 400,
  style,
}) => {
  const ouverture = etat === 'parle' ? Math.max(bouche, 0.3) : etat === 'surpris' ? Math.max(bouche, 0.6) : bouche;
  const mainLevee = etat === 'enFait' || etat === 'verdict';
  return (
    <svg
      viewBox="0 0 520 400"
      width={width}
      height={height}
      style={{overflow: 'visible', ...style}}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter={filtre ? `url(#${filtre})` : undefined}>
        <path d={SILHOUETTE} fill={blanc} />
        <Tete />
        <Rayures />
        <Sourcils etat={etat} />
        <Moustaches />
        {/* verres : fond blanc puis monture */}
        <path d={VERRE_G} fill={blanc} />
        <path d={VERRE_D} fill={blanc} />
        {verres === 'yeux' ? <Yeux etat={etat} clignement={clignement} regard={regard} /> : null}
        <Verres verres={verres} chargement={chargement} />
        <path {...trait} d={VERRE_G} />
        <path {...trait} d={VERRE_D} />
        <path {...trait} d="M 211 172 C 240 168 276 168 306 171" />
        <Bouche ouverture={ouverture} etat={etat} />
        <Corps />
        <Cicatrice />
        {/* bras gauche vers la main */}
        <path {...trait} d="M 130 262 C 152 262 172 264 192 266" />
        {mainLevee ? <Main leve x={96} y={292} rotation={-4} /> : <Main leve={false} x={112} y={306} rotation={8} />}
        {etat === 'reflechit' ? (
          <g fill={encre}>
            <circle cx={452} cy={96} r={7} />
            <circle cx={476} cy={70} r={10} />
            <circle cx={506} cy={38} r={14} />
          </g>
        ) : null}
        {etat === 'enFait' ? (
          // petits traits d'éclat autour du doigt
          <g {...trait} strokeWidth={T * 0.6}>
            <path d="M 50 232 L 34 220" />
            <path d="M 42 262 L 22 262" />
            <path d="M 50 292 L 34 304" />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
