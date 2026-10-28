import {continueRender, delayRender, staticFile} from 'remotion';
import tokens from '../brand/tokens.json';

// Les polices sont dans public/brand/fonts : aucun appel réseau au rendu.
let charge = false;
export const chargerPolices = () => {
  if (charge || typeof document === 'undefined') return;
  charge = true;
  const handle = delayRender('Polices de Matou');
  const polices = [
    new FontFace('Permanent Marker', `url(${staticFile(tokens.typo.titre.fichier)}) format('woff2')`),
    new FontFace('Shantell Sans', `url(${staticFile(tokens.typo.texte.fichier)}) format('woff2')`, {
      weight: '300 800',
    }),
  ];
  Promise.all(polices.map((p) => p.load()))
    .then((chargees) => {
      chargees.forEach((p) => document.fonts.add(p));
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
