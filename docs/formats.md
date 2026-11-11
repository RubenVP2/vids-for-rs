# Formats d'essai

Deux formats testés à côté du cahier habituel, pour changer la **première image** : sur
YouTube, 58,8 % des spectateurs balayent avant de regarder (YouTube Studio, 28 jours au
09/11/2026). Le champ `format` de `scenes.json` choisit la vidéo (`src/Episode.tsx`) ;
absent, c'est le cahier.

| Format | `format` | La 1re image | Ce qui change | Fichiers |
| --- | --- | --- | --- | --- |
| Matou t'écrit | `messages` | Un fil de messages, Matou en photo de profil, la 1re bulle déjà là | Chaque phrase est une bulle qui arrive au moment où Matou la dit ; le mot dit passe au fluo (la bulle remplace les sous-titres). `reponse` sur une scène : la bulle du spectateur (non prononcée). Le Hype-mètre arrive comme une image envoyée | `src/formats/Messages.tsx` |
| Matou contre le titre | `titre` | La coupure de presse (gros titre en serif, média, date) et trois tampons VRAI ? EXAGÉRÉ ? FAUX ? qui clignotent | Matou juge un titre au lieu de résumer une annonce. Le verdict est un tampon posé sur la coupure (`titrePresse.verdict` : `vrai`, `exagere`, `faux`) ; la fin reprend la coupure tamponnée | `src/formats/Titre.tsx` |

Règles inchangées : la source est citée et datée à l'écran, rien n'est inventé. Pour
`titre`, le titre jugé est celui de la source (ou sa traduction fidèle), et le tampon
s'appuie sur la fiche de `source.md`.

## Prototypes (`prototypes/`)

- `901-matou-t-ecrit` : l'épisode #021 (feux de la ville, NVIDIA), même voix et même
  minutage, en format `messages`. Il se compare directement au #021 publié.
- `902-matou-contre-le-titre` : l'article de #010 (Sam Altman et la RAM, Tom's Hardware),
  script réécrit pour le format `titre`, verdict « exagéré ».

Rendu : `npm run render -- prototypes/<dossier>` ; images : `npm run stills -- prototypes/<dossier>`.

## Pas encore branché

Rien de ceci n'entre dans les routines tant que l'utilisateur n'a pas validé un format :
`validate` ne connaît pas encore les règles propres à chaque format (ouverture du gabarit,
titre de presse présent dans `source.md`), et le carrousel LinkedIn reste celui du cahier.
