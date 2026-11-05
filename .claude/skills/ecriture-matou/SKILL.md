---
name: ecriture-matou
description: Comment Matou parle et comment écrire un scenes.json — voix, structure en scènes, budget de mots, catalogue des types de scène. À lire pour écrire, réécrire ou raccourcir le script d'un épisode.
---

# Écrire comme Matou

## La voix

Matou est un chat à lunettes qui a tout lu et qui t'explique l'essentiel comme à un
pote. **Pédagogue d'abord**, drôle ensuite : humour pince-sans-rire à la Fireship,
jamais moqueur envers le public.

- Tutoiement. Phrases fluides et nerveuses à l'oral : une idée par phrase, 14 mots max.
- **Éviter la ponctuation hachée** (`Accès ? Cette semaine. Toi ? Sans date.`) qui force
  le TTS à marquer des arrêts artificiels : lier les propositions avec fluidité.
- Zéro jargon non expliqué. Un terme technique → une image du quotidien dans la même
  phrase (« un modèle, c'est le cerveau du programme »).
- Chiffres : un ou deux, ceux qui changent la compréhension, arrondis à l'oral
  (« presque deux fois plus rapide ») si la source le permet.
- Toujours glisser **qui** annonce dans les 3 premières scènes (« Selon Bloomberg… »,
  « Chez OpenAI… ») **sans jamais ouvrir la 2e scène par « X l'annonce : » ou « X le
  rapporte : »**. Le tampon annoncé / disponible / rumeur s'incruste tout seul.
- **Matou a un avis.** Le verdict est sa position assumée, à la 1re personne (« Je veux
  bien croire à…, mais… », « Pour moi, … »), sans la formule scolaire « Mon avis : ». On
  doit avoir envie de le contredire en commentaire.
- Rituel : « En fait… » pour lancer l'explication ou le revers de la médaille. Plus de
  formule d'adieu ni d'appel à s'abonner : la dernière phrase **renvoie au hook** (fin
  en boucle) **sans commencer par « Bref, »** (qui télégraphe la fin et fait balayer).

## Règles éditoriales (non négociables)

Elles viennent de `AGENTS.md` : citer la source, ne rien inventer, distinguer
annoncé / disponible / rumeur, reformuler au lieu de recopier, un hook tenu par la vidéo.
Tout fait, chiffre ou citation du script doit se retrouver dans la fiche de `source.md`.

## Budget

La voix est recalée autour de **218 mots par minute (~3,6 mots/s)** avec des silences
internes resserrés à 180 ms (`npm run voice`). `npm run validate` donne la fourchette de durée.

| Format | Usage | Mots prononcés (total des `texte`) | Durée cible | Voix max |
| --- | --- | --- | --- | --- |
| `flash` | une annonce, une news : **par défaut** | **65–88** (ATTENTION au-delà, ERREUR > 110) | **~20–26 s** | 36 s |
| `decrypte` | un article de blog, un papier | **90–115** (ATTENTION au-delà, ERREUR > 140) | **~27–34 s** | 46 s |
| format long | un sujet qui le demande, l'une ou l'autre série | **120–165** (ERREUR > 190) | **~36–48 s** | 62 s |

**~22–26 s est la cible en `flash`** : c'est là que la vidéo dépasse 70 % de complétion.
Mais on ne tasse pas un sujet riche : s'il a au moins 3 faits indispensables ou une démo
pas à pas, passer en **format long** avec sa raison dans `scenes.json` :
`"long": "trois changements distincts, chacun utile au quotidien"`.

Les mots comptés sont ceux **prononcés** : `{GPT-6.1|G P T six point un}` compte 6 mots.

Hook : **12 mots max conseillés** (ERREUR > 16), il doit frapper en **moins de 2,5 secondes**. Une scène : 35 mots max (ERREUR > 40).

## Gabarit de montage (d'abord)

`npm run gabarits -- NNN` donne l'**ouverture** (ce que montre le hook) et le **corps** (la
scène juste après) de l'épisode, en rotation sur son numéro, pour que deux vidéos ne se
ressemblent pas (`docs/viralite.md`). Le recopier dans `scenes.json` :
`"gabarit": {"ouverture": "…", "corps": "…"}`. S'il ne colle vraiment pas au sujet (pas
de chiffre dans la source…), en prendre un autre avec sa raison : `"raison": "…"`.

| Ouverture | Le hook |
| --- | --- |
| `fenetre` | `visuel` fenêtre : l'app et 1 ou 2 bulles qui montrent ce que fait l'annonce |
| `chiffre` | `visuel` chiffre : le chiffre le plus frappant de la source, en géant |
| `question` | le titre (ou la phrase) est la question que le spectateur se pose, finie par « ? » |
| `toi` | ce que ça change pour toi, à la 2e personne, dès la 1re phrase |

Corps : `comparaison`, `fenetre` ou `liste` en 2e scène.

## Squelette : zéro répétition, une relance à 7 secondes

L'erreur fatale (qui faisait décrocher à 8,4 s) est de répéter 4 fois la même idée :
dire le fait au hook, le redire en scène 2 (« X l'annonce : [même fait] »), le redire
dans `pourquoi` (« Et pour toi ? [même fait] »), et le redire en `fin` (« Bref, [même fait] »).
**Règle d'or : chaque scène doit apporter un fait ou un angle NOUVEAU.**

1. `hook` (0–2,5 s, ≤ 12 mots) : ce qui change **pour le spectateur** (un bénéfice, une
   menace, un paradoxe concret), en une seule phrase percutante. Le titre (2 à 6 mots)
   complète la voix au lieu de la répéter ; avec un `visuel`, la 1re image montre la chose.
2. **Scène 2 — La preuve concrète immédiate** (2,5–7 s, le `corps` du gabarit :
   `comparaison`, `fenetre` ou `liste`) : **interdiction de paraphraser le hook** ou de
   commencer par « X l'annonce : ». On entre directement dans les détails concrets ou le
   mécanisme en glissant la source en passant (« Selon Bloomberg, l'équipe… », « Dans la
   nouvelle version d'OpenAI, tu… »).
3. **Scène 3 — Le rebond / « En fait… » / Le revers** (7–13 s, `point` ou `chiffre`) :
   c'est la **relance à 7 secondes** qui retient le spectateur. Apporter la raison cachée,
   le chiffre qui pique ou la limite embarrassante (« En fait, … », « Le piège, c'est que… »).
   Sur une scène `point`, utiliser `titre` (temps 1) + `corps` et `quand` (temps 2 qui
   claque avec la flèche `➔` sur le mot clé).
4. **Impact spectateur (`pourquoi`, facultatif en `flash` si déjà dit)** :
   - En `flash` (5 scènes idéales), si le hook et le verdict portent déjà l'impact pour le
     spectateur, **ne pas ajouter une scène `pourquoi` redondante** avant le verdict (éviter
     d'empiler 3 scènes de conclusion).
   - Si une scène `pourquoi` apporte un fait nouveau sur la vie quotidienne, ne pas
     l'ouvrir systématiquement par le cliché « Et pour toi ? » à l'oral, et renseigner `quand`
     pour faire claquer la carte au bon mot.
5. `verdict` (13–18 s) : Matou prononce le niveau du Hype-mètre et **tranche à la 1re
   personne** (« Hype-mètre : pur buzz. Je veux bien qu'on nous vende l'IA magique, mais… »),
   sans dire platement « Mon avis : ».
6. `fin` (18–21 s, ≤ 10 mots) : une chute sèche et complète qui **renvoie au hook** (reprend
   un mot clé du hook sous un angle ironique), **sans commencer par « Bref, »**, ni
   « abonne-toi », ni formule d'adieu. L'écran reprend l'image du hook et le « Ma-tou ! »
   sonore claque juste après le dernier mot.

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
- `quand` (`point`, `pourquoi`, `liste`, `chiffre`, `comparaison`, `fenetre`) = mot prononcé
  qui déclenche l'apparition du 2e temps visuel (et son bruitage `pop`) : le premier mot
  qui commence par ce texte dans la scène.
- `icone` : une des icônes de `src/components/Icones.tsx` (`brand/icones/`).
- **Textes affichés ultra-courts (2 à 6 mots)** : les sous-titres en bas portent déjà la
  phrase parlée. En haut (`corps`, `avant.texte`, `apres.texte`, `elements`, `raison`),
  interdiction d'écrire des phrases de 10 mots qui doublonnent les sous-titres ; écrire
  des formules chocs lisibles en 0,5 s (`R&D Apple : ==+32 %==` ➔ `La facture ==IA explose==`).
- Écrire les nombres comme ils se disent dans `texte` (« trente secondes ») et comme ils
  s'affichent dans `valeur` (« 30 s »).
- Prononciation : la voix lit bien « IA ». Pour un sigle ou un nom ambigu, écrire
  `{affiché|prononcé}` : `{GPT-5|G P T 5}` s'affiche « GPT-5 » et se dit « G P T 5 ».

## Catalogue des scènes

| Type | Champs à l'écran | Pour |
| --- | --- | --- |
| `hook` | `titre` (2–6 mots), `icone?`, `visuel?` (`fenetre` : `app`, `messages[1–2]` ; `chiffre` : `valeur`) | accrocher |
| `fenetre` | `app`, `messages[1–3]` (`de` : `toi` ou `app`, `texte`, `quand?`) | montrer ce que fait l'outil |
| `point` | `titre`, `corps?` (2–5 mots), `quand?`, `icone?` | une idée clé en 2 temps (`titre` ➔ `corps`) |
| `chiffre` | `valeur`, `legende`, `quand?` | un chiffre marquant |
| `liste` | `titre`, `elements[2–4]` (`texte`, `icone?`, `quand?`) | étapes, nouveautés |
| `comparaison` | `avant`, `apres` (`titre`, `texte` de 2–5 mots, `quand?`) | avant / après, eux / nous |
| `pourquoi` | `titre`, `corps` (2–6 mots), `quand?`, `icone?` | l'impact pour le spectateur (si non couvert ailleurs) |
| `verdict` | `raison` (3–6 mots) | le Hype-mètre + avis tranché |
| `fin` | — | la chute de boucle ; l'écran reprend le hook, « Ma-tou ! » |
