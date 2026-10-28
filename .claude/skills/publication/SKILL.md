---
name: publication
description: Écrit publication.md d'un épisode de Matou — descriptions et hashtags pour TikTok, Instagram Reels, YouTube Shorts, plus le texte court de Threads, X et Bluesky. À utiliser après le rendu, ou pour réécrire une description ou des hashtags.
---

# Publication : description + hashtags

Écrire `episodes/NNN-slug/publication.md` avec exactement ces sections (les scripts
`npm run check` et `npm run postiz` les lisent) : `## TikTok`, `## Instagram`,
`## YouTube`, `## Court (Threads, X, Bluesky)`. Facebook et LinkedIn reprennent le texte
d'Instagram : pas de section à écrire pour eux.

## Règles communes

Lire d'abord la section « Publier » de `docs/apprentissages.md`.

- Première ligne = la promesse du hook, reformulée, sans racolage : la vidéo la tient.
- La source est citée : nom de l'entreprise ou du média, et l'**URL complète** au moins
  dans la section YouTube (TikTok et Instagram : nom de la source, URL en commentaire épinglé).
- Le statut si ce n'est pas disponible : « annoncé », « rumeur ».
- Ton de Matou : tutoiement, un emoji ☝️ ou 🤓 au plus par paragraphe.
- Hashtags : 4 à 6 par plateforme, en français d'abord. Toujours `#IA` et `#matou`.
  Ajouter 1–2 tags du sujet (`#ChatGPT`, `#Gemini`, `#Claude`, `#Mistral`…) et 1–2
  tags de découverte (`#apprendresurtiktok` sur TikTok, `#vulgarisation` ailleurs).
  Pas de tags sans rapport avec la vidéo.

## Par plateforme

- **TikTok** : 150 caractères avant les hashtags, une question qui invite à commenter.
- **Instagram** : 3–6 lignes aérées, flèches « → » pour 2–3 points clés, invitation à
  s'abonner, hashtags à la fin.
- **YouTube** : `**Titre** :` 60 caractères max, avec le numéro (`#NNN`) à la fin ;
  2 lignes de description, puis `Source : <URL>`, puis 3–4 hashtags dont `#shorts`.
  Le titre sert aussi de titre à la vidéo Facebook.
- **Court (Threads, X, Bluesky)** : **280 caractères max** hashtag compris (limite de X).
  La promesse du hook, l'idée en une phrase, le statut s'il le faut, `Source : <nom>`, et
  **un seul** hashtag, `#IA` (Threads n'en garde qu'un). Pas d'URL : elle va dans le
  commentaire, qui devient la première réponse du fil sur ces trois réseaux.

En tête du fichier : le chemin de la vidéo, de la miniature, l'URL de la source et la
ligne `Commentaire à épingler (tous les réseaux) : Sources : …` (nom et URL de chaque
source ; 280 caractères max, car X et Bluesky le reçoivent en réponse).
Modèle : `episodes/001-chatgpt-prend-la-souris/publication.md`.

La bio, le nom affiché et la photo de profil ne changent pas d'un épisode à l'autre :
`brand/profil.md` (à donner si l'utilisateur les demande).

**Fait quand** `npm run check -- NNN` ne signale rien sur la publication.
