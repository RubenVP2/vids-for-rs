// Bilan : les chiffres de chaque épisode envoyé dans Postiz (vues, likes, commentaires… par réseau)
// et ceux des comptes. Sert au skill bilan (tâche planifiée du lundi).
// Usage : npm run bilan [-- --jours 30]
//         npm run bilan -- --attente   épisodes dont les posts sont encore en brouillon (n'écrit rien)
// Écrit episodes/NNN-slug/stats.json (chiffres bruts, versionnés) et affiche trois tableaux Markdown
// (épisodes, gabarits de texte, comptes).
// Accès : CLI officielle `postiz` authentifiée par OAuth2 (postiz auth:login), sans clé API.
import fs from 'node:fs';
import path from 'node:path';
import {EPISODES} from './lib/episode';
import {lireDeclares} from './lib/gabarits';
import {cli, enListe} from './lib/postiz-cli';

type Serie = {label: string; average?: boolean; data: {total: number | string; date: string}[]};
type Poste = {reseau: string; postId: string; integration: string; date?: string};
type Post = {id: string; state: string; releaseURL: string | null; publishDate: string};
type Canal = {id: string; name: string; identifier: string; disabled: boolean};

const args = process.argv.slice(2);
const jours = Number(args[args.indexOf('--jours') + 1]) || 30;
/** « jeu. 30, 18:30 » : chaque réseau a son créneau (brand/postiz.json), le bilan les compare. */
const creneau = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', {timeZone: 'Europe/Paris', weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});

/** Une série Postiz → un nombre : la somme des jours, ou leur moyenne pour une durée moyenne. */
const resumer = (series: Serie[]) =>
  Object.fromEntries(
    series.map((s) => {
      const valeurs = s.data.map((d) => Number(d.total) || 0);
      const somme = valeurs.reduce((a, b) => a + b, 0);
      return [s.label, Math.round((s.average ? somme / Math.max(valeurs.length, 1) : somme) * 10) / 10];
    }),
  );
const enLigne = (stats: Record<string, number>) =>
  Object.entries(stats)
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ') || '—';

const dossiers = fs
  .readdirSync(EPISODES)
  .filter((d) => fs.existsSync(path.join(EPISODES, d, 'postiz-envoi.json')))
  .sort();
const envois = dossiers.map((d) => ({d, envoi: JSON.parse(fs.readFileSync(path.join(EPISODES, d, 'postiz-envoi.json'), 'utf8'))}));
const plusAncien = Math.min(Date.now(), ...envois.map((e) => new Date(e.envoi.date).getTime()));
const [debut, fin] = [plusAncien - 2 * 86_400_000, Date.now() + 15 * 86_400_000].map((t) => new Date(t).toISOString());
const posts = enListe<Post>(cli('posts:list', '--startDate', debut, '--endDate', fin));
const parId = new Map(posts.map((p) => [p.id, p]));

if (args.includes('--attente')) {
  const enAttente = envois.filter(({envoi}) => (envoi.postes as Poste[]).some((p) => parId.get(p.postId)?.state === 'DRAFT'));
  for (const {d, envoi} of enAttente) {
    // le créneau le plus proche : celui avant lequel il faut relire
    const dates = (envoi.postes as Poste[]).filter((p) => parId.get(p.postId)?.state === 'DRAFT').map((p) => p.date ?? envoi.date).sort();
    console.log(`${d} : brouillons à relire avant ${creneau(dates[0])}`);
  }
  console.log(`${enAttente.length} épisode(s) en attente de relecture.`);
  process.exit(0);
}

const parGabarit: {reseau: string; gabarit: string; stats: Record<string, number>}[] = [];
console.log(`## Épisodes (${jours} derniers jours)\n`);
console.log('| Épisode | Série | Rang | Réseau | Créneau | État | Chiffres |\n| --- | --- | --- | --- | --- | --- | --- |');
for (const {d, envoi} of envois) {
  // Un épisode reconstitué (archive.md) n'a plus ses scènes : sa série est notée dans postiz-envoi.json.
  const fichierScenes = path.join(EPISODES, d, 'scenes.json');
  const serie = fs.existsSync(fichierScenes) ? JSON.parse(fs.readFileSync(fichierScenes, 'utf8')).serie : (envoi.serie ?? '—');
  const fichierPub = path.join(EPISODES, d, 'publication.md');
  const declares = fs.existsSync(fichierPub) ? lireDeclares(fs.readFileSync(fichierPub, 'utf8')) : {};
  const postes = [];
  for (const p of envoi.postes as Poste[]) {
    const post = parId.get(p.postId);
    const etat = post?.state ?? 'introuvable (supprimé ?)';
    const brut = post?.releaseURL || etat === 'PUBLISHED' ? cli<Serie[] | {missing: true}>('analytics:post', p.postId, '-d', String(jours)) : [];
    const manquant = !Array.isArray(brut);
    const stats = Array.isArray(brut) ? resumer(brut) : {};
    const reseau = p.reseau === 'threads-relance' ? 'relance' : p.reseau;
    const gabarit = declares[reseau]?.id ?? null;
    if (gabarit && Object.keys(stats).length) parGabarit.push({reseau, gabarit, stats});
    postes.push({...p, etat, url: post?.releaseURL ?? null, manquant, gabarit, stats});
    const note = manquant ? 'publication non reliée : posts:missing puis posts:connect (skill postiz)' : enLigne(stats);
    console.log(`| ${d} | ${serie} | ${envoi.rang ?? 'principal'} | ${p.reseau} | ${creneau(p.date ?? envoi.date)} | ${etat}${post?.releaseURL ? ` ([lien](${post.releaseURL}))` : ''} | ${note} |`);
  }
  const stats = {maj: new Date().toISOString(), jours, date: envoi.date, rang: envoi.rang ?? 'principal', postes};
  fs.writeFileSync(path.join(EPISODES, d, 'stats.json'), JSON.stringify(stats, null, 2) + '\n');
}

// Gabarits de texte (docs/publication.md) : moyenne de chaque chiffre, réseau par réseau.
console.log('\n## Gabarits de texte (moyennes par post)\n');
console.log('| Réseau | Gabarit | Posts | Chiffres |\n| --- | --- | --- | --- |');
const groupes = new Map<string, typeof parGabarit>();
for (const x of parGabarit) groupes.set(`${x.reseau} ${x.gabarit}`, [...(groupes.get(`${x.reseau} ${x.gabarit}`) ?? []), x]);
for (const [cle, lignes] of [...groupes].sort(([a], [b]) => a.localeCompare(b))) {
  const [reseau, gabarit] = cle.split(' ');
  const labels = [...new Set(lignes.flatMap((l) => Object.keys(l.stats)))];
  const moyennes = Object.fromEntries(labels.map((k) => [k, Math.round((lignes.reduce((s, l) => s + (l.stats[k] ?? 0), 0) / lignes.length) * 10) / 10]));
  console.log(`| ${reseau} | ${gabarit} | ${lignes.length} | ${enLigne(moyennes)} |`);
}
if (!groupes.size) console.log('| — | aucun post publié avec un gabarit déclaré | 0 | — |');

console.log('\n## Comptes (7 derniers jours)\n');
console.log('| Réseau | Compte | Chiffres |\n| --- | --- | --- |');
for (const c of enListe<Canal>(cli('integrations:list'), 'integrations').filter((c) => !c.disabled)) {
  const brut = (() => { try { return cli<Serie[]>('analytics:platform', c.id, '-d', '7'); } catch { return []; } })();
  console.log(`| ${c.identifier} | ${c.name} | ${enLigne(resumer(Array.isArray(brut) ? brut : []))} |`);
}
