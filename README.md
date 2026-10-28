# Vids for RS — Matou (@matou.ai)

**L'actu de l'IA en 30 secondes. Un chat t'explique.** ☝️🤓

Vidéos courtes verticales (TikTok, Instagram Reels, YouTube Shorts) qui expliquent au
grand public les annonces et articles de blog des grands acteurs de l'IA, présentées
par Matou, un chat à lunettes dessiné à la main.

![Le cahier de Matou](docs/images/planche-matou.png)

## Objectifs

1. **Informer** : rendre l'actualité IA claire, sourcée et utile en 30 à 45 secondes.
2. **Fidéliser** : une identité forte (design system, mascotte, rituels) pour que les
   viewers reconnaissent les vidéos au premier coup d'œil, s'abonnent et reviennent.
3. **Automatiser** : **une session Claude = une vidéo**. On fournit un article, Claude
   produit la vidéo prête à publier + description + hashtags.

## Produire un épisode

Dans une session Claude Code : donner le lien de l'article. Claude suit le skill
`episode` (source → script → relectures → voix → rendu → contrôles → publication).

À la main :

```bash
npm ci
npm run validate -- 001 && npm run voice -- 001 && npm run render -- 001 && npm run check -- 001
```

## État du projet

- ✅ Phase 1 — Brainstorming & positionnement
- ✅ Phase 2 — Identité de marque
- ✅ Phase 3 — Moteur vidéo (épisode `#000` bande-annonce rendu)
- ✅ Phase 5 — Skills et sous-agents « 1 session = 1 vidéo »
- 🟡 **Phase 4 — Pilote `#001`** sur un vrai article (prochaine étape)

| Document | Contenu |
| --- | --- |
| [`docs/design-system.md`](docs/design-system.md) | Le cahier de Matou : couleurs, typos, Matou, composants, son |
| [`docs/moteur.md`](docs/moteur.md) | Le moteur vidéo : commandes, voix, alignement, rendu |
| [`docs/decisions.md`](docs/decisions.md) | Journal des décisions (tranchées et ouvertes) |
| [`docs/roadmap.md`](docs/roadmap.md) | Les phases du projet |
| [`docs/brainstorm.md`](docs/brainstorm.md) | Pistes explorées en phase 1 |
| [`CLAUDE.md`](CLAUDE.md) | Le contexte et les règles que Claude suit à chaque session |
