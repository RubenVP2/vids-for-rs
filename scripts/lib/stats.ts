// Analyse des chiffres déjà relevés (episodes/*/stats.json), sans appel à Postiz : croise réseau,
// créneau, rang, gabarits, Hype-mètre, durée, débit, longueur du texte et score de veille.
// Usage : npm run bilan -- --local [--age-min 24]   (méthode et lecture : docs/bilans/README.md)
import fs from 'node:fs';
import path from 'node:path';
import {EPISODES, RACINE} from './episode';
import {nomFormule} from './duo';
import {nomRythme} from './rythme';

/**
 * Le commentaire de sources (2e élément du post, `--commentaire` de npm run postiz) est compté
 * par Postiz comme un commentaire du public sur ces réseaux : chaque post qui le porte en affiche
 * au moins un, alors qu'il n'en a pas (relevé du 09/11/2026 : 21 commentaires Instagram sur 23,
 * 22 Threads sur 24, 8 LinkedIn sur 9). Sur YouTube, il ne l'est pas (0 sur 19). On le retire
 * pour mesurer les vrais commentaires.
 */
export const COMPTE_SOURCE = new Set(['instagram', 'threads', 'linkedin']);

const lire = <T>(fichier: string): T | undefined => (fs.existsSync(fichier) ? (JSON.parse(fs.readFileSync(fichier, 'utf8')) as T) : undefined);

type Poste = {reseau: string; integration: string; date?: string; etat: string; gabarit: string | null; stats: Record<string, number>};
type Stats = {maj: string; date: string; rang: string; postes: Poste[]};
type Groupe = {posts: {integration: {id: string}; value: unknown[]}[]};

/**
 * Les intégrations dont le post portait un commentaire de sources.
 * `postiz-envoi.json` fait foi : il survit au rattrapage et porte `commentaire` par poste (les envois
 * antérieurs au drapeau sont déduits de `publication.md` via `prevu`). `postiz.json` n'est qu'un
 * complément, car `postiz.ts` le réécrit à chaque envoi (aperçu, rattrapage).
 */
export const sourcesPostees = (dossier: string, prevu: boolean) => {
  const ids = new Set<string>();
  const couverts = new Set<string>();
  try {
    const envoi = lire<{commentaire?: boolean; postes?: {reseau: string; integration?: string; commentaire?: boolean}[]}>(path.join(dossier, 'postiz-envoi.json'));
    if (envoi?.postes?.length) {
      const defaut = envoi.commentaire ?? prevu;
      for (const p of envoi.postes) {
        couverts.add(p.reseau);
        if (COMPTE_SOURCE.has(p.reseau) && (p.commentaire ?? defaut) && p.integration) ids.add(p.integration);
      }
    }
  } catch {
    /* journal illisible : on retombe sur postiz.json */
  }
  try {
    const brut = lire<Groupe[] | Groupe>(path.join(dossier, 'postiz.json'));
    const groupes = brut ? (Array.isArray(brut) ? brut : [brut]) : [];
    for (const g of groupes.flatMap((x) => x.posts)) if (g.value.length >= 2) ids.add(g.integration.id);
  } catch {
    /* postiz.json absent ou de forme inattendue : les ids connus suffisent */
  }
  return {ids, couverts, prevu};
};

/** Le post portait-il un commentaire de sources ? */
export const avecSource = (sources: ReturnType<typeof sourcesPostees>, integration: string, reseau: string) =>
  sources.ids.has(integration) || (sources.prevu && COMPTE_SOURCE.has(reseau) && !sources.couverts.has(reseau));

/** Commentaires (ou réponses Threads) laissés par le public : le commentaire de sources retiré. */
export const commentairesNets = (reseau: string, stats: Record<string, number>, avecSource: boolean) => {
  const brut = stats.Comments ?? stats.Replies ?? 0;
  return Math.max(0, brut - (avecSource && COMPTE_SOURCE.has(reseau) ? 1 : 0));
};

const FUSEAU = 'Europe/Paris';
const heureDe = (t: string) => new Intl.DateTimeFormat('fr-FR', {timeZone: FUSEAU, hour: '2-digit', minute: '2-digit'}).format(new Date(t));
const jourDe = (t: string) => new Intl.DateTimeFormat('en-CA', {timeZone: FUSEAU}).format(new Date(t));
const weekEnd = (j: string) => [0, 6].includes(new Date(`${j}T12:00:00Z`).getUTCDay());

type Ligne = {
  ep: string; rang: string; serie: string; rythme: string; formule: string; format: string; verdict: string; ouverture: string; duree?: number; motsParMinute?: number;
  score?: number; reseau: string; heure: string; jour: string; semaine: string; gabarit: string; longueur?: number;
  vues?: number; likes: number; commentaires: number; commentairesBruts: number; ageH: number;
};

const sectionDe = (texte: string, titre: string) => {
  const bloc = texte.split(/^## /m).slice(1).find((b) => b.slice(0, b.indexOf('\n')).replace(/\s*\(.*\)\s*$/, '').trim() === titre);
  return bloc?.slice(bloc.indexOf('\n') + 1).trim();
};
const SECTIONS: Record<string, string> = {
  tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', linkedin: 'LinkedIn', threads: 'Threads', 'threads-relance': 'Threads relance',
};

/** Score de veille du sujet : veille/<jour>-<rang>.json, candidat retenu (`choix`). */
const scoreVeille = (jour: string, rang: string) => {
  const v = lire<{choix?: string | null; candidats?: {id: string; score: string | number}[]}>(path.join(RACINE, 'veille', `${jour}-${rang}.json`));
  const c = v?.candidats?.find((x) => x.id === v.choix);
  return c ? Number(c.score) : undefined;
};

const lignes = (ageMin: number) => {
  const tout: Ligne[] = [];
  for (const d of fs.readdirSync(EPISODES).sort()) {
    const dossier = path.join(EPISODES, d);
    const stats = lire<Stats>(path.join(dossier, 'stats.json'));
    if (!stats) continue;
    const scenes = lire<{serie?: string; verdict?: string; intemporel?: string; gabarit?: {ouverture?: string}}>(path.join(dossier, 'scenes.json')) ?? {};
    const timings = lire<{duree?: number; qualite?: {motsParMinute?: number}}>(path.join(dossier, 'timings.json'));
    const fichierPub = path.join(dossier, 'publication.md');
    const pub = fs.existsSync(fichierPub) ? fs.readFileSync(fichierPub, 'utf8') : '';
    const sources = sourcesPostees(dossier, /Commentaire à épingler/.test(pub));
    const jourEp = jourDe(stats.date);
    for (const p of stats.postes) {
      if (p.etat !== 'PUBLISHED' || !Object.keys(p.stats).length) continue;
      const quand = p.date ?? stats.date;
      const ageH = (new Date(stats.maj).getTime() - new Date(quand).getTime()) / 3_600_000;
      if (ageH < ageMin) continue;
      const bloc = sectionDe(pub, SECTIONS[p.reseau] ?? '');
      tout.push({
        ep: d.slice(0, 3), rang: stats.rang, serie: scenes.serie ?? '—', rythme: nomRythme(Number(d.slice(0, 3))), formule: nomFormule(Number(d.slice(0, 3))), format: scenes.intemporel ? 'intemporel' : 'actu', verdict: scenes.verdict ?? '—', ouverture: scenes.gabarit?.ouverture ?? '—',
        duree: timings?.duree, motsParMinute: timings?.qualite?.motsParMinute, score: scoreVeille(jourEp, stats.rang),
        reseau: p.reseau, heure: heureDe(quand), jour: jourDe(quand), semaine: weekEnd(jourDe(quand)) ? 'week-end' : 'semaine',
        gabarit: p.gabarit ?? '—', longueur: bloc?.replace(/^\s*(#[\p{L}\d_]+\s*)+$/gmu, '').trim().length,
        vues: p.stats.Views, likes: p.stats.Likes ?? 0, commentairesBruts: p.stats.Comments ?? p.stats.Replies ?? 0,
        commentaires: commentairesNets(p.reseau, p.stats, avecSource(sources, p.integration, p.reseau)), ageH: Math.round(ageH),
      });
    }
  }
  return tout;
};

const mediane = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN;
};
const moyenne = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN);
const ecart = (v: number[]) => Math.sqrt(moyenne(v.map((x) => (x - moyenne(v)) ** 2)) * (v.length / Math.max(v.length - 1, 1)));
const arrondi = (x: number, n = 1) => (Number.isFinite(x) ? Math.round(x * 10 ** n) / 10 ** n : '—');
/** Corrélation des rangs (Spearman), rangs moyens pour les ex aequo. */
const spearman = (x: number[], y: number[]) => {
  const rangs = (v: number[]) => {
    const tri = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const r = new Array<number>(v.length);
    for (let i = 0; i < tri.length; ) {
      let j = i;
      while (j + 1 < tri.length && tri[j + 1][0] === tri[i][0]) j++;
      for (let k = i; k <= j; k++) r[tri[k][1]] = (i + j) / 2 + 1;
      i = j + 1;
    }
    return r;
  };
  const [rx, ry] = [rangs(x), rangs(y)];
  const [mx, my] = [moyenne(rx), moyenne(ry)];
  const num = rx.reduce((s, a, i) => s + (a - mx) * (ry[i] - my), 0);
  return num / Math.sqrt(rx.reduce((s, a) => s + (a - mx) ** 2, 0) * ry.reduce((s, b) => s + (b - my) ** 2, 0));
};

const VUES = ['youtube', 'tiktok', 'instagram', 'threads', 'threads-relance'];
const resume = (l: Ligne[]) => {
  const v = l.map((x) => x.vues).filter((x): x is number => x !== undefined);
  return `| ${l.length} | ${arrondi(mediane(v), 0)} | ${arrondi(moyenne(v), 0)} | ${v.length ? `${Math.min(...v)}–${Math.max(...v)}` : '—'} | ${arrondi(mediane(l.map((x) => x.likes)))} | ${l.reduce((s, x) => s + x.commentaires, 0)} |`;
};
const grouper = (l: Ligne[], cle: (x: Ligne) => string) => {
  const g = new Map<string, Ligne[]>();
  for (const x of l) g.set(cle(x), [...(g.get(cle(x)) ?? []), x]);
  return [...g].sort(([a], [b]) => a.localeCompare(b));
};
const croiser = (l: Ligne[], titre: string, cle: (x: Ligne) => string, reseaux = VUES) => {
  console.log(`\n## ${titre}\n\n| Réseau | ${titre} | Posts | Vues méd. | Vues moy. | Min–max | Likes méd. | Com. nets |\n| --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const r of reseaux) for (const [k, g] of grouper(l.filter((x) => x.reseau === r), cle)) console.log(`| ${r} | ${k} ${resume(g)}`);
};

export const analyser = (ageMin = 0) => {
  const l = lignes(ageMin);
  console.log(`# Analyse locale des stats.json (${l.length} posts publiés et mesurés${ageMin ? `, âgés d'au moins ${ageMin} h au relevé` : ''})`);

  // Réseaux : dispersion, et taille d'échantillon pour voir un effet ×k sur les vues (log-normal,
  // test à deux groupes, α = 5 %, puissance 80 % : n = 2 · (1,96 + 0,84)² · σ² / ln(k)², par groupe).
  console.log('\n## Réseaux\n\n| Réseau | Posts | Vues méd. | Vues moy. | Min–max | σ(ln vues) | Posts par groupe pour voir ×1,25 / ×2 / ×4 | Com. bruts | Com. nets |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const [r, g] of grouper(l, (x) => x.reseau)) {
    const v = g.map((x) => x.vues).filter((x): x is number => x !== undefined);
    const s = ecart(v.map((x) => Math.log(x + 1)));
    const n = (k: number) => (v.length > 2 ? Math.max(2, Math.ceil((2 * 2.8 ** 2 * s ** 2) / Math.log(k) ** 2)) : '—');
    console.log(`| ${r} | ${g.length} | ${arrondi(mediane(v), 0)} | ${arrondi(moyenne(v), 0)} | ${v.length ? `${Math.min(...v)}–${Math.max(...v)}` : '—'} | ${v.length > 2 ? arrondi(s, 2) : '—'} | ${n(1.25)} / ${n(2)} / ${n(4)} | ${g.reduce((a, x) => a + x.commentairesBruts, 0)} | ${g.reduce((a, x) => a + x.commentaires, 0)} |`);
  }

  croiser(l, 'Créneau', (x) => x.heure);
  croiser(l, 'Rang', (x) => x.rang);
  croiser(l, 'Gabarit de texte', (x) => x.gabarit, [...VUES, 'linkedin']);
  croiser(l, 'Gabarit × créneau', (x) => `${x.gabarit} @ ${x.heure}`, ['youtube']);
  croiser(l, 'Hype-mètre × créneau', (x) => `${x.verdict} @ ${x.heure}`, ['youtube', 'instagram', 'tiktok']);
  croiser(l, 'Ouverture × créneau', (x) => `${x.ouverture} @ ${x.heure}`, ['youtube']);
  croiser(l, 'Série', (x) => x.serie, ['youtube', 'instagram', 'tiktok']);
  // Tests du 09/11/2026 : rythme de voix posé contre rapide (à créneau égal), et série intemporelle contre actu.
  croiser(l.filter((x) => x.rythme !== '—'), 'Rythme de voix × créneau', (x) => `${x.rythme} @ ${x.heure}`, ['youtube', 'instagram', 'tiktok']);
  // Test du 12/11/2026 (brand/duo.json) : duo Matou et Plouf, décor bureau, contre solo.
  croiser(l.filter((x) => x.formule !== '—'), 'Formule (duo / solo) × créneau', (x) => `${x.formule} @ ${x.heure}`, ['youtube', 'instagram', 'tiktok']);
  croiser(l, 'Format × rang', (x) => `${x.format} (${x.rang})`, ['youtube', 'instagram', 'tiktok']);
  croiser(l, 'Semaine × créneau', (x) => `${x.semaine} @ ${x.heure}`, ['youtube', 'instagram']);

  // Les deux YouTube d'un même jour : le principal (midi) et le second (soir), même chaîne, même jour.
  // Le total du jour dit si un créneau ajoute des vues ou ne fait que les prendre à l'autre Short.
  console.log('\n## YouTube : principal et second du même jour\n\n| Jour | Principal | Vues | Second | Vues | Total du jour | Le plus tardif gagne |\n| --- | --- | --- | --- | --- | --- | --- |');
  let gagnes = 0, paires = 0;
  const totaux: number[] = [];
  for (const [j, g] of grouper(l.filter((x) => x.reseau === 'youtube'), (x) => x.jour)) {
    const p = g.find((x) => x.rang === 'principal'), s = g.find((x) => x.rang === 'second');
    if (!p || !s || p.vues === undefined || s.vues === undefined) continue;
    paires++;
    const soir = p.heure > s.heure ? p : s, midi = soir === p ? s : p;
    gagnes += Number(soir.vues! > midi.vues!);
    totaux.push(p.vues + s.vues);
    console.log(`| ${j} | #${p.ep} ${p.heure} | ${p.vues} | #${s.ep} ${s.heure} | ${s.vues} | ${p.vues + s.vues} | ${soir.vues! > midi.vues! ? 'oui' : 'non'} |`);
  }
  console.log(`\nLe post le plus tardif gagne ${gagnes} jour(s) sur ${paires} ; total du jour médian : ${arrondi(mediane(totaux), 0)} vues.`);

  // Variables continues : corrélation des rangs avec les vues, réseau par réseau.
  console.log('\n## Corrélations avec les vues (Spearman ρ)\n\n| Réseau | Variable | Posts | ρ |\n| --- | --- | --- | --- |');
  const variables: [string, (x: Ligne) => number | undefined][] = [
    ['durée de la vidéo (s)', (x) => x.duree], ['mots/min', (x) => x.motsParMinute], ['longueur du texte', (x) => x.longueur], ['score de veille', (x) => x.score],
  ];
  for (const r of VUES) {
    for (const [nom, f] of variables) {
      const paires = l.filter((x) => x.reseau === r && x.vues !== undefined && f(x) !== undefined);
      if (paires.length < 5) continue;
      console.log(`| ${r} | ${nom} | ${paires.length} | ${arrondi(spearman(paires.map((x) => f(x)!), paires.map((x) => x.vues!)), 2)} |`);
    }
  }

  console.log('\n## Posts YouTube (détail)\n\n| Épisode | Rang | Jour | Créneau | Âge au relevé (h) | Durée (s) | Mots/min | Score veille | Hype | Ouverture | Gabarit | Vues | Likes |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const x of l.filter((x) => x.reseau === 'youtube')) {
    console.log(`| #${x.ep} | ${x.rang} | ${x.jour} | ${x.heure} | ${x.ageH} | ${arrondi(x.duree ?? NaN)} | ${x.motsParMinute ?? '—'} | ${x.score ?? '—'} | ${x.verdict} | ${x.ouverture} | ${x.gabarit} | ${x.vues} | ${x.likes} |`);
  }
};
