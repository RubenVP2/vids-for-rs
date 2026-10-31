# Veille déterministe

Le sujet de chaque épisode est choisi par `scripts/veille.ts` (`npm run veille`), pas par
l'agent : mêmes articles, mêmes épisodes déjà faits et même heure → même classement. Les
poids vivent dans `brand/veille.json` ; décision du 2026-10-31 (`docs/decisions.md`).

## La chaîne

```
lancer.sh episode-du-jour <rang>
  → npm run veille -- --rang <rang>
      1. collecte : flux fixes (brand/veille.json), articles des 48 dernières heures
      2. regroupe les articles d'une même annonce (mots et entités en commun)
      3. écarte : déjà traité, ni officiel ni 2 médias, finance/bourse, même entreprise
         que le principal du jour (second seulement)
      4. score par règles fixes, tri stable (score, nb de sources, date, URL)
      5. écrit veille/AAAA-MM-JJ-<rang>.json (articles collectés + classement) et .md
      6. met à jour veille/reserve.json
      → dernière ligne « CHOIX: <id> <url> »
  → agy : prend le CHOIX ; peut l'écarter (--ecarter <id> --raison …) → candidat suivant
```

## Le score

| Signal | Points (défaut) | Pourquoi |
| --- | --- | --- |
| Source officielle (blog d'un labo) dans le groupe | 20 | Fait vérifiable, statut clair |
| Chaque média distinct qui en parle (Google Actualités FR compte chaque éditeur) | 8, plafond 48 | La reprise multi-médias est le meilleur indice d'une actu grand public |
| Fraîcheur du premier article | < 12 h : 15, < 24 h : 10 | Une actu de moins de 24 h fait plus de vues (hypothèse) |
| Hacker News (meilleur score d'une histoire liée) | 0,04 par point, plafond 20 | L'emballement des développeurs précède souvent le grand public |
| Reddit (r/ChatGPT, r/OpenAI, r/artificial, r/LocalLLaMA, top du jour) | 4 par post lié, plafond 12 | Ce dont les utilisateurs parlent |
| Google Trends France : une recherche en hausse correspond au sujet | 20 | Ce que les Français cherchent maintenant |

**Seuil : 45.** Au-dessus : l'actu du jour. En dessous, la réserve dans l'ordre des
scores : sujets du jour entre 25 et 45, puis les bons sujets des 7 derniers jours non
choisis (`veille/reserve.json`, rempli et purgé par le script). Plus rien : le premier de
`docs/sujets.md` (liste à la main), sinon pas d'épisode.

## Le veto de l'agent

Seul jugement laissé au modèle : écarter un sujet inexplicable en 30 s, une rumeur
fragile, un sujet trop technique sans effet sur le quotidien, ou une source introuvable.
Chaque veto est écrit avec sa raison dans le fichier du jour ; le suivant vient dans
l'ordre du classement.

## Contrôler, régler

- `npm run veille -- --rejouer veille/<fichier>.json` reclasse les articles gelés du
  fichier et dit si le classement est identique.
- Un flux qui ne répond pas est listé dans « Flux en échec » ; le classement se fait
  avec les autres.
- Régler : changer un poids ou un flux dans `brand/veille.json` (le bilan du lundi
  propose les changements à partir des vues, l'utilisateur décide).

## Limites connues

- Le regroupement se fait sur les mots des titres : un article français qui ne reprend
  aucun nom du titre anglais (« les ados » pour « teens ») compte comme un autre sujet.
- Le flux d'OpenAI est lu par son miroir public (Olshansk/rss-feeds sur GitHub) : le site
  refuse les lecteurs automatiques.
- Google Trends ne liste que ~10 recherches à la fois, rarement sur l'IA : le bonus est
  rare mais fort.
