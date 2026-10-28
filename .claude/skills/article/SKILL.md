---
name: article
description: Écrit article.md d'un épisode de Matou, la version texte publiée sur le blog du site (site/). À utiliser après publication.md (étape 6 du skill episode), ou pour réécrire un article du blog.
---

# Article : la version texte de l'épisode

Écrire `episodes/NNN-slug/article.md`. Le site (`site/`, voir `docs/site.md`) le publie
sur `/blog/<slug>/` **seul, au bon moment** : seulement quand `postiz-envoi.json` dit
`programmé` (le « oui » de l'utilisateur) et que la date de la vidéo est passée. Il ne
faut donc rien faire d'autre pour le publier, ni le publier plus tôt.

Le numéro, la série, la source, le statut (tampon) et le Hype-mètre viennent de
`scenes.json` : ne pas les répéter dans le fichier. La miniature vient de
`miniature.jpg` (écrite par `npm run render`).

## Format

```markdown
---
titre: "…"        # 65 caractères max : le titre Google et le H1
description: "…"  # 80 à 165 caractères : le texte sous le titre dans Google
---

## En bref
- 3 puces : l'idée, l'accès (statut en gras), le chiffre ou la nuance clé.

## … (3 à 5 intertitres qui posent chacun une question ou une idée)

## Et pour toi ?
```

## Règles

- Mêmes règles éditoriales que la vidéo (`CLAUDE.md`) : chaque fait, chiffre et
  citation vient de `source.md` ; une info de source secondaire le dit (« selon
  9to5Mac… ») ; annoncé / disponible / rumeur toujours clair.
- Plus de place que la vidéo : 400 à 700 mots. Y mettre les nuances et les zones floues
  de la fiche que la vidéo n'a pas pu dire (un encadré `>` pour la plus importante).
- Ton de Matou, tutoiement, « En fait… » au plus une fois. Pas d'emoji. Un mot
  technique s'explique entre parenthèses ou en une phrase.
- Le titre contient le nom du produit ou de l'entreprise (c'est ce que les gens
  cherchent sur Google) et tient la promesse du hook, sans racolage.
- Pas d'URL dans le texte : la source est affichée sous l'article par le site.
- Pas de section « Hype-mètre » : le site l'ajoute à partir de `scenes.json`.

Modèle : `episodes/002-gemini-4-carbon/article.md`.

**Fait quand** le sous-agent `verificateur-faits`, lancé sur `article.md` au lieu de
`scenes.json`, rend « OK », et que `npm run build` dans `site/` passe (le schéma
refuse un titre ou une description hors limites).
