// Gabarits de montage de scenes.json : quelle ouverture et quel corps pour quel épisode, et
// l'épisode les suit-il ? Réglages : brand/montage.json ; raisons : docs/viralite.md.
import fs from 'node:fs';
import path from 'node:path';
import {rang} from '../../src/rotation';
import {texteParle, type Episode} from '../../src/schema';
import {RACINE} from './episode';

type Ouverture = {id: string; visuel?: string; motif?: string; consigne: string; exemple: string};
type Corps = {id: string; scene: string; consigne: string};
type Reglages = {depuis: number; ouvertures: Ouverture[]; corps: Corps[]};

export const montage = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'montage.json'), 'utf8')) as Reglages;

export const montageAttendu = (n: number) => {
  const ouverture = montage.ouvertures[rang(n, montage.ouvertures.length)];
  const i = rang(n, montage.corps.length);
  // une fenêtre au hook puis une autre juste après : on passe au corps suivant
  const corps = montage.corps[montage.corps[i].scene === ouverture.visuel ? (i + 1) % montage.corps.length : i];
  return {ouverture, corps};
};

/** Erreurs de montage de l'épisode (vide si conforme). Le gabarit prévu, ou un autre avec sa raison. */
export const controlerMontage = (episode: Episode) => {
  const ko: string[] = [];
  const prevu = montageAttendu(episode.numero);
  const g = episode.gabarit;
  const cmd = `npm run gabarits -- ${episode.numero}`;
  if (!g) return [`« gabarit » absent de scenes.json (prévu : ouverture ${prevu.ouverture.id}, corps ${prevu.corps.id} ; ${cmd})`];

  const ouverture = montage.ouvertures.find((o) => o.id === g.ouverture);
  const corps = montage.corps.find((c) => c.id === g.corps);
  if (!ouverture) ko.push(`ouverture « ${g.ouverture} » inconnue (${cmd})`);
  else if (ouverture.id !== prevu.ouverture.id && !g.raison) ko.push(`ouverture « ${g.ouverture} » sans raison (prévue : ${prevu.ouverture.id})`);
  if (!corps) ko.push(`corps « ${g.corps} » inconnu (${cmd})`);
  else if (corps.id !== prevu.corps.id && !g.raison) ko.push(`corps « ${g.corps} » sans raison (prévu : ${prevu.corps.id})`);

  const hook = episode.scenes[0];
  if (ouverture && hook.type === 'hook') {
    if (ouverture.visuel && hook.visuel?.type !== ouverture.visuel)
      ko.push(`ouverture ${ouverture.id} : le hook doit avoir « visuel » de type ${ouverture.visuel} (${ouverture.consigne.toLowerCase()})`);
    if (ouverture.motif && !new RegExp(ouverture.motif, 'iu').test(`${texteParle(hook.titre)}\n${texteParle(hook.texte)}`))
      ko.push(`ouverture ${ouverture.id} non suivie (${ouverture.consigne.toLowerCase()})`);
  }
  if (corps && episode.scenes[1]?.type !== corps.scene)
    ko.push(`corps ${corps.id} : la scène après le hook doit être « ${corps.scene} », pas « ${episode.scenes[1]?.type} »`);
  return ko;
};
