import React, {useContext} from 'react';

// Mise en page de l'épisode, en rotation sur son numéro (src/rotation.ts) pour que deux vidéos
// ne se ressemblent pas : en miroir, Matou passe de l'autre côté, les cartes penchent dans
// l'autre sens et les éléments entrent par l'autre bord.
export const MiseEnPage = React.createContext({miroir: false});
export const useMiroir = () => useContext(MiseEnPage).miroir;
