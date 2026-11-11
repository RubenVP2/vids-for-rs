---
name: publication
description: Écrit publication.md d'un épisode de Matou — un texte taillé pour chaque réseau (TikTok, Instagram Reels, YouTube Shorts, Threads), avec les hashtags. À utiliser après le rendu, ou pour réécrire une description ou des hashtags.
---

# Publication : un texte par réseau

Chaque réseau récompense autre chose (`docs/reseaux.md`) : on ne recopie pas le même
texte partout. Écrire `episodes/NNN-slug/publication.md` avec exactement ces sections
(`npm run check` et `npm run postiz` les lisent) : `## TikTok`, `## Instagram`,
`## YouTube`, `## Threads`. Pas de `## LinkedIn` : LinkedIn a un post de fond par
semaine depuis le 10/11/2026 (skill `linkedin`), plus un post par épisode. Pas de `## Threads relance` : elle est arrêtée
depuis le 09/11/2026 (`npm run gabarits -- NNN` la redemande si elle revient dans
`brand/postiz.json`). Facebook reprend le texte
d'Instagram ; X et Bluesky, pas connectés, une section `## Court (X, Bluesky)` facultative.

## Gabarits (d'abord)

`npm run gabarits -- NNN` donne, pour chaque réseau, le gabarit de cet épisode (la
question de fin, la 1re ligne ou le titre à écrire selon une formule), avec un exemple.
Copier sa dernière ligne (`Gabarits : tiktok=… · …`) en tête de `publication.md` et
suivre chaque gabarit. Il ne se choisit pas : il tourne avec le numéro, pour que le bilan
compare les formules. Si l'un ne colle vraiment pas au sujet, prendre un autre gabarit du
même réseau (`brand/publication.json`) et écrire la raison entre parenthèses après son
nom. Pourquoi et comment c'est vérifié : `docs/publication.md`.

Jamais de question oui/non (« Tu penses que… ? », « Est-ce que… ? ») : on y répond d'un
pouce ou pas du tout. Demander un choix, un chiffre ou un récit.

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
  cherchent** (le nom connu : ChatGPT, Google, Apple…) dans la 1re phrase, puis la
  question du gabarit. 3 à 5 hashtags, dont `#apprendresurtiktok`.
- **Instagram** (Reel) : 1re ligne = la promesse selon le gabarit (coupée à ~125 caractères). 3–6 lignes
  aérées, flèches « → » pour 2–3 points clés. Finir sur une invitation à **envoyer la
  vidéo** (« Envoie-la à quelqu'un qui… ») : c'est le signal le plus fort du Reel.
  **3 à 5 hashtags** (Instagram n'en garde pas plus), dont `#vulgarisation`.
- **YouTube** (Short) : `**Titre** :` 60 caractères max, selon le gabarit, avec le nom
  connu dans les 3 premiers mots et sans numéro (`#NNN` : personne ne le cherche, et il
  prend 5 caractères). 2 lignes de description, puis
  `Source : <URL>`, puis 2 à 4 hashtags dont `#shorts`. Le titre sert aussi à Facebook
  et nomme le carrousel LinkedIn.
- **LinkedIn** (seulement si `npm run gabarits` la demande, ce qui n'est plus le cas depuis le
  10/11/2026 ; carrousel, `npm run carrousel`) : écrit pour des pros hors tech.
  - 1er paragraphe = l'accroche, **210 caractères max** (au-delà, « … voir plus »).
  - Puis ce que ça change **pour le travail** (métier, entreprise, décisions), 2–3
    flèches « → », 600 à 1 300 caractères en tout.
  - Finir par la question du gabarit, à laquelle un pro a envie de répondre, puis « Le détail en
    images ⤵️ » ou équivalent.
  - 0 à 3 hashtags (`#IA` et 1–2 du métier : `#management`, `#RH`, `#cybersécurité`…).
  - Aucune URL : la source est en 1er commentaire.
- **Threads** (vidéo) : 500 caractères max, une **prise de position** selon le gabarit
  et **toujours une question**, pas la légende TikTok ni un résumé. L'idée en une phrase,
  le statut s'il le faut, `Source : <nom>`. Un seul hashtag (`#IA` ou le sujet), aucune URL.
- **Threads relance** (arrêtée ; seulement si `npm run gabarits` la demande ; texte seul,
  quelques heures après la vidéo, le même jour) : 500 caractères max. La **question** du gabarit, sur le même sujet, sous un autre angle que
  la vidéo. Elle doit se comprendre sans la vidéo. Pas de lien, au plus un hashtag.
- **Court (X, Bluesky)**, facultatif : 280 caractères, un hashtag, sans URL.

## Épisode intemporel (`"intemporel"` dans `scenes.json`)

La série « Matou t'explique » répond à une question que les gens **tapent** : c'est elle
qui fait le texte, pas un nom de marque.

- **YouTube** : le titre est la question, mot pour mot comme on la cherche (« C'est quoi
  un agent IA ? », « Pourquoi ChatGPT invente des réponses ? »). Déclarer le gabarit
  `pourquoi` ou celui prévu, avec la raison « série intemporelle » s'il diffère.
- **TikTok** : la question dans la 1re phrase, puis la question de fin du gabarit.
- Partout : pas de « vient d'annoncer », pas de date ; la source reste citée.

En tête du fichier : la ligne `Gabarits : …`, le chemin de la vidéo, de la miniature, l'URL de la source et la
ligne `Commentaire à épingler (tous les réseaux) : Sources : …` (nom et URL de chaque
source ; 280 caractères max). Il devient le 1er commentaire partout sauf TikTok, et la
1re réponse du fil sur Threads. Modèle : `episodes/003-experts-obeissent-ia/publication.md`
(antérieur aux gabarits : sans ligne `Gabarits`, avec `#003` dans le titre).

La bio, le nom affiché et la photo de profil ne changent pas d'un épisode à l'autre :
`brand/profil.md` (à donner si l'utilisateur les demande).

**Fait quand** `npm run check -- NNN` ne signale rien sur la publication.
