---
name: ecriture-matou
description: Comment Matou parle et comment écrire un scenes.json — voix, structure en scènes, budget de mots, catalogue des types de scène. À lire pour écrire, réécrire ou raccourcir le script d'un épisode.
---

# Écrire comme Matou

## La voix

Matou est un chat à lunettes qui a tout lu et qui t'explique l'essentiel comme à un
pote. **Pédagogue d'abord**, drôle ensuite : humour pince-sans-rire à la Fireship,
jamais moqueur envers le public.

- Tutoiement. Phrases courtes, à l'oral : une idée par phrase, 15 mots max.
- Zéro jargon non expliqué. Un terme technique → une image du quotidien dans la même
  phrase (« un modèle, c'est le cerveau du programme »).
- Chiffres : un ou deux, ceux qui changent la compréhension, arrondis à l'oral
  (« presque deux fois plus rapide ») si la source le permet.
- Toujours dire **qui** annonce et **si c'est disponible, annoncé ou une rumeur**.
- Une blague maximum par épisode, plutôt dans la chute ou le verdict.
- Rituels obligatoires : « En fait… » pour lancer l'explication (scène `point` en général),
  « C'était Matou, et c'est tout. » en dernière phrase.

## Règles éditoriales (non négociables)

Elles viennent de `CLAUDE.md` : citer la source, ne rien inventer, distinguer
annoncé / disponible / rumeur, reformuler au lieu de recopier, un hook tenu par la vidéo.
Tout fait, chiffre ou citation du script doit se retrouver dans la fiche de `source.md`.

## Budget

La voix lit **~3,4 mots par seconde**.

| Série | Usage | Mots (total des `texte`) | Durée |
| --- | --- | --- | --- |
| `flash` | une annonce, une news | 80–105 | ~30 s |
| `decrypte` | un article de blog, un papier | 110–145 | ~40–45 s |

Hook : 16 mots max, il doit tenir en 3 secondes. Une scène : 40 mots max.

## Squelette

1. `hook` (0–3 s) : la promesse. Une question ou un fait étonnant **vrai**. Matou `surpris`.
2. `source` : qui, quoi, quand. Le tampon de statut s'affiche tout seul.
3. 2 à 4 scènes d'explication : `point`, `chiffre`, `liste`, `comparaison`.
4. `pourquoi` : « Et pour toi ? » — l'impact concret sur la vie du spectateur.
5. `verdict` : Matou prononce le niveau du Hype-mètre et pourquoi, en une phrase.
6. `fin` : appel à s'abonner + « C'était Matou, et c'est tout. »

Verdict : `buzz` = beaucoup de bruit, peu de concret / pas dispo ; `prometteur` = réel
mais limité ou à venir ; `gameChanger` = disponible et change vraiment les usages.
Sois avare de `gameChanger`.

## Le fichier scenes.json

Le schéma fait foi : `src/schema.ts` (types, longueurs max). Points clés :

- `texte` = ce que Matou **dit** pendant la scène. Le minutage vient de la voix : on
  n'écrit jamais de temps.
- `==mot==` dans un texte = surligné au fluo (et au stylo bleu dans les sous-titres).
  1 à 2 mots clés par scène, pas plus.
- `matou` = expression : `neutre`, `parle`, `enFait`, `surpris`, `sceptique`, `reflechit`,
  `content`, `verdict`. Par défaut, chaque type de scène a la sienne (`MATOU_PAR_DEFAUT`
  dans `src/scenes/Scenes.tsx`). `sceptique` pour une rumeur ou une promesse floue.
- `quand` (listes, chiffre, comparaison) = mot prononcé qui fait apparaître l'élément :
  le premier mot qui commence par ce texte dans la scène.
- `icone` : une des icônes de `src/components/Icones.tsx` (`brand/icones/`).
- Textes affichés courts : l'écran complète la voix, il ne la répète pas mot pour mot.
- Écrire les nombres comme ils se disent dans `texte` (« trente secondes ») et comme ils
  s'affichent dans `valeur` (« 30 s »).
- Prononciation : la voix lit bien « IA ». Pour un sigle ou un nom ambigu, écrire
  `{affiché|prononcé}` : `{GPT-5|G P T 5}` s'affiche « GPT-5 » et se dit « G P T 5 ».

## Catalogue des scènes

| Type | Champs à l'écran | Pour |
| --- | --- | --- |
| `hook` | `titre` (2–7 mots), `icone?` | accrocher |
| `source` | `titreArticle` | qui / quoi / quand + tampon |
| `point` | `titre`, `corps?`, `icone?` | une idée clé |
| `chiffre` | `valeur`, `legende`, `quand?` | un chiffre marquant |
| `liste` | `titre`, `elements[2–4]` (`texte`, `icone?`, `quand?`) | étapes, nouveautés |
| `comparaison` | `avant`, `apres` (`titre`, `texte`) | avant / après, eux / nous |
| `pourquoi` | `titre`, `corps`, `icone?` | l'impact pour le spectateur |
| `verdict` | `raison` | le Hype-mètre |
| `fin` | — | abonnement + signature |

Exemple complet et rendu : `episodes/000-bande-annonce/scenes.json`.
