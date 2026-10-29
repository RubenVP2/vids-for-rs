# Routines : Hermes + agy sur le Raspberry Pi

Les trois tâches planifiées de Matou tournent sur le Pi (`ssh pi`), plus dans les
routines cloud de Claude. Ce document explique la chaîne, pour la dépanner.

## La chaîne

```
Hermes (cron)  →  ~/.hermes/scripts/matou-<routine>.sh   lance en tâche de fond (systemd-run)
               →  scripts/routines/lancer.sh <routine>   dans le clone ~/matou/vids-for-rs
                    1. main à jour, arbre propre, npm ci si le lock a changé
                    2. agy --print … (skill de la routine)  ← modèles Gemini, repli si quota
                    3. commit + pull --rebase + push sur main
                    4. hermes send → Discord #matou : message final, miniature, vidéo
```

Hermes ne fait que planifier : un épisode dépasse le délai d'un script de cron (1 h),
donc le script Hermes rend la main tout de suite et `lancer.sh` livre lui-même.

| Routine | Hermes | Quand (Paris) | Agent |
| --- | --- | --- | --- |
| `episode-du-jour` | Matou — épisode du jour | tous les jours, 7 h 43 | agy, skill `episode-du-jour` |
| `rappel` | Matou — rappel de relecture | tous les jours, 14 h 07 | aucun (`npm run bilan -- --attente`) |
| `bilan` | Matou — bilan du lundi | lundi, 10 h 37 | agy, skill `bilan` |

## Pourquoi un clone dédié

`~/matou/vids-for-rs` ne sert qu'aux routines : `lancer.sh` le remet à `origin/main`
à chaque passage (`reset --hard`, `clean`). Ne jamais y travailler à la main ;
`~/vids-for-rs` reste le clone de travail.

## agy

- Contexte : `AGENTS.md` (lien vers `CLAUDE.md`). Skills : `.agents/skills.json` pointe
  vers `.claude/skills`. Sous-agents : `.agents/agents` est un lien vers `.claude/agents`.
  Une seule copie : modifier les skills dans `.claude/`, les deux harnais les voient.
- En `--print --mode accept-edits`, agy travaille dans le clone sans qu'il soit dans
  ses `trustedWorkspaces`.
- Les permissions globales d'agy interdisent `git commit` et `git push` : c'est voulu,
  le lanceur s'en charge.
- Modèles : `MATOU_MODELES` (défaut `gemini-3.8-flash-high`, puis `gemini-4-argon-high`,
  puis `claude-sonnet-5-5-high`). Liste : `agy models`.
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
  scripts/routines/lancer.sh episode-du-jour` (pas de push, pas de Postiz, pas de Discord).
