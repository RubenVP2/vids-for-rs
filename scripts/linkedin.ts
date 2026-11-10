// LinkedIn de Matou : un post de fond par semaine, en carrousel (brand/linkedin.json, skill linkedin).
// Le lundi, la routine bilan pose la question de la semaine sur Discord ; la réponse (via Hermes,
// commande.sh reponse) attend dans l'état des routines. Du mardi au jeudi, la routine rappel
// produit le post : « retour d'expérience » s'il y a une réponse, sinon « coulisses ».
//
// Usage : npm run linkedin -- --question            la question de la semaine (message Discord), notée dans l'état
//         npm run linkedin -- --reponse < texte     la réponse de l'utilisateur (Hermes), pour la dernière question
//         npm run linkedin -- --a-faire             « LINKEDIN: <semaine> » si le post est à produire maintenant, sinon « LINKEDIN: non (…) »
//         npm run linkedin -- --preparer            crée linkedin/<semaine>/ et sa consigne.md (mode, matière)
//         npm run linkedin -- <dossier>             contrôle post.json et rend les diapos (rendu/NN.png)
//         npm run linkedin -- <dossier> --envoyer   brouillon Postiz au prochain créneau (postiz-envoi.json)
//         npm run linkedin -- <dossier> --programmer | --annuler     file Postiz / veto
//   <dossier> : linkedin/2026-S46, ou « dernier » (le plus récent envoyé).
// État hors du dépôt (questions et réponses) : $MATOU_ETAT, défaut ~/.local/state/matou/linkedin.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderStill, selectComposition} from '@remotion/renderer';
import {nombreDiapos, postLinkedinSchema, type PostLinkedin} from '../src/Coulisses';
import {RACINE} from './lib/episode';
import {cli, enListe} from './lib/postiz-cli';
import {empaqueter, navigateur} from './lib/remotion';

type Reglages = {
  jours: number[];
  heure: string;
  productionDes: {jour: number; heure: string};
  productionJusqua: number;
  interdits: string[];
  questions: {id: string; question: string}[];
};
type Poste = {reseau: string; postId: string; integration: string; date: string; statut: 'brouillon' | 'programmé'};
type Journal = {envoye: string; date: string; statut: Poste['statut']; images: string[]; postes: Poste[]};
type Consigne = {semaine: string; mode: PostLinkedin['mode']; question?: string; reponseDe?: string};

const R = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'linkedin.json'), 'utf8')) as Reglages;
const POSTIZ = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'postiz.json'), 'utf8')) as {fuseau: string; delaiVeto: number; linkedin: Record<string, unknown>};
const DOSSIER = path.join(RACINE, 'linkedin');
const ETAT = path.join(process.env.MATOU_ETAT ?? path.join(os.homedir(), '.local', 'state', 'matou'), 'linkedin');
const FUSEAU = POSTIZ.fuseau;

// --- Temps (heure de Paris) ---------------------------------------------------------------------

const parties = (t: number) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23'})
      .formatToParts(t)
      .map((x) => [x.type, x.value]),
  );
  const jourSemaine = {Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7}[p.weekday as string] as number;
  return {jour: `${p.year}-${p.month}-${p.day}`, heure: `${p.hour}:${p.minute}`, jourSemaine};
};
/** Semaine ISO du jour de Paris : « 2026-S46 ». */
const semaineDe = (t: number) => {
  const d = new Date(`${parties(t).jour}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); // jeudi de la semaine ISO
  const n = Math.ceil(((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-S${String(n).padStart(2, '0')}`;
};
const decalage = (t: number) => {
  const nom = new Intl.DateTimeFormat('en-US', {timeZone: FUSEAU, timeZoneName: 'longOffset'}).formatToParts(t).find((p) => p.type === 'timeZoneName')?.value;
  const d = /GMT([+-])(\d{2}):(\d{2})/.exec(nom ?? '');
  return d ? (d[1] === '-' ? -1 : 1) * (Number(d[2]) * 60 + Number(d[3])) * 60_000 : 0;
};
/** « AAAA-MM-JJ » + « HH:MM » de Paris → ms UTC. */
const instant = (jour: string, heure: string) => {
  const [a, m, j] = jour.split('-').map(Number);
  const [h, mi] = heure.split(':').map(Number);
  const naif = Date.UTC(a, m - 1, j, h, mi);
  return naif - decalage(naif - decalage(naif));
};
const lisible = (t: number | string) => new Intl.DateTimeFormat('fr-FR', {timeZone: FUSEAU, dateStyle: 'full', timeStyle: 'short'}).format(new Date(t));

// --- Fichiers ---------------------------------------------------------------------------------

const lireJson = <T>(f: string): T | undefined => {
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8')) as T;
  } catch {
    return undefined;
  }
};
const dossiers = () => (fs.existsSync(DOSSIER) ? fs.readdirSync(DOSSIER).filter((d) => /^\d{4}-S\d{2}$/.test(d)).sort() : []);
const consignes = () => dossiers().map((d) => lireJson<Consigne>(path.join(DOSSIER, d, 'consigne.json'))).filter((c): c is Consigne => !!c);
const fichierQuestion = (s: string) => path.join(ETAT, `question-${s}.json`);
const fichierReponse = (s: string) => path.join(ETAT, `reponse-${s}.txt`);

const args = process.argv.slice(2);
const sortir = (code: number, ...lignes: string[]): never => {
  lignes.forEach((l) => console.log(l));
  process.exit(code);
};

// --- Question et réponse ------------------------------------------------------------------------

if (args.includes('--question')) {
  const semaine = semaineDe(Date.now());
  const deja = lireJson<{id: string; question: string}>(fichierQuestion(semaine));
  // Rotation sur le numéro de semaine, en sautant les questions qui ont déjà donné un post.
  const utilisees = new Set(consignes().map((c) => c.question).filter(Boolean));
  const n = Number(semaine.slice(-2));
  const libres = R.questions.filter((q) => !utilisees.has(q.id));
  const liste = libres.length ? libres : R.questions;
  const q = deja ?? liste[n % liste.length];
  fs.mkdirSync(ETAT, {recursive: true});
  fs.writeFileSync(fichierQuestion(semaine), JSON.stringify({...q, semaine, posee: new Date().toISOString()}, null, 2) + '\n');
  sortir(
    0,
    `Matou — la question LinkedIn de la semaine (${semaine}) :`,
    `> ${q.question}`,
    `Réponds ici en commençant par « réponse : », deux ou trois phrases suffisent, d'ici mardi 11 h. Ta réponse devient le carrousel de la semaine (sans ton nom). Pas de réponse : je publie un post « coulisses » tiré de nos bilans, rien à faire.`,
  );
}

if (args.includes('--reponse')) {
  const texte = fs.readFileSync(0, 'utf8').replace(/^\s*r[ée]ponse\s*:\s*/i, '').trim();
  if (texte.length < 15) sortir(2, 'Réponse vide ou trop courte : rien enregistré.');
  if (texte.length > 4000) sortir(2, `Réponse trop longue (${texte.length} caractères, max 4000) : rien enregistré.`);
  const questions = fs.existsSync(ETAT) ? fs.readdirSync(ETAT).filter((f) => /^question-\d{4}-S\d{2}\.json$/.test(f)).sort() : [];
  if (!questions.length) sortir(2, "Aucune question posée : rien enregistré (la question part avec le bilan du lundi).");
  const semaine = questions.at(-1)!.slice(9, 17);
  const fait = fs.existsSync(path.join(DOSSIER, semaine, 'postiz-envoi.json'));
  fs.writeFileSync(fichierReponse(semaine), texte + '\n');
  sortir(
    0,
    fait
      ? `Réponse enregistrée (${semaine}). Le post de cette semaine est déjà parti : elle servira la semaine prochaine.`
      : `Réponse enregistrée (${semaine}) : elle devient le carrousel LinkedIn de la semaine.`,
  );
}

// --- Production ----------------------------------------------------------------------------------

/** La réponse à utiliser : celle de la semaine, sinon une réponse plus ancienne (4 semaines) jamais utilisée. */
const reponseDisponible = (semaine: string) => {
  const utilisees = new Set(consignes().map((c) => c.reponseDe).filter(Boolean));
  const reponses = fs.existsSync(ETAT) ? fs.readdirSync(ETAT).filter((f) => /^reponse-\d{4}-S\d{2}\.txt$/.test(f)).map((f) => f.slice(8, 16)) : [];
  return reponses
    .filter((s) => s <= semaine && !utilisees.has(s) && Date.now() - fs.statSync(fichierReponse(s)).mtimeMs < 28 * 86_400_000)
    .sort()
    .at(-1);
};

if (args.includes('--a-faire')) {
  const maintenant = parties(Date.now());
  const semaine = semaineDe(Date.now());
  const {jour, heure} = R.productionDes;
  if (maintenant.jourSemaine < jour || (maintenant.jourSemaine === jour && maintenant.heure < heure) || maintenant.jourSemaine > R.productionJusqua)
    sortir(0, `LINKEDIN: non (production du jour ${jour} à ${heure} au jour ${R.productionJusqua})`);
  if (fs.existsSync(path.join(DOSSIER, semaine, 'postiz-envoi.json'))) sortir(0, `LINKEDIN: non (post ${semaine} déjà envoyé)`);
  sortir(0, `LINKEDIN: ${semaine} ${reponseDisponible(semaine) ? 'reponse' : 'coulisses'}`);
}

if (args.includes('--preparer')) {
  const semaine = semaineDe(Date.now());
  const dest = path.join(DOSSIER, semaine);
  fs.mkdirSync(dest, {recursive: true});
  const de = reponseDisponible(semaine);
  const q = de ? lireJson<{id: string; question: string}>(fichierQuestion(de)) : undefined;
  const consigne: Consigne = de ? {semaine, mode: 'reponse', question: q?.id, reponseDe: de} : {semaine, mode: 'coulisses'};
  fs.writeFileSync(path.join(dest, 'consigne.json'), JSON.stringify(consigne, null, 2) + '\n');
  const deja = dossiers()
    .filter((d) => d !== semaine)
    .map((d) => lireJson<PostLinkedin>(path.join(DOSSIER, d, 'post.json')))
    .filter((p): p is PostLinkedin => !!p)
    .map((p) => `- ${p.semaine} (${p.mode}) : ${p.titre.replace(/==/g, '')}`);
  const lignes = [`# Post LinkedIn ${semaine} — mode ${consigne.mode}`, ''];
  if (consigne.mode === 'reponse') {
    lignes.push(
      `## La question (${de})`, '', q?.question ?? '(question introuvable)', '',
      "## La réponse de l'utilisateur (seule source des faits vécus, à ne jamais enrichir)", '',
      fs.readFileSync(fichierReponse(de!), 'utf8').trim(), '',
    );
  } else {
    // La matière des coulisses : ce qui s'est passé depuis 8 jours, d'après le dépôt lui-même.
    const depuis = parties(Date.now() - 8 * 86_400_000).jour;
    const decisions = fs.readFileSync(path.join(RACINE, 'docs', 'decisions.md'), 'utf8').split('\n')
      .filter((l) => /^\| \d{4}-\d{2}-\d{2} \|/.test(l) && l.slice(2, 12) >= depuis)
      .map((l) => `- ${l.slice(2, 12)} : ${l.split('|')[2].trim()}`);
    const bilans = fs.readdirSync(path.join(RACINE, 'docs', 'bilans')).filter((f) => /^\d{4}-\d{2}-\d{2}/.test(f) || f.includes(depuis.slice(0, 7))).sort().slice(-3);
    let commits: string[] = [];
    try {
      commits = execFileSync('git', ['log', `--since=${depuis}`, '--pretty=%s'], {cwd: RACINE, encoding: 'utf8'})
        .split('\n').filter((l) => l && !/^Routine |^Commande |^Merge /.test(l)).slice(0, 15).map((l) => `- ${l}`);
    } catch {
      commits = ['- (historique git illisible)'];
    }
    lignes.push(
      '## Matière (une seule histoire à choisir, lire le fichier avant d’en citer un chiffre)', '',
      `### Décisions des 8 derniers jours (docs/decisions.md)`, '', ...(decisions.length ? decisions : ['- aucune']), '',
      '### Bilans récents (docs/bilans/)', '', ...bilans.map((b) => `- docs/bilans/${b}`), '',
      '### Changements du moteur (git log, hors routines)', '', ...(commits.length ? commits : ['- aucun']), '',
      'Aussi : docs/apprentissages.md (ce qui marche, ce qui a été démenti).', '',
    );
  }
  lignes.push('## Déjà publiés (ne pas refaire le même angle)', '', ...(deja.length ? deja : ['- aucun']), '');
  fs.writeFileSync(path.join(dest, 'consigne.md'), lignes.join('\n'));
  sortir(0, `Consigne : ${path.relative(RACINE, dest)}/consigne.md (mode ${consigne.mode})`, `LINKEDIN: ${semaine}`);
}

// --- Un post : contrôle, rendu, envoi --------------------------------------------------------------

const arg = args.find((a) => !a.startsWith('--'));
if (!arg) sortir(2, 'Préciser le dossier du post (linkedin/2026-S46, ou « dernier ») ou une option (--question, --a-faire, --preparer).');
const dossier =
  arg === 'dernier'
    ? path.join(DOSSIER, dossiers().filter((d) => fs.existsSync(path.join(DOSSIER, d, 'postiz-envoi.json'))).at(-1) ?? '_')
    : path.resolve(arg as string);
const journal = path.join(dossier, 'postiz-envoi.json');

if (args.includes('--programmer') || args.includes('--annuler')) {
  const envoi = lireJson<Journal>(journal) ?? sortir(1, `Aucun envoi pour ${path.relative(RACINE, dossier)} : lancer d'abord --envoyer.`);
  const veto = args.includes('--annuler');
  let etats: Record<string, string> = {};
  try {
    etats = Object.fromEntries(enListe<{id: string; state?: string}>(cli('posts:list')).map((p) => [p.id, String(p.state ?? '').toUpperCase()]));
  } catch (e) {
    console.log(`ATTENTION état Postiz illisible (${(e as Error).message.slice(0, 120)}) : décision sur la date seule.`);
  }
  let code = 0;
  for (const p of envoi.postes) {
    const passe = Date.parse(p.date) <= Date.now();
    if (etats[p.postId] === 'PUBLISHED' || (passe && p.statut === 'programmé')) {
      p.statut = 'programmé';
      console.log(`Inchangé : linkedin, ${lisible(p.date)} (déjà parti)`);
    } else if (veto ? p.statut !== 'programmé' : passe || (p.statut === 'programmé' && etats[p.postId] === 'QUEUE')) {
      console.log(`Inchangé : linkedin, ${lisible(p.date)} (${veto ? 'déjà en brouillon' : passe ? 'date passée' : 'déjà dans la file'})`);
    } else {
      try {
        cli('posts:status', p.postId, '--status', veto ? 'draft' : 'schedule');
        p.statut = veto ? 'brouillon' : 'programmé';
        console.log(`${veto ? 'Repassé en brouillon' : 'Programmé'} : linkedin (${p.postId}), ${lisible(p.date)}`);
      } catch (e) {
        console.log(`Échec : linkedin (${p.postId}) : ${(e as Error).message.slice(0, 200)}`);
        code = 1;
      }
    }
  }
  envoi.statut = envoi.postes.every((p) => p.statut === 'programmé') ? 'programmé' : 'brouillon';
  fs.writeFileSync(journal, JSON.stringify(envoi, null, 2) + '\n');
  process.exit(code);
}

const fichierPost = path.join(dossier, 'post.json');
if (!fs.existsSync(fichierPost)) sortir(1, `${path.relative(RACINE, fichierPost)} absent : l'écrire d'abord (skill linkedin).`);
const lu = postLinkedinSchema.safeParse(lireJson(fichierPost));
if (!lu.success) sortir(1, ...lu.error.issues.map((i) => `KO  post.json : ${i.path.join('.') || '(post)'} : ${i.message}`));
const post = lu.data!;
const consigne = lireJson<Consigne>(path.join(dossier, 'consigne.json'));

// Contrôles : rien d'interne ni de personnel ne sort, la forme LinkedIn, et chaque chiffre a sa source.
const ok: string[] = [];
const ko: string[] = [];
const verifier = (c: boolean, bien: string, mal: string) => (c ? ok : ko).push(c ? bien : mal);
const sansMarques = (t: string) => t.replace(/==/g, '');
const tousLesTextes = [post.titre, post.texte, post.lecon.titre, post.lecon.texte, ...post.diapos.flatMap((d) => [d.titre, d.texte, d.chiffre ?? ''])].map(sansMarques);
const tout = tousLesTextes.join('\n');
const fuites: [RegExp, string][] = [
  [/https?:\/\/|www\./i, 'une URL (LinkedIn freine les liens ; aucun lien dans le post)'],
  [/[\w.+-]+@[\w-]+\.[\w.]+/, 'une adresse mail'],
  [/(^|\s)@[\w.]{2,}/, 'une mention @'],
  [/~\/|\/home\/|\/root\/|\/etc\/|[A-Za-z]:\\/, 'un chemin de fichier'],
  [/\d{9,}/, 'un identifiant (9 chiffres ou plus)'],
  [/\b(sk|pk|ghp|xox[bp])[-_][A-Za-z0-9]{8,}/, 'ce qui ressemble à une clé'],
];
for (const [motif, quoi] of fuites) verifier(!motif.test(tout), `Pas de ${quoi.split(' (')[0]}`, `Le post contient ${quoi} : ${motif.exec(tout)?.[0]}`);
for (const mot of R.interdits) {
  verifier(!new RegExp(`\\b${mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'iu').test(tout), `Pas de « ${mot} »`, `Mot interdit dans le post : « ${mot} » (brand/linkedin.json → interdits)`);
}
const accroche = post.texte.split(/\n\s*\n/)[0];
verifier(accroche.length <= 210, `Accroche de ${accroche.length} caractères`, `Accroche de ${accroche.length} caractères (max 210, avant « voir plus »)`);
const hashtags = post.texte.match(/#[\p{L}_][\p{L}\d_]*/gu) ?? [];
verifier(hashtags.length <= 3, `${hashtags.length} hashtag(s)`, `${hashtags.length} hashtags (max 3)`);
const question = (post.texte.replace(/^\s*(#[\p{L}\d_]+\s*)+$/gmu, '').match(/[^.!?\n]*\?/g) ?? []).at(-1)?.trim() ?? '';
verifier(!!question && post.texte.trim().lastIndexOf('?') > post.texte.trim().length * 0.6, 'Question finale', 'Le post doit finir par une question ouverte (dernier paragraphe)');
verifier(!/^(est-ce que|tu penses que|vous pensez que|êtes-vous d'accord)/i.test(question), 'Question ouverte', `Question fermée (oui/non) : « ${question} »`);
if (consigne) verifier(consigne.mode === post.mode, `Mode ${post.mode}`, `Mode ${post.mode} alors que la consigne dit ${consigne.mode}`);

// Matière : la réponse (mode reponse) ou les fichiers cités (mode coulisses). Chaque chiffre doit y être.
let matiere = '';
if (post.mode === 'reponse') {
  verifier(post.sources.some((s) => /réponse de la semaine/i.test(s)), 'Source : la réponse de la semaine', 'Mode reponse : « réponse de la semaine » doit figurer dans sources');
  matiere = fs.existsSync(path.join(dossier, 'consigne.md')) ? fs.readFileSync(path.join(dossier, 'consigne.md'), 'utf8') : '';
  if (post.question) verifier(R.questions.some((q) => q.id === post.question), `Question ${post.question}`, `Question « ${post.question} » absente de brand/linkedin.json`);
}
for (const s of post.sources.filter((x) => !/réponse de la semaine/i.test(x))) {
  const f = path.join(RACINE, s.split('#')[0].trim());
  if (fs.existsSync(f) && fs.statSync(f).isFile()) matiere += '\n' + fs.readFileSync(f, 'utf8');
  else ko.push(`Source introuvable dans le dépôt : ${s}`);
}
const chiffres = [...new Set(tout.match(/\d+(?:[.,]\d+)?/g) ?? [])].filter((n) => !/^20\d\d$/.test(n) && n !== post.semaine.slice(-2));
const norm = (t: string) => t.replace(/\s| | /g, '');
const absents = chiffres.filter((n) => !norm(matiere).includes(n) && !norm(matiere).includes(n.replace(',', '.')) && !norm(matiere).includes(n.replace('.', ',')));
verifier(!absents.length, `Chiffres retrouvés dans les sources (${chiffres.length})`, `Chiffres absents des sources : ${absents.join(', ')} (ne rien inventer : retirer, ou citer le fichier qui les donne)`);

ok.forEach((m) => console.log(`OK  ${m}`));
ko.forEach((m) => console.log(`KO  ${m}`));
if (ko.length) sortir(1, `\n${ko.length} point(s) à corriger.`);

const rendu = path.join(dossier, 'rendu');
const images = () => (fs.existsSync(rendu) ? fs.readdirSync(rendu).filter((f) => f.endsWith('.png')).sort().map((f) => path.join(rendu, f)) : []);

if (!args.includes('--envoyer')) {
  fs.rmSync(rendu, {recursive: true, force: true});
  fs.mkdirSync(rendu, {recursive: true});
  const serveUrl = await empaqueter();
  const browserExecutable = navigateur();
  for (let index = 0; index < nombreDiapos(post); index++) {
    const inputProps = {post, index};
    const composition = await selectComposition({serveUrl, id: 'DiapoLinkedin', inputProps, browserExecutable, logLevel: 'error', timeoutInMilliseconds: 120000});
    const output = path.join(rendu, `${String(index + 1).padStart(2, '0')}.png`);
    await renderStill({serveUrl, composition, inputProps, output, browserExecutable, logLevel: 'error', timeoutInMilliseconds: 120000});
    console.log(path.relative(RACINE, output));
  }
  sortir(0, `\nPrêt : ${nombreDiapos(post)} diapos. Envoi : npm run linkedin -- ${path.relative(RACINE, dossier)} --envoyer`);
}

// --envoyer : un brouillon au prochain créneau (jours et heure de brand/linkedin.json), au moins delaiVeto h après.
if (fs.existsSync(journal) && !args.includes('--force')) sortir(1, `Déjà envoyé (${path.relative(RACINE, journal)}) : vérifier dans Postiz (--force crée un doublon).`);
const fichiers = images();
if (fichiers.length !== nombreDiapos(post)) sortir(1, `Diapos absentes ou périmées (${fichiers.length} sur ${nombreDiapos(post)}) : relancer npm run linkedin -- ${path.relative(RACINE, dossier)}`);
let date: number | undefined;
for (let d = 0; d < 9 && date === undefined; d++) {
  const p = parties(Date.now() + d * 86_400_000);
  const t = instant(p.jour, R.heure);
  if (R.jours.includes(p.jourSemaine) && t - Date.now() >= POSTIZ.delaiVeto * 3_600_000) date = t;
}
if (date === undefined) sortir(1, 'Aucun créneau LinkedIn dans les 8 jours (brand/linkedin.json → jours).');
const canal = enListe<{id: string; identifier: string; disabled: boolean}>(cli('integrations:list'), 'integrations').find(
  (c) => !c.disabled && ['linkedin', 'linkedin-page'].includes(c.identifier),
);
if (!canal) sortir(1, 'Aucun compte LinkedIn connecté dans Postiz.');
const medias = fichiers.map((f) => {
  const r = cli<{id?: string; path: string}>('upload', f);
  console.log(`Téléversé : ${path.relative(RACINE, f)}`);
  return {id: r.id ?? path.basename(f), path: r.path};
});
const charge = {
  type: 'draft',
  date: new Date(date!).toISOString(),
  shortLink: false,
  tags: [],
  posts: [
    {
      integration: {id: canal!.id},
      value: [{content: post.texte, image: medias}],
      settings: {__type: canal!.identifier, ...POSTIZ.linkedin, post_as_images_carousel: true, carousel_name: sansMarques(post.titre)},
    },
  ],
};
const tmp = path.join(os.tmpdir(), `postiz-linkedin-${Date.now()}.json`);
fs.writeFileSync(tmp, JSON.stringify(charge));
const reponse = enListe<{postId?: string; id?: string}>(cli('posts:create', '--json', tmp));
fs.rmSync(tmp, {force: true});
const envoi: Journal = {
  envoye: new Date().toISOString(),
  date: charge.date,
  statut: 'brouillon',
  images: medias.map((m) => m.path),
  postes: reponse.map((p) => ({reseau: 'linkedin', postId: p.postId ?? p.id ?? '', integration: canal!.id, date: charge.date, statut: 'brouillon' as const})),
};
fs.writeFileSync(journal, JSON.stringify(envoi, null, 2) + '\n');
sortir(0, `Brouillon : linkedin, ${lisible(date!)} (carrousel de ${medias.length} diapos)`, 'Rien n’est publié : --programmer le met dans la file (veto ensuite : --annuler).');
