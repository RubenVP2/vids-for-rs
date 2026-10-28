# CLAUDE.md — Vids for RS

Ce fichier est la mémoire du projet pour Claude. Le lire en début de session.

## Le projet

Vidéos courtes verticales d'information sur l'IA (news + articles de blog des grandes
entreprises) pour les réseaux sociaux. Langue de travail : **français**.

Cible finale : **une session Claude = une vidéo**. L'utilisateur fournit un article
(texte ou URL) ; Claude produit la vidéo finale, la description et les hashtags,
en respectant le design system du projet.

## Cadre validé (voir `docs/decisions.md`)

- **Audience** : grand public + pros hors tech. Aucun jargon non expliqué.
- **Plateformes** : TikTok, Instagram Reels, YouTube Shorts (vertical 1080×1920).
- **Format** : ~30 secondes (Décrypté : jusqu'à 45 s), une seule idée, ~75–85 mots.
- **Ton** : pédagogie grand public avant tout, avec une touche de fun. Inspiration :
  Fireship (densité, rythme, humour pince-sans-rire), adapté au format court.
- **Voix** : V1 en synthèse vocale via OpenRouter ; V2 avec la voix de l'utilisateur.
  La voix doit rester une brique interchangeable (script → audio + horodatage des
  mots). OpenRouter ne fournit pas l'horodatage : il vient d'un alignement local.
- **À l'écran** : jamais l'utilisateur. Seulement la voix et la mascotte.
- **Marque** : la chaîne s'appelle **Matou** (`@matou.ai`). Matou est un chat blanc
  dessiné à la main par l'utilisateur (`brand/references/`) : grosses lunettes,
  dents de lapin, doigt levé jaune ☝️, croix grise sur le ventre. C'est **lui qui
  parle**, avec une voix masculine. Ses phrases : « ☝️ En fait… » pour lancer
  l'explication, « C'était Matou, et c'est tout. » pour finir.
- **Univers visuel** : « le cahier de Matou ». Fond papier crème quadrillé, trait de
  feutre noir fait main, jaune = surligneur des mots clés.
- **Rythme** : 1 vidéo par jour, au minimum 1 tous les 2 jours.

## Phase actuelle

**Phase 2 — Identité de marque** (à démarrer). La phase 1 est terminée : le cadre
est fixé. Les pistes sont dans `docs/brainstorm.md`, les choix dans
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
