---
name: episode
description: Produit un épisode de Matou de bout en bout à partir d'un article (lien ou texte) — vidéo MP4, miniature, description et hashtags. À utiliser dès que l'utilisateur donne un article, un lien d'annonce IA, ou demande « une vidéo », « un épisode », « le prochain Matou ».
---

# Épisode : un article → une vidéo publiable

Une session = un épisode. Chaque étape se termine sur son critère ; on ne passe à la
suivante qu'une fois le critère atteint. Les commandes sont dans `package.json`.

## 0. Préparer

- `node_modules` absent → `npm ci`.
- Numéro : le plus grand `episodes/NNN-*` + 1, sur `main` à jour (les
  routines y poussent chaque épisode). Slug : 2 à 5 mots, minuscules, tirets.
- Créer `episodes/NNN-slug/`.

**Fait quand** le dossier existe et que le numéro ne collisionne avec aucun autre.

## 1. Documenter la source

Lancer le sous-agent **`documentaliste`** avec l'URL (ou le texte collé) et le dossier.
Il écrit `source.md` : texte de l'article, date, auteur, et la **fiche** (faits, chiffres,
citations, statut annoncé / disponible / rumeur).

Lire la fiche. Si la source n'est pas d'une entreprise ou d'un média identifiable, ou
si l'info n'a qu'une source secondaire non recoupée : le dire à l'utilisateur avant d'écrire
(en tâche planifiée : changer de sujet, voir le skill `episode-du-jour`).

**Fait quand** `source.md` contient l'URL, la date de publication, la fiche, et que
tu sais en une phrase quelle est **l'idée unique** de l'épisode.

## 2. Écrire le script et les scènes

Suivre le skill **`ecriture-matou`** : il donne la voix de Matou, la structure, le
budget de mots et le catalogue des scènes. Écrire `scenes.json`.

**Fait quand** `npm run validate -- NNN` ne sort aucune ERREUR, et que chaque
ATTENTION est soit corrigée, soit justifiée (ex. un chiffre reformulé : « deux fois » pour « 2× »).

## 3. Relectures indépendantes (en parallèle)

Lancer en même temps, chacun sur le dossier de l'épisode :

- **`verificateur-faits`** : chaque affirmation de `scenes.json` contre `source.md`.
- **`spectateur`** : lit seulement les scènes, comme quelqu'un qui ne connaît rien à l'IA.

Appliquer toutes les corrections BLOQUANT du vérificateur. Pour le spectateur, corriger
tout ce qui est marqué « décroche » ou « pas compris ». Revalider (`npm run validate`).

**Fait quand** le vérificateur rend « OK » (relancer après corrections si BLOQUANT) et
qu'aucun retour « décroche » du spectateur n'est resté sans réponse.

## 4. Voix

`npm run voice -- NNN`. Lire la sortie : durée et taux d'alignement.

- Alignement < 85 % → la voix a mal lu (mot étranger, sigle). Réécrire le mot comme il
  se prononce avec `{affiché|prononcé}` (voir `ecriture-matou`), puis `--force`.
- Durée > 36 s (flash) ou > 46 s (décrypté) → raccourcir le script, revalider, `--force`.

**Fait quand** `timings.json` existe, alignement ≥ 85 %, durée dans la limite.

## 5. Rendu et contrôle visuel

`npm run render -- NNN`, puis `npm run stills -- NNN` (une image par scène, avec
l'interface des réseaux simulée par-dessus).

Lancer le sous-agent **`controleur-visuel`** sur le dossier. Corriger chaque problème
BLOQUANT dans `scenes.json` (texte trop long, mot coupé…), puis refaire rendu + images.

**Fait quand** le contrôleur rend « OK ».

## 6. Publication

Suivre le skill **`publication`** pour écrire `publication.md` (TikTok, Instagram,
YouTube, et le texte court de Threads, X et Bluesky). Puis `npm run check -- NNN`.

**Fait quand** `npm run check` affiche « Prêt pour la relecture humaine. »

## 7. Livrer

1. Envoyer à l'utilisateur la vidéo (`rendu/NNN-slug.mp4`) et la miniature.
2. Dans la réponse : le texte de `publication.md` prêt à copier, l'idée de l'épisode
   en une phrase, le verdict du Hype-mètre et les points que tu n'as pas pu vérifier.
3. `git add` du dossier (les rendus sont ignorés par git), commit, push.

L'utilisateur relit toujours avant de publier : ne présente jamais l'épisode comme publié.

## 8. Programmer dans Postiz

Suivre le skill **`programmation`** : brouillons dans Postiz (CLI `postiz`), relecture
de l'utilisateur, puis programmation sur son feu vert. Sans accès à Postiz
(`npm run postiz -- --canaux` refusé), le dire en une ligne et s'arrêter à l'étape 7.
