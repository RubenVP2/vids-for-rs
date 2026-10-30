# Routines : Hermes + agy sur le Raspberry Pi

Les trois tâches planifiées de Matou tournent sur le Pi (`ssh pi`), plus dans les
routines cloud de Claude. Ce document explique la chaîne, pour la dépanner.

## La chaîne

```
Hermes (cron)  →  ~/.hermes/scripts/matou-<routine>.sh   lance en tâche de fond (systemd-run)
                  (matou-episode-principal.sh, matou-episode-second.sh, matou-rappel.sh, matou-bilan.sh)
               →  scripts/routines/lancer.sh <routine> [rang]   dans le clone ~/matou/vids-for-rs
                    1. main à jour, arbre propre, npm ci si le lock a changé
                    2. agy --print … (skill de la routine)  ← modèles Gemini, repli si quota,
                       puis Claude Code (claude -p) si agy échoue avec tous ses modèles
                    3. épisode : garde-fous, puis npm run postiz -- NNN --programmer
                    4. commit + pull --rebase + push sur main (3 essais, sinon branche secours/…)
                    5. hermes send → Discord #matou : message final, horaires, veto, miniature, vidéo
```

Les heures suivent les créneaux des réseaux (`docs/reseaux.md`). Un épisode prend 45 min
environ (jusqu'à 1 h 40 avec les replis de modèle) :

- le **principal** part à 5 h 13, il est prêt vers 6 h : LinkedIn (8 h 30) et Threads
  (9 h), au moins 2 h plus tard (le délai du veto), puis les vidéos à midi ;
- le **second** part à 14 h 13, avec l'actu de l'après-midi : prêt vers 15 h (16 h 53 au
  pire), pour les créneaux du soir (18 h 30 et après).

Chaque post part le jour même : un épisode en retard prend le repli (2 h 30 plus tard),
jamais le lendemain. Un seul épisode par rang et par jour : si celui du rang est déjà
dans `episodes/` (envoyé aujourd'hui), le lanceur s'arrête sans rien produire
(`MATOU_FORCER=1` pour passer outre). Le rappel (11 h 07 et 17 h 07) liste ce que les garde-fous (ou un
veto) ont laissé en brouillon, avant les créneaux de midi et du soir.

**Programmation automatique** (`MATOU_AUTO=1`, défaut) : le lanceur programme seulement
si l'agent finit par `PROGRAMMER: oui`, que `npm run check -- NNN` passe et que les
brouillons existent. Sinon le message Discord dit « NON programmé » et pourquoi. Veto :
dans Postiz (repasser en brouillon), « veto #NNN » à Claude, ou
`npm run postiz -- NNN --annuler` dans `~/vids-for-rs` (après `git pull`).

Hermes ne fait que planifier : un épisode dépasse le délai d'un script de cron (1 h),
donc le script Hermes rend la main tout de suite et `lancer.sh` livre lui-même.

| Routine | Hermes | Quand (Paris) | Agent |
| --- | --- | --- | --- |
| `episode-du-jour principal` | Matou — épisode principal | tous les jours, 5 h 13 | agy, skill `episode-du-jour` |
| `episode-du-jour second` | Matou — épisode second | tous les jours, 14 h 13 | agy, skill `episode-du-jour` |
| `rappel` | Matou — rappel de relecture | tous les jours, 11 h 07 et 17 h 07 | aucun (`npm run bilan -- --attente`) |
| `bilan` | Matou — bilan du lundi | lundi, 10 h 37 | agy, skill `bilan` |

## Pourquoi un clone dédié

`~/matou/vids-for-rs` ne sert qu'aux routines : `lancer.sh` le remet à `origin/main`
à chaque passage (`reset --hard`, `clean`). Ne jamais y travailler à la main ;
`~/vids-for-rs` reste le clone de travail. Au passage, il supprime les dossiers d'épisode
sans aucun fichier versionné (restes d'un repli) et les `rendu/` et `controle/` de plus
de 30 jours.

Un commit non poussé serait donc perdu au passage suivant. Le lanceur essaie 3 fois
(rebase sur `main`, puis push) ; s'il échoue encore, il pousse sur `secours/<date>-<routine>-<NNN>`
et le dit sur Discord. À faire alors : `git fetch && git merge origin/secours/…` dans
`~/vids-for-rs`, puis pousser. Ce qui est versionné, et pourquoi : `docs/decisions.md`
(« Versionnement des épisodes »).

## agy

- Contexte : `AGENTS.md` (lien vers `CLAUDE.md`). Skills : `.agents/skills.json` pointe
  vers `.claude/skills`. Sous-agents : `.agents/agents` est un lien vers `.claude/agents`.
  Une seule copie : modifier les skills dans `.claude/`, les deux harnais les voient.
- En `--print --mode accept-edits`, agy travaille dans le clone sans qu'il soit dans
  ses `trustedWorkspaces`.
- Les permissions globales d'agy interdisent `git commit` et `git push` : c'est voulu,
  le lanceur s'en charge.
- Modèles : `MATOU_MODELES` (défaut `gemini-3.8-flash-high`, puis `gemini-4-argon-high`,
  puis `claude-sonnet-5-5-high`). Liste : `agy models`. Le repli efface le travail du
  modèle raté (`reset --hard`, `clean`) ; une réponse en statut ERROR qui finit par
  `EPISODE: NNN` est gardée (épisode fini, seul un dernier appel d'outil a raté).
  Les quotas tombent vite à 2 épisodes par jour : le journal donne « Resets in … ».
- **Dernier repli : Claude Code.** Si agy échoue avec tous ses modèles, le lanceur relance
  la même consigne avec `claude -p` (`MATOU_CLAUDE`, défaut `claude-sonnet-5-5`, effort
  high ; `MATOU_CLAUDE=0` le coupe). Claude Code lit `CLAUDE.md` (qui importe
  `AGENTS.md`) et les skills et sous-agents de `.claude/`. Permissions : mode `dontAsk`,
  seuls les outils listés dans `lancer.sh` (`outils_claude`) passent ; ni `git commit`
  ni `git push`. Un outil manque (refus dans le journal) : l'ajouter à la liste. Le commit dit quel agent a travaillé (« agy » ou
  « Claude Code »). Compte : celui de `claude` sur le Pi (`claude auth status`).
- Effort : **toujours high**. `lancer.sh` passe `--effort high` et ramène tout modèle
  de `MATOU_MODELES` à sa variante `-high` (agy refuse un modèle d'un autre effort).
  En interactif sur le Pi, `~/.gemini/antigravity-cli/settings.json` fixe aussi
  `"model": "gemini-4-argon-high"`.

## Secrets

- Voix : `OPENROUTER_API_KEY`, lue dans `~/.hermes/.env` par le lanceur.
- Postiz : jeton OAuth de la CLI (`~/.postiz/credentials.json`, `postiz auth:login`).
  Expiré : `npx postiz auth:status` le dit, relancer `postiz auth:login` sur le Pi.

## Dépanner

- Journaux : `~/.local/state/matou/AAAA-MM-JJ-HHMM-<routine>.log` (sortie d'agy comprise),
  et `journalctl --user -u 'matou-*'`.
- Relancer à la main : `hermes cron run <id>` (id : `hermes cron list`), ou directement
  `~/matou/vids-for-rs/scripts/routines/lancer.sh episode-du-jour`.
- Essai sans effet de bord : `MATOU_BRANCHE=<branche> MATOU_POUSSER=0 MATOU_POSTIZ=0
  scripts/routines/lancer.sh episode-du-jour second` (pas de push, pas de Postiz, pas de Discord).
- Revenir aux brouillons seuls (plus de programmation automatique) : `MATOU_AUTO=0` dans
  les scripts Hermes (`--setenv=MATOU_AUTO=0`).
