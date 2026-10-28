// Étape « programmation » : un épisode prêt → brouillons Postiz sur chaque réseau connecté
// (TikTok, Instagram, YouTube, Facebook, Threads, LinkedIn, X, Bluesky).
// Rien n'est publié sans le feu vert de l'utilisateur : les posts sont créés en BROUILLON,
// et --programmer ne fait que les passer dans la file de publication de Postiz.
// Usage : npm run postiz -- <épisode>                aperçu : écrit postiz.json et postiz-mcp.json, n'envoie rien
//         npm run postiz -- <épisode> --envoyer [--date 2026-10-29T18:00] [--commentaire] [--force]
//         npm run postiz -- <épisode> --programmer   après le feu vert : brouillons → programmés
//         npm run postiz -- --canaux                 comptes connectés + règles de chaque réseau
// Accès : secret réseau sur api.postiz.com (en-tête Authorization, sans préfixe) ou POSTIZ_API_KEY.
// Sans clé, passer par le MCP Postiz : postiz-mcp.json est l'argument de integrationSchedulePostTool,
// une fois les <…> remplacés (skill programmation).
import fs from 'node:fs';
import path from 'node:path';
import {dossierEpisode, nomEpisode, RACINE} from './lib/episode';

type Reseau = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'threads' | 'linkedin' | 'x' | 'bluesky';
type Texte = 'tiktok' | 'instagram' | 'youtube' | 'court'; // sections de publication.md
type Reglages = {fuseau: string; heure: string; comptes: Partial<Record<Reseau, string>>} & Record<Reseau, Record<string, unknown>>;
type Canal = {id: string; name: string; identifier: string; disabled: boolean};
type Media = {id: string; path: string};
type Publication = Record<Texte, string> & {titre: string; commentaire?: string};
type Journal = {envoye: string; date: string; statut: 'brouillon' | 'programmé'; video: string; miniature?: string; postes: {reseau: string; postId: string; integration: string}[]};

const API = (process.env.POSTIZ_API_URL ?? 'https://api.postiz.com').replace(/\/$/, '');
const reglages = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'postiz.json'), 'utf8')) as Reglages;
// Par réseau : identifiants Postiz, section de publication.md reprise, limite de caractères du texte.
const INFOS: Record<Reseau, {nom: string; identifiants: string[]; texte: Texte; limite: number}> = {
  tiktok: {nom: 'TikTok', identifiants: ['tiktok'], texte: 'tiktok', limite: 2000},
  instagram: {nom: 'Instagram', identifiants: ['instagram', 'instagram-standalone'], texte: 'instagram', limite: 2200},
  youtube: {nom: 'YouTube', identifiants: ['youtube'], texte: 'youtube', limite: 5000},
  facebook: {nom: 'Facebook', identifiants: ['facebook'], texte: 'instagram', limite: 63206},
  threads: {nom: 'Threads', identifiants: ['threads'], texte: 'court', limite: 500},
  linkedin: {nom: 'LinkedIn', identifiants: ['linkedin', 'linkedin-page'], texte: 'instagram', limite: 3000},
  x: {nom: 'X', identifiants: ['x'], texte: 'court', limite: 280},
  bluesky: {nom: 'Bluesky', identifiants: ['bluesky'], texte: 'court', limite: 300},
};
const RESEAUX = Object.keys(INFOS) as Reseau[];
const NOMS = Object.fromEntries(RESEAUX.map((r) => [r, INFOS[r].nom])) as Record<Reseau, string>;
const LIMITE_TITRE_YOUTUBE = 100;

const appeler = async <T>(chemin: string, init: RequestInit = {}): Promise<T> => {
  const entetes = new Headers(init.headers);
  // Sans variable, la clé est ajoutée par le proxy de la session (secret réseau).
  if (process.env.POSTIZ_API_KEY) entetes.set('Authorization', process.env.POSTIZ_API_KEY);
  if (typeof init.body === 'string') entetes.set('Content-Type', 'application/json');
  const rep = await fetch(`${API}/public/v1${chemin}`, {...init, headers: entetes});
  if (rep.status === 401) {
    throw new Error(
      'Postiz refuse l’accès (401). Ajouter la clé API Postiz (Settings › Developers › Public API) à l’environnement : ' +
        'secret réseau sur api.postiz.com (en-tête Authorization, sans préfixe) ou variable POSTIZ_API_KEY, puis ouvrir une nouvelle session.',
    );
  }
  if (!rep.ok) throw new Error(`Postiz ${init.method ?? 'GET'} ${chemin} : HTTP ${rep.status} ${await rep.text()}`);
  return (await rep.json()) as T;
};

const lirePublication = (dossier: string): Publication => {
  const texte = fs.readFileSync(path.join(dossier, 'publication.md'), 'utf8');
  const blocs = texte.split(/^## /m);
  const section = (titre: string) => {
    const bloc = blocs.find((b) => b.startsWith(titre));
    if (!bloc) throw new Error(`publication.md : section « ## ${titre} » absente.`);
    return bloc.slice(bloc.indexOf('\n') + 1).trim();
  };
  const youtube = section('YouTube');
  const titre = /^\*\*Titre\*\*\s*:\s*(.+)$/m.exec(youtube)?.[1].trim();
  if (!titre) throw new Error('publication.md : ligne « **Titre** : … » absente de la section YouTube.');
  return {
    tiktok: section('TikTok'),
    instagram: section('Instagram'),
    youtube: youtube.replace(/^\*\*Titre\*\*.*\n+/m, '').trim(),
    court: section('Court'),
    titre,
    commentaire: /^Commentaire à épingler[^:]*:\s*(.+)$/m.exec(texte)?.[1].trim(),
  };
};

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
  if (!m) throw new Error(`Date « ${date} » : attendu AAAA-MM-JJTHH:MM (heure de ${reglages.fuseau}).`);
  const naif = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
  return new Date(naif - decalage(naif - decalage(naif))).toISOString();
};

const demain = () => `${new Intl.DateTimeFormat('en-CA', {timeZone: reglages.fuseau}).format(Date.now() + 86_400_000)}T${reglages.heure}`;
const lisible = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', {timeZone: reglages.fuseau, dateStyle: 'full', timeStyle: 'short'}).format(new Date(iso));

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

const construire = (pub: Publication, canaux: Partial<Record<Reseau, Pick<Canal, 'id' | 'identifier'>>>, video: Media, miniature: Media | undefined, date: string, commentaire: boolean) => ({
  type: 'draft',
  date,
  shortLink: false, // les URL de source restent lisibles
  tags: [],
  posts: RESEAUX.filter((r) => canaux[r]).map((r) => {
    const canal = canaux[r]!;
    const valeur: {content: string; image: Media[]}[] = [{content: pub[INFOS[r].texte], image: [video]}];
    // Commentaire = 1re réponse du fil sur Threads, X et Bluesky. TikTok ne permet pas aux
    // applications de commenter : commentaire à la main là-bas.
    if (commentaire && pub.commentaire && r !== 'tiktok') valeur.push({content: pub.commentaire, image: []});
    const settings: Record<string, unknown> = {__type: canal.identifier, ...reglages[r]};
    if (r === 'youtube') {
      settings.title = pub.titre;
      if (miniature) settings.thumbnail = miniature;
    }
    if (r === 'facebook') settings.title = pub.titre;
    return {integration: {id: canal.id}, value: valeur, settings};
  }),
});

// Le MCP veut du HTML (une ligne = un <p>), les réglages en paires clé/valeur, et accepte une
// couverture par vidéo (thumbnail) : elle sert aussi sur TikTok, Instagram et Facebook.
const html = (texte: string) =>
  texte.split('\n').map((l) => `<p>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('');
const versMcp = (corps: ReturnType<typeof construire>, miniature: string) => ({
  socialPost: corps.posts.map((p) => ({
    integrationId: p.integration.id,
    isPremium: false,
    date: corps.date,
    shortLink: false,
    type: 'draft',
    postsAndComments: p.value.map((v) => ({content: html(v.content), attachments: v.image.map((m) => ({path: m.path, thumbnail: miniature}))})),
    settings: Object.entries(p.settings)
      .filter(([cle]) => cle !== '__type')
      .map(([key, value]) => ({key, value})),
  })),
});

const televerser = async (fichier: string): Promise<Media> => {
  const form = new FormData();
  const type = fichier.endsWith('.mp4') ? 'video/mp4' : 'image/png';
  form.append('file', await fs.openAsBlob(fichier, {type}), path.basename(fichier));
  const r = await appeler<{id?: string; path: string}>('/upload', {method: 'POST', body: form});
  console.log(`Téléversé : ${path.basename(fichier)} → ${r.path}`);
  return {id: r.id ?? path.basename(fichier), path: r.path};
};

const args = process.argv.slice(2);
const valeurDe = (option: string) => {
  const i = args.indexOf(option);
  return i >= 0 ? args[i + 1] : undefined;
};

if (args.includes('--canaux')) {
  const canaux = await appeler<Canal[]>('/integrations');
  for (const c of canaux) console.log(`${c.identifier.padEnd(22)} ${c.id}  ${c.name}${c.disabled ? ' (désactivé)' : ''}`);
  for (const [r, c] of Object.entries(choisirCanaux(canaux)) as [Reseau, Canal][]) {
    const rep = await appeler<{output?: unknown}>(`/integration-settings/${c.id}`);
    console.log(`\n=== ${NOMS[r]} (${c.name}) : règles et réglages ===\n${JSON.stringify(rep.output ?? rep, null, 2)}`);
  }
  process.exit(0);
}

const dossier = dossierEpisode(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--date'));
const nom = nomEpisode(dossier);
const journal = path.join(dossier, 'postiz-envoi.json');

if (args.includes('--programmer')) {
  if (!fs.existsSync(journal)) throw new Error('Aucun brouillon envoyé pour cet épisode : lancer d’abord --envoyer.');
  const envoi = JSON.parse(fs.readFileSync(journal, 'utf8')) as Journal;
  for (const p of envoi.postes) {
    await appeler(`/posts/${p.postId}/status`, {method: 'PUT', body: JSON.stringify({status: 'schedule'})});
    console.log(`Programmé : ${p.reseau} (${p.postId})`);
  }
  fs.writeFileSync(journal, JSON.stringify({...envoi, statut: 'programmé'}, null, 2) + '\n');
  console.log(`\nPublication prévue ${lisible(envoi.date)} (date enregistrée dans Postiz).`);
  process.exit(0);
}

const pub = lirePublication(dossier);
const mp4 = path.join(dossier, 'rendu', `${nom}.mp4`);
const png = path.join(dossier, 'rendu', `${nom}-miniature.png`);
const date = versUtc(valeurDe('--date') ?? demain());
const commentaire = args.includes('--commentaire');

const alertes: string[] = [];
if (!fs.existsSync(mp4)) alertes.push(`Vidéo absente : ${path.relative(RACINE, mp4)} (npm run render)`);
for (const r of RESEAUX) {
  const n = pub[INFOS[r].texte].length;
  if (n > INFOS[r].limite) alertes.push(`${NOMS[r]} : texte de ${n} caractères (max ${INFOS[r].limite})`);
  if (commentaire && r !== 'tiktok' && (pub.commentaire?.length ?? 0) > INFOS[r].limite) {
    alertes.push(`${NOMS[r]} : commentaire de sources de ${pub.commentaire!.length} caractères (max ${INFOS[r].limite})`);
  }
}
if (pub.titre.length > LIMITE_TITRE_YOUTUBE) alertes.push(`YouTube : titre de ${pub.titre.length} caractères (max ${LIMITE_TITRE_YOUTUBE})`);
if (new Date(date).getTime() < Date.now()) alertes.push(`Date passée : ${lisible(date)}`);

if (!args.includes('--envoyer')) {
  const fictifs = Object.fromEntries(RESEAUX.map((r) => [r, {id: `<id ${NOMS[r]}>`, identifier: INFOS[r].identifiants[0]}]));
  const [cheminVideo, cheminMiniature] = [`<chemin de ${path.basename(mp4)}>`, `<chemin de ${path.basename(png)}>`];
  const corps = construire(pub, fictifs, {id: '<id de la vidéo>', path: cheminVideo}, {id: '<id de la miniature>', path: cheminMiniature}, date, commentaire);
  fs.writeFileSync(path.join(dossier, 'postiz.json'), JSON.stringify(corps, null, 2) + '\n');
  fs.writeFileSync(path.join(dossier, 'postiz-mcp.json'), JSON.stringify(versMcp(corps, cheminMiniature), null, 2) + '\n');
  for (const r of RESEAUX) {
    const {texte, limite} = INFOS[r];
    console.log(`${NOMS[r].padEnd(10)} ${pub[texte].length}/${limite} caractères (section ${texte})${r === 'youtube' ? ` · titre « ${pub.titre} »` : ''}`);
  }
  console.log(`Date      ${lisible(date)} (brouillon)`);
  console.log(`Commentaire de sources : ${commentaire ? '1er commentaire partout, à la main sur TikTok' : pub.commentaire ? 'à poster à la main (--commentaire : partout sauf TikTok)' : 'absent de publication.md'}`);
  alertes.forEach((a) => console.log(`ATTENTION ${a}`));
  console.log('\nAperçu écrit dans postiz.json (API) et postiz-mcp.json (MCP). Rien n’a été envoyé.');
  process.exit(alertes.length ? 1 : 0);
}

if (alertes.length) throw new Error(`Envoi annulé :\n${alertes.map((a) => `  - ${a}`).join('\n')}`);
if (fs.existsSync(journal) && !args.includes('--force')) {
  throw new Error(`Déjà envoyé (${path.relative(RACINE, journal)}) : vérifier dans Postiz avant de recommencer (--force crée des doublons).`);
}

const canaux = choisirCanaux(await appeler<Canal[]>('/integrations'));
const absents = RESEAUX.filter((r) => !canaux[r]);
if (absents.length === RESEAUX.length) throw new Error(`Aucun compte connecté dans Postiz (${RESEAUX.map((r) => NOMS[r]).join(', ')}).`);
if (absents.length) console.log(`Non connectés dans Postiz, ignorés : ${absents.map((r) => NOMS[r]).join(', ')}.`);

const video = await televerser(mp4);
const miniature = canaux.youtube && fs.existsSync(png) ? await televerser(png) : undefined;
const corps = construire(pub, canaux, video, miniature, date, commentaire);
fs.writeFileSync(path.join(dossier, 'postiz.json'), JSON.stringify(corps, null, 2) + '\n');
const reponse = await appeler<{postId: string; integration: string}[]>('/posts', {method: 'POST', body: JSON.stringify(corps)});

const envoi: Journal = {
  envoye: new Date().toISOString(),
  date,
  statut: 'brouillon',
  video: video.path,
  miniature: miniature?.path,
  postes: reponse.map((p) => ({reseau: RESEAUX.find((r) => canaux[r]?.id === p.integration) ?? p.integration, postId: p.postId, integration: p.integration})),
};
fs.writeFileSync(journal, JSON.stringify(envoi, null, 2) + '\n');
envoi.postes.forEach((p) => console.log(`Brouillon : ${p.reseau} (${p.postId})`));
console.log(`\nDate prévue : ${lisible(date)}. Rien n’est publié : relire dans Postiz, puis --programmer après le feu vert.`);
