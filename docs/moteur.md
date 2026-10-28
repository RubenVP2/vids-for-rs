# Moteur vidéo — de l'article au MP4

```
article ──► source.md ──► scenes.json ──► voix.mp3 + timings.json ──► MP4 + miniature ──► publication.md
         documentaliste   ecriture-matou      npm run voice             npm run render       publication
                          + validate         (TTS + transcription       + stills + contrôle   + check
                          + relectures         + alignement)
```

La recette complète, étape par étape, est le skill `.claude/skills/episode/`. Ce
document explique **comment le moteur marche**, pour le modifier.

## Installation

```bash
npm ci
```

Variables : `OPENROUTER_API_KEY` (ou `OPENROUTER_KEY`). Postiz : secret réseau sur
`api.postiz.com` (en-tête `Authorization` sans préfixe) ou `POSTIZ_API_KEY` ; `POSTIZ_API_URL`
pour une instance auto-hébergée. Navigateur : Remotion utilise
`$REMOTION_BROWSER`, sinon le Chromium headless de Playwright s'il est installé
(`/opt/pw-browsers`), sinon il télécharge le sien.

## Commandes

| Commande | Fait |
| --- | --- |
| `npm run validate -- NNN` | schéma, longueur, rituels, chiffres absents de la source |
| `npm run voice -- NNN [--force]` | voix + minutage des mots + enveloppe de la bouche |
| `npm run render -- NNN [--brouillon]` | MP4 1080×1920 normalisé −14 LUFS + miniature PNG |
| `npm run stills -- NNN` | une image de contrôle par scène, interface des réseaux par-dessus |
| `npm run check -- NNN` | contrôle final : durée, format, volume, voix, publication |
| `npm run postiz -- NNN [--envoyer \| --programmer]` | aperçu (`postiz.json`, `postiz-mcp.json` pour le MCP Postiz), puis, avec une clé d'API, brouillons et programmation (skill `programmation`) |
| `npm run postiz -- --canaux` | comptes connectés à Postiz et règles de chaque réseau |
| `npm run studio` | Remotion Studio, aperçu interactif (props par défaut : #000) |
| `npm run brand` | réexporte les SVG de Matou et des icônes dans `brand/` |
| `npm run stills -- planches` | réexporte les planches de `docs/images/` et `brand/avatar.png` |
| `npm run voices:compare` | regénère le comparatif des voix (`brand/voix/essais/`) |

`NNN` accepte `000`, `0` ou le nom du dossier.

## Un épisode sur disque

```
episodes/NNN-slug/
  source.md         article + fiche des faits (documentaliste)
  scenes.json       le script découpé en scènes (seul fichier écrit à la main)
  voix.mp3          la voix de Matou
  timings.json      minutage de chaque mot, des scènes, volume par image
  publication.md    descriptions et hashtags par plateforme
  postiz.json       ce qui est (ou serait) envoyé à Postiz
  postiz-mcp.json   le même envoi au format du MCP Postiz (integrationSchedulePostTool)
  postiz-envoi.json ids des brouillons Postiz et leur statut
  rendu/            MP4 + miniature (ignoré par git)
  controle/         images de contrôle (ignoré par git)
```

## La voix (`scripts/voice.ts`)

1. Toutes les phrases des scènes sont lues **d'un seul tenant** (prosodie naturelle)
   par la voix de `brand/voix.json` (Gemini TTS « Puck » ; secours MAI « Marc » puis
   ElevenLabs « Brian » si la première échoue).
2. Silences de début et fin coupés, volume normalisé.
3. OpenRouter ne renvoie pas de minutage avec la voix : on **retranscrit** l'audio
   (Whisper large v3, horodatage par mot) puis on **aligne** les mots du script sur les
   mots entendus (`scripts/lib/alignement.ts`, alignement de séquences). Le script garde
   son orthographe ; les mots non retrouvés sont interpolés. Le taux d'alignement est
   noté dans `timings.json` (≥ 85 % attendu).
4. Volume RMS par image → `enveloppe` : la bouche de Matou s'ouvre en paliers.

Changer de voix = modifier `brand/voix.json`. Passer à la voix de l'utilisateur (V2) :
même fichier, avec un modèle qui clone une voix à partir d'un extrait
(`input_references`, voir la doc TTS d'OpenRouter), sans toucher au reste.

## Le rendu (`src/`)

- `Root.tsx` déclare les compositions : `Episode`, `EpisodeAvecInterface` (contrôle),
  `Miniature`, `PlancheMarque`, `PlancheMatou`.
- `Episode.tsx` : chaque scène commence 4 images avant son premier mot et dure jusqu'à
  la scène suivante. La durée totale = voix + 1,4 s. Matou, les sous-titres et l'en-tête
  vivent au-dessus des scènes.
- `schema.ts` : schéma Zod de `scenes.json` et `timings.json`, vérifié par `validate`,
  par Remotion Studio et au rendu.
- Ajouter un type de scène : l'ajouter au schéma, écrire son composant dans
  `scenes/Scenes.tsx` (+ `SceneVue`, `MATOU_PAR_DEFAUT`), sa place de Matou dans
  `PLACEMENTS` (`Episode.tsx`), puis le documenter dans le skill `ecriture-matou`.

## Coûts (OpenRouter, ordre de grandeur)

Voix ~0,01 $ par épisode, transcription ~0,005 $. La musique (Lyria, 0,04 $) n'a été
générée qu'une fois.
