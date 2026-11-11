import React from 'react';
import tokens from '../../brand/tokens.json';

// La bande de Matou (prototype, docs/personnages.md) : quatre seconds rôles dessinés comme
// lui (feutre noir, corps blanc, une seule couleur d'accent chacun). Composants « purs »,
// comme MatouSvg : pas de dépendance à Remotion.
//
// - Bip : l'IA elle-même, un vieil écran sûr de lui, qui se trompe avec aplomb ;
// - Coco : le perroquet du marketing, qui répète les communiqués au mégaphone ;
// - Plouf : le poisson rouge, le spectateur qui pose la question (et l'oublie) ;
// - Cookie : la souris d'ordinateur qui ramasse tes données (arnaques, vie privée).

const {encre, blanc, graphite, fluo, stylo} = tokens.colors;
const T = 12;
const trait = {
  fill: 'none',
  stroke: encre,
  strokeWidth: T,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
const plein = (fill: string, epaisseur = T) => ({...trait, fill, strokeWidth: epaisseur});

export const ETATS_PERSO = ['neutre', 'parle', 'surpris', 'signature'] as const;
export type EtatPerso = (typeof ETATS_PERSO)[number];

export type PersoProps = {
  etat: EtatPerso;
  /** Ouverture de la bouche, 0 à 1. */
  bouche?: number;
  clignement?: number;
  filtre?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

const Cadre: React.FC<PersoProps & {children: React.ReactNode}> = ({filtre, width = 400, height = 420, style, children}) => (
  <svg viewBox="0 0 400 420" width={width} height={height} style={{overflow: 'visible', ...style}} xmlns="http://www.w3.org/2000/svg">
    <g filter={filtre ? `url(#${filtre})` : undefined}>{children}</g>
  </svg>
);

const ouvertureDe = ({etat, bouche = 0}: PersoProps) =>
  etat === 'parle' ? Math.max(bouche, 0.4) : etat === 'surpris' ? Math.max(bouche, 0.6) : etat === 'signature' ? Math.max(bouche, 0.5) : bouche;

// ---------------------------------------------------------------- Bip : l'IA

const ECRAN = 'M 104 96 L 296 90 L 300 226 L 102 232 Z';

const VisageBip: React.FC<PersoProps> = (p) => {
  const o = ouvertureDe(p);
  if (p.etat === 'signature') {
    // « Bien sûr ! » : yeux en accent circonflexe, grand sourire, sûr de lui.
    return (
      <g>
        <path {...trait} strokeWidth={11} d="M 138 152 L 158 126 L 178 150" />
        <path {...trait} strokeWidth={11} d="M 220 150 L 240 124 L 260 148" />
        <path {...plein(encre, 8)} d="M 156 176 L 248 172 C 244 210 214 220 200 220 C 182 220 160 208 156 176 Z" />
        <path fill={blanc} d="M 170 180 L 236 177 L 234 190 L 172 192 Z" />
      </g>
    );
  }
  const yeux =
    (p.clignement ?? 0) > 0.6 ? (
      <g {...trait} strokeWidth={10}>
        <path d="M 144 146 L 172 145" />
        <path d="M 226 144 L 254 143" />
      </g>
    ) : p.etat === 'surpris' ? (
      <g fill={encre}>
        <rect x={140} y={118} width={34} height={42} />
        <rect x={222} y={116} width={34} height={42} />
        <rect x={160} y={122} width={10} height={10} fill={blanc} />
        <rect x={242} y={120} width={10} height={10} fill={blanc} />
      </g>
    ) : (
      <g fill={encre}>
        <rect x={146} y={126} width={24} height={30} />
        <rect x={228} y={124} width={24} height={30} />
      </g>
    );
  const bouche =
    o > 0.05 ? (
      <rect x={p.etat === 'surpris' ? 186 : 170} y={184} width={p.etat === 'surpris' ? 28 : 60} height={8 + 30 * o} fill={encre} />
    ) : (
      <path {...trait} strokeWidth={10} d="M 170 194 L 230 192" />
    );
  return (
    <g>
      {yeux}
      {bouche}
    </g>
  );
};

export const BipSvg: React.FC<PersoProps> = (p) => (
  <Cadre {...p}>
    {/* antennes */}
    <path {...trait} d="M 178 30 L 150 -6" />
    <circle cx={146} cy={-12} r={11} fill={encre} />
    <path {...trait} d="M 224 28 L 260 -14" />
    <circle cx={265} cy={-20} r={12} {...plein(fluo.rose, 7)} />
    {/* dessus du boîtier, en perspective */}
    <path {...plein(blanc)} d="M 92 62 L 124 26 L 284 22 L 318 56 Z" />
    {/* bras */}
    <path {...trait} d="M 62 172 C 34 184 24 210 30 236" />
    <circle cx={32} cy={248} r={17} {...plein(blanc, 9)} />
    {p.etat === 'signature' ? (
      <>
        {/* bras levé, sûr de lui */}
        <path {...trait} d="M 340 168 C 372 150 384 118 380 92" />
        <circle cx={380} cy={80} r={17} {...plein(blanc, 9)} />
      </>
    ) : (
      <>
        <path {...trait} d="M 340 172 C 368 184 376 210 370 236" />
        <circle cx={368} cy={248} r={17} {...plein(blanc, 9)} />
      </>
    )}
    {/* jambes */}
    <path {...trait} d="M 150 286 L 146 350" />
    <path {...trait} d="M 250 284 L 256 350" />
    <ellipse cx={138} cy={356} rx={28} ry={11} fill={encre} />
    <ellipse cx={264} cy={356} rx={28} ry={11} fill={encre} />
    {/* façade */}
    <path {...plein(blanc)} d="M 64 60 L 336 54 L 342 282 L 60 288 Z" />
    {/* l'écran : le visage */}
    <path fill={fluo.bleu} d={ECRAN} />
    <path fill="none" stroke={blanc} strokeWidth={8} strokeLinecap="round" d="M 118 112 L 156 110" opacity={0.9} />
    <VisageBip {...p} />
    <path {...trait} d={ECRAN} />
    {/* grille et boutons */}
    <g {...trait} strokeWidth={6}>
      <path d="M 92 252 L 150 250" />
      <path d="M 92 266 L 150 264" />
    </g>
    <circle cx={252} cy={258} r={10} {...plein(blanc, 7)} />
    <circle cx={286} cy={257} r={10} {...plein(fluo.rose, 7)} />
    {p.etat === 'signature' ? (
      // petite étincelle de suffisance
      <g {...trait} strokeWidth={7}>
        <path d="M 30 70 L 30 104" />
        <path d="M 13 87 L 47 87" />
      </g>
    ) : null}
  </Cadre>
);

// ---------------------------------------------------------------- Coco : la hype

const BEC = 'M 172 156 C 176 136 228 136 232 156 C 236 186 220 212 200 226 C 196 208 184 186 172 156 Z';

export const CocoSvg: React.FC<PersoProps> = (p) => {
  const o = ouvertureDe(p);
  const crie = p.etat === 'signature';
  const pupille = p.etat === 'surpris' ? 15 : crie ? 7 : 11;
  return (
    <Cadre {...p}>
      {/* crête */}
      <path {...plein(fluo.rose, 10)} d="M 196 56 C 170 30 160 0 176 -14 C 196 4 204 30 204 54 Z" />
      <path {...plein(fluo.rose, 10)} d="M 204 54 C 206 22 222 -4 242 -8 C 246 16 228 40 212 58 Z" />
      <path {...plein(fluo.rose, 10)} d="M 192 60 C 166 48 140 40 128 18 C 152 12 178 30 196 52 Z" />
      {/* pattes */}
      <g {...trait} strokeWidth={9}>
        <path d="M 172 380 L 168 408" />
        <path d="M 150 410 L 186 410" />
        <path d="M 230 380 L 234 408" />
        <path d="M 216 410 L 252 410" />
      </g>
      {/* corps */}
      <path
        {...plein(blanc)}
        d="M 122 150 C 116 92 154 52 202 50 C 252 50 290 92 282 150 C 296 210 298 300 272 356 C 246 392 158 392 132 356 C 104 300 108 210 122 150 Z"
      />
      {/* plumes du ventre */}
      <g {...trait} stroke={graphite} strokeWidth={8}>
        <path d="M 172 284 L 182 296 L 192 284" />
        <path d="M 212 306 L 222 318 L 232 306" />
        <path d="M 184 334 L 194 346 L 204 334" />
      </g>
      {/* ailes */}
      <path {...plein(blanc)} d="M 124 182 C 92 212 86 282 112 326 C 128 302 140 262 138 210 Z" />
      <path {...trait} strokeWidth={7} d="M 104 300 L 120 288 M 100 270 L 120 262" />
      {crie ? (
        <path {...plein(blanc)} d="M 280 186 C 316 196 330 218 330 244 C 310 248 284 236 270 214 Z" />
      ) : (
        <>
          <path {...plein(blanc)} d="M 280 182 C 312 212 318 282 292 326 C 276 302 264 262 266 210 Z" />
          <path {...trait} strokeWidth={7} d="M 300 300 L 284 288 M 304 270 L 284 262" />
        </>
      )}
      {/* yeux */}
      {[164, 240].map((x) => (
        <g key={x}>
          <circle cx={x} cy={124} r={28} {...plein(blanc, 9)} />
          {(p.clignement ?? 0) > 0.6 ? (
            <path {...trait} strokeWidth={9} d={`M ${x - 14} 126 L ${x + 14} 126`} />
          ) : (
            <>
              <circle cx={x + (x < 200 ? 6 : -6)} cy={128} r={pupille} fill={encre} />
              {p.etat === 'surpris' ? <circle cx={x + (x < 200 ? 11 : -1)} cy={122} r={5} fill={blanc} /> : null}
            </>
          )}
        </g>
      ))}
      {/* bec : l'intérieur et la mandibule s'ouvrent sous le bec du haut */}
      {o > 0.05 ? (
        <>
          <path fill={encre} d={`M 176 168 C 180 ${196 + 46 * o} 222 ${196 + 46 * o} 228 168 Z`} />
          <path {...plein(fluo.orange, 10)} d={`M 182 ${188 + 40 * o} C 192 ${206 + 46 * o} 212 ${206 + 46 * o} 222 ${188 + 40 * o} C 214 ${196 + 40 * o} 190 ${196 + 40 * o} 182 ${188 + 40 * o} Z`} />
        </>
      ) : null}
      <path {...plein(fluo.orange, 10)} d={BEC} />
      <path {...trait} strokeWidth={6} d="M 186 156 C 190 150 196 150 198 156" />
      {crie ? (
        <>
          {/* le mégaphone du communiqué */}
          <path {...plein(blanc)} d="M 236 182 L 338 128 L 352 254 L 240 208 Z" />
          <path {...plein(fluo.rose, 10)} d="M 338 128 C 362 150 368 232 352 254 C 342 232 336 160 338 128 Z" />
          <path {...trait} d="M 262 214 L 270 246" />
          <g {...trait} strokeWidth={9}>
            <path d="M 380 150 L 408 132" />
            <path d="M 386 192 L 420 192" />
            <path d="M 380 236 L 408 254" />
          </g>
        </>
      ) : null}
    </Cadre>
  );
};

// ---------------------------------------------------------------- Plouf : le spectateur

const BOCAL = 'M 108 104 C 40 160 36 320 126 372 C 170 396 230 396 274 372 C 364 320 360 160 292 104 Z';

export const PloufSvg: React.FC<PersoProps> = (p) => {
  const o = ouvertureDe(p);
  const perdu = p.etat === 'signature';
  const id = `plouf-eau-${p.etat}`;
  return (
    <Cadre {...p}>
      <defs>
        <clipPath id={id}>
          <path d={BOCAL} />
        </clipPath>
      </defs>
      <path fill={blanc} opacity={0.7} d={BOCAL} />
      <g clipPath={`url(#${id})`}>
        <path fill={fluo.bleu} opacity={0.55} d="M 20 168 C 120 182 260 156 380 170 L 380 420 L 20 420 Z" />
        <path fill="none" stroke={stylo.bleu} strokeWidth={6} strokeLinecap="round" d="M 20 168 C 120 182 260 156 380 170" />
        {/* gravier */}
        <g fill={graphite}>
          <circle cx={150} cy={378} r={10} />
          <circle cx={176} cy={384} r={8} />
          <circle cx={226} cy={382} r={11} />
          <circle cx={256} cy={374} r={8} />
        </g>
      </g>
      {/* le poisson */}
      <path {...plein(fluo.orange, 10)} d="M 252 262 C 284 230 312 226 320 236 C 310 262 310 286 320 306 C 308 316 280 306 252 284 Z" />
      <path {...plein(fluo.orange, 10)} d="M 158 230 C 176 196 218 200 228 236 Z" />
      <path {...plein(fluo.orange)} d="M 108 272 C 116 222 200 210 252 250 C 264 262 264 282 252 294 C 200 334 116 322 108 272 Z" />
      <path {...trait} strokeWidth={8} d="M 214 258 C 224 272 222 290 210 300" />
      {/* yeux : le droit passe un peu derrière le gauche */}
      {(
        [
          [196, 250, 21],
          [150, 256, 25],
        ] as const
      ).map(([x, y, r]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r} {...plein(blanc, 8)} />
          {(p.clignement ?? 0) > 0.6 ? (
            <path {...trait} strokeWidth={8} d={`M ${x - 11} ${y} L ${x + 11} ${y}`} />
          ) : perdu ? (
            <circle cx={x - 6} cy={y - 9} r={6} fill={encre} />
          ) : (
            <>
              <circle cx={x - 5} cy={y + 3} r={p.etat === 'surpris' ? 13 : 9} fill={encre} />
              {p.etat === 'surpris' ? <circle cx={x - 1} cy={y - 2} r={4} fill={blanc} /> : null}
            </>
          )}
        </g>
      ))}
      {/* bouche */}
      {o > 0.05 ? (
        <ellipse cx={120} cy={286} rx={9} ry={6 + 10 * o} fill={encre} />
      ) : (
        <circle cx={120} cy={284} r={7} {...trait} strokeWidth={7} />
      )}
      {/* bulles */}
      <g {...trait} strokeWidth={6}>
        <circle cx={98} cy={236} r={9} />
        <circle cx={84} cy={200} r={6} />
      </g>
      {/* le bocal */}
      <path {...trait} d="M 108 104 C 40 160 36 320 126 372 C 170 396 230 396 274 372 C 364 320 360 160 292 104" />
      <path {...trait} d="M 96 104 C 150 90 250 90 304 104 C 250 118 150 118 96 104 Z" />
      <path fill="none" stroke={blanc} strokeWidth={10} strokeLinecap="round" d="M 300 160 C 322 200 326 250 312 290" opacity={0.9} />
      {perdu ? (
        // « … c'était quoi la question ? »
        <g>
          <path {...trait} strokeWidth={14} d="M 168 30 C 166 -4 232 -10 234 22 C 236 46 204 48 202 74" />
          <circle cx={202} cy={96} r={9} fill={encre} />
        </g>
      ) : null}
    </Cadre>
  );
};

// ---------------------------------------------------------------- Cookie : tes données

export const CookieSvg: React.FC<PersoProps> = (p) => {
  const o = ouvertureDe(p);
  const malin = p.etat === 'signature';
  return (
    <Cadre {...p}>
      {/* oreilles */}
      {[128, 272].map((x) => (
        <g key={x}>
          <circle cx={x} cy={96} r={44} {...plein(blanc)} />
          <circle cx={x} cy={98} r={22} fill={fluo.rose} />
        </g>
      ))}
      {/* la queue est un câble, prise au bout */}
      <path {...trait} d="M 262 330 C 320 364 362 332 352 292 C 344 256 368 232 390 246" />
      <g transform="translate(398 248) rotate(30)">
        <rect x={-8} y={-16} width={40} height={32} rx={4} {...plein(blanc, 9)} />
        <rect x={32} y={-9} width={18} height={18} {...plein(graphite, 7)} />
      </g>
      {/* pieds */}
      <ellipse cx={168} cy={360} rx={26} ry={13} {...plein(blanc, 9)} />
      <ellipse cx={234} cy={360} rx={26} ry={13} {...plein(blanc, 9)} />
      {/* corps : une souris d'ordinateur */}
      <path {...plein(blanc)} d="M 136 130 C 132 62 268 62 264 130 L 272 298 C 274 370 126 370 128 298 Z" />
      <g {...trait} strokeWidth={9}>
        <path d="M 200 68 L 200 140" />
        <path d="M 135 140 C 170 150 230 150 265 140" />
      </g>
      <rect x={190} y={84} width={20} height={40} rx={10} fill={encre} />
      {/* visage */}
      {malin ? (
        <g>
          <circle cx={172} cy={196} r={9} fill={encre} />
          <circle cx={228} cy={196} r={9} fill={encre} />
          <path {...trait} strokeWidth={9} d="M 154 186 L 190 190 M 210 190 L 246 186" />
        </g>
      ) : (p.clignement ?? 0) > 0.6 ? (
        <g {...trait} strokeWidth={8}>
          <path d="M 162 194 L 182 194" />
          <path d="M 218 194 L 238 194" />
        </g>
      ) : (
        <g>
          <circle cx={172} cy={192} r={p.etat === 'surpris' ? 15 : 10} fill={encre} />
          <circle cx={228} cy={192} r={p.etat === 'surpris' ? 15 : 10} fill={encre} />
          {p.etat === 'surpris' ? (
            <>
              <circle cx={177} cy={186} r={5} fill={blanc} />
              <circle cx={233} cy={186} r={5} fill={blanc} />
            </>
          ) : null}
        </g>
      )}
      <g {...trait} strokeWidth={7}>
        <path d="M 112 212 L 156 220" />
        <path d="M 110 236 L 156 232" />
        <path d="M 288 212 L 244 220" />
        <path d="M 290 236 L 244 232" />
      </g>
      {malin ? (
        <path {...plein(encre, 7)} d="M 174 238 C 186 262 216 262 228 236 C 212 244 190 244 174 238 Z" />
      ) : o > 0.05 ? (
        <ellipse cx={200} cy={246} rx={14} ry={6 + 12 * o} fill={encre} />
      ) : (
        <path {...trait} strokeWidth={7} d="M 184 238 C 190 248 200 248 200 238 C 200 248 210 248 216 238" />
      )}
      <ellipse cx={200} cy={224} rx={13} ry={9} {...plein(fluo.rose, 7)} />
      {malin ? (
        // le cookie qu'elle t'a pris
        <g>
          <circle cx={200} cy={308} r={44} {...plein(fluo.orange, 10)} />
          <g fill={encre}>
            <circle cx={184} cy={296} r={6} />
            <circle cx={214} cy={292} r={5} />
            <circle cx={204} cy={320} r={6} />
            <circle cx={182} cy={326} r={4} />
            <circle cx={226} cy={318} r={4} />
          </g>
          <circle cx={156} cy={304} r={15} {...plein(blanc, 8)} />
          <circle cx={244} cy={304} r={15} {...plein(blanc, 8)} />
        </g>
      ) : (
        <g {...trait} strokeWidth={10}>
          <path d="M 134 272 C 152 284 168 286 180 280" />
          <path d="M 266 272 C 248 284 232 286 220 280" />
        </g>
      )}
    </Cadre>
  );
};

export const PERSONNAGES = {
  bip: {nom: 'Bip', composant: BipSvg, role: "L'IA, sûre d'elle", signature: 'Bien sûr !'},
  coco: {nom: 'Coco', composant: CocoSvg, role: 'La hype, au mégaphone', signature: 'Révolutionnaire !'},
  plouf: {nom: 'Plouf', composant: PloufSvg, role: 'Toi, qui poses la question', signature: 'Euh… et ça sert à quoi ?'},
  cookie: {nom: 'Cookie', composant: CookieSvg, role: 'Tes données, en douce', signature: 'Je peux prendre un cookie ?'},
} as const;
export type NomPerso = keyof typeof PERSONNAGES;
