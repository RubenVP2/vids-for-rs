# CLAUDE.md — Vids for RS

Mémoire du projet. Langue de travail : **français**.

## Le projet

Matou (`@matou.ai`) : vidéos verticales courtes qui expliquent l'actu de l'IA (annonces
et articles de blog des grandes entreprises) au grand public, sur TikTok, Instagram
Reels et YouTube Shorts, relayées sur Facebook, Threads, X et Bluesky (via Postiz).

**Une session = un épisode** : l'utilisateur donne un article (lien ou texte), la
session livre la vidéo MP4, la miniature, la description et les hashtags. Recette :
skill **`episode`**. Pas d'article sous la main → skill **`veille-ia`**.

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

## Règles éditoriales (non négociables)

- Toujours citer la source (à l'écran et dans la description).
- Ne jamais inventer un fait, un chiffre ou une citation absente de la source.
- Distinguer clairement : annoncé / disponible / rumeur.
- Résumer et commenter, ne pas recopier l'article mot à mot.
- Pas de titre racoleur : le hook doit être tenu par la vidéo.
- L'utilisateur relit toujours avant publication.

## Outils du dépôt

- Skills (`.claude/skills/`) : `episode` (la recette), `ecriture-matou` (voix et
  scènes), `publication` (descriptions, hashtags), `veille-ia` (choisir un sujet),
  `programmation` (brouillons Postiz, puis programmation sur feu vert) et `postiz`
  (skill officiel de Postiz, copié tel quel).
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
