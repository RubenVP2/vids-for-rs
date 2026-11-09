// Veille déterministe : collecte une liste fixe de flux (brand/veille.json), regroupe les articles
// qui parlent de la même annonce, note chaque sujet par règles fixes et choisit le premier.
// Mêmes articles + mêmes épisodes + même heure → même classement (docs/veille.md).
// Usage : npm run veille -- --rang principal|second     collecte, classe, écrit veille/AAAA-MM-JJ-<rang>.{json,md}
//         npm run veille -- --rang second --ecarter C02 --raison "…"   veto de l'agent : sujet suivant
//         npm run veille -- --rejouer veille/2026-11-01-principal.json  reclasse les mêmes articles (contrôle)
// La dernière ligne est toujours « CHOIX: <id> <url> » ou « CHOIX: aucun ».
import fs from 'node:fs';
import path from 'node:path';
import {EPISODES, FRAICHEUR_MAX, RACINE} from './lib/episode';

type Flux = {nom: string; type: 'officiel' | 'media' | 'agregateur'; url: string; filtre?: boolean};
type Config = {
  fenetreHeures: number; seuil: number; seuilReserve: number; reserveJours: number;
  points: Record<string, number>; flux: Flux[]; hn: string; reddit: string[]; trends: string;
  entites: Record<string, string>; motsIA: string[]; motsHorsSujet: string[]; motsVides: string[];
};
/** Un article (ou un signal HN / Reddit) tel que collecté : c'est l'entrée gelée du classement.
 *  `via` : agrégateur d'où vient l'article (son lien est une redirection, à éviter en tête). */
type Article = {source: string; type: Flux['type'] | 'hn' | 'reddit'; titre: string; url: string; date: string; points?: number; via?: string};
type Detail = {officiel: number; medias: number; fraicheur: number; hn: number; reddit: number; trends: number};
type Sujet = {
  id: string; titre: string; url: string; date: string; entreprises: string[]; sources: string[];
  officiel: boolean; score: number; detail: Detail; exclu?: string; articles: Article[]; signaux: Article[];
};
type Candidat = {id: string; titre: string; url: string; score: number; origine: 'actu' | 'reserve'};
type Passage = {
  genere: string; rang: string; maintenant: string; erreurs: string[]; articles: Article[]; tendances: string[];
  sujets: Sujet[]; candidats: Candidat[]; ecartes: {id: string; raison: string}[]; choix: string | null;
};
type Reserve = {titre: string; url: string; date: string; score: number; ajoute: string}[];

const CONFIG: Config = JSON.parse(fs.readFileSync(path.join(RACINE, 'brand', 'veille.json'), 'utf8'));
const DOSSIER = path.join(RACINE, 'veille');
const RESERVE = path.join(DOSSIER, 'reserve.json');
const HEURE = 3_600_000;

const args = process.argv.slice(2);
const option = (nom: string) => (args.includes(nom) ? args[args.indexOf(nom) + 1] : undefined);
const jourParis = (t: number) => new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Paris'}).format(new Date(t));
/** Âge en jours d'un article (date de publication ISO), jours de Paris. */
const ageJours = (iso: string, maintenant: number) =>
  Math.round((Date.parse(jourParis(maintenant)) - Date.parse(jourParis(Date.parse(iso)))) / 86_400_000);

// --- Texte : décodage, mots, entreprises ---------------------------------------------------------

const decoder = (s: string) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, e) => ({amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' '})[e as string]!)
    .replace(/\s+/g, ' ').trim();

const VIDES = new Set(CONFIG.motsVides);
/** Mots porteurs d'un titre : minuscules, sans accents, sans mots vides, pluriel simple retiré. */
const mots = (titre: string) =>
  new Set(
    titre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/)
      .filter((m) => m.length >= 3 && !VIDES.has(m))
      .map((m) => (m.length > 4 && /[sx]$/.test(m) && !(m in CONFIG.entites) ? m.slice(0, -1) : m)),
  );
const motsBruts = (titre: string) => new Set(titre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/));
const ENTREPRISES = new Set(Object.values(CONFIG.entites));
const entreprisesDe = (m: Set<string>) => [...new Set([...m].filter((x) => x in CONFIG.entites).map((x) => CONFIG.entites[x]))].sort();
const parleIA = (titre: string) => {
  const b = motsBruts(titre);
  return CONFIG.motsIA.some((m) => b.has(m)) || [...b].some((m) => m in CONFIG.entites) || /intelligence artificielle|artificial intelligence/i.test(titre);
};

/** Même annonce ? Au moins une entité en commun, deux mots précis (pas un simple nom d'entreprise),
 *  et trois mots communs ou la moitié du titre le plus court. */
const memeAnnonce = (a: Set<string>, b: Set<string>) => {
  const communs = [...a].filter((m) => b.has(m));
  if (!communs.some((m) => m in CONFIG.entites)) return false;
  if (communs.filter((m) => !ENTREPRISES.has(m)).length < 2) return false;
  return communs.length >= 3 || communs.length / Math.min(a.size, b.size) >= 0.5;
};
const urlPropre = (u: string) => u.replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();

// --- Collecte ----------------------------------------------------------------------------------

const lire = async (url: string, essai = 1): Promise<string> => {
  const r = await fetch(url, {
    headers: {'user-agent': 'Mozilla/5.0 (matou-veille; +https://matou.ai)', accept: 'application/rss+xml, application/atom+xml, application/xml, application/json, */*'},
    signal: AbortSignal.timeout(20_000),
  });
  if (r.status === 429 && essai < 3) { // limite de débit : on patiente, deux fois au plus
    await new Promise((ok) => setTimeout(ok, essai * 8_000));
    return lire(url, essai + 1);
  }
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
};
const balise = (bloc: string, ...noms: string[]) => {
  for (const n of noms) {
    const m = bloc.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'i'));
    if (m && decoder(m[1])) return decoder(m[1]);
  }
  return '';
};
/** RSS 2.0 et Atom, sans dépendance : titre, lien, date, éditeur (Google Actualités). */
const elements = (xml: string) =>
  [...xml.matchAll(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi)].map(([bloc]) => {
    const href = bloc.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)/i)?.[1] ?? bloc.match(/<link[^>]*href=["']([^"']+)/i)?.[1];
    return {
      titre: balise(bloc, 'title'),
      url: href ?? balise(bloc, 'link'),
      date: balise(bloc, 'pubDate', 'published', 'dc:date', 'updated'),
      editeur: balise(bloc, 'source'),
    };
  });

const collecter = async (maintenant: number) => {
  const depuis = maintenant - CONFIG.fenetreHeures * HEURE;
  const articles: Article[] = [];
  const erreurs: string[] = [];
  const garder = (a: Article) => {
    const t = Date.parse(a.date);
    if (a.titre && a.url && Number.isFinite(t) && t >= depuis && t <= maintenant + HEURE) articles.push({...a, date: new Date(t).toISOString()});
  };
  for (const f of CONFIG.flux) {
    try {
      for (const e of elements(await lire(f.url))) {
        if (f.filtre && !parleIA(e.titre)) continue;
        // Google Actualités : « Titre - Éditeur » ; chaque éditeur compte comme un média.
        const titre = f.type === 'agregateur' ? e.titre.replace(/\s+-\s+[^-]+$/, '') : e.titre;
        if (f.type === 'agregateur') garder({source: e.editeur || f.nom, type: 'media', titre, url: e.url, date: e.date, via: f.nom});
        else garder({source: f.nom, type: f.type, titre, url: e.url, date: e.date});
      }
    } catch (err) {
      erreurs.push(`${f.nom} : ${(err as Error).message}`);
    }
  }
  try {
    const hn = JSON.parse(await lire(CONFIG.hn.replace('{depuis}', String(Math.floor(depuis / 1000))))) as {hits: {title: string; url?: string; objectID: string; points: number; created_at: string}[]};
    for (const h of hn.hits.filter((h) => parleIA(h.title)))
      garder({source: 'Hacker News', type: 'hn', titre: h.title, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, date: h.created_at, points: h.points});
  } catch (err) {
    erreurs.push(`Hacker News : ${(err as Error).message}`);
  }
  for (const url of CONFIG.reddit) {
    try {
      for (const e of elements(await lire(url))) garder({source: `r/${url.split('/r/')[1].split('/')[0]}`, type: 'reddit', titre: e.titre, url: e.url, date: e.date});
    } catch (err) {
      erreurs.push(`${url.split('/r/')[1].split('/')[0]} : ${(err as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, 4_000)); // Reddit refuse les rafales (429)
  }
  let tendances: string[] = [];
  try {
    tendances = elements(await lire(CONFIG.trends)).map((e) => e.titre).filter(Boolean);
  } catch (err) {
    erreurs.push(`Google Trends : ${(err as Error).message}`);
  }
  return {articles, erreurs, tendances};
};

// --- Classement (fonction pure des articles, des épisodes et de l'heure) ------------------------

type Traite = {url: string; mots: Set<string>; entreprises: string[]; date: number; rang: string; envoye: number};
const dejaTraites = (): Traite[] =>
  fs.readdirSync(EPISODES).sort().flatMap((d) => {
    try {
      const sc = JSON.parse(fs.readFileSync(path.join(EPISODES, d, 'scenes.json'), 'utf8'));
      const envoi = fs.existsSync(path.join(EPISODES, d, 'postiz-envoi.json')) ? JSON.parse(fs.readFileSync(path.join(EPISODES, d, 'postiz-envoi.json'), 'utf8')) : {};
      const titres = JSON.stringify(sc).match(/"titreArticle":"[^"]*"/g)?.map((t) => t.slice(16, -1)) ?? [];
      const m = mots([...titres, d.replace(/^\d+-/, '').replace(/-/g, ' ')].join(' '));
      return [{
        url: urlPropre(sc.source?.url ?? ''), mots: m,
        entreprises: [...new Set([...entreprisesDe(m), ...entreprisesDe(mots(sc.source?.nom ?? ''))])].sort(),
        date: Date.parse(sc.source?.date ?? '') || 0, rang: envoi.rang ?? 'principal', envoye: Date.parse(envoi.envoye ?? '') || 0,
      }];
    } catch {
      return [];
    }
  });

const classer = (articles: Article[], tendances: string[], rang: string, maintenant: number): Sujet[] => {
  const P = CONFIG.points;
  const tri = (a: Article, b: Article) => a.date.localeCompare(b.date) || a.url.localeCompare(b.url);
  const presse = articles.filter((a) => a.type === 'officiel' || a.type === 'media').sort(tri);
  const signaux = articles.filter((a) => a.type === 'hn' || a.type === 'reddit').sort(tri);

  // Regroupement glouton, dans l'ordre chronologique : un article rejoint le premier groupe
  // dont un membre parle de la même annonce, sinon il en ouvre un.
  const groupes: {articles: Article[]; mots: Set<string>[]; signaux: Article[]}[] = [];
  const vus = new Set<string>();
  for (const a of presse) {
    const cle = `${a.source}|${urlPropre(a.url)}`;
    if (vus.has(cle)) continue;
    vus.add(cle);
    const m = mots(a.titre);
    const g = groupes.find((g) => g.articles.some((b) => urlPropre(b.url) === urlPropre(a.url)) || g.mots.some((x) => memeAnnonce(m, x)));
    if (g) { g.articles.push(a); g.mots.push(m); } else groupes.push({articles: [a], mots: [m], signaux: []});
  }
  // Un signal (HN, Reddit) s'attache au groupe qui partage le plus de mots ; il ne crée pas de sujet.
  for (const s of signaux) {
    const m = mots(s.titre);
    let meilleur = -1, communs = 0;
    groupes.forEach((g, i) => {
      if (!g.articles.some((b) => urlPropre(b.url) === urlPropre(s.url)) && !g.mots.some((x) => memeAnnonce(m, x))) return;
      const n = Math.max(...g.mots.map((x) => [...m].filter((y) => x.has(y)).length));
      if (n > communs) { meilleur = i; communs = n; }
    });
    if (meilleur >= 0) groupes[meilleur].signaux.push(s);
  }

  const traites = dejaTraites();
  const aujourdhui = jourParis(maintenant);
  const principalDuJour = traites.filter((t) => t.rang === 'principal' && t.envoye && jourParis(t.envoye) === aujourdhui);
  const motsTendances = tendances.map((t) => mots(t)).filter((m) => m.size > 0);

  const sujets = groupes.map((g) => {
    const tous = new Set(g.mots.flatMap((m) => [...m]));
    const officiels = g.articles.filter((a) => a.type === 'officiel');
    const medias = new Set(g.articles.filter((a) => a.type === 'media').map((a) => a.source.toLowerCase()));
    const tete = officiels[0] ?? g.articles.find((a) => !a.via) ?? g.articles[0];
    const age = (maintenant - Date.parse(g.articles[0].date)) / HEURE;
    const hnMax = Math.max(0, ...g.signaux.filter((s) => s.type === 'hn').map((s) => s.points ?? 0));
    const detail: Detail = {
      officiel: officiels.length ? P.officiel : 0,
      medias: Math.min(P.mediasMax, medias.size * P.parMedia),
      fraicheur: age < 12 ? P.moins12h : age < 24 ? P.moins24h : 0,
      hn: Math.min(P.hnMax, Math.round(hnMax * P.hnParPoint)),
      reddit: Math.min(P.redditMax, g.signaux.filter((s) => s.type === 'reddit').length * P.parReddit),
      trends: motsTendances.some((t) => [...t].every((m) => tous.has(m)) && [...t].some((m) => m in CONFIG.entites)) ? P.trends : 0,
    };
    const entreprises = entreprisesDe(tous);
    let exclu: string | undefined;
    if (!officiels.length && medias.size < 2) exclu = 'un seul média, pas de source officielle';
    const finance = g.articles.filter((a) => CONFIG.motsHorsSujet.some((m) => motsBruts(a.titre).has(m))).length;
    if (finance * 2 >= g.articles.length) exclu = 'hors sujet (finance, bourse)';
    for (const t of traites) {
      const recent = maintenant - t.date < 7 * 24 * HEURE;
      if (g.articles.some((a) => urlPropre(a.url) === t.url)) exclu = 'déjà traité (même article)';
      else if (recent && g.mots.some((m) => memeAnnonce(m, t.mots))) exclu = 'déjà traité (même annonce, moins de 7 jours)';
    }
    if (!exclu && rang === 'second') {
      const commune = principalDuJour.flatMap((t) => t.entreprises).find((e) => entreprises.includes(e));
      if (commune) exclu = `même entreprise que le principal du jour (${commune})`;
    }
    return {
      id: '', titre: tete.titre, url: tete.url, date: g.articles[0].date, entreprises,
      sources: [...new Set(g.articles.map((a) => a.source))], officiel: officiels.length > 0,
      score: Object.values(detail).reduce((a, b) => a + b, 0), detail, exclu, articles: g.articles, signaux: g.signaux,
    };
  });
  sujets.sort((a, b) => b.score - a.score || b.sources.length - a.sources.length || a.date.localeCompare(b.date) || a.url.localeCompare(b.url));
  sujets.forEach((s, i) => (s.id = `C${String(i + 1).padStart(2, '0')}`));
  return sujets;
};

// --- Réserve et choix --------------------------------------------------------------------------

const lireReserve = (): Reserve => (fs.existsSync(RESERVE) ? JSON.parse(fs.readFileSync(RESERVE, 'utf8')) : []);

/** Ordre fixe : l'actu au-dessus du seuil, puis la réserve (meilleur score d'abord) : les bons
 *  sujets des 7 derniers jours, dont ceux du jour qui passent seulement le seuil de réserve. */
const candidats = (sujets: Sujet[], reserve: Reserve, maintenant: number): Candidat[] => {
  const enCandidat = (s: Sujet, origine: Candidat['origine']) => ({id: s.id, titre: s.titre, url: s.url, score: s.score, origine});
  // Une info de plus de FRAICHEUR_MAX jours ne peut plus être proposée : check.ts la refuserait à
  // l'envoi (la vidéo affiche la date de la source). Mieux vaut zéro candidat qu'un sujet périmé.
  // Repère = l'heure de la veille, pas l'horloge : un rejeu doit donner le même classement.
  const frais = (d: string) => ageJours(d, maintenant) <= FRAICHEUR_MAX;
  const actu = sujets.filter((s) => !s.exclu && s.score >= CONFIG.seuil).map((s) => enCandidat(s, 'actu'));
  const faibles = sujets.filter((s) => !s.exclu && s.score < CONFIG.seuil && s.score >= CONFIG.seuilReserve && frais(s.date)).map((s) => enCandidat(s, 'reserve'));
  const pris = new Set(sujets.map((s) => urlPropre(s.url)));
  const traites = new Set(dejaTraites().map((t) => t.url));
  const res = reserve.filter((r) => frais(r.date) && !pris.has(urlPropre(r.url)) && !traites.has(urlPropre(r.url)))
    .map((r, i) => ({id: `R${String(i + 1).padStart(2, '0')}`, titre: r.titre, url: r.url, score: r.score, origine: 'reserve' as const}));
  const repli = [...faibles, ...res].sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));
  return [...actu, ...repli];
};
const choisir = (p: Passage) => p.candidats.find((c) => !p.ecartes.some((e) => e.id === c.id))?.id ?? null;

/** Bons sujets non choisis → réserve ; on retire ce qui est traité, choisi, écarté par l'agent ou trop vieux. */
const majReserve = (p: Passage, maintenant: number) => {
  const limite = maintenant - CONFIG.reserveJours * 24 * HEURE;
  const retires = new Set([...dejaTraites().map((t) => t.url),
    ...p.candidats.filter((c) => c.id === p.choix || p.ecartes.some((e) => e.id === c.id)).map((c) => urlPropre(c.url))]);
  const reserve = lireReserve().filter((r) => Date.parse(r.date) >= limite && !retires.has(urlPropre(r.url)));
  for (const s of p.sujets) {
    if (s.exclu || s.score < CONFIG.seuilReserve || retires.has(urlPropre(s.url))) continue;
    if (reserve.some((r) => urlPropre(r.url) === urlPropre(s.url))) continue;
    reserve.push({titre: s.titre, url: s.url, date: s.date, score: s.score, ajoute: new Date(maintenant).toISOString()});
  }
  reserve.sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));
  fs.writeFileSync(RESERVE, JSON.stringify(reserve, null, 2) + '\n');
};

// --- Sorties -----------------------------------------------------------------------------------

const enMarkdown = (p: Passage) => {
  const heure = new Date(p.maintenant).toLocaleString('fr-FR', {timeZone: 'Europe/Paris', dateStyle: 'full', timeStyle: 'short'});
  const lignes = [
    `# Veille ${p.rang} — ${heure}`, '',
    `${p.articles.length} articles collectés, ${p.sujets.length} sujets, seuil ${CONFIG.seuil}. Poids : brand/veille.json.`,
    p.erreurs.length ? `Flux en échec : ${p.erreurs.join(' ; ')}.` : 'Tous les flux ont répondu.', '',
    `**Choix : ${p.choix ?? 'aucun'}**${p.ecartes.length ? ` (écartés par l'agent : ${p.ecartes.map((e) => `${e.id} — ${e.raison}`).join(' ; ')})` : ''}`, '',
    '| Id | Score | Off. | Médias | Fraîch. | HN | Reddit | Trends | Sujet | Sources | Exclu |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...p.sujets.slice(0, 25).map((s) => {
      const d = s.detail;
      return `| ${s.id} | **${s.score}** | ${d.officiel} | ${d.medias} | ${d.fraicheur} | ${d.hn} | ${d.reddit} | ${d.trends} | [${s.titre.replace(/\|/g, '/')}](${s.url}) | ${s.sources.join(', ')} | ${s.exclu ?? ''} |`;
    }),
  ];
  const res = p.candidats.filter((c) => c.origine === 'reserve');
  if (res.length) lignes.push('', '## Réserve (si aucune actu ne passe le seuil)', '', ...res.map((r) => `- ${r.id} (${r.score}) [${r.titre}](${r.url})`));
  return lignes.join('\n') + '\n';
};

const afficher = (p: Passage) => {
  for (const s of p.sujets.filter((s) => !s.exclu).slice(0, 8))
    console.log(`${s.id}  ${String(s.score).padStart(3)}  ${s.titre}  [${s.sources.length} sources : ${s.sources.slice(0, 4).join(', ')}]  ${s.url}`);
  const exclus = p.sujets.filter((s) => s.exclu && s.score >= CONFIG.seuil);
  if (exclus.length) console.log(`Exclus au-dessus du seuil : ${exclus.map((s) => `${s.id} (${s.exclu})`).join(' ; ')}`);
  if (p.erreurs.length) console.log(`Flux en échec : ${p.erreurs.join(' ; ')}`);
  console.log(`Candidats dans l'ordre (seuil ${CONFIG.seuil}, réserve ${CONFIG.seuilReserve}) : ${p.candidats.map((c) => `${c.id}${p.ecartes.some((e) => e.id === c.id) ? ' (écarté)' : ''}`).join(', ') || 'aucun'}`);
  const c = p.candidats.find((x) => x.id === p.choix);
  console.log(c ? `CHOIX: ${c.id} ${c.url}` : 'CHOIX: aucun');
};

const ecrire = (p: Passage, fichier: string) => {
  fs.mkdirSync(DOSSIER, {recursive: true});
  fs.writeFileSync(fichier, JSON.stringify(p, null, 2) + '\n');
  fs.writeFileSync(fichier.replace(/\.json$/, '.md'), enMarkdown(p));
};

// --- Commandes ---------------------------------------------------------------------------------

const rejouer = option('--rejouer');
if (rejouer) {
  const avant: Passage = JSON.parse(fs.readFileSync(rejouer, 'utf8'));
  const sujets = classer(avant.articles, avant.tendances, avant.rang, Date.parse(avant.maintenant));
  const memes = JSON.stringify(sujets.map((s) => [s.id, s.url, s.score])) === JSON.stringify(avant.sujets.map((s) => [s.id, s.url, s.score]));
  console.log(memes ? 'Classement identique : la veille est reproductible.' : 'Classement différent (poids, épisodes ou code modifiés depuis).');
  process.exit(memes ? 0 : 1);
}

const rang = option('--rang') ?? 'principal';
if (!['principal', 'second'].includes(rang)) throw new Error(`Rang inconnu « ${rang} » (principal ou second)`);
const ecarter = option('--ecarter');

if (ecarter) {
  const fichier = fs.readdirSync(DOSSIER).filter((f) => f.endsWith(`-${rang}.json`)).sort().at(-1);
  if (!fichier) throw new Error(`Aucune veille ${rang} à reprendre : lancer d'abord npm run veille -- --rang ${rang}.`);
  const p: Passage = JSON.parse(fs.readFileSync(path.join(DOSSIER, fichier), 'utf8'));
  if (!p.candidats.some((c) => c.id === ecarter)) throw new Error(`${ecarter} n'est pas un candidat (${p.candidats.map((c) => c.id).join(', ') || 'aucun'}).`);
  p.ecartes.push({id: ecarter, raison: option('--raison') ?? 'sans raison donnée'});
  p.choix = choisir(p);
  ecrire(p, path.join(DOSSIER, fichier));
  majReserve(p, Date.parse(p.maintenant));
  afficher(p);
} else {
  const maintenant = Date.now();
  const {articles, erreurs, tendances} = await collecter(maintenant);
  const presse = articles.filter((a) => a.type !== 'hn' && a.type !== 'reddit').length;
  const sujets = classer(articles, tendances, rang, maintenant);
  const p: Passage = {genere: new Date().toISOString(), rang, maintenant: new Date(maintenant).toISOString(), erreurs, articles, tendances, sujets, candidats: [], ecartes: [], choix: null};
  if (presse === 0) erreurs.push('aucun article de presse : collecte impossible, seule la réserve est proposée');
  p.candidats = candidats(sujets, lireReserve(), maintenant);
  p.choix = choisir(p);
  ecrire(p, path.join(DOSSIER, `${jourParis(maintenant)}-${rang}.json`));
  majReserve(p, maintenant);
  afficher(p);
}
