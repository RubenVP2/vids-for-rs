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
- Toujours dire **qui** annonce (une demi-phrase dans les 3 premières scènes : « OpenAI
  vient de l'annoncer ») ; le tampon annoncé / disponible / rumeur s'incruste tout seul.
- **Matou a un avis.** Le verdict est sa position assumée, à la 1re personne (« Moi, je
  préfère… »), pas un résumé ; on doit avoir envie de le contredire en commentaire. Une
  pique ou un peu d'auto-dérision de chat sont bienvenues (une ou deux par épisode),
  jamais aux dépens du public.
- Rituel : « En fait… » pour lancer l'explication (scène `point` en général). Plus de
  formule d'adieu ni d'appel à s'abonner : la dernière phrase **renvoie au hook** (fin
  en boucle), la signature est le « Ma-tou ! » sonore de l'écran de fin.

## Règles éditoriales (non négociables)

Elles viennent de `AGENTS.md` : citer la source, ne rien inventer, distinguer
annoncé / disponible / rumeur, reformuler au lieu de recopier, un hook tenu par la vidéo.
Tout fait, chiffre ou citation du script doit se retrouver dans la fiche de `source.md`.

## Budget

La voix lit **entre 2,7 et 3,5 mots par seconde** selon le texte : sigles, chiffres et
phrases courtes la ralentissent (pauses). Le budget vise le cas lent, pour que la
première prise tienne dans la limite de la voix ; `npm run validate` donne la
fourchette de durée.

| Format | Usage | Mots prononcés (total des `texte`) | Voix max |
| --- | --- | --- | --- |
| `flash` | une annonce, une news : **par défaut** | **75–92** (ATTENTION au-delà, ERREUR > 110) | 36 s |
| `decrypte` | un article de blog, un papier | **100–118** (ATTENTION au-delà, ERREUR > 140) | 46 s |
| format long | un sujet qui le demande, l'une ou l'autre série | **120–165** (ERREUR > 190) | 62 s |

**~30 s reste la cible** : c'est là que la vidéo est le plus souvent vue jusqu'au bout.
Mais on ne tasse pas un sujet riche pour tenir 30 s (débit précipité, fin qui tombe) :
s'il a au moins 3 faits que le public doit avoir pour comprendre, ou une démo à montrer
pas à pas, passer en **format long** avec sa raison dans `scenes.json` :
`"long": "trois changements distincts, chacun utile au quotidien"`. Jamais pour délayer :
chaque scène en plus doit apporter un fait. En format long, relancer la curiosité vers
le milieu (« mais le vrai changement, c'est… ») : sans relance, on décroche.

Les mots comptés sont ceux **prononcés** : `{GPT-6.1|G P T six point un}` compte 6 mots.

Hook : 16 mots max, il doit tenir en 3 secondes. Une scène : 40 mots max.

## Gabarit de montage (d'abord)

`npm run gabarits -- NNN` donne l'**ouverture** (ce que montre le hook) et le **corps** (la
scène juste après) de l'épisode, en rotation sur son numéro, pour que deux vidéos ne se
ressemblent pas (un gabarit identique à chaque vidéo est ce que YouTube, TikTok et
Instagram déclassent ou démonétisent : `docs/viralite.md`). Le recopier dans
`scenes.json` : `"gabarit": {"ouverture": "…", "corps": "…"}`. S'il ne colle vraiment pas
au sujet (pas de chiffre dans la source…), en prendre un autre avec sa raison :
`"raison": "…"`. `npm run validate` vérifie qu'il est suivi.

| Ouverture | Le hook |
| --- | --- |
| `fenetre` | `visuel` fenêtre : l'app et 1 ou 2 bulles qui montrent ce que fait l'annonce |
| `chiffre` | `visuel` chiffre : le chiffre le plus frappant de la source, en géant |
| `question` | le titre (ou la phrase) est la question que le spectateur se pose, finie par « ? » |
| `toi` | ce que ça change pour toi, à la 2e personne, dès la 1re phrase |

Corps : `comparaison`, `fenetre` ou `liste` en 2e scène.

## Squelette

1. `hook` (0–3 s) : ce qui change **pour le spectateur** (un bénéfice, une menace), pas
   « X annonce Y ». Un fait étonnant **vrai**. Le titre (2 à 6 mots) complète la voix au
   lieu de la répéter ; avec un `visuel`, la 1re image montre la chose. Matou `surpris`.
   Avant de l'écrire, lire la section « Écrire » de `docs/apprentissages.md` (ce qui a
   retenu le public de Matou jusqu'ici).
2. Le corps du gabarit, puis 1 à 3 scènes d'explication : `point`, `chiffre`, `liste`,
   `comparaison`, `fenetre`. Qui annonce se dit en passant (« OpenAI l'annonce : … ») ;
   il n'y a plus de scène `source` (le tampon de statut s'incruste sur la 2e scène, la
   source reste dans l'en-tête).
3. `pourquoi` : « Et pour toi ? » — l'impact concret sur la vie du spectateur.
4. `verdict` : Matou prononce le niveau du Hype-mètre et **son avis**, en une phrase.
   L'en-tête l'annonce depuis la 2e scène (« Hype-mètre ? ») : c'est la promesse de fin.
5. `fin` : une phrase courte et **complète** qui **renvoie au hook** (elle reprend un de
   ses mots), dite comme une chute : hook « Si ta discussion dérape, ChatGPT peut te
   couper la parole » → fin « Bref, si ta discussion dérape, c'est ChatGPT qui aura le
   dernier mot. ». Pas de phrase en suspens (« la prochaine fois que… ») : au 1er
   visionnage, la vidéo semble coupée. L'écran de fin reprend l'image du hook (c'est lui
   qui fait la boucle), puis le « Ma-tou ! » part après le dernier mot. Ni
   « abonne-toi », ni formule d'adieu (`validate` les refuse) : elles font balayer.

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
| `hook` | `titre` (2–6 mots), `icone?`, `visuel?` (`fenetre` : `app`, `messages[1–2]` ; `chiffre` : `valeur`) | accrocher |
| `fenetre` | `app`, `messages[1–3]` (`de` : `toi` ou `app`, `texte`, `quand?`) | montrer ce que fait l'outil |
| `point` | `titre`, `corps?`, `icone?` | une idée clé |
| `chiffre` | `valeur`, `legende`, `quand?` | un chiffre marquant |
| `liste` | `titre`, `elements[2–4]` (`texte`, `icone?`, `quand?`) | étapes, nouveautés |
| `comparaison` | `avant`, `apres` (`titre`, `texte`) | avant / après, eux / nous |
| `pourquoi` | `titre`, `corps`, `icone?` | l'impact pour le spectateur |
| `verdict` | `raison` | le Hype-mètre |
| `fin` | — | la phrase de boucle ; l'écran reprend le hook, « Ma-tou ! » |

La fenêtre est une **reconstitution** dessinée (c'est écrit dessus) : ses bulles disent
ce que la source dit que l'outil fait, sans citation inventée ni capture de la vraie
interface. Une carte porte 3 à 6 mots (titre) : la voix dit la phrase, l'écran ne la
répète pas.

Exemple complet au format actuel : `episodes/008-*/scenes.json` dès qu'il existe ;
avant #008 (scène `source`, « C'était Matou, et c'est tout. »), c'est l'ancien format.
