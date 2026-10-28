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
Le CLI `postiz` lit `POSTIZ_API_KEY` : `export POSTIZ_API_KEY="$POSTIZ_ENV"` avant.

Ne compter que les posts PUBLISHED depuis au moins 48 h : avant, les chiffres bougent trop.

**Fait quand** chaque post publié a des chiffres ou une raison écrite de ne pas en avoir.

## 2. Analyser

Comparer les épisodes entre eux, réseau par réseau (les ordres de grandeur diffèrent trop
d'un réseau à l'autre pour les additionner). Pour chaque épisode, regarder ce qui le
distingue : entreprise citée, type de sujet (produit grand public, sécurité, emploi,
argent…), série, hook (`scenes.json`, première scène), verdict du Hype-mètre, jour.

Une conclusion ne vaut que si elle repose sur **au moins 3 épisodes** qui vont dans le
même sens ; sinon c'est une piste, notée comme telle. Ne jamais inventer d'explication
que les chiffres ne montrent pas.

## 3. Écrire

1. `docs/bilans/AAAA-MM-JJ.md` : les deux tableaux de `npm run bilan`, le top et le flop
   de la semaine avec leur hook, 3 constats au plus, et le rythme tenu (épisodes publiés
   sur 7 jours ; objectif 7, minimum 4).
2. `docs/apprentissages.md` : ajouter ou corriger les lignes que les chiffres confirment
   ou contredisent (avec la date et les épisodes qui le montrent). Une hypothèse démentie
   par 3 épisodes est barrée, pas effacée.
3. `docs/sujets.md` : la remettre à **5 sujets** d'avance pour les jours sans actu forte,
   avec le skill `veille-ia` (articles de blog des 30 derniers jours, série `decrypte`,
   pas déjà traités). Retirer ceux qui sont périmés.

Ne pas modifier les skills ni `CLAUDE.md` : proposer le changement dans le message final,
l'utilisateur tranche.

Commit, puis `git pull --rebase origin main` et
`git push origin HEAD:main` (autorisé pour cette routine).

## 4. Message final

En 6 lignes au plus : vues de la semaine par réseau et évolution des abonnés, le
meilleur épisode et pourquoi, ce qui change dans les apprentissages, les décisions à
prendre par l'utilisateur (avec ta recommandation), et le lien vers le bilan.
