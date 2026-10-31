# Textes des posts : gabarits et contrôles

Ce qui fait commenter, envoyer ou chercher une vidéo tient souvent à une ligne : la
question de fin, la 1re ligne, le titre. Pour ne pas la laisser au hasard du modèle, et
pour pouvoir **mesurer** quelle tournure marche, chaque texte suit un gabarit fixe.
Décision du 2026-11-01 (`docs/decisions.md`). Le reste du texte (fond, ton, longueurs)
suit le skill `publication` et `docs/reseaux.md`.

## La chaîne

```
npm run gabarits -- NNN     un gabarit par réseau, en rotation sur le numéro (sans tirage)
  → l'agent écrit publication.md, avec en tête la ligne « Gabarits : tiktok=camp · … »
npm run check -- NNN        refuse un gabarit non suivi, une question oui/non, etc.
npm run bilan               table « Gabarits de texte » : moyenne des chiffres par gabarit
```

Réglages : `brand/publication.json` (formules, motif vérifié, consigne, exemple). Le
gabarit d'un épisode est `formules[(⌊n/2⌋ + n % 2) % nombre de formules]` (n : son
numéro). Le principal et le second alternent numéros pairs et impairs : `⌊n/2⌋` avance
d'un cran par jour pour chacun, et `n % 2` décale le second. Avec `n` seul, sur TikTok
(4 formules), le principal n'aurait vu que 2 gabarits et le second les 2 autres, et le
bilan aurait comparé les rangs au lieu des gabarits.

Un gabarit qui ne colle vraiment pas au sujet : en prendre un autre du même réseau,
avec sa raison entre parenthèses (`youtube=nom-fait (pas de chiffre dans la source)`).
C'est le seul choix laissé à l'agent, comme le veto de la veille.

## Les gabarits

| Réseau | Partie vérifiée | Gabarits |
| --- | --- | --- |
| TikTok | la question de fin | `camp` (deux camps nommés), `note` (un chiffre à donner), `vecu` (une expérience à raconter), `un-mot` (un mot ou un emoji) |
| Instagram | la 1re ligne | `question`, `chiffre` (le plus frappant de la source), `toi` (ce que ça change pour toi) |
| YouTube | le titre | `nom-fait` (le nom connu, puis le fait), `pourquoi` (« Pourquoi … ? »), `chiffre` |
| LinkedIn | la question de fin | `metier` (le travail du lecteur), `pour-contre`, `horizon` (une prédiction datée) |
| Threads | l'ouverture | `avis` (« Mon avis : »), `pari` (« Je parie que »), `question-d-abord` |
| Threads relance | la question | `dilemme` (« Tu préfères … ou … ? »), `vecu`, `horizon` |

Pourquoi ces familles : une question fermée (« Tu penses que… ? ») se répond d'un pouce
ou pas du tout ; un choix, un chiffre ou un récit demande d'écrire. Sur Instagram, la
1re ligne est tout ce qu'on voit avant « plus ». Sur YouTube, le titre est ce que la
recherche lit. Ce sont des hypothèses : le bilan les juge.

## Les contrôles (`npm run check`, depuis l'épisode `depuis`)

- le gabarit déclaré est celui prévu, ou un autre avec sa raison ; son motif est dans le texte ;
- aucune question oui/non (« est-ce que », « tu penses que », « penses-tu »…), sur tous les réseaux ;
- Threads pose une question ;
- TikTok : un nom connu (liste `entites` de `brand/veille.json`) dans la 1re phrase ;
- Instagram : 1re ligne de 125 caractères au plus, invitation « Envoie-la… » ;
- YouTube : titre de 60 caractères au plus, sans « #NNN », nom connu dans les 3 premiers mots.

Les anciens épisodes (avant `depuis`, 8) ne sont pas contrôlés : ils n'ont pas de gabarit.

## Régler

Ajouter, retirer ou réécrire une formule dans `brand/publication.json`. Retirer une
formule décale la rotation des épisodes suivants, pas les anciens : leur gabarit est écrit
dans leur `publication.md`. Le bilan du lundi **propose** de retirer un gabarit qui fait
moins bien sur au moins 3 posts du même réseau ; l'utilisateur décide.

## Limites connues

- Un motif vérifie une forme, pas la qualité : « Team A ou team B ? » peut rester plat.
- Le repérage des questions oui/non est une liste de tournures : « Tu aurais vu le
  piège ? » passe.
- À 2 épisodes par jour, chaque gabarit revient tous les 1,5 à 2 jours : 3 posts par
  gabarit en une semaine environ (plus les 48 h de recul du bilan). LinkedIn (le principal,
  jours ouvrés) : 2 à 3 semaines.
- Un gabarit se compare à un autre sur des sujets différents : seul l'écart qui tient sur
  plusieurs semaines compte.
