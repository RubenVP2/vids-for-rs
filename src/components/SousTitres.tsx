import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {Timings} from '../schema';
import {AXES_TEXTE, C, POLICE_TEXTE, tokens} from '../theme';

// Sous-titres mot à mot : de courtes « pages » (une ligne, coupées aux fins de phrase),
// le mot prononcé passe au fluo, les mots clés (==…== dans le script) sont au stylo bleu.

const MAX_CARACTERES = 24;

type Page = {debut: number; fin: number; mots: Timings['mots']};

export const paginer = (mots: Timings['mots']): Page[] => {
  const pages: Page[] = [];
  let courante: Timings['mots'] = [];
  const fermer = () => {
    if (courante.length) pages.push({debut: courante[0].debut, fin: courante[courante.length - 1].fin, mots: courante});
    courante = [];
  };
  mots.forEach((m, i) => {
    const longueur = courante.map((x) => x.texte).join(' ').length;
    const pause = courante.length > 0 && m.debut - courante[courante.length - 1].fin > 0.45;
    const changementScene = courante.length > 0 && courante[0].scene !== m.scene;
    if (courante.length && (longueur + 1 + m.texte.length > MAX_CARACTERES || pause || changementScene)) fermer();
    courante.push(m);
    if (/[.?!…:]$/.test(m.texte) && i < mots.length - 1) fermer();
  });
  fermer();
  // chaque page reste affichée jusqu'au début de la suivante (pas de trou)
  return pages.map((p, i) => ({...p, fin: i + 1 < pages.length ? pages[i + 1].debut : p.fin + 0.6}));
};

export const SousTitres: React.FC<{timings: Timings; top: number}> = ({timings, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const pages = useMemo(() => paginer(timings.mots), [timings]);
  const page = pages.find((p) => t >= p.debut - 0.05 && t < p.fin);
  if (!page) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: tokens.safeZone.left,
        right: tokens.safeZone.right,
        textAlign: 'center',
        fontFamily: POLICE_TEXTE,
        fontVariationSettings: AXES_TEXTE,
        fontWeight: 800,
        fontSize: tokens.typo.tailles.sousTitre,
        lineHeight: 1.2,
        color: C.encre,
        paintOrder: 'stroke fill',
        WebkitTextStroke: `14px ${C.papier}`,
      }}
    >
      {page.mots.map((m, i) => {
        const actif = t >= m.debut && t < m.fin + 0.05;
        return (
          <React.Fragment key={`${m.debut}-${i}`}>
            {i > 0 ? ' ' : null}
            <span
              style={{
                color: m.surligne ? C.stylo.bleu : C.encre,
                backgroundImage: actif ? `linear-gradient(${C.surligneur}, ${C.surligneur})` : undefined,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 58%',
                backgroundPosition: '0 82%',
              }}
            >
              {m.texte}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
