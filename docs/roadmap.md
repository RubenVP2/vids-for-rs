# Roadmap — Vids for RS

## Phase 0 — Mise en place ✅

- Dépôt, README, CLAUDE.md, documents de travail.

## Phase 1 — Brainstorming & positionnement ✅

- Audience, plateformes, langue, ton, rythme, durées, séries de lancement.
- Matou : nom, dessin, voix masculine, phrases signatures, univers « cahier ».
- Voix via OpenRouter, moteur vidéo Remotion.
- Décisions consignées dans [`decisions.md`](decisions.md).

## Phase 2 — Identité de marque ✅

- Matou vectorisé à partir du dessin original : 8 expressions, verres-écrans, trait qui bouillonne.
- Design system « le cahier de Matou » : tokens, polices, couleurs, zones de sécurité,
  composants, icônes, bruitages, signature sonore, musique de fond.
- **Sortie** : [`design-system.md`](design-system.md), `brand/`, planches dans `docs/images/`.
- Reste à faire par l'utilisateur : réserver `@matou.ai` sur TikTok, Instagram et YouTube.

## Phase 3 — Moteur vidéo ✅

- Remotion : 9 types de scènes, sous-titres mot à mot, Hype-mètre, miniature.
- Voix : 11 voix masculines comparées, Gemini « Puck » choisie ; minutage des mots par
  transcription horodatée + alignement sur le script.
- Schéma `scenes.json` validé, scripts `validate`, `voice`, `render`, `stills`, `check`.
- **Sortie** : épisode `#000` (bande-annonce de la chaîne) rendu de bout en bout.
  Détail : [`moteur.md`](moteur.md).

## Phase 5 — Industrialisation « 1 session = 1 vidéo » ✅ (avancée avant le pilote)

- Skills : `episode`, `ecriture-matou`, `publication`, `veille-ia`.
- Sous-agents : `documentaliste`, `verificateur-faits`, `spectateur`, `controleur-visuel`.
- Contrôles automatiques avant et après rendu.

## Phase 4 — Épisode pilote `#001` ✅

- `#001` « L'IA d'OpenAI prend la souris » : produit de bout en bout avec la recette
  `episode`, envoyé en brouillons dans Postiz (TikTok, Instagram, YouTube, Threads).
- Ajustements tirés du pilote : budget de mots recalé, fin sans promesse, texte court
  pour Threads.

## Phase 6 — Lancement & amélioration continue 🟡 *en cours*

- Postiz (cloud, formule Standard) : 5 comptes connectés (le 5e : la page LinkedIn).
- Routines : épisode du jour chaque matin, rappel de relecture, bilan du lundi
  (`docs/bilans/`, `docs/apprentissages.md`, `docs/sujets.md`).
- À faire : premières publications, puis ajuster les formats selon les bilans.
- V2 : la voix de l'utilisateur (clonage via OpenRouter, `brand/voix.json`).
- Site (dépôt RubenVP2/jev-game, `docs/site.md`) : accueil + blog, un article par épisode. À faire :
  le connecter à Cloudflare, le domaine, Search Console, le lien en bio.
