---
name: publication
description: Écrit publication.md d'un épisode de Matou — description et hashtags pour TikTok, Instagram Reels et YouTube Shorts. À utiliser après le rendu, ou pour réécrire une description ou des hashtags.
---

# Publication : description + hashtags

Écrire `episodes/NNN-slug/publication.md` avec exactement ces sections (le script
`npm run check` les lit) : `## TikTok`, `## Instagram`, `## YouTube`.

## Règles communes

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

En tête du fichier : le chemin de la vidéo, de la miniature, et l'URL de la source.
Modèle : `episodes/000-bande-annonce/publication.md`.

La bio, le nom affiché et la photo de profil ne changent pas d'un épisode à l'autre :
`brand/profil.md` (à donner si l'utilisateur les demande).

**Fait quand** `npm run check -- NNN` ne signale rien sur la publication.
