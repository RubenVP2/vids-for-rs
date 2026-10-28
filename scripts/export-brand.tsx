// Exporte Matou (un SVG par état) et les icônes dans brand/, à partir des composants React.
// Usage : npm run brand
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ETATS, MatouSvg} from '../src/mascot/MatouSvg';
import {ICONES, Icone} from '../src/components/Icones';

const racine = path.resolve(import.meta.dirname, '..');
const dossierMatou = path.join(racine, 'brand', 'mascotte');
const dossierIcones = path.join(racine, 'brand', 'icones');
fs.mkdirSync(dossierMatou, {recursive: true});
fs.mkdirSync(dossierIcones, {recursive: true});

const ecrire = (fichier: string, el: React.ReactElement) => {
  let svg = renderToStaticMarkup(el);
  if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  fs.writeFileSync(fichier, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
};

for (const etat of ETATS) {
  ecrire(path.join(dossierMatou, `matou-${etat}.svg`), <MatouSvg etat={etat} bouche={etat === 'parle' ? 0.7 : 0} />);
}
ecrire(path.join(dossierMatou, 'matou-verres-chargement.svg'), <MatouSvg etat="reflechit" verres="chargement" chargement={30} />);
ecrire(path.join(dossierMatou, 'matou-verdict-fusee.svg'), <MatouSvg etat="verdict" verres="fusee" />);
for (const nom of ICONES) {
  ecrire(path.join(dossierIcones, `${nom}.svg`), <Icone nom={nom} />);
}
console.log(`Matou : ${ETATS.length + 2} SVG dans brand/mascotte, ${ICONES.length} icônes dans brand/icones`);
