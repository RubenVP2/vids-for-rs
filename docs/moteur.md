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

Variables : `OPENROUTER_API_KEY` (ou `OPENROUTER_KEY`). Postiz : la CLI `postiz`
(`scripts/lib/postiz-cli.ts`) avec son jeton OAuth (`postiz auth:login`) ou
`POSTIZ_API_KEY` (ou `POSTIZ_ENV`) ; `POSTIZ_API_URL` pour une instance auto-hébergée.
Navigateur : Remotion utilise `$REMOTION_BROWSER`, sinon le Chromium headless de
Playwright s'il est installé (`/opt/pw-browsers`), sinon le Chromium du système
(`/usr/bin/chromium`, sur le Pi), sinon il télécharge le sien.

## Commandes

| Commande | Fait |
| --- | --- |
| `npm run validate -- NNN` | schéma, longueur, rituels, chiffres absents de la source, fraîcheur de l'info |
| `npm run voice -- NNN [--force]` | voix + minutage des mots + enveloppe de la bouche |
| `npm run render -- NNN [--brouillon]` | MP4 1080×1920 normalisé −14 LUFS + miniature PNG |
| `npm run stills -- NNN` | une image de contrôle par scène, interface des réseaux par-dessus |
| `npm run check -- NNN [--date AAAA-MM-JJ]` | contrôle final : fraîcheur, durée, format, volume, voix, publication |
| `npm run postiz -- NNN [--envoyer \| --programmer]` | aperçu (`postiz.json`, charge utile de `postiz posts:create --json`), puis brouillons et programmation par la CLI (skill `programmation`) |
| `npm run postiz -- --canaux` | comptes connectés à Postiz et règles de chaque réseau |
| `npm run bilan [-- --jours 30]` | chiffres Postiz de chaque épisode envoyé (écrit `stats.json`) et des comptes |
| `npm run bilan -- --attente` | épisodes dont les brouillons attendent la relecture |
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
  postiz-envoi.json ids des brouillons Postiz et leur statut
  stats.json        chiffres par réseau (npm run bilan)
  rendu/            MP4 + miniature (ignoré par git)
  controle/         images de contrôle (ignoré par git)
```

## La voix (`scripts/voice.ts`)

1. Toutes les phrases des scènes sont lues **d'un seul tenant** (prosodie naturelle)
   par la voix de `brand/voix.json` (Gemini TTS « Puck » ; secours MAI « Marc » puis
   ElevenLabs « Brian » si la première échoue).
2. Silences de début et fin coupés, volume normalisé.
3. **Chaque prise est mesurée** (`scripts/lib/qualite-voix.ts`) : hauteur par corrélation
   croisée normalisée, lissée (médiane glissante, sauts de plus de 7 demi-tons rejetés) ;
   intonation = écart **p20–p80** en demi-tons ; pauses ≥ 250 ms rapportées aux phrases ;
   débit en mots par minute, recalé par `atempo` **avant** de juger. Calibrage (000–010, plus
   trois prises d'essai) : Puck donne 5,8 à 9,6 demi-tons, une prise volontairement plate de
   Puck 3,2 à 4,8, MAI « Marc » 4,3 — plancher **5,5**. La synthèse n'étant pas déterministe,
   on essaie **trois prises** et on s'arrête à la première conforme ; le modèle est réessayé
   trois fois (15 s) avant d'abandonner.
4. **Ni voix de secours, ni prise plate ne sont publiées** : la meilleure prise non conforme
   part dans `voix.refaire.mp3`, un secours demandé à la main (`--secours`) dans
   `voix.secours.mp3`, `voix.mp3` reste intact et la commande échoue (code 1). `npm run check` refuse aussi tout `timings`
   dont la voix n'est pas celle de `brand/voix.json`. Le profil de hauteur (`profil`) n'est
   qu'une **alerte** : deux voix d'homme partagent la même plage, seule l'identité du modèle
   tranche. Un débit trop rapide est recalé avec `atempo` (hauteur gardée) ; s'il reste rapide,
   c'est le texte qu'il faut raccourcir.
5. La provenance (modèle, voix, **sha256 du mp3**) est écrite dans `voix.meta.json` : `check`
   compare l'empreinte, donc un fichier déplacé à la main ne passe pas pour Matou.
6. OpenRouter ne renvoie pas de minutage avec la voix : on **retranscrit** l'audio
   (Whisper large v3, horodatage par mot) puis on **aligne** les mots du script sur les
   mots entendus (`scripts/lib/alignement.ts`, alignement de séquences). Le script garde
   son orthographe ; les mots non retrouvés sont interpolés. Le taux d'alignement est
   noté dans `timings.json` (≥ 85 % attendu), avec les mesures de la prise (`qualite`).
7. Volume RMS par image → `enveloppe` : la bouche de Matou s'ouvre en paliers.

Changer de voix = modifier `brand/voix.json`. Passer à la voix de l'utilisateur (V2) :
même fichier, avec un modèle qui clone une voix à partir d'un extrait
(`input_references`, voir la doc TTS d'OpenRouter), sans toucher au reste.

## Le rendu (`src/`)

- `Root.tsx` déclare les compositions : `Episode`, `EpisodeAvecInterface` (contrôle),
  `Miniature`, `PlancheMarque`, `PlancheMatou`.
- `Episode.tsx` : chaque scène commence 4 images avant son premier mot et dure jusqu'à
  la scène suivante. La durée totale = voix + 1,4 s. Matou, les sous-titres et l'en-tête
  vivent au-dessus des scènes.
- Date affichée (en-tête, étiquette du hook, pied du carrousel) : toujours celle de la
  **source**, rattachée à elle par `dateSource` (`EnTete.tsx`) : « article du 7 nov. 2026 »,
  jamais une date seule. La vidéo ne montre pas sa date de sortie : le réseau l'affiche, et
  elle n'est connue qu'à l'envoi. **Fraîcheur** : la source a au plus `FRAICHEUR_MAX` = 2 jours
  calendaires (heure de Paris) le jour où la vidéo sort (`scripts/lib/episode.ts`) ; au-delà,
  `validate` et `check` refusent — mais seulement tant que la sortie est devant : dès que la date
  d'envoi du journal est passée, la vidéo est de l'histoire et n'est plus bloquée (sinon un épisode
  déjà publié serait refusé à chaque relecture). Jour de sortie :
  `postiz-envoi.json` s'il existe, sinon `--date` (`check`), sinon aujourd'hui (Postiz publie
  le jour même). Ce jour est la **dernière** date programmée du journal (postes compris), pas
  sa ligne `date` : un brouillon du 9 repoussé au 12 vaut le 12. Un journal resté en
  Seul un journal `programmé` compte : un `brouillon`, un statut inconnu ou une date illisible (mois 13, 30 février) ne prouvent aucun départ, et le garde-fou s'applique alors comme si le journal n'existait pas.
  La branche urgente de `commande.sh` (« ok #NNN ») lance `check` avant de publier et refuse
  sur « Info trop vieille » : c'est le seul chemin qui n'écrit pas de brouillon d'abord.
- `schema.ts` : schéma Zod de `scenes.json` et `timings.json`, vérifié par `validate`,
  par Remotion Studio et au rendu.
- Ajouter un type de scène : l'ajouter au schéma, écrire son composant dans
  `scenes/Scenes.tsx` (+ `SceneVue`, `MATOU_PAR_DEFAUT`), sa place de Matou dans
  `PLACEMENTS` (`Episode.tsx`), puis le documenter dans le skill `ecriture-matou`.

## Coûts (OpenRouter, ordre de grandeur)

Voix ~0,01 $ par épisode, transcription ~0,005 $. La musique (Lyria, 0,04 $) n'a été
générée qu'une fois.
