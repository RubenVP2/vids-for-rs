---
name: bilan
description: Bilan de la semaine de Matou — chiffres de chaque épisode par réseau (Postiz), ce qui marche et ce qui ne marche pas, mise à jour des apprentissages et de la réserve de sujets. À utiliser quand une tâche planifiée le demande, ou quand l'utilisateur dit « bilan », « stats », « qu'est-ce qui marche ».
---

# Bilan de la semaine

But : que chaque épisode suivant soit choisi et écrit avec ce que les chiffres ont
appris. Le résultat sert à `veille-ia`, `ecriture-matou` et `publication`.

## 0. Préparer

Comme l'étape 0 du skill `episode-du-jour` : `main` à jour, `npm ci` si besoin.

## 1. Relever les chiffres

`npm run bilan`. Pour chaque ligne « publication non reliée » (TikTok surtout) : skill
**`postiz`**, `posts:missing <postId>` puis `posts:connect` avec le contenu publié le
jour de `date` (le plus proche de l'heure prévue) ; puis relancer `npm run bilan`.
Le CLI `postiz` (`node_modules/.bin/postiz` : `npx` manque sur le Pi) utilise son jeton OAuth (Pi) ou `POSTIZ_API_KEY` :
avec une clé dans `POSTIZ_ENV`, `export POSTIZ_API_KEY="$POSTIZ_ENV"` avant.
Sous `scripts/routines/lancer.sh` : aucune commande git, le script committe et pousse.

Ne compter que les posts PUBLISHED depuis au moins 48 h : avant, les chiffres bougent trop.

**Fait quand** chaque post publié a des chiffres ou une raison écrite de ne pas en avoir.

## 2. Analyser

Comparer les épisodes entre eux, réseau par réseau (les ordres de grandeur diffèrent trop
d'un réseau à l'autre pour les additionner). Pour chaque épisode, regarder ce qui le
distingue : entreprise citée, type de sujet (produit grand public, sécurité, emploi,
argent…), série, hook (`scenes.json`, première scène), verdict du Hype-mètre, jour.
La vidéo elle-même (`docs/viralite.md`) : gabarit de montage (`scenes.json` → `gabarit`),
et format long (champ `long`, jusqu'à ~60 s) contre ~30 s. Pour la durée, regarder les
vues et les likes, et la rétention relevée à la main dans TikTok Studio si l'utilisateur
l'a notée : un format long qui fait moins de vues 3 semaines de suite, le dire.

Puis la stratégie par réseau (`docs/reseaux.md`) : le rang (colonne « Rang » : principal
du matin et de midi contre second du soir, depuis le 31/10 ; avant, l'inverse), le créneau de chaque post (colonne « Créneau »), le
format (LinkedIn : carrousel ou vidéo), le texte propre au réseau (`publication.md`), et
sur Threads la relance (`threads-relance`) contre le post vidéo. Un créneau qui fait
moins bien 3 semaines de suite : proposer une autre heure. Les vues d'un épisode qui
baissent depuis l'arrivée de l'autre : le dire (le rythme de 2 par jour est un pari).
Compter aussi les vetos et les brouillons retenus par les garde-fous de la semaine.

Les textes (`docs/publication.md`) : la table « Gabarits de texte » de `npm run bilan`
donne, réseau par réseau, la moyenne des chiffres de chaque gabarit. Le chiffre qui
compte dépend de la partie vérifiée : commentaires pour une question (TikTok, LinkedIn,
Threads), envois et partages pour Instagram, vues pour un titre YouTube.

Une conclusion ne vaut que si elle repose sur **au moins 3 épisodes** qui vont dans le
même sens ; sinon c'est une piste, notée comme telle. Ne jamais inventer d'explication
que les chiffres ne montrent pas.

## 3. Écrire

1. `docs/bilans/AAAA-MM-JJ.md` : les deux tableaux de `npm run bilan`, le top et le flop
   de la semaine avec leur hook, 3 constats au plus, et le rythme tenu (épisodes publiés
   sur 7 jours ; objectif 14, minimum 7).
2. `docs/apprentissages.md` : ajouter ou corriger les lignes que les chiffres confirment
   ou contredisent (avec la date et les épisodes qui le montrent). Une hypothèse démentie
   par 3 épisodes est barrée, pas effacée.
3. Veille (`docs/veille.md`) : la réserve automatique (`veille/reserve.json`) se remplit
   et se purge seule. Comparer les scores de la semaine (`veille/*.json`) aux vues des
   épisodes : si un signal (médias, HN, Reddit, Trends, fraîcheur) ne prédit pas les vues,
   **proposer** un nouveau poids pour `brand/veille.json` dans le message final, sans le
   changer (l'utilisateur décide). `docs/sujets.md` (dernier repli, à la main) : retirer
   les sujets périmés ou déjà traités, sans en ajouter.
4. Gabarits (`brand/publication.json`) : un gabarit qui fait nettement moins bien que les
   autres du même réseau sur au moins 3 posts publiés chacun : **proposer** de le retirer
   ou de le réécrire dans le message final, sans changer le fichier.

Ne pas modifier les skills, `AGENTS.md` ni les créneaux de `brand/postiz.json` :
proposer le changement dans le message final, l'utilisateur tranche.

Commit, puis `git pull --rebase origin main` et
`git push origin HEAD:main` (autorisé pour cette routine).

## 4. Message final

En 6 lignes au plus : vues de la semaine par réseau et évolution des abonnés, le
meilleur épisode et pourquoi, ce qui change dans les apprentissages, les décisions à
prendre par l'utilisateur (avec ta recommandation), et le lien vers le bilan.
