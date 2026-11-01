#!/usr/bin/env bash
# Matou : point d'entrée de Hermes pour les commandes données sur Discord (skill Hermes « matou »).
#   matou.sh urgent <lien> [réseaux]       épisode urgent en tâche de fond (45 min), livré sur #matou
#   matou.sh ok|veto NNN [réseaux] | etat | stats    scripts/routines/commande.sh
# Les scripts sont lus sur origin/main (git show) : le clone des routines n'est remis à jour
# qu'au passage d'une routine, et on n'y touche pas pendant qu'elle tourne.
# Copie versionnée : ~/matou/vids-for-rs/scripts/routines/hermes/ (docs/routines.md).
DEPOT="${MATOU_DEPOT:-$HOME/matou/vids-for-rs}"
git -C "$DEPOT" fetch -q origin main 2>/dev/null || echo "(git fetch impossible : dernière version connue de main)"

if [ "${1:-}" = urgent ]; then
  lien="${2:-}" reseaux="${3:-}"
  [[ "$lien" =~ ^https?://[^[:space:]\"\'\`\$\\]+$ ]] || { echo "Lien invalide « $lien » : il faut l'URL de l'article (https://…)."; exit 2; }
  [[ -z "$reseaux" || "$reseaux" =~ ^[a-z]+(,[a-z]+)*$ ]] || { echo "Réseaux invalides « $reseaux » (ex. tiktok,threads)."; exit 2; }
  systemd-run --user --unit="matou-urgent-$(date +%Y%m%d%H%M%S)" --collect \
    --setenv=MATOU_LIVRER=discord:1565406564091961616 --setenv=MATOU_DEPOT="$DEPOT" \
    bash -c 's="$(git -C "$0" show origin/main:scripts/routines/lancer.sh)" && exec bash -c "$s" lancer.sh urgent "$1" "$2"' "$DEPOT" "$lien" "$reseaux" >/dev/null 2>&1 &&
    echo "Urgent lancé sur $lien : vidéo dans 45 min environ sur #matou, rien ne part sans ton « ok »." ||
    echo "Matou : impossible de lancer l'urgent (systemd-run)."
  exit 0
fi

script="$(git -C "$DEPOT" show origin/main:scripts/routines/commande.sh 2>/dev/null)" || { echo "Matou : commande.sh introuvable sur main."; exit 1; }
exec bash -c "$script" commande.sh "$@"
