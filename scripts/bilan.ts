// Bilan : les chiffres de chaque épisode envoyé dans Postiz (vues, likes, commentaires… par réseau)
// et ceux des comptes. Sert au skill bilan (tâche planifiée du lundi).
// Usage : npm run bilan [-- --jours 30]
//         npm run bilan -- --attente   épisodes dont les posts sont encore en brouillon (n'écrit rien)
// Écrit episodes/NNN-slug/stats.json (chiffres bruts, versionnés) et affiche deux tableaux Markdown.
// Accès : même clé que npm run postiz (POSTIZ_API_KEY, POSTIZ_ENV ou secret réseau sur api.postiz.com).
import fs from 'node:fs';
import path from 'node:path';
import {EPISODES} from './lib/episode';

type Serie = {label: string; average?: boolean; data: {total: number | string; date: string}[]};
type Poste = {reseau: string; postId: string; integration: string};
type Post = {id: string; state: string; releaseURL: string | null; publishDate: string};
type Canal = {id: string; name: string; identifier: string; disabled: boolean};

const API = (process.env.POSTIZ_API_URL ?? 'https://api.postiz.com').replace(/\/$/, '');
const args = process.argv.slice(2);
const jours = Number(args[args.indexOf('--jours') + 1]) || 30;

const appeler = async <T>(chemin: string): Promise<T> => {
  const entetes = new Headers();
  const cle = process.env.POSTIZ_API_KEY ?? process.env.POSTIZ_ENV;
  if (cle) entetes.set('Authorization', cle);
  const rep = await fetch(`${API}/public/v1${chemin}`, {headers: entetes});
  if (!rep.ok) throw new Error(`Postiz GET ${chemin} : HTTP ${rep.status} ${await rep.text()}`);
  return (await rep.json()) as T;
};

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
const {posts} = await appeler<{posts: Post[]}>(`/posts?startDate=${debut}&endDate=${fin}`);
const parId = new Map(posts.map((p) => [p.id, p]));

if (args.includes('--attente')) {
  const enAttente = envois.filter(({envoi}) => (envoi.postes as Poste[]).some((p) => parId.get(p.postId)?.state === 'DRAFT'));
  enAttente.forEach(({d, envoi}) => console.log(`${d} : brouillons pour le ${new Date(envoi.date).toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})}`));
  console.log(`${enAttente.length} épisode(s) en attente de relecture.`);
  process.exit(0);
}

console.log(`## Épisodes (${jours} derniers jours)\n`);
console.log('| Épisode | Série | Réseau | État | Chiffres |\n| --- | --- | --- | --- | --- |');
for (const {d, envoi} of envois) {
  const scenes = JSON.parse(fs.readFileSync(path.join(EPISODES, d, 'scenes.json'), 'utf8'));
  const postes = [];
  for (const p of envoi.postes as Poste[]) {
    const post = parId.get(p.postId);
    const etat = post?.state ?? 'introuvable (supprimé ?)';
    const brut = post?.releaseURL || etat === 'PUBLISHED' ? await appeler<Serie[] | {missing: true}>(`/analytics/post/${p.postId}?date=${jours}`) : [];
    const manquant = !Array.isArray(brut);
    const stats = Array.isArray(brut) ? resumer(brut) : {};
    postes.push({...p, etat, url: post?.releaseURL ?? null, manquant, stats});
    const note = manquant ? 'publication non reliée : posts:missing puis posts:connect (skill postiz)' : enLigne(stats);
    console.log(`| ${d} | ${scenes.serie} | ${p.reseau} | ${etat}${post?.releaseURL ? ` ([lien](${post.releaseURL}))` : ''} | ${note} |`);
  }
  const stats = {maj: new Date().toISOString(), jours, date: envoi.date, postes};
  fs.writeFileSync(path.join(EPISODES, d, 'stats.json'), JSON.stringify(stats, null, 2) + '\n');
}

console.log('\n## Comptes (7 derniers jours)\n');
console.log('| Réseau | Compte | Chiffres |\n| --- | --- | --- |');
for (const c of (await appeler<Canal[]>('/integrations')).filter((c) => !c.disabled)) {
  const brut = await appeler<Serie[]>(`/analytics/${c.id}?date=7`).catch(() => []);
  console.log(`| ${c.identifier} | ${c.name} | ${enLigne(resumer(Array.isArray(brut) ? brut : []))} |`);
}
