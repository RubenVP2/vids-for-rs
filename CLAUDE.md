# CLAUDE.md — Vids for RS

Mémoire du projet. Langue de travail : **français**.

## Le projet

Matou (`@matou.ai`) : vidéos verticales courtes qui expliquent l'actu de l'IA (annonces
et articles de blog des grandes entreprises) au grand public, sur **TikTok, Instagram
Reels, YouTube Shorts, Threads et LinkedIn** (page Matou AI), les 5 comptes connectés à
Postiz (le script gère aussi Facebook, X et Bluesky).

**Une session = un épisode** : l'utilisateur donne un article (lien ou texte), la
session livre la vidéo MP4, la miniature, la description et les hashtags. Recette :
skill **`episode`**. Pas d'article sous la main → skill **`veille-ia`**.

**Routines (tâches planifiées, sans intervention)** : chaque matin **`episode-du-jour`**
(veille → épisode → brouillons Postiz), chaque lundi **`bilan`** (chiffres Postiz →
`docs/apprentissages.md` et `docs/sujets.md`). Elles poussent sur **`main`**.
La seule étape humaine : relire les brouillons, puis les programmer.

**Harnais** : les routines tournent sur le Raspberry Pi. Hermes (cron) lance
`scripts/routines/lancer.sh`, qui prépare `main`, confie le travail à **`agy`**
(Antigravity CLI, modèles Gemini), puis committe, pousse et livre sur Discord (#matou).
`agy` lit ce fichier (lien `AGENTS.md`) et les skills et sous-agents de `.claude/`
(`.agents/skills.json`, lien `.agents/agents`) : une seule copie, pour les deux harnais.
Détail : `docs/routines.md`.

## Cadre validé (détail et raisons : `docs/decisions.md`)

- **Audience** : grand public + pros hors tech. Aucun jargon non expliqué.
- **Format** : 1080×1920. Série `flash` ~30 s (une annonce), `decrypte` ≤ 45 s (un
  article de blog). Une seule idée par vidéo.
- **Ton** : pédagogie d'abord, humour pince-sans-rire (inspiration Fireship).
- **Matou** : chat blanc à lunettes dessiné par l'utilisateur, c'est **lui qui parle**
  (voix masculine). Rituels : « En fait… » pour expliquer, Hype-mètre à la fin
  (pur buzz / prometteur / game changer), « C'était Matou, et c'est tout. » pour finir.
- **À l'écran** : jamais l'utilisateur. Univers « cahier de Matou » : `docs/design-system.md`.
- **Voix** : V1 synthèse via OpenRouter (`brand/voix.json`) ; V2 la voix de l'utilisateur.
- **Rythme** : 1 vidéo par jour, au minimum 1 tous les 2 jours.
- **Un post par réseau, pas un copier-coller** (`docs/reseaux.md`) : vidéo le soir sur
  Instagram (18 h 30), TikTok (19 h), YouTube (20 h) ; Threads le matin (vidéo, 9 h) puis
  une relance texte (19 h 30) ; LinkedIn en carrousel, en semaine à 8 h 30, un par jour
  ouvré. Créneaux : `brand/postiz.json`.

## Règles éditoriales (non négociables)

- Toujours citer la source (à l'écran et dans la description).
- Ne jamais inventer un fait, un chiffre ou une citation absente de la source.
- Distinguer clairement : annoncé / disponible / rumeur.
- Résumer et commenter, ne pas recopier l'article mot à mot.
- Pas de titre racoleur : le hook doit être tenu par la vidéo.
- L'utilisateur relit toujours avant publication.

## Outils du dépôt

- Skills (`.claude/skills/`) : `episode` (la recette), `ecriture-matou` (voix et
  scènes), `publication` (un texte par réseau, hashtags), `veille-ia` (choisir un sujet),
  `programmation` (brouillons Postiz, puis programmation sur feu vert),
  `episode-du-jour` et `bilan` (les routines) et `postiz` (skill officiel de Postiz,
  copié tel quel).
- Ce qui marche chez Matou (chiffres) : `docs/apprentissages.md`. Sujets d'avance :
  `docs/sujets.md`. Bilans hebdomadaires : `docs/bilans/`.
- Postiz : CLI officielle `postiz` (dépendance du projet), authentifiée par OAuth
  (`postiz auth:login`, sur le Pi) ou par la clé `POSTIZ_API_KEY` / `POSTIZ_ENV`.
- Sous-agents (`.claude/agents/`) : `documentaliste` (article → `source.md`),
  `verificateur-faits` (script contre source), `spectateur` (test grand public),
  `controleur-visuel` (images rendues).
- Moteur (Remotion + scripts) : `docs/moteur.md`. Commandes : `package.json`.

## Conventions

- Docs en français, Markdown, dans `docs/`. Code et noms en français aussi.
- `brand/` : tokens, Matou en SVG, icônes, voix. `public/brand/` : polices et sons
  (servis au rendu). `src/` : composants vidéo. `episodes/NNN-slug/` : un dossier par vidéo.
- Une décision prise avec l'utilisateur → une ligne dans `docs/decisions.md` (date,
  choix, raison), et ce fichier mis à jour si elle change les règles ci-dessus.
- Les vidéos rendues ne sont pas versionnées (`rendu/`) : on les envoie à l'utilisateur.
