#!/usr/bin/env bash
# Lanceur des routines de Matou sur le Raspberry Pi (docs/routines.md).
# Hermes (cron) l'appelle en tâche de fond ; il prépare la branche, confie le travail à agy,
# puis committe, pousse et livre le message final (et la vidéo) sur Discord.
#
# Usage : scripts/routines/lancer.sh episode-du-jour [principal|second] | bilan | rappel
#   principal (défaut) : le meilleur sujet du jour, créneaux du soir sur tous les réseaux ;
#   second : le sujet suivant, créneaux de midi (partout sauf LinkedIn). brand/postiz.json.
#
# Variables (toutes facultatives) :
#   MATOU_DEPOT    clone dédié aux routines                  (défaut ~/matou/vids-for-rs)
#   MATOU_BRANCHE  branche de travail                        (défaut main)
#   MATOU_POUSSER  1 : commit + push ; 0 : commit local seul (défaut 1)
#   MATOU_POSTIZ   1 : brouillons Postiz ; 0 : s'arrêter avant (défaut 1)
#   MATOU_AUTO     1 : programme les brouillons si les garde-fous passent (veto de
#                  l'utilisateur ensuite) ; 0 : s'arrêter aux brouillons (défaut 1)
#   MATOU_LIVRER   cible `hermes send` ; vide : message sur la sortie standard seulement
#   MATOU_MODELES  modèles agy essayés dans l'ordre (repli si quota ou panne),
#                  toujours ramenés à leur variante high (effort imposé)
#   MATOU_CLAUDE   modèle Claude Code si agy échoue avec tous ses modèles ; 0 : pas de
#                  repli                                     (défaut claude-sonnet-5-5)
set -uo pipefail

routine="${1:?Usage : lancer.sh episode-du-jour [principal|second] | bilan | rappel}"
rang="${2:-principal}"
case "$rang" in principal | second) ;; *) echo "Rang inconnu « $rang » (principal ou second)" >&2; exit 2 ;; esac
DEPOT="${MATOU_DEPOT:-$HOME/matou/vids-for-rs}"
BRANCHE="${MATOU_BRANCHE:-main}"
POUSSER="${MATOU_POUSSER:-1}"
POSTIZ="${MATOU_POSTIZ:-1}"
AUTO="${MATOU_AUTO:-1}"
LIVRER="${MATOU_LIVRER:-}"
MODELES="${MATOU_MODELES:-gemini-3.8-flash-high gemini-4-argon-high claude-sonnet-5-5-high}"
CLAUDE="${MATOU_CLAUDE:-claude-sonnet-5-5}"
JOURNAUX="$HOME/.local/state/matou"

export PATH="$HOME/.local/bin:$PATH"
mkdir -p "$JOURNAUX"
journal="$JOURNAUX/$(date +%F-%H%M)-$routine$([ "$routine" = episode-du-jour ] && echo "-$rang").log"

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
# Un épisode attend son tour (le second suit le principal) ; le rappel et le bilan ne l'attendent pas.
exec 9>"$JOURNAUX/routine.lock"
if [ "$routine" = episode-du-jour ]; then
  flock -w 7200 9 || echouer "le Pi est occupé depuis 2 h par une autre routine"
else
  flock -n 9 || { echo "Routine $routine ignorée : une autre tourne encore." >>"$journal"; exit 0; }
fi

# 1. Branche à jour, arbre propre (les rendus, ignorés par git, sont gardés 30 jours).
[ -d "$DEPOT/.git" ] || echouer "clone absent ($DEPOT)"
cd "$DEPOT" || echouer "dossier $DEPOT inaccessible"
git rebase --abort >/dev/null 2>&1 # un push raté la veille peut laisser un rebase en cours
{
  git fetch -q origin "$BRANCHE" &&
    git checkout -q -B "$BRANCHE" "origin/$BRANCHE" &&
    git reset -q --hard "origin/$BRANCHE" &&
    git clean -fdq
} >>"$journal" 2>&1 || echouer "impossible de mettre $BRANCHE à jour"
# Un épisode effacé par un repli ne laisse que ses rendus (ignorés) : sans ce ménage, son
# dossier fausserait le numéro du suivant (le plus grand episodes/NNN-* + 1).
for d in episodes/*/; do
  [ -n "$(git ls-files "$d" | head -1)" ] || rm -rf "$d"
done
find episodes/*/rendu episodes/*/controle -maxdepth 0 -mtime +30 -exec rm -rf {} + 2>/dev/null

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
    livrer "Matou — brouillons retenus par les garde-fous (ou par ton veto), à relire dans Postiz :
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
      postiz_consigne="Va jusqu'aux brouillons Postiz (npm run postiz -- NNN --rang $rang --commentaire --envoyer). Ne lance jamais --programmer : le lanceur programme lui-même si les garde-fous passent."
    else
      postiz_consigne="Essai : n'envoie RIEN à Postiz (pas de --envoyer, pas de --programmer) ; arrête-toi après npm run check."
    fi
    consigne="$commun Épisode $rang du jour. Suis le skill episode-du-jour de bout en bout (veille-ia en mode autonome, puis episode étapes 0 à 7, avec les sous-agents documentaliste, verificateur-faits, spectateur et controleur-visuel). $postiz_consigne Termine par le message final du skill, en français, puis l'avant-dernière ligne exactement « PROGRAMMER: oui » ou « PROGRAMMER: non — <raison> » (étape 4 du skill), et la dernière ligne exactement « EPISODE: NNN » (ou « EPISODE: aucun »)."
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
    # Un statut ERROR avec « EPISODE: NNN » : l'épisode est fini, seul un dernier appel
    # d'outil a raté (vu le 2026-10-30). On le garde ; les garde-fous décident ensuite.
    sortie="$(python3 -c '
import json, re, sys
d = json.load(sys.stdin); r = d.get("response", "")
fini = re.search(r"^EPISODE: *[0-9]{3}", r, re.M)
print(r if d.get("status") == "SUCCESS" or fini else "")' <<<"$brut" 2>>"$journal")"
    [ -n "$sortie" ] && break
  fi
  echo "agy ($modele) a échoué ou n'a rien rendu : modèle suivant." >>"$journal"
  git reset -q --hard && git clean -fdq
  sortie=""
done
agent="agy"

# 5 ter. Dernier repli : Claude Code, s'il est installé (mêmes skills, CLAUDE.md importe
# AGENTS.md). Personne pour répondre : « dontAsk » refuse tout ce qui n'est pas dans la
# liste ci-dessous. Ni commit ni push (le lanceur s'en charge).
outils_claude=(Read Write Edit Glob Grep Skill Task Agent WebFetch WebSearch TodoWrite
  'Bash(npm run:*)' 'Bash(npm ci:*)' 'Bash(node:*)' 'Bash(npx tsx:*)' 'Bash(python3:*)'
  'Bash(curl:*)' 'Bash(ffprobe:*)' 'Bash(ffmpeg:*)' 'Bash(ls:*)' 'Bash(cat:*)' 'Bash(head:*)'
  'Bash(tail:*)' 'Bash(wc:*)' 'Bash(grep:*)' 'Bash(find:*)' 'Bash(mkdir:*)' 'Bash(cp:*)'
  'Bash(mv:*)' 'Bash(date:*)' 'Bash(git status:*)' 'Bash(git diff:*)' 'Bash(git log:*)'
  'Bash(git add:*)')
if [ -z "$sortie" ] && [ "$CLAUDE" != 0 ] && command -v claude >/dev/null; then
  echo "== claude --model $CLAUDE ($(date +%T))" >>"$journal"
  if brut="$(timeout 100m claude -p "$consigne" --model "$CLAUDE" --effort high --output-format json \
    --permission-mode dontAsk --allowedTools "${outils_claude[@]}" </dev/null 2>>"$journal")"; then
    printf '%s\n' "$brut" >>"$journal"
    sortie="$(python3 -c '
import json, re, sys
d = json.load(sys.stdin); r = d.get("result", "")
fini = re.search(r"^EPISODE: *[0-9]{3}", r, re.M)
print(r if not d.get("is_error") or fini else "")' <<<"$brut" 2>>"$journal")"
  fi
  [ -n "$sortie" ] && agent="Claude Code" || echo "claude ($CLAUDE) a échoué ou n'a rien rendu." >>"$journal"
fi
[ -n "$sortie" ] || echouer "agy a échoué avec tous les modèles ($MODELES)$([ "$CLAUDE" != 0 ] && echo ", puis Claude Code")"

numero="$(grep -oE '^EPISODE: *[0-9]{3}' <<<"$sortie" | tail -1 | grep -oE '[0-9]{3}')"
avis="$(grep -E '^PROGRAMMER: ' <<<"$sortie" | tail -1 | sed 's/^PROGRAMMER: *//')"
message="$(grep -vE '^(EPISODE|PROGRAMMER): ' <<<"$sortie")"

# 5 bis. Programmation automatique, avec droit de veto (docs/decisions.md, 2026-10-30).
# Garde-fous : l'agent dit oui (vérification des faits sans réserve), npm run check passe,
# les brouillons existent. Sinon les brouillons attendent la relecture de l'utilisateur.
if [ "$routine" = episode-du-jour ] && [ -n "$numero" ] && [ "$POSTIZ" = 1 ]; then
  envoi="$(ls episodes/"$numero"-*/postiz-envoi.json 2>/dev/null | head -1)"
  raison=""
  if [ "$AUTO" != 1 ]; then raison="programmation automatique coupée (MATOU_AUTO=0)"
  elif [ -z "$envoi" ]; then raison="aucun brouillon dans Postiz"
  elif [[ "$avis" != oui* ]]; then raison="l'agent ne le recommande pas : ${avis:-aucun avis rendu}"
  elif ! npm run -s check -- "$numero" >>"$journal" 2>&1; then raison="npm run check -- $numero échoue"
  fi
  if [ -z "$raison" ] && programmes="$(npm run -s postiz -- "$numero" --programmer 2>>"$journal")"; then
    message="$message

PROGRAMMÉ automatiquement :
$(grep -E '^Programmé' <<<"$programmes" | sed 's/ ([^)]*)//')
Veto (avant l'heure du post) : dans Postiz, repasse le post en brouillon ou supprime-le ; ou demande « veto #$numero » à Claude ; ou sur le Pi : cd ~/vids-for-rs && git pull && npm run postiz -- $numero --annuler."
  else
    message="$message

NON programmé (${raison:-npm run postiz -- $numero --programmer a échoué}) : les brouillons attendent ta relecture dans Postiz, puis « programme »."
  fi
fi

# 6. Mémoire des routines : commit, puis push sur la branche (autorisé par l'utilisateur).
# Le prochain passage remet le clone à origin/$BRANCHE : un commit non poussé serait perdu.
# D'où 3 essais (rebase sur ce qui a été poussé entre-temps), puis une branche de secours.
if [ -n "$(git status --porcelain)" ]; then
  git add -A >>"$journal" 2>&1
  if ! git -c user.name="Matou (routine)" -c user.email="routines@matou.ai" \
    commit -q -m "Routine $routine${numero:+ : #$numero} ($agent, Pi)" >>"$journal" 2>&1; then
    message="$message

ATTENTION : le commit a échoué, rien n'est versionné (journal : $journal)."
  elif [ "$POUSSER" = 1 ]; then
    pousse=0
    for essai in 1 2 3; do
      if { git pull -q --rebase origin "$BRANCHE" && git push -q origin "HEAD:$BRANCHE"; } >>"$journal" 2>&1; then
        pousse=1; break
      fi
      git rebase --abort >/dev/null 2>&1
      sleep $((essai * 30))
    done
    if [ "$pousse" = 0 ]; then
      secours="secours/$(date +%F-%H%M)-$routine${numero:+-$numero}"
      git push -q origin "HEAD:refs/heads/$secours" >>"$journal" 2>&1 &&
        quoi="le travail est sur la branche $secours, à fusionner dans $BRANCHE" ||
        quoi="la branche de secours non plus : le travail n'existe que dans $DEPOT, ne relance pas de routine avant de l'avoir récupéré"
      message="$message

ATTENTION : le push sur $BRANCHE a échoué 3 fois ; $quoi (journal : $journal)."
    fi
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
