# CLAUDE.md — Vids for RS

Ce fichier est la mémoire du projet pour Claude. Le lire en début de session.

## Le projet

Vidéos courtes verticales d'information sur l'IA (news + articles de blog des grandes
entreprises) pour les réseaux sociaux. Langue de travail : **français**.

Cible finale : **une session Claude = une vidéo**. L'utilisateur fournit un article
(texte ou URL) ; Claude produit la vidéo finale, la description et les hashtags,
en respectant le design system du projet.

## Phase actuelle

**Phase 1 — Brainstorming & positionnement.** On ne produit pas encore de vidéo ni de
design définitif. Les pistes sont dans `docs/brainstorm.md`, les choix dans
`docs/decisions.md`, l'enchaînement des phases dans `docs/roadmap.md`.

Quand une décision est prise avec l'utilisateur : l'ajouter à `docs/decisions.md`
(date, choix, raison) et mettre à jour ce fichier si elle change les règles ci-dessous.

## Règles éditoriales (non négociables)

- Toujours citer la source (à l'écran et dans la description).
- Ne jamais inventer un fait, un chiffre ou une citation absente de la source.
- Distinguer clairement : annoncé / disponible / rumeur.
- Résumer et commenter, ne pas recopier l'article mot à mot.
- Pas de titre racoleur qui trahit le contenu : le hook doit être tenu par la vidéo.
- L'utilisateur relit toujours avant publication.

## Conventions du dépôt

- Documentation en français, en Markdown, dans `docs/`.
- Structure cible (à créer au fil des phases, pas avant) :
  - `brand/` : design system (tokens, typos, mascotte SVG, sons)
  - `templates/` : composants vidéo réutilisables
  - `episodes/<numéro>-<slug>/` : un dossier par vidéo (source, script, scènes, rendu)
