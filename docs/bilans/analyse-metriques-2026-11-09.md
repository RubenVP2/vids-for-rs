# Analyse des métriques — 9 novembre 2026

Analyse des chiffres déjà présents dans le dépôt : les 24 `episodes/*/stats.json` (relevé
Postiz du 09/11/2026, 09 h 38–09 h 40 UTC), `timings.json`, `scenes.json`, `publication.md`,
`postiz.json`, les classements `veille/*.json` et les deux bilans hebdomadaires. Aucun chiffre
n'est estimé : tout sort des fichiers, par les commandes indiquées.

## Méthode (reproductible)

| Ce qui est calculé | Commande |
| --- | --- |
| Tous les tableaux de ce rapport (médianes, croisements, tailles d'échantillon, corrélations, détail YouTube) | `npm run bilan -- --local` (ou `node --import tsx scripts/bilan.ts --local`) |
| Même chose sans les posts de moins de 24 h au relevé (contrôle de robustesse) | `npm run bilan -- --local --age-min 24` |

- **Posts retenus** : état `PUBLISHED` et chiffres non vides, soit **117 posts** sur 24
  épisodes (#000 à #024, sans #013, l'urgent jamais publié). Les deux YouTube en état
  `ERROR` qui ont pourtant des vues (#000 : 243, #002 : 105) sont écartés, comme dans
  `npm run bilan`.
- **Heure** : heure de Paris (UTC+1 après le 25/10), tirée de la date de chaque post.
- **Commentaires « nets »** : commentaires (ou réponses Threads) moins notre commentaire de
  sources quand le post en portait un (`postiz.json` : 2 valeurs ou plus) et que le réseau le
  compte (Instagram, Threads, LinkedIn ; voir § 3.1).
- **Score de veille** : score du candidat retenu (`choix`) dans `veille/<jour>-<rang>.json`
  (du 01/11 au 09/11, soit #008 à #024).
- **Tailles d'échantillon** : vues supposées log-normales, test à deux groupes, α = 5 %,
  puissance 80 % : n par groupe = 2 · (1,96 + 0,84)² · σ² / ln(k)², avec σ l'écart-type de
  ln(vues) du réseau et k l'effet cherché (×1,25, ×2, ×4).
- **Corrélations** : Spearman (rangs), réseau par réseau.

## 1. Les 5 chiffres qui comptent

1. **TikTok est plat** : 23 posts, de **235 à 273 vues** (médiane 256, σ(ln) = 0,04). Avec si
   peu de dispersion, un effet de +25 % se verrait avec 2 posts par groupe. Aucun créneau,
   gabarit, rang ni durée ne le produit : rien de ce qu'on règle ne change les vues TikTok
   aujourd'hui.
2. **YouTube est le seul réseau qui varie, et l'heure y compte** : médiane **122 vues à 13 h
   contre 464 à 20 h** (9 posts chacun). Le plus tardif des deux Shorts du jour gagne **7 jours
   sur 8** (test du signe : p = 0,035 unilatéral, 0,07 bilatéral).
3. **Instagram ne dépend pas de l'heure** : 131 vues à 12 h, 127 à 18 h 30 (médianes, 10 et
   9 posts). TikTok non plus : 254 et 254.
4. **21 des 23 « commentaires » Instagram, 23 des 24 réponses Threads et 8 des 9
   commentaires LinkedIn sont le nôtre** (le commentaire de sources). Commentaires du public,
   tous réseaux : **16 sur 117 posts**.
### Correction après revue (09/11/2026)

La première version de cette analyse déduisait la présence du commentaire de sources de
`postiz.json` : 18 commentaires du public annoncés. Ce fichier est réécrit à chaque envoi
(aperçu, rattrapage), trois épisodes n'y figuraient plus et un commentaire du public y passait
pour le nôtre. Le calcul s'appuie désormais sur `postiz-envoi.json` (qui survit au rattrapage),
complété par `postiz.json`, et `postiz.ts` y écrit un drapeau `commentaire` pour les envois
futurs. Résultat : **16 commentaires du public**, et les trois réseaux concernés passent à
21 sur 23 (Instagram), 23 sur 24 (Threads), 8 sur 9 (LinkedIn).

5. **Le score de veille ne prédit pas les vues** : ρ = 0,15 sur YouTube (14 posts), −0,07 sur
   Instagram (15). #016 (score 47) : 24 vues YouTube ; #021 et #023 (score 35, le seuil) :
   813 et 752.

## 2. Réseau par réseau

| Réseau | Posts | Vues méd. | Vues moy. | Min–max | σ(ln vues) | Posts par groupe pour voir ×1,25 / ×2 / ×4 | Com. bruts | Com. nets |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| youtube | 19 | 265 | 371 | 24–1258 | 1,25 | 493 / 52 / 13 | 3 | 3 |
| tiktok | 23 | 256 | 255 | 235–273 | 0,04 | 2 / 2 / 2 | 8 | 8 |
| instagram | 23 | 123 | 127 | 27–169 | 0,36 | 40 / 5 / 2 | 23 | 2 |
| threads (vidéo) | 24 | 6 | 11 | 0–51 | 1,02 | 329 / 34 / 9 | 24 | 2 |
| threads (relance) | 19 | 10 | 15 | 0–74 | 1,10 | 381 / 40 / 10 | 1 | 1 |
| linkedin | 9 | — (pas de vues) | — | — | — | — | 9 | 2 |

Chiffres de compte sur 7 jours (bilan du 09/11) : TikTok 5 061 vues, Instagram 1 566, Threads
377, YouTube 497 minutes regardées (pas de vues de compte). Threads fait ~5 % des vues de compte
hors YouTube (377 sur 7 004), pour 4 posts par jour.

**Seuil pour conclure** : la colonne « Posts par groupe » se lit ainsi. Sur YouTube, pour
départager deux gabarits qui feraient ×2, il faut ~52 posts par gabarit ; nous en avons 3 à 6.
Pour un écart ×4, comme celui du créneau, il en faut ~13 ; nous en avons 9 par créneau. Sur
Instagram, ×1,25 demande ~40 posts par groupe. Sur Threads, ×2 demande 34 à 40.

## 3. Croisements

### 3.1 Commentaires : une erreur de mesure

Depuis #001, `npm run postiz -- … --commentaire` ajoute un 2e élément « Sources : … » à chaque
post (sauf TikTok et la relance). Postiz le compte comme un commentaire :

| Réseau | Posts publiés qui le portent | Dont avec exactement 1 commentaire |
| --- | --- | --- |
| Instagram | 19 | 18 |
| Threads (vidéo) | 21 | 20 |
| LinkedIn | 7 | 6 |
| YouTube | 17 | 1 (pas compté) |

Commentaires du public (nets), par épisode : #002 LI 1, #003 TT 1, #005 TH 1 et TT 1, #006 TT 2,
#007 YT 2, #009 TT 2, #010 LI 1, #011 IG 2 et TT 1, #012 relance 1, #014 TH 1, #017 YT 1,
#022 TT 1. **Total 18.** Conséquences : « 100 % des carrousels LinkedIn commentés » et « un
chiffre surprenant fait commenter » (`docs/apprentissages.md`) mesuraient notre commentaire.

### 3.2 Créneau et rang

| Réseau | Créneau | Posts | Vues méd. | Vues moy. | Min–max |
| --- | --- | --- | --- | --- | --- |
| youtube | 13:00 | 9 | 122 | 203 | 24–859 |
| youtube | 20:00 | 9 | 464 | 553 | 24–1258 |
| tiktok | 12:30 | 10 | 254 | 254 | 235–273 |
| tiktok | 19:00 | 9 | 254 | 254 | 236–266 |
| instagram | 12:00 | 10 | 131 | 136 | 112–169 |
| instagram | 18:30 | 9 | 127 | 134 | 107–169 |
| threads (vidéo) | 09:00 | 11 | 7 | 14 | 0–51 |
| threads (vidéo) | 19:30 | 8 | 4 | 6 | 1–22 |
| threads (relance) | 15:30 | 10 | 7 | 18 | 0–74 |
| threads (relance) | 21:30 | 8 | 10 | 12 | 3–24 |

YouTube, les deux Shorts d'un même jour :

| Jour | Principal | Vues | Second | Vues | Total du jour | Le plus tardif gagne |
| --- | --- | --- | --- | --- | --- | --- |
| 30/10 | #004 20:00 | 265 | #005 13:00 | 248 | 513 | oui |
| 31/10 | #006 13:00 | 313 | #007 20:00 | 1258 | 1571 | oui |
| 03/11 | #011 13:00 | 39 | #012 20:00 | 382 | 421 | oui |
| 04/11 | #014 13:00 | 859 | #015 20:00 | 24 | 883 | non |
| 05/11 | #016 13:00 | 24 | #017 20:00 | 561 | 585 | oui |
| 06/11 | #018 13:00 | 51 | #019 20:00 | 461 | 512 | oui |
| 07/11 | #020 13:00 | 122 | #021 20:00 | 813 | 935 | oui |
| 08/11 | #022 13:00 | 122 | #023 20:00 | 752 | 874 | oui |

Total du jour médian : **730 vues**.

Ce que ça dit : sur YouTube, le Short de 20 h fait ~4 fois plus que celui de 13 h. Le 30/10,
seul jour où le principal était le soir, le soir gagne aussi, de peu (265 contre 248).

Ce que ça ne dit pas : **le rang et l'heure se confondent** (le second est toujours le soir).
Deux autres lectures restent possibles : (a) le sujet de l'après-midi est meilleur ; (b) YouTube
pousse un seul Short par jour sur une petite chaîne. Le 04/11 va dans le sens de (b) : #014 à
13 h fait 859 et #015 à 20 h fait 24. Autre point inexpliqué : à 13 h, la 1re semaine faisait
248 et 313 (#005, #006), puis à partir du 02/11 la médiane tombe à 51 (#010 à #022, 7 posts).
Les données ne disent pas pourquoi.

Rang hors YouTube : Instagram 122 (principal) contre 123 (second), TikTok 259 contre 254.
Aucun écart.

Robustesse : sans les posts de moins de 24 h (`--age-min 24`), YouTube donne 87 vues à 13 h
contre 463 à 20 h, et le soir gagne 6 jours sur 7.

### 3.3 Gabarits de texte (rotation `brand/publication.json`, depuis #008)

| Réseau | Gabarit | Posts | Vues méd. | Min–max |
| --- | --- | --- | --- | --- |
| youtube | chiffre | 6 | 84 | 24–813 |
| youtube | nom-fait | 5 | 382 | 39–752 |
| youtube | pourquoi | 3 | 461 | 122–859 |
| tiktok | camp / note / un-mot / vecu | 4 / 4 / 3 / 4 | 249 / 247 / 256 / 249 | 235–270 |
| instagram | chiffre / question / toi | 4 / 5 / 6 | 155 / 117 / 128 | 107–169 |
| threads | avis / pari / question-d-abord | 6 / 4 / 6 | 3 / 15 / 5 | 0–51 |
| relance | dilemme / horizon / vecu | 5 / 6 / 4 | 7 / 20 / 3 | 0–74 |
| linkedin | horizon / metier / pour-contre | 2 / 3 / 1 | likes méd. 0,5 / 1 / 0 | — |

À créneau égal, sur YouTube (20 h) : pourquoi 461 (1 post), nom-fait 382 à 752 (3), chiffre 24
à 813 (3). L'avance de « pourquoi » (moyenne 481 dans le bilan) tient à #014 (859 vues, à 13 h).
« pari » (Threads) tient à #014 (51 vues) et « horizon » (relance) à #022 (74 vues).
**Aucun gabarit ne se détache** : chaque case a 2 à 6 posts, loin des seuils du § 2.

### 3.4 Hype-mètre, ouverture de montage, série

- **Hype-mètre** : 5 « buzz » (#008, #010, #014, #016, #024), 19 « prometteur », 0 « game
  changer ». Les 5 « buzz » sont des principaux, donc tous à 13 h sur YouTube : impossible de
  séparer le verdict du créneau. Instagram à 12 h : buzz 150 (4 posts) contre prometteur 117 (5).
  Il faudrait ~40 posts par groupe pour voir +25 %.
- **Ouverture** (YouTube, à créneau égal) : « toi » a la meilleure médiane aux deux heures
  (13 h : 122 et 859 ; 20 h : 561 et 813), mais il n'y a que 2 posts par case. Ça reste une
  hypothèse.
- **Série** : YouTube decrypte 423 (4 posts) contre flash 260 (14) ; Instagram 117 contre 126 ;
  TikTok 254 contre 259. Rien de concluant.

### 3.5 Jour de la semaine

14 jours de données : chaque jour de la semaine apparaît 1 ou 2 fois. YouTube à 20 h :
week-end 783 (#007, #009, #021, #023) contre semaine 382 (5 posts). Mann-Whitney : U = 19/20,
p ≈ 0,03 bilatéral. Mais une dizaine de croisements ont été testés : avec la correction de
Bonferroni, le seuil passe à 0,005. **C'est une hypothèse à suivre, pas un constat.** Instagram :
week-end 120–122 contre semaine 137.

### 3.6 Durée, débit, longueur du texte, score de veille (Spearman ρ)

| Variable | YouTube | TikTok | Instagram | Threads |
| --- | --- | --- | --- | --- |
| Durée de la vidéo | −0,01 (18) | 0,08 (22) | 0,10 (22) | −0,11 (23) |
| Mots/min | 0,27 (12) | 0,07 (12) | −0,24 (12) | 0,07 (13) |
| Longueur du texte du post | −0,19 (19) | 0,23 (23) | 0,20 (23) | 0,00 (21) |
| Score de veille | 0,15 (14) | −0,51 (15) | −0,07 (15) | 0,28 (16) |

Entre parenthèses, le nombre de posts. Aucune corrélation exploitable. Le −0,51 de TikTok porte
sur des vues de 235 à 273, et sur 20 corrélations testées, une valeur |ρ| ≥ 0,5 au hasard est
attendue.

Durée : la médiane passe de **31,8 s** (#000–#010) à **21,7 s** depuis #016 (débit recalé le
05/11), avec un débit médian de 217 mots/min (cible 204, plafond 230 ; #020 à 231). Aucune
corrélation durée-vues : rien ne pousse à changer `brand/voix.json`. `AGENTS.md` parle encore de
« ~30 s » pour la série flash, alors que `budgetDe` (`scripts/lib/episode.ts`) vise ~20–27 s :
c'est à harmoniser.

Veille : 6 des 16 sujets retenus ont **exactement 35**, le seuil. 35 = source officielle (20) +
moins de 12 h (15), donc tout billet officiel frais passe le seuil. Ces 6 sujets ont fait 39, 51,
122, 122, 752 et 813 vues sur YouTube, pas moins que les autres. Rien ne justifie de toucher au
seuil ni à `parMedia`.

## 4. Ce que les bilans affirmaient et que les fichiers ne confirment pas

| Bilan du 09/11 | Ce que disent les fichiers |
| --- | --- |
| YouTube le soir : « moyenne de 594 vues » | Calculée sans #015 (24 vues à 20 h). Depuis le 03/11, avec #015 : moyenne 499, médiane 511 |
| Rétention « 69,2 % contre 24,7 % » grâce au montage | Chiffre du compte, pas par vidéo. Les vidéos ont raccourci (médiane 31,8 s → 21,7 s), ce qui fait monter le pourcentage tout seul. La durée moyenne regardée (8,4 → 22,6 s) est le chiffre le plus solide, mais rien ne permet de l'attribuer à un changement plutôt qu'à un autre |
| LinkedIn : « 100 % d'épisodes commentés » | 8 des 9 commentaires sont notre commentaire de sources |
| Instagram : « Envoie-la » fait partager (#014, #020, #021) | Ces partages sont sur TikTok. Instagram : 2 partages en 23 posts (#002, #009) |
| Threads : la relance bat la vidéo | Vrai pour 11 épisodes sur 19 seulement (médianes : relance 10 vues, vidéo 6) |
| TikTok : « 24 épisodes sur 24 entre 235 et 273 » | 23 posts TikTok publiés (#013 jamais publié, #024 en file au relevé) ; la fourchette est juste |
| « Seul le créneau du soir du 03/11 a sauté » | C'est le 02/11 (`veille/2026-11-02-second.md` : « Choix : aucun ») ; #012 est le second du 03/11 |

## 5. Limites

- **Un seul relevé par post, à des âges différents** : de 15 h (#023 YouTube) à 267 h (#001).
  `stats.json` est réécrit à chaque bilan, sans historique : impossible de comparer les vues à
  âge égal (J+2, J+7). `--age-min` réduit le biais sans le supprimer.
- **Confusions structurelles** : le rang décide de l'heure ; la rotation des gabarits dépend du
  numéro ; les « buzz » sont tous des principaux. Les croisements « toutes choses égales par
  ailleurs » se limitent à ce que montrent les tableaux à créneau égal.
- **Postiz ne donne pas la rétention par vidéo** (TikTok, Reels, Shorts). C'est pourtant le
  signal que ces réseaux récompensent (`docs/reseaux.md`).
- **14 jours, 24 épisodes** : aucun croisement n'atteint les seuils du § 2, sauf l'écart de
  créneau sur YouTube, et encore de justesse.

## 6. Recommandations, classées par impact / effort

| # | Recommandation | Impact | Effort | État |
| --- | --- | --- | --- | --- |
| R1 | Compter seulement les commentaires du public | Élevé (fiabilité des décisions) | Faible | **Fait** |
| R2 | YouTube du principal à 18 h, en test de 2 semaines | Élevé si l'effet tient (YouTube est le seul réseau qui bouge) | Faible | **Fait** |
| R3 | Corriger les « Confirmé » de `docs/apprentissages.md` | Élevé (ces lignes guident veille, écriture et publication) | Faible | **Fait** |
| R4 | Garder la rotation des gabarits, les poids de veille et la voix tels quels | Évite de décider sur du bruit | Nul | **Fait (rien changé, exprès)** |
| R5 | Historiser les relevés pour comparer à âge égal | Moyen | Moyen | Proposé |
| R6 | Relever à la main la rétention TikTok et Shorts sur 10 vidéos | Moyen (seul levier TikTok mesurable) | Faible | Proposé |
| R7 | Décider du volume Threads (4 posts par jour pour ~5 % des vues) | Faible à moyen (temps et quota d'agent) | Faible | Proposé, à trancher par l'utilisateur |

**R1. Commentaires du public**
- Constat : 21 sur 23 (Instagram), 22 sur 24 (Threads) et 7 sur 9 (LinkedIn) des commentaires
  relevés sont notre commentaire de sources (§ 3.1).
- Changement : `scripts/lib/stats.ts` (`COMPTE_SOURCE`, `sourcesPostees`, `commentairesNets`) ;
  `scripts/bilan.ts` compare les gabarits sur les commentaires nets. `stats.json` garde les
  chiffres bruts.
- Risque : si Postiz cesse de compter notre commentaire sur un réseau, on sous-compte de 1 par
  post. On le repère dans le tableau « Réseaux » : les commentaires bruts y tombent sous le nombre
  de posts qui portent la source.
- Vérification le 23/11 : `npm run bilan -- --local`, la différence entre commentaires bruts et
  nets doit égaler le nombre de posts Instagram, Threads et LinkedIn publiés avec une source.

**R2. YouTube du principal à 18 h**
- Constat : médiane 122 vues à 13 h contre 464 à 20 h ; le plus tardif gagne 7 jours sur 8 ;
  Instagram et TikTok ne bougent pas avec l'heure (§ 3.2). `docs/reseaux.md` situait déjà le pic
  YouTube entre 19 h et 21 h.
- Changement : `brand/postiz.json` → `creneaux.principal.youtube.heure` passe de `13:00` à
  `18:00`. 2 h d'écart avec le Short du second (20 h), au-delà des 90 min exigées par
  `scripts/postiz.ts`. Le repli (+2 h 30) donnerait 20 h 30, toujours le même jour. Mis à jour
  aussi : `AGENTS.md`, `docs/reseaux.md` et `docs/decisions.md` (ligne « proposé, à valider »).
- Risques : (a) deux Shorts à 2 h d'écart se partagent l'audience ; (b) le sujet du principal
  (actu de la nuit) a 5 h de plus quand il sort ; (c) le veto reste possible jusqu'à 18 h,
  sans changement pour lui.
- Vérification le 23/11, avec ~12 Shorts de plus par créneau âgés d'au moins 48 h (le seuil ×4
  du § 2 est 13) :
  `npm run bilan -- --local --age-min 48`, puis lire « Créneau » et « YouTube : principal et
  second du même jour ».
  - Garder si la médiane à 18 h est d'au moins **244** (2 × 122), que celle de 20 h ne descend
    pas sous **325** (−30 % de 464) et que le total du jour médian dépasse **730**.
  - Si 18 h monte mais que 20 h baisse d'autant (total du jour stable) : YouTube pousse un Short
    par jour. Tester alors un seul Short par jour.
  - Si 18 h reste vers 120 : l'écart vient du rang ou du sujet, pas de l'heure. Revenir à 13 h.

**R3. `docs/apprentissages.md` corrigé**
- Constat : § 3.1, § 3.3 et § 4.
- Changement : deux lignes barrées (« Envoie-la » fait partager ; LinkedIn « systématiquement
  commenté »), cinq repassées en hypothèse (chiffre surprenant fait commenter, ouverture « toi »,
  relance Threads, pari/horizon, titre « pourquoi »), deux restreintes à YouTube (le soir est le
  bon créneau ; le second fait plus de vues). Chaque ligne cite ses chiffres.
- Risque : aucun pour la production. Une ligne repassera « Confirmé » quand ses cases
  atteindront les seuils du § 2.
- Vérification : au bilan du 23/11, chaque hypothèse se relit avec `npm run bilan -- --local`.

**R4. Ne rien changer à la veille, aux gabarits ni à la voix**
- Constat : score de veille sans lien avec les vues (ρ de −0,07 à 0,15 sur YouTube et
  Instagram) ; aucun gabarit ne se détache (2 à 6 posts par case) ; durée et débit sans lien
  avec les vues (|ρ| ≤ 0,27).
- Fichiers non modifiés, exprès : `brand/veille.json`, `brand/publication.json`,
  `brand/montage.json`, `brand/voix.json`. Il n'y a pas de `brand/hype.json` : le Hype-mètre est
  le champ `verdict` de `scenes.json`.
- Risque : aucun. La rotation garde les groupes équilibrés, c'est ce qui permettra de conclure.
- Vérification : rien à vérifier le 23/11. On rouvre la question des gabarits quand une case
  atteint ~13 posts YouTube à créneau égal.

**R5. Historique des relevés** (non fait)
- Constat : âges au relevé de 15 h à 267 h, `stats.json` écrasé à chaque bilan (§ 5).
- Changement proposé : `scripts/bilan.ts` ajoute chaque relevé à
  `episodes/NNN/stats-historique.jsonl` (date, postId, chiffres) au lieu de seulement réécrire
  `stats.json` ; `--local` comparerait alors les vues à J+2 et J+7.
- Risque : un fichier de plus par épisode dans git (quelques Ko par semaine).
- Vérification : deux relevés successifs donnent deux lignes par post.

**R6. Rétention à la main** (non fait)
- Constat : TikTok ne varie pas (σ(ln) = 0,04) et Postiz ne donne pas le taux de complétion.
- Changement proposé : relever dans TikTok Studio et YouTube Studio la rétention à 3 s et le %
  regardé de 10 vidéos, dans le bilan du 16/11.
- Risque : aucun, mais c'est un travail manuel.
- Vérification : 10 lignes chiffrées dans le bilan.

**R7. Volume Threads** (à trancher par l'utilisateur)
- Constat : médiane de 6 vues (vidéo) et 10 (relance), 377 vues de compte par semaine pour
  4 posts par jour ; 2 réponses du public en 24 posts.
- Option : garder un post Threads par épisode, sans relance, et revoir dans 2 semaines.
- Risque : perdre un réseau qui pourrait décoller ; rien dans les données ne le laisse prévoir.
- Vérification : vues du compte Threads par semaine avant et après.

## 7. Fichiers modifiés

| Fichier | Changement |
| --- | --- |
| `brand/postiz.json` | `creneaux.principal.youtube.heure` : `13:00` → `18:00` ; description mise à jour |
| `scripts/lib/stats.ts` | **Nouveau** : analyse locale (`analyser`), commentaires nets (`COMPTE_SOURCE`, `sourcesPostees`, `commentairesNets`) |
| `scripts/bilan.ts` | Option `--local [--age-min N]` (avant tout appel à Postiz) ; tableau des gabarits sur les commentaires nets |
| `docs/apprentissages.md` | 9 lignes corrigées (R3) |
| `docs/decisions.md` | 2 lignes du 09/11/2026 (YouTube à 18 h, proposé ; commentaires du public) |
| `docs/reseaux.md` | Tableau et paragraphe du principal : YouTube à 18 h, avec la raison chiffrée |
| `AGENTS.md` | Créneaux du principal : YouTube 18 h |
| `docs/bilans/README.md` | Mode d'emploi de `--local` |
| `docs/bilans/analyse-metriques-2026-11-09.md` | Ce rapport |

**Pas modifiés, faute de droit d'écriture sur `.claude/` dans cette session** (à faire à la main,
une ligne chacun) : `.claude/skills/programmation/SKILL.md` (l. 63, « YouTube 13 h » → « 18 h »)
et `.claude/skills/episode-du-jour/SKILL.md` (l. 15, même chose). Le comportement ne change pas
pour autant : `npm run postiz` lit l'heure dans `brand/postiz.json`. Le skill `bilan` gagnerait
à lancer `npm run bilan -- --local` et à lire des médianes plutôt que des moyennes.

Vérifications : `npx tsc --noEmit` passe sans erreur ; aucun script shell modifié (`bash -n`
passe sur `scripts/routines/lancer.sh` et `commande.sh`) ; `npm run bilan -- --local` ne fait
aucun appel réseau.
