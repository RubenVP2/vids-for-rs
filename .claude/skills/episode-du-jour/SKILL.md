---
name: episode-du-jour
description: Routine quotidienne de Matou, sans intervention — choisit l'actu IA du jour qui a le plus de potentiel, produit l'épisode, le dépose en brouillons dans Postiz et prévient l'utilisateur. À utiliser quand une tâche planifiée le demande, ou quand l'utilisateur dit « fais l'épisode du jour tout seul ».
---

# Épisode du jour (tâche planifiée)

Personne ne répond pendant la routine : chaque décision se prend avec les règles
ci-dessous, jamais en posant une question. La seule étape humaine reste la relecture
des brouillons dans Postiz (règle non négociable de `CLAUDE.md`).

## 0. Préparer

1. Branche de travail : **`main`**. La récupérer (`git fetch origin main` puis
   `git checkout -B main origin/main`) : c'est là que vivent le code, les épisodes
   précédents, `docs/apprentissages.md` et `docs/sujets.md`.
2. `npm ci` si `node_modules` manque. `npm run postiz -- --canaux` doit lister les comptes.
   Sinon (accès Postiz absent ou refusé) : s'arrêter et le dire dans le message final.

Lancée par `scripts/routines/lancer.sh` (Pi, Hermes + agy), cette étape 0 est déjà
faite, et le script s'occupe de git (commit, pull, push) et de l'envoi de la vidéo :
**ne lance aucune commande git**, et termine par le message final (étape 4) puis, sur la
dernière ligne, `EPISODE: NNN` (ou `EPISODE: aucun` si la routine s'arrête sans épisode).
3. File d'attente : `npm run bilan -- --attente`. **3 épisodes ou plus en attente de
   relecture** : ne rien produire (l'utilisateur ne suit pas), dire dans le message final
   lesquels attendent sa relecture, et s'arrêter.

**Fait quand** `main` est à jour, Postiz répond, et moins de 3 épisodes attendent.

## 1. Choisir le sujet

Skill **`veille-ia`**, en mode autonome : il lit `docs/apprentissages.md` et
`docs/sujets.md`, classe, et prend le premier. Pas d'actu qui atteint le seuil de la
veille : prendre le premier sujet de `docs/sujets.md` (et le retirer de la liste).

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

Skill **`programmation`**, jusqu'à `--envoyer` compris.
Sans `--date` : le script prend le premier jour libre du calendrier à 18 h (aujourd'hui
si la routine tourne le matin). Committer et pousser comme à l'étape 2.

**Ne jamais lancer `--programmer`** dans la routine : il attend le « oui » de l'utilisateur.

## 4. Message final

C'est lui que l'utilisateur reçoit en notification. Court, dans cet ordre :

1. L'épisode : numéro, titre YouTube, idée en une phrase, Hype-mètre, date prévue.
2. Pourquoi ce sujet (une ligne : la raison du classement de la veille).
3. Ce qu'il doit faire : relire les brouillons dans Postiz, puis soit les programmer
   lui-même dans Postiz, soit répondre « programme » dans cette session (tu lances alors
   `npm run postiz -- NNN --programmer`, puis commit et push de `postiz-envoi.json`).
4. Les points non vérifiés, s'il y en a.

Routine arrêtée sans épisode : la raison, et ce qu'il faut faire pour débloquer.
