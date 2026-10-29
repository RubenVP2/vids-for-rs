---
name: episode-du-jour
description: Routine quotidienne de Matou, sans intervention — deux fois par matin (épisode principal, puis second), choisit l'actu IA qui a le plus de potentiel, produit l'épisode, le dépose dans Postiz et prévient l'utilisateur ; le lanceur le programme si les garde-fous passent (veto de l'utilisateur ensuite). À utiliser quand une tâche planifiée le demande, ou quand l'utilisateur dit « fais l'épisode du jour tout seul ».
---

# Épisode du jour (tâche planifiée)

Personne ne répond pendant la routine : chaque décision se prend avec les règles
ci-dessous, jamais en posant une question.

Deux épisodes par jour (`docs/reseaux.md`) :

- **principal** (lancé vers 5 h) : le meilleur sujet du jour. Il passe partout :
  LinkedIn 8 h 30, Threads 9 h, Instagram 18 h 30, TikTok 19 h, YouTube 20 h.
- **second** (lancé ensuite, vers 7 h) : le sujet suivant du classement. Il passe le midi
  sur TikTok, YouTube et Threads seulement.

La consigne du lanceur dit lequel. Sans précision (session à la main) : principal.

Pas de relecture humaine avant la mise en file : après la routine, le lanceur programme
les brouillons si les garde-fous passent, et l'utilisateur garde un **droit de veto**
jusqu'à l'heure de chaque post (`docs/decisions.md`, 2026-10-30). Les garde-fous, c'est
ton travail : un doute → `PROGRAMMER: non`, les brouillons attendent l'utilisateur.

## 0. Préparer

1. Branche de travail : **`main`**. La récupérer (`git fetch origin main` puis
   `git checkout -B main origin/main`) : c'est là que vivent le code, les épisodes
   précédents (dont le principal du jour, pour le second), `docs/apprentissages.md` et
   `docs/sujets.md`.
2. `npm ci` si `node_modules` manque. `npm run postiz -- --canaux` doit lister les comptes.
   Sinon (accès Postiz absent ou refusé) : s'arrêter et le dire dans le message final.

Lancée par `scripts/routines/lancer.sh` (Pi, Hermes + agy), cette étape 0 est déjà
faite, et le script s'occupe de git (commit, pull, push), de la programmation et de
l'envoi de la vidéo : **ne lance aucune commande git ni `--programmer`**, et termine par
le message final (étape 4) puis les deux lignes `PROGRAMMER: …` et `EPISODE: NNN`.
3. File d'attente : `npm run bilan -- --attente` liste les épisodes restés en brouillon
   (garde-fou ou veto). **3 ou plus** : ne rien produire (l'utilisateur ne suit pas), dire
   lesquels attendent sa relecture, et s'arrêter.

**Fait quand** `main` est à jour, Postiz répond, et moins de 3 épisodes attendent.

## 1. Choisir le sujet

Skill **`veille-ia`**, en mode autonome : il lit `docs/apprentissages.md` et
`docs/sujets.md`, classe, et prend le premier. Pas d'actu qui atteint le seuil de la
veille : prendre le premier sujet de `docs/sujets.md` (et le retirer de la liste).

Épisode **second** : le principal du jour est déjà dans `episodes/` (le plus récent).
Écarter son sujet et tout ce qui le recoupe (même entreprise, même annonce), puis
prendre le suivant du classement ; sinon la réserve. Deux vidéos sur la même actu le même
jour se font concurrence.

Un sujet que le `documentaliste` juge mal sourcé (source non identifiable, rumeur sans
média reconnu) : passer au suivant du classement, sans demander.

## 2. Produire

Skill **`episode`**, étapes 0 à 7. Pendant la routine :

- Une relecture qui reste BLOQUANT après **deux** tours de corrections : abandonner ce
  sujet, supprimer son dossier, reprendre l'étape 1 avec le suivant (une seule fois ; au
  deuxième échec, s'arrêter et l'expliquer).
- Étape 7 : envoyer la vidéo et la miniature (outil d'envoi de fichiers de la session
  s'il existe ; sinon leurs chemins dans le message final), commit, puis
  `git pull --rebase origin main` et `git push origin HEAD:main` (sous `lancer.sh` :
  rien de tout ça, le script le fait).
  L'utilisateur a autorisé cette poussée pour la routine : c'est ce qui permet à l'épisode
  suivant de voir celui-ci (numéro, sujets déjà traités).

## 3. Brouillons Postiz

Skill **`programmation`**, jusqu'à `--envoyer` compris, avec **`--rang principal`** ou
**`--rang second`** (`npm run postiz -- NNN --rang second --commentaire --envoyer`).
Sans `--date` : chaque réseau prend son premier créneau libre de ce rang, au moins 2 h
plus tard (le temps du veto). « Pas de post : LinkedIn… » ou « réservé à l'épisode
principal » est normal. Committer et pousser comme à l'étape 2.

**Ne jamais lancer `--programmer`** toi-même : c'est le lanceur, après tes garde-fous.

## 4. Message final

C'est lui que l'utilisateur reçoit en notification. Court, dans cet ordre :

1. L'épisode : numéro, rang, titre YouTube, idée en une phrase, Hype-mètre, et l'heure du
   premier post (la limite du veto) ; les réseaux sans post et pourquoi.
2. Pourquoi ce sujet (une ligne : la raison du classement de la veille).
3. Les points non vérifiés, s'il y en a.

Puis, sur l'avant-dernière ligne, ton avis de garde-fou :

- `PROGRAMMER: oui` seulement si **tout** est vrai : `npm run check` passe ; le
  `verificateur-faits` n'a laissé aucune réserve (ni BLOQUANT ni doute sur un chiffre,
  une date ou une citation) ; la source est de premier rang ou un média reconnu ; le
  statut (annoncé / disponible / rumeur) est dit à l'écran ; aucun point non vérifié.
- Sinon `PROGRAMMER: non — <la raison en quelques mots>`. Le lanceur laisse alors les
  brouillons, et l'utilisateur relit puis répond « programme » (tu lances
  `npm run postiz -- NNN --programmer`, puis commit et push de `postiz-envoi.json`).

Dernière ligne : `EPISODE: NNN`.

Routine arrêtée sans épisode : la raison, ce qu'il faut faire pour débloquer, puis
`EPISODE: aucun`.
