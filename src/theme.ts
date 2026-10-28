import tokens from '../brand/tokens.json';

export {tokens};
export const C = tokens.colors;
export const W = tokens.format.width;
export const H = tokens.format.height;
export const FPS = tokens.format.fps;
export const SAFE = tokens.safeZone;

export const POLICE_TITRE = "'Permanent Marker', 'Shantell Sans', sans-serif";
export const POLICE_TEXTE = "'Shantell Sans', sans-serif";
const {wght, INFM, BNCE} = tokens.typo.texte.axes;
/** Réglages de Shantell Sans : gras, un peu « écrit à la main », sans rebond. */
export const AXES_TEXTE = `'INFM' ${INFM}, 'BNCE' ${BNCE}`;
export const GRAS_TEXTE = wght;
