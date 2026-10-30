---
name: publication
description: Écrit publication.md d'un épisode de Matou — un texte taillé pour chaque réseau (TikTok, Instagram Reels, YouTube Shorts, LinkedIn en carrousel, Threads et sa relance), avec les hashtags. À utiliser après le rendu, ou pour réécrire une description ou des hashtags.
---

# Publication : un texte par réseau

Chaque réseau récompense autre chose (`docs/reseaux.md`) : on ne recopie pas le même
texte partout. Écrire `episodes/NNN-slug/publication.md` avec exactement ces sections
(`npm run check` et `npm run postiz` les lisent) : `## TikTok`, `## Instagram`,
`## YouTube`, `## LinkedIn`, `## Threads`, `## Threads relance`. Facebook reprend le texte
d'Instagram ; X et Bluesky, pas connectés, une section `## Court (X, Bluesky)` facultative.

## Règles communes

Lire d'abord `docs/reseaux.md` et la section « Publier » de `docs/apprentissages.md`.

- Ouvrir sur la promesse du hook, reformulée, sans racolage : la vidéo la tient.
- La source est citée par son nom partout. L'**URL complète** ne va que dans la section
  YouTube et dans le commentaire de sources : sur les autres réseaux, un lien dans le
  texte coupe la portée.
- Le statut si ce n'est pas disponible : « annoncé », « rumeur ».
- Ton de Matou : tutoiement, un emoji ☝️ ou 🤓 au plus par paragraphe.
- Hashtags en français d'abord, toujours liés au sujet. `#IA` partout, `#matou` sur
  TikTok, Instagram et YouTube.

## Par réseau

- **TikTok** (vidéo) : 150 caractères avant les hashtags. Les **mots que les gens
  cherchent** (le nom connu : ChatGPT, Google, Apple…) dans la 1re phrase, puis une
  question qui fait commenter. 3 à 5 hashtags, dont `#apprendresurtiktok`.
- **Instagram** (Reel) : 1re ligne = la promesse (coupée à ~125 caractères). 3–6 lignes
  aérées, flèches « → » pour 2–3 points clés. Finir sur une invitation à **envoyer la
  vidéo** (« Envoie-la à quelqu'un qui… ») : c'est le signal le plus fort du Reel.
  **3 à 5 hashtags** (Instagram n'en garde pas plus), dont `#vulgarisation`.
- **YouTube** (Short) : `**Titre** :` 60 caractères max, cherchable (nom connu et fait
  d'abord), le numéro (`#NNN`) à la fin. 2 lignes de description, puis
  `Source : <URL>`, puis 2 à 4 hashtags dont `#shorts`. Le titre sert aussi à Facebook
  et nomme le carrousel LinkedIn.
- **LinkedIn** (carrousel, `npm run carrousel`) : écrit pour des pros hors tech.
  - 1er paragraphe = l'accroche, **210 caractères max** (au-delà, « … voir plus »).
  - Puis ce que ça change **pour le travail** (métier, entreprise, décisions), 2–3
    flèches « → », 600 à 1 300 caractères en tout.
  - Finir par une question à laquelle un pro a envie de répondre, puis « Le détail en
    images ⤵️ » ou équivalent.
  - 0 à 3 hashtags (`#IA` et 1–2 du métier : `#management`, `#RH`, `#cybersécurité`…).
  - Aucune URL : la source est en 1er commentaire.
- **Threads** (vidéo, 9 h) : 500 caractères max, une **prise de position** ou une
  question franche qui appelle des réponses, pas la légende TikTok. L'idée en une phrase,
  le statut s'il le faut, `Source : <nom>`. Un seul hashtag (`#IA` ou le sujet), aucune URL.
- **Threads relance** (texte seul, quelques heures après la vidéo, le même jour) : 500 caractères max. Une
  **question** qui fait débattre sur le même sujet, sous un autre angle que le matin
  (« Tu ferais confiance à… ? », « Qui a déjà… ? »). Elle doit se comprendre sans la
  vidéo. Pas de lien, au plus un hashtag.
- **Court (X, Bluesky)**, facultatif : 280 caractères, un hashtag, sans URL.

En tête du fichier : le chemin de la vidéo, de la miniature, l'URL de la source et la
ligne `Commentaire à épingler (tous les réseaux) : Sources : …` (nom et URL de chaque
source ; 280 caractères max). Il devient le 1er commentaire partout sauf TikTok, et la
1re réponse du fil sur Threads. Modèle : `episodes/003-experts-obeissent-ia/publication.md`.

La bio, le nom affiché et la photo de profil ne changent pas d'un épisode à l'autre :
`brand/profil.md` (à donner si l'utilisateur les demande).

**Fait quand** `npm run check -- NNN` ne signale rien sur la publication.
