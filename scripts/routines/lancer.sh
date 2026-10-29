#!/usr/bin/env bash
# Lanceur des routines de Matou sur le Raspberry Pi (docs/routines.md).
# Hermes (cron) l'appelle en tâche de fond ; il prépare la branche, confie le travail à agy,
# puis committe, pousse et livre le message final (et la vidéo) sur Discord.
#
# Usage : scripts/routines/lancer.sh episode-du-jour | bilan | rappel
#
# Variables (toutes facultatives) :
#   MATOU_DEPOT    clone dédié aux routines                  (défaut ~/matou/vids-for-rs)
#   MATOU_BRANCHE  branche de travail                        (défaut main)
#   MATOU_POUSSER  1 : commit + push ; 0 : commit local seul (défaut 1)
#   MATOU_POSTIZ   1 : brouillons Postiz ; 0 : s'arrêter avant (défaut 1)
#   MATOU_LIVRER   cible `hermes send` ; vide : message sur la sortie standard seulement
#   MATOU_MODELES  modèles agy essayés dans l'ordre (repli si quota ou panne),
#                  toujours ramenés à leur variante high (effort imposé)
set -uo pipefail

routine="${1:?Usage : lancer.sh episode-du-jour | bilan | rappel}"
DEPOT="${MATOU_DEPOT:-$HOME/matou/vids-for-rs}"
BRANCHE="${MATOU_BRANCHE:-main}"
POUSSER="${MATOU_POUSSER:-1}"
POSTIZ="${MATOU_POSTIZ:-1}"
LIVRER="${MATOU_LIVRER:-}"
MODELES="${MATOU_MODELES:-gemini-3.8-flash-high gemini-4-argon-high claude-sonnet-5-5-high}"
JOURNAUX="$HOME/.local/state/matou"

export PATH="$HOME/.local/bin:$PATH"
mkdir -p "$JOURNAUX"
journal="$JOURNAUX/$(date +%F-%H%M)-$routine.log"

# La voix passe par OpenRouter : la clé vit dans l'environnement d'Hermes, jamais dans le dépôt.
if [ -z "${OPENROUTER_API_KEY:-}" ] && [ -f "$HOME/.hermes/.env" ]; then
  OPENROUTER_API_KEY="$(sed -n 's/^OPENROUTER_API_KEY=//p' "$HOME/.hermes/.env" | tr -d "\"'" | head -1)"
  export OPENROUTER_API_KEY
fi

livrer() { # livrer <texte> [fichier…] : message final, puis pièces jointes
  local texte="$1"; shift
  printf '%s\n' "$texte"
  [ -n "$LIVRER" ] || return 0
  hermes send -q --to "$LIVRER" "$texte" >>"$journal" 2>&1 || echo "Livraison du message échouée" >>"$journal"
  for f in "$@"; do
    [ -f "$f" ] && { hermes send -q --to "$LIVRER" "MEDIA:$f" >>"$journal" 2>&1 || echo "Livraison de $f échouée" >>"$journal"; }
  done
}

echouer() { livrer "Matou — routine $routine arrêtée : $1 (journal : $journal)"; exit 1; }

# Une seule routine à la fois : un épisode occupe le Pi (rendu Remotion) pendant 20 à 40 min.
exec 9>"$JOURNAUX/routine.lock"
flock -n 9 || { echo "Routine $routine ignorée : une autre tourne encore." >>"$journal"; exit 0; }

# 1. Branche à jour, arbre propre (les rendus, ignorés par git, sont gardés).
[ -d "$DEPOT/.git" ] || echouer "clone absent ($DEPOT)"
cd "$DEPOT" || echouer "dossier $DEPOT inaccessible"
{
  git fetch -q origin "$BRANCHE" &&
    git checkout -q -B "$BRANCHE" "origin/$BRANCHE" &&
    git reset -q --hard "origin/$BRANCHE" &&
    git clean -fdq
} >>"$journal" 2>&1 || echouer "impossible de mettre $BRANCHE à jour"

# 2. Dépendances : npm ci quand package-lock.json change.
empreinte="$(sha1sum package-lock.json | cut -d' ' -f1)"
if [ "$(cat node_modules/.empreinte 2>/dev/null)" != "$empreinte" ]; then
  npm ci --no-audit --no-fund >>"$journal" 2>&1 || echouer "npm ci a échoué"
  echo "$empreinte" >node_modules/.empreinte
fi

# 3. Rappel de relecture : pas besoin d'agent, le script suffit. Silencieux s'il n'y a rien.
if [ "$routine" = rappel ]; then
  attente="$(npm run -s bilan -- --attente 2>>"$journal")" || echouer "npm run bilan -- --attente a échoué"
  if ! grep -q '^0 épisode' <<<"$attente"; then
    livrer "Matou — brouillons à relire dans Postiz :
$attente
Un brouillon dont l'heure est passée ne part pas : programme-le dans Postiz, ou lance \`npm run postiz -- NNN --programmer\`."
  fi
  exit 0
fi

# 4. Consigne donnée à agy.
commun="Tu tournes en tâche planifiée sur le Raspberry Pi, lancé par scripts/routines/lancer.sh : personne ne répondra, ne pose aucune question. La branche $BRANCHE est déjà à jour et npm ci est fait. N'exécute AUCUNE commande git (le lanceur committe et pousse après toi). Si tu dois corriger le moteur (scripts/, src/) pour avancer, dis-le dans le message final. Lis AGENTS.md. Nous sommes le $(LC_ALL=fr_FR.UTF-8 date '+%A %d %B %Y'), heure de Paris : une « actu » date des 48 dernières heures, vérifie la date de chaque article."
case "$routine" in
  episode-du-jour)
    if [ "$POSTIZ" = 1 ]; then
      postiz_consigne="Va jusqu'aux brouillons Postiz (npm run postiz -- NNN --commentaire --envoyer). Ne lance jamais --programmer."
    else
      postiz_consigne="Essai : n'envoie RIEN à Postiz (pas de --envoyer, pas de --programmer) ; arrête-toi après npm run check."
    fi
    consigne="$commun Suis le skill episode-du-jour de bout en bout (veille-ia en mode autonome, puis episode étapes 0 à 7, avec les sous-agents documentaliste, verificateur-faits, spectateur et controleur-visuel). $postiz_consigne Termine par le message final du skill, en français, puis une dernière ligne exactement « EPISODE: NNN » (ou « EPISODE: aucun »)."
    ;;
  bilan)
    consigne="$commun Suis le skill bilan de bout en bout. Ne modifie ni les skills ni CLAUDE.md (propose-le dans le message final). Ne publie et ne programme rien dans Postiz. Termine par le message final du skill, en français."
    ;;
  *) echouer "routine inconnue « $routine »" ;;
esac

# 5. agy, avec repli sur le modèle suivant si le premier échoue (quota, panne).
# Effort high obligatoire : un modèle donné en low/medium/xhigh/max passe en high.
sortie=""
for modele in $MODELES; do
  modele="$(sed -E 's/-(low|medium|high|xhigh|max)$//' <<<"$modele")-high"
  echo "== agy --model $modele ($(date +%T))" >>"$journal"
  # Sortie JSON : seule la réponse finale est gardée (pas les lignes de progression).
  if brut="$(agy --print "$consigne" --model "$modele" --effort high --mode accept-edits --print-timeout 100m \
    --output-format json 2>>"$journal")"; then
    printf '%s\n' "$brut" >>"$journal"
    sortie="$(python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("response","") if d.get("status")=="SUCCESS" else "")' <<<"$brut" 2>>"$journal")"
    [ -n "$sortie" ] && break
  fi
  echo "agy ($modele) a échoué ou n'a rien rendu : modèle suivant." >>"$journal"
  git reset -q --hard && git clean -fdq
  sortie=""
done
[ -n "$sortie" ] || echouer "agy a échoué avec tous les modèles ($MODELES)"

numero="$(grep -oE '^EPISODE: *[0-9]{3}' <<<"$sortie" | tail -1 | grep -oE '[0-9]{3}')"
message="$(grep -vE '^EPISODE: ' <<<"$sortie")"

# 6. Mémoire des routines : commit, puis push sur la branche (autorisé par l'utilisateur).
if [ -n "$(git status --porcelain)" ]; then
  git add -A >>"$journal" 2>&1
  git -c user.name="Matou (routine)" -c user.email="routines@matou.ai" \
    commit -q -m "Routine $routine${numero:+ : #$numero} (agy, Pi)" >>"$journal" 2>&1
  if [ "$POUSSER" = 1 ]; then
    { git pull -q --rebase origin "$BRANCHE" && git push -q origin "HEAD:$BRANCHE"; } >>"$journal" 2>&1 ||
      message="$message

ATTENTION : le push sur $BRANCHE a échoué (journal : $journal)."
  fi
fi

# 7. Livraison : message final, miniature et vidéo.
pieces=()
if [ -n "$numero" ]; then
  for d in episodes/"$numero"-*/rendu; do
    pieces+=("$PWD/$d"/*-miniature.png)
    for v in "$PWD/$d"/*.mp4; do pieces+=("$v"); done
  done
fi
livrer "$message" "${pieces[@]}"
