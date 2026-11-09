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
| Source officielle (blog d'un labo) dans le groupe | 10 (20 jusqu'au 09/11/2026) | Fait vérifiable, statut clair ; mais un billet officiel seul ne fait pas une actu grand public |
| Chaque média distinct qui en parle (Google Actualités FR compte chaque éditeur) | 8, ou 16 pour un média français (`fr` dans la liste des flux), plafond 48 | La reprise multi-médias est le meilleur indice d'une actu grand public ; les médias français sont ceux que lit le public de Matou |
| Sujet du quotidien : un mot de `motsQuotidien` dans un titre (école, emploi, arnaque, santé, prix, interdit…) | 15 | Constat confirmé (`docs/apprentissages.md`) : ce qui touche le quotidien bat la performance technique |
| Nom que tout le monde connaît : un mot de `nomsConnus` (ChatGPT, Google, WhatsApp, iPhone…) | 10 | Constat confirmé : un nom connu attire plus qu'un nom de modèle ou de labo |
| Fraîcheur du premier article | < 12 h : 15, < 24 h : 10 | Une actu de moins de 24 h fait plus de vues (hypothèse) |
| Hacker News (meilleur score d'une histoire liée) | 0,04 par point, plafond 20 | L'emballement des développeurs précède souvent le grand public |
| Reddit (r/ChatGPT, r/OpenAI, r/artificial, r/LocalLLaMA, top du jour) | 4 par post lié, plafond 12 | Ce dont les utilisateurs parlent |
| Google Trends France : une recherche en hausse correspond au sujet | 20 | Ce que les Français cherchent maintenant |

Les trois bonus grand public (média français, quotidien, nom connu) ne vont qu'à un sujet
dont un titre parle vraiment d'IA (un mot de `motsIA` ou un produit de `produitsIA`) :
sans cela, « iPhone à prix cassé chez Amazon » gagnerait 25 points.

**Seuil : 35.** Un billet officiel frais seul vaut désormais 25 : il attend en réserve, et
ne devient le sujet que s'il touche le quotidien ou porte un nom connu. Au-dessus : l'actu du jour. En dessous, la réserve dans l'ordre des
scores : sujets du jour entre 25 et 35, puis les bons sujets des 7 derniers jours non
choisis (`veille/reserve.json`, rempli et purgé par le script). Passé `FRAICHEUR_MAX` (2 jours),
un sujet n'est plus candidat : il ne partirait pas (`check.ts` le refuserait), donc il ne
reste que la trace, pas le choix. Plus rien : le premier de
`docs/sujets.md` (liste à la main), sinon pas d'épisode.

## Le veto de l'agent

Seul jugement laissé au modèle : écarter un sujet inexplicable en 30 s, une rumeur
fragile, un sujet trop technique sans effet sur le quotidien, ou une source introuvable.
Chaque veto est écrit avec sa raison dans le fichier du jour ; le suivant vient dans
l'ordre du classement.

## Contrôler, régler

- `npm run veille -- --rejouer veille/<fichier>.json` reclasse les articles gelés du
  fichier et dit si le classement **et** la liste des candidats (donc le filtre de fraîcheur)
  sont identiques. Les passages d'avant le 09/11/2026 ne gardent pas la réserve : le rejeu
  le signale et ne compare que le classement (code de sortie 2 : rejeu partiel, pas un succès).
  Un fichier `.md` n'est pas rejouable : passer le `.json` du même passage.
- Un flux qui ne répond pas est listé dans « Flux en échec » ; le classement se fait
  avec les autres.
- Après un changement de poids, le rejeu affiche l'ancien choix et le nouveau haut du
  classement : c'est la façon d'essayer un réglage sur les jours passés.
- Régler : changer un poids ou un flux dans `brand/veille.json` (le bilan du lundi
  propose les changements à partir des vues, l'utilisateur décide).

## Limites connues

- Les mots du quotidien sont une liste : « prix » ou « loi » attrapent aussi des sujets
  sans intérêt (une promo, un texte technique). Le veto de l'agent reste le filet.

- Le regroupement se fait sur les mots des titres : un article français qui ne reprend
  aucun nom du titre anglais (« les ados » pour « teens ») compte comme un autre sujet.
- Le flux d'OpenAI est lu par son miroir public (Olshansk/rss-feeds sur GitHub) : le site
  refuse les lecteurs automatiques.
- Google Trends ne liste que ~10 recherches à la fois, rarement sur l'IA : le bonus est
  rare mais fort.
