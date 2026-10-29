// Étape « programmation » : un épisode prêt → brouillons Postiz sur chaque réseau connecté
// (TikTok, Instagram, YouTube, Facebook, Threads, LinkedIn, X, Bluesky).
// Chaque réseau a son texte (section de publication.md), son format (vidéo, ou carrousel
// sur LinkedIn) et son créneau (brand/postiz.json → creneaux ; stratégie : docs/reseaux.md).
// Rien n'est publié sans le feu vert de l'utilisateur : les posts sont créés en BROUILLON,
// et --programmer ne fait que les passer dans la file de publication de Postiz.
// Usage : npm run postiz -- <épisode>                aperçu : écrit postiz.json (charges utiles -j), n'envoie rien
//         npm run postiz -- <épisode> --envoyer [--date 2026-10-29[T18:00]] [--commentaire] [--force]
//         sans --date : pour chaque réseau, son premier créneau libre au moins 3 h après maintenant
//         --date AAAA-MM-JJ : ce jour-là, chaque réseau à son heure ; --date AAAA-MM-JJTHH:MM : tous à cette heure
//         --reseaux linkedin,x : seulement ces réseaux (rattrapage d'un réseau connecté après coup :
//         les posts s'ajoutent au journal, les autres réseaux ne sont pas renvoyés)
//         npm run postiz -- <épisode> --programmer   après le feu vert : brouillons → programmés
//         npm run postiz -- --canaux                 comptes connectés + règles de chaque réseau
// Accès : CLI officielle `postiz` authentifiée par OAuth2 device flow (postiz auth:login,
// jeton dans ~/.postiz/credentials.json) — aucune clé API nécessaire.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {dossierEpisode, nomEpisode, RACINE} from './lib/episode';
import {cli, enListe} from './lib/postiz-cli';

type Reseau = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'threads' | 'linkedin' | 'x' | 'bluesky';
type Texte = 'tiktok' | 'instagram' | 'youtube' | 'linkedin' | 'threads' | 'relance' | 'court'; // sections de publication.md
type Creneau = {heure: string; jours?: number[]; suivantSeulement?: boolean; relance?: string};
type Reglages = {fuseau: string; creneaux: Record<Reseau, Creneau>; comptes: Partial<Record<Reseau, string>>} & Record<Reseau, Record<string, unknown>>;
type Canal = {id: string; name: string; identifier: string; disabled: boolean};
type Media = {id: string; path: string};
type Publication = Partial<Record<Texte, string>> & {titre: string; commentaire?: string};
type Statut = 'brouillon' | 'programmé';
// reseau « threads-relance » : le 2e post Threads (texte seul) du même épisode.
type Poste = {reseau: string; postId: string; integration: string; date?: string; statut?: Statut};
type Journal = {envoye: string; date: string; statut: Statut; video: string; miniature?: string; carrousel?: string[]; postes: Poste[]};
/** Un post à créer : un réseau, son texte, ses médias, sa date. */
type Envoi = {reseau: Reseau; relance?: boolean; date: string; texte: string; carrousel: boolean};

const reglages = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'postiz.json'), 'utf8')) as Reglages;
// Par réseau : identifiants Postiz, sections de publication.md (la 1re présente est prise :
// les anciens épisodes n'ont ni LinkedIn ni Threads), limite de caractères du texte.
const INFOS: Record<Reseau, {nom: string; identifiants: string[]; textes: Texte[]; limite: number}> = {
  tiktok: {nom: 'TikTok', identifiants: ['tiktok', 'tiktok-business'], textes: ['tiktok'], limite: 2000},
  instagram: {nom: 'Instagram', identifiants: ['instagram', 'instagram-standalone'], textes: ['instagram'], limite: 2200},
  youtube: {nom: 'YouTube', identifiants: ['youtube'], textes: ['youtube'], limite: 5000},
  facebook: {nom: 'Facebook', identifiants: ['facebook'], textes: ['instagram'], limite: 63206},
  threads: {nom: 'Threads', identifiants: ['threads'], textes: ['threads', 'court'], limite: 500},
  linkedin: {nom: 'LinkedIn', identifiants: ['linkedin', 'linkedin-page'], textes: ['linkedin', 'instagram'], limite: 3000},
  x: {nom: 'X', identifiants: ['x'], textes: ['court'], limite: 280},
  bluesky: {nom: 'Bluesky', identifiants: ['bluesky'], textes: ['court'], limite: 300},
};
const RESEAUX = Object.keys(INFOS) as Reseau[];
const NOMS = Object.fromEntries(RESEAUX.map((r) => [r, INFOS[r].nom])) as Record<Reseau, string>;
const LIMITE_TITRE_YOUTUBE = 100;
const SECTIONS: Record<Texte, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  relance: 'Threads relance',
  court: 'Court',
};
const reseauDe = (identifiant: string) => RESEAUX.find((r) => INFOS[r].identifiants.includes(identifiant));

const lirePublication = (dossier: string): Publication => {
  const texte = fs.readFileSync(path.join(dossier, 'publication.md'), 'utf8');
  const blocs = texte.split(/^## /m).slice(1);
  // « ## Threads » ne doit pas attraper « ## Threads relance » : on compare le titre entier
  // (une précision entre parenthèses est permise : « ## Court (X, Bluesky) »).
  const section = (titre: string) => {
    const bloc = blocs.find((b) => b.slice(0, b.indexOf('\n')).replace(/\s*\(.*\)\s*$/, '').trim() === titre);
    return bloc?.slice(bloc.indexOf('\n') + 1).trim() || undefined;
  };
  const pub = Object.fromEntries((Object.keys(SECTIONS) as Texte[]).map((t) => [t, section(SECTIONS[t])])) as Partial<Record<Texte, string>>;
  for (const t of ['tiktok', 'instagram', 'youtube'] as const) {
    if (!pub[t]) throw new Error(`publication.md : section « ## ${SECTIONS[t]} » absente.`);
  }
  const titre = /^\*\*Titre\*\*\s*:\s*(.+)$/m.exec(pub.youtube!)?.[1].trim();
  if (!titre) throw new Error('publication.md : ligne « **Titre** : … » absente de la section YouTube.');
  return {
    ...pub,
    youtube: pub.youtube!.replace(/^\*\*Titre\*\*.*\n+/m, '').trim(),
    titre,
    commentaire: /^Commentaire à épingler[^:]*:\s*(.+)$/m.exec(texte)?.[1].trim(),
  };
};
const texteDe = (pub: Publication, r: Reseau) => INFOS[r].textes.map((t) => pub[t]).find(Boolean);

/** Décalage du fuseau de Matou à l'instant t, en ms (« GMT+01:00 » → 3 600 000). */
const decalage = (t: number) => {
  const nom = new Intl.DateTimeFormat('en-US', {timeZone: reglages.fuseau, timeZoneName: 'longOffset'})
    .formatToParts(t)
    .find((p) => p.type === 'timeZoneName')?.value;
  const d = /GMT([+-])(\d{2}):(\d{2})/.exec(nom ?? '');
  return d ? (d[1] === '-' ? -1 : 1) * (Number(d[2]) * 60 + Number(d[3])) * 60_000 : 0;
};

/** « 2026-10-29T18:00 » (heure du fuseau de Matou) ou une date ISO complète → ISO UTC. */
const versUtc = (date: string) => {
  if (/(Z|[+-]\d\d:\d\d)$/.test(date)) return new Date(date).toISOString();
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(date);
  if (!m) throw new Error(`Date « ${date} » : attendu AAAA-MM-JJ ou AAAA-MM-JJTHH:MM (heure de ${reglages.fuseau}).`);
  const naif = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
  return new Date(naif - decalage(naif - decalage(naif))).toISOString();
};

const JOUR = 86_400_000;
const jour = (t: number) => new Intl.DateTimeFormat('en-CA', {timeZone: reglages.fuseau}).format(t);
/** 1 = lundi … 7 = dimanche, pour un jour « AAAA-MM-JJ ». */
const jourSemaine = (j: string) => ((new Date(`${j}T12:00:00Z`).getUTCDay() + 6) % 7) + 1;
const lisible = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', {timeZone: reglages.fuseau, dateStyle: 'full', timeStyle: 'short'}).format(new Date(iso));

/** Jours déjà occupés dans Postiz, par réseau (« AAAA-MM-JJ »). Postiz injoignable : aucun. */
const joursPris = (): Record<Reseau, Set<string>> => {
  const pris = Object.fromEntries(RESEAUX.map((r) => [r, new Set<string>()])) as Record<Reseau, Set<string>>;
  const [debut, fin] = [Date.now() - JOUR, Date.now() + 15 * JOUR].map((t) => new Date(t).toISOString());
  try {
    const posts = enListe<{publishDate: string; integration?: {providerIdentifier?: string}}>(cli('posts:list', '--startDate', debut, '--endDate', fin));
    for (const p of posts) {
      const r = reseauDe(p.integration?.providerIdentifier ?? '');
      if (r) pris[r].add(jour(new Date(p.publishDate).getTime()));
    }
  } catch {
    console.log('ATTENTION calendrier Postiz illisible (postiz auth:status) : créneaux calculés sans lui.');
  }
  return pris;
};

/**
 * Le créneau d'un réseau : son premier jour permis et libre, à son heure, au moins 3 h après
 * maintenant (ou le jour imposé par --date). undefined : pas de post (créneau suivant déjà pris).
 */
const creneauPour = (r: Reseau, pris: Set<string>, impose?: string): string | undefined => {
  const c = reglages.creneaux[r];
  if (impose?.includes('T')) return versUtc(impose);
  const depart = impose ? new Date(`${impose}T12:00:00Z`).getTime() : Date.now();
  for (let i = 0; i < 15; i++) {
    const j = jour(depart + i * JOUR);
    if (c.jours && !c.jours.includes(jourSemaine(j))) continue;
    const date = versUtc(`${j}T${c.heure}`);
    if (!impose && new Date(date).getTime() - Date.now() < 3 * 3_600_000) continue;
    if (!pris.has(j)) return date;
    if (c.suivantSeulement || impose) return undefined;
  }
  throw new Error(`${NOMS[r]} : aucun jour libre dans les 15 prochains jours du calendrier Postiz : préciser --date.`);
};

const choisirCanaux = (canaux: Canal[]) => {
  const choisis: Partial<Record<Reseau, Canal>> = {};
  for (const r of RESEAUX) {
    const impose = reglages.comptes[r];
    const candidats = canaux.filter((c) => !c.disabled && (impose ? c.id === impose : INFOS[r].identifiants.includes(c.identifier)));
    if (candidats.length > 1) {
      const liste = candidats.map((c) => `${c.id} = ${c.name}`).join(', ');
      throw new Error(`Plusieurs comptes ${NOMS[r]} dans Postiz (${liste}) : mettre le bon id dans brand/postiz.json → comptes.${r}.`);
    }
    if (candidats[0]) choisis[r] = candidats[0];
  }
  return choisis;
};

/** Les posts de l'épisode, un par réseau retenu (plus la relance Threads), chacun à son créneau. */
const planifier = (pub: Publication, reseaux: Reseau[], carrousel: string[], impose?: string) => {
  const pris = joursPris();
  const envois: Envoi[] = [];
  const sautes: string[] = [];
  for (const r of reseaux) {
    const texte = texteDe(pub, r);
    if (!texte) continue;
    const date = creneauPour(r, pris[r], impose);
    if (!date) {
      sautes.push(`${NOMS[r]} : prochain créneau déjà pris, pas de post pour cet épisode`);
      continue;
    }
    envois.push({reseau: r, date, texte, carrousel: r === 'linkedin' && !!pub.linkedin && carrousel.length >= 2});
    const relance = reglages.creneaux[r].relance;
    if (relance && r === 'threads' && pub.relance) {
      const dateRelance = versUtc(`${jour(new Date(date).getTime())}T${relance}`);
      if (dateRelance > date) envois.push({reseau: r, relance: true, date: dateRelance, texte: pub.relance, carrousel: false});
    }
  }
  return {envois, sautes};
};

/** Une charge utile `posts:create` par date (Postiz n'en prend qu'une par envoi). */
const construire = (
  pub: Publication,
  envois: Envoi[],
  canaux: Partial<Record<Reseau, Pick<Canal, 'id' | 'identifier'>>>,
  medias: {video: Media; miniature?: Media; carrousel: Media[]},
  commentaire: boolean,
) => {
  const dates = [...new Set(envois.map((e) => e.date))].sort();
  return dates.map((date) => ({
    type: 'draft',
    date,
    shortLink: false, // les URL de source restent lisibles
    tags: [],
    posts: envois
      .filter((e) => e.date === date && canaux[e.reseau])
      .map((e) => {
        const canal = canaux[e.reseau]!;
        const images = e.relance ? [] : e.carrousel ? medias.carrousel : [medias.video];
        const valeur: {content: string; image: Media[]}[] = [{content: e.texte, image: images}];
        // Commentaire = 1re réponse du fil sur Threads, X et Bluesky. TikTok ne permet pas aux
        // applications de commenter : commentaire à la main là-bas. La relance n'en a pas.
        if (commentaire && pub.commentaire && e.reseau !== 'tiktok' && !e.relance) valeur.push({content: pub.commentaire, image: []});
        const settings: Record<string, unknown> = {__type: canal.identifier, ...reglages[e.reseau]};
        if (e.reseau === 'youtube') {
          settings.title = pub.titre;
          if (medias.miniature) settings.thumbnail = medias.miniature;
        }
        if (e.reseau === 'facebook') settings.title = pub.titre;
        if (e.reseau === 'linkedin') {
          settings.post_as_images_carousel = e.carrousel;
          if (e.carrousel) settings.carousel_name = pub.titre.replace(/\s*#\d+$/, '');
        }
        return {integration: {id: canal.id}, value: valeur, settings};
      }),
  }));
};

const televerser = async (fichier: string): Promise<Media> => {
  const r = cli<{id?: string; path: string}>('upload', fichier);
  console.log(`Téléversé : ${path.relative(RACINE, fichier)} → ${r.path}`);
  return {id: r.id ?? path.basename(fichier), path: r.path};
};

const args = process.argv.slice(2);
const valeurDe = (option: string) => {
  const i = args.indexOf(option);
  return i >= 0 ? args[i + 1] : undefined;
};

if (args.includes('--canaux')) {
  const canaux = enListe<Canal>(cli('integrations:list'), 'integrations');
  for (const c of canaux) console.log(`${c.identifier.padEnd(22)} ${c.id}  ${c.name}${c.disabled ? ' (désactivé)' : ''}`);
  for (const [r, c] of Object.entries(choisirCanaux(canaux)) as [Reseau, Canal][]) {
    const rep = cli<{output?: unknown}>('integrations:settings', c.id);
    console.log(`\n=== ${NOMS[r]} (${c.name}) : règles et réglages ===\n${JSON.stringify(rep.output ?? rep, null, 2)}`);
  }
  process.exit(0);
}

const choix = valeurDe('--reseaux')?.split(',') as Reseau[] | undefined;
const inconnus = choix?.filter((r) => !RESEAUX.includes(r)) ?? [];
if (inconnus.length) throw new Error(`--reseaux : ${inconnus.join(', ')} inconnu (attendu parmi ${RESEAUX.join(', ')}).`);
const retenu = (reseau: string) => !choix || choix.includes(reseau.replace(/-relance$/, '') as Reseau);

const dossier = dossierEpisode(args.find((a, i) => !a.startsWith('--') && !['--date', '--reseaux'].includes(args[i - 1])));
const nom = nomEpisode(dossier);
const journal = path.join(dossier, 'postiz-envoi.json');

if (args.includes('--programmer')) {
  if (!fs.existsSync(journal)) throw new Error('Aucun brouillon envoyé pour cet épisode : lancer d’abord --envoyer.');
  const envoi = JSON.parse(fs.readFileSync(journal, 'utf8')) as Journal;
  for (const p of envoi.postes.filter((p) => retenu(p.reseau))) {
    cli('posts:status', p.postId, '--status', 'schedule');
    p.statut = 'programmé';
    console.log(`Programmé : ${p.reseau} (${p.postId}), ${lisible(p.date ?? envoi.date)}`);
  }
  const statut = envoi.postes.every((p) => p.statut === 'programmé') ? 'programmé' : envoi.statut;
  fs.writeFileSync(journal, JSON.stringify({...envoi, statut}, null, 2) + '\n');
  console.log('\nDates enregistrées dans Postiz.');
  process.exit(0);
}

const pub = lirePublication(dossier);
const mp4 = path.join(dossier, 'rendu', `${nom}.mp4`);
const png = path.join(dossier, 'rendu', `${nom}-miniature.png`);
const dossierCarrousel = path.join(dossier, 'rendu', 'carrousel');
const carrousel = fs.existsSync(dossierCarrousel)
  ? fs.readdirSync(dossierCarrousel).filter((f) => f.endsWith('.png')).sort().map((f) => path.join(dossierCarrousel, f))
  : [];
const commentaire = args.includes('--commentaire');
const impose = valeurDe('--date');

const alertes: string[] = [];
if (!fs.existsSync(mp4)) alertes.push(`Vidéo absente : ${path.relative(RACINE, mp4)} (npm run render)`);
if (pub.linkedin && carrousel.length < 2) alertes.push(`Carrousel LinkedIn absent : ${path.relative(RACINE, dossierCarrousel)} (npm run carrousel)`);
for (const r of RESEAUX) {
  const n = texteDe(pub, r)?.length ?? 0;
  if (n > INFOS[r].limite) alertes.push(`${NOMS[r]} : texte de ${n} caractères (max ${INFOS[r].limite})`);
  if (commentaire && r !== 'tiktok' && (pub.commentaire?.length ?? 0) > INFOS[r].limite) {
    alertes.push(`${NOMS[r]} : commentaire de sources de ${pub.commentaire!.length} caractères (max ${INFOS[r].limite})`);
  }
}
if ((pub.relance?.length ?? 0) > INFOS.threads.limite) alertes.push(`Threads relance : ${pub.relance!.length} caractères (max ${INFOS.threads.limite})`);
if (pub.titre.length > LIMITE_TITRE_YOUTUBE) alertes.push(`YouTube : titre de ${pub.titre.length} caractères (max ${LIMITE_TITRE_YOUTUBE})`);

const resume = (envois: Envoi[], sautes: string[]) => {
  for (const e of envois) {
    const format = e.relance ? 'texte seul' : e.carrousel ? `carrousel de ${carrousel.length} diapos` : 'vidéo';
    console.log(`${(NOMS[e.reseau] + (e.relance ? ' (relance)' : '')).padEnd(19)} ${lisible(e.date).padEnd(36)} ${format}, ${e.texte.length} caractères`);
  }
  sautes.forEach((s) => console.log(`Pas de post : ${s}`));
};
const passees = (envois: Envoi[]) => envois.filter((e) => new Date(e.date).getTime() < Date.now()).map((e) => `Date passée (${NOMS[e.reseau]}) : ${lisible(e.date)}`);

if (!args.includes('--envoyer')) {
  const {envois, sautes} = planifier(pub, RESEAUX.filter(retenu), carrousel, impose);
  alertes.push(...passees(envois));
  const fictifs = Object.fromEntries(RESEAUX.map((r) => [r, {id: `<id ${NOMS[r]}>`, identifier: INFOS[r].identifiants[0]}]));
  const medias = {
    video: {id: '<id de la vidéo>', path: `<chemin de ${path.basename(mp4)}>`},
    miniature: {id: '<id de la miniature>', path: `<chemin de ${path.basename(png)}>`},
    carrousel: carrousel.map((f) => ({id: `<id de ${path.basename(f)}>`, path: `<chemin de carrousel/${path.basename(f)}>`})),
  };
  fs.writeFileSync(path.join(dossier, 'postiz.json'), JSON.stringify(construire(pub, envois, fictifs, medias, commentaire), null, 2) + '\n');
  resume(envois, sautes);
  console.log(`YouTube : titre « ${pub.titre} »`);
  console.log(`Commentaire de sources : ${commentaire ? '1er commentaire partout, à la main sur TikTok' : pub.commentaire ? 'à poster à la main (--commentaire : partout sauf TikTok)' : 'absent de publication.md'}`);
  alertes.forEach((a) => console.log(`ATTENTION ${a}`));
  console.log('\nAperçu écrit dans postiz.json (charges utiles de `postiz posts:create --json`). Rien n’a été envoyé.');
  process.exit(alertes.length ? 1 : 0);
}

if (alertes.length) throw new Error(`Envoi annulé :\n${alertes.map((a) => `  - ${a}`).join('\n')}`);
const precedent = fs.existsSync(journal) ? (JSON.parse(fs.readFileSync(journal, 'utf8')) as Journal) : undefined;
const dejaLa = precedent?.postes.filter((p) => retenu(p.reseau)) ?? [];
if (precedent && (!choix || dejaLa.length) && !args.includes('--force')) {
  const quoi = choix ? ` sur ${dejaLa.map((p) => p.reseau).join(', ')}` : '';
  throw new Error(`Déjà envoyé${quoi} (${path.relative(RACINE, journal)}) : vérifier dans Postiz avant de recommencer (--force crée des doublons).`);
}

const tous = choisirCanaux(enListe<Canal>(cli('integrations:list'), 'integrations'));
const canaux = Object.fromEntries(Object.entries(tous).filter(([r]) => retenu(r))) as typeof tous;
const absents = RESEAUX.filter((r) => retenu(r) && !canaux[r]);
if (!Object.keys(canaux).length) throw new Error(`Aucun compte connecté dans Postiz (${RESEAUX.filter(retenu).map((r) => NOMS[r]).join(', ')}).`);
if (absents.length) console.log(`Non connectés dans Postiz, ignorés : ${absents.map((r) => NOMS[r]).join(', ')}.`);

const {envois, sautes} = planifier(pub, RESEAUX.filter((r) => canaux[r]), carrousel, impose);
const passe = passees(envois);
if (passe.length) throw new Error(`Envoi annulé :\n${passe.map((a) => `  - ${a}`).join('\n')}`);
if (!envois.length) throw new Error(`Aucun post à créer : ${sautes.join(' ; ')}`);

const video = await televerser(mp4);
const miniature = canaux.youtube && fs.existsSync(png) ? await televerser(png) : undefined;
const images = envois.some((e) => e.carrousel) ? await Promise.all(carrousel.map(televerser)) : [];
const charges = construire(pub, envois, canaux, {video, miniature, carrousel: images}, commentaire);
fs.writeFileSync(path.join(dossier, 'postiz.json'), JSON.stringify(charges, null, 2) + '\n');

const nouveaux: Poste[] = [];
for (const charge of charges) {
  const fichier = path.join(os.tmpdir(), `postiz-${nom}-${Date.now()}.json`);
  fs.writeFileSync(fichier, JSON.stringify(charge));
  const reponse = enListe<{postId?: string; id?: string; integration?: string; integrationId?: string}>(cli('posts:create', '--json', fichier));
  fs.rmSync(fichier, {force: true});
  for (const p of reponse) {
    const integration = p.integration ?? p.integrationId ?? '';
    const r = RESEAUX.find((x) => canaux[x]?.id === integration);
    const relance = envois.some((e) => e.relance && e.date === charge.date && e.reseau === r);
    nouveaux.push({reseau: r ? `${r}${relance ? '-relance' : ''}` : integration, postId: p.postId ?? p.id ?? '', integration, date: charge.date, statut: 'brouillon'});
  }
}

// Rattrapage : le journal de l'épisode garde ses posts, les nouveaux s'y ajoutent.
const premiere = charges[0].date;
const envoi: Journal =
  choix && precedent
    ? {...precedent, statut: 'brouillon', postes: [...precedent.postes.filter((p) => !retenu(p.reseau)), ...nouveaux]}
    : {envoye: new Date().toISOString(), date: premiere, statut: 'brouillon', video: video.path, miniature: miniature?.path, carrousel: images.map((m) => m.path), postes: nouveaux};
fs.writeFileSync(journal, JSON.stringify(envoi, null, 2) + '\n');
nouveaux.forEach((p) => console.log(`Brouillon : ${p.reseau} (${p.postId}), ${lisible(p.date!)}`));
sautes.forEach((s) => console.log(`Pas de post : ${s}`));
console.log('\nRien n’est publié : relire dans Postiz, puis --programmer après le feu vert.');
