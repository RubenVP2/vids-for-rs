---
name: veille-ia
description: Trouve et classe les annonces IA du moment pour choisir le sujet du prochain épisode de Matou. À utiliser quand l'utilisateur demande « quoi publier », « les news du jour », un sujet, ou n'a pas d'article sous la main.
---

# Veille : choisir le sujet du jour

La veille est **déterministe** : un script collecte une liste fixe de flux, regroupe les
articles qui parlent de la même annonce et note chaque sujet par règles fixes
(`docs/veille.md`, poids dans `brand/veille.json`). Tu ne cherches pas l'actu toi-même
(pas de recherche web pour trouver un sujet) et tu ne changes pas l'ordre du classement.

## Lancer

```
npm run veille -- --rang principal    # ou --rang second
```

Sous `lancer.sh`, c'est déjà fait : lis `veille/AAAA-MM-JJ-<rang>.md` (le classement
complet) et la dernière ligne de la sortie, « CHOIX: <id> <url> ».

Le script écarte déjà : ce qui est déjà traité (même article, ou même annonce depuis
moins de 7 jours), ce qui n'a ni source officielle ni deux médias, la finance et la
bourse, et pour le **second** tout sujet de la même entreprise que le principal du jour.

## Ton seul rôle : le veto

Prends le sujet choisi. Tu peux l'**écarter**, et seulement pour une de ces raisons :

- on ne peut pas l'expliquer honnêtement en 30 s (une seule idée ne tient pas la vidéo) ;
- rumeur fragile ou polémique sans fait vérifiable ;
- trop technique pour quelqu'un qui n'est pas dans la tech, sans effet sur son quotidien ;
- le `documentaliste` le juge mal sourcé (source introuvable ou illisible).

Pour écarter : `npm run veille -- --rang <rang> --ecarter <id> --raison "<raison courte>"`.
Le script note la raison dans le fichier du jour et rend le candidat suivant (même
ordre, toujours) : prends-le, sans juger s'il est « meilleur ». Trois veto au plus ; au
quatrième, ou si la sortie dit « CHOIX: aucun », prends le premier sujet de
`docs/sujets.md` (et retire-le) ; s'il est vide, arrête la routine avec `EPISODE: aucun`.

Le lien du choix peut être un article de média : la source de l'épisode reste la source
de premier rang (le billet officiel cité par l'article), retrouvée par le `documentaliste`.

**Fait quand** un sujet est retenu, et que chaque veto a sa raison dans `veille/`.

## Mode manuel

L'utilisateur demande « quoi publier » : lance le script et propose-lui les 3 premiers
candidats (titre de hook possible, source, statut, série `flash` / `decrypte`, score et
détail du score). Il choisit ; ensuite, skill `episode`. S'il te laisse le choix (« fais
la plus populaire », « choisis ») : prends le CHOIX, comme en mode autonome.
