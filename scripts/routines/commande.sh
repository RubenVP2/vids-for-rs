#!/usr/bin/env bash
# Commandes de Matou données sur Discord, que Hermes lance (skill matou, docs/routines.md).
# Elles travaillent dans un worktree jetable d'origin/main, jamais dans le clone des routines :
# une routine peut être en train de le remettre à zéro, et une commande n'attend pas son verrou.
#
# Usage : scripts/routines/commande.sh ok NNN [réseaux]       feu vert : urgent → publié tout de suite,
#                                                             sinon brouillons → programmés
#         scripts/routines/commande.sh veto NNN [réseaux]     posts programmés pas encore partis → brouillons
#         scripts/routines/commande.sh etat                   ce qui part aujourd'hui et demain, par épisode
#         scripts/routines/commande.sh stats                  npm run bilan (chiffres Postiz), sans rien écrire
#   réseaux : tiktok,threads… (ok d'un urgent : défaut, ceux demandés avec l'urgent, sinon tous)
set -uo pipefail

action="${1:?Usage : commande.sh ok|veto NNN [réseaux] | etat | stats}"
numero="${2:-}" reseaux="${3:-}"
DEPOT="${MATOU_DEPOT:-$HOME/matou/vids-for-rs}"
export PATH="$HOME/.local/bin:$PATH"

case "$action" in
  ok | veto)
    [[ "$numero" =~ ^#?[0-9]{1,3}$ ]] || { echo "Numéro d'épisode attendu (ex. 008)."; exit 2; }
    numero="$(printf %03d $((10#${numero#\#})))"
    ;;
  etat | stats) ;;
  *) echo "Commande inconnue « $action » (ok, veto, etat, stats)."; exit 2 ;;
esac
[[ -z "$reseaux" || "$reseaux" =~ ^[a-z]+(,[a-z]+)*$ ]] || { echo "Réseaux : liste séparée par des virgules (ex. tiktok,threads)."; exit 2; }

base="$(mktemp -d)" arbre="$base/matou"
nettoyer() { git -C "$DEPOT" worktree remove --force "$arbre" >/dev/null 2>&1; rm -rf "$base"; git -C "$DEPOT" worktree prune; }
trap nettoyer EXIT
{ git -C "$DEPOT" fetch -q origin main && git -C "$DEPOT" worktree add -q --detach "$arbre" origin/main; } >/dev/null 2>&1 ||
  { echo "Impossible de préparer main (git fetch dans $DEPOT)."; exit 1; }
ln -s "$DEPOT/node_modules" "$arbre/node_modules"
cd "$arbre" || exit 1

if [ "$action" = etat ]; then
  node -e '
    const fs = require("fs");
    const jour = (t) => new Intl.DateTimeFormat("en-CA", {timeZone: "Europe/Paris"}).format(new Date(t));
    const heure = (t) => new Intl.DateTimeFormat("fr-FR", {timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit"}).format(new Date(t));
    const [auj, dem] = [Date.now(), Date.now() + 864e5].map(jour);
    let rien = true;
    for (const d of fs.readdirSync("episodes").sort()) {
      const lire = (f) => { try { return JSON.parse(fs.readFileSync(`episodes/${d}/${f}`, "utf8")); } catch { return null; } };
      const envoi = lire("postiz-envoi.json"), urgent = lire("urgent.json");
      if (urgent && !envoi && jour(urgent.demande) === auj) { console.log(`#${d.slice(0, 3)} urgent : en attente de ton « ok #${d.slice(0, 3)} »`); rien = false; }
      const postes = (envoi?.postes ?? []).filter((p) => [auj, dem].includes(jour(p.date ?? envoi.date)));
      if (!postes.length) continue;
      rien = false;
      const liste = postes.map((p) => {
        const t = p.date ?? envoi.date;
        return `${p.reseau} ${jour(t) === dem ? "demain " : ""}${heure(t)} ${Date.parse(t) <= Date.now() && p.statut === "programmé" ? "parti" : p.statut}`;
      });
      console.log(`#${d.slice(0, 3)} ${envoi.rang ?? "principal"} : ${liste.join(", ")}`);
    }
    if (rien) console.log("Rien de prévu aujourd’hui ni demain.");
    console.log("(selon le journal des épisodes sur main ; un changement fait à la main dans Postiz n’y est pas.)");
  '
  exit 0
fi

if [ "$action" = stats ]; then
  npm run -s bilan 2>&1
  exit 0
fi

dossier="$(ls -d episodes/"$numero"-*/ 2>/dev/null | head -1)"
[ -n "$dossier" ] || { echo "Épisode #$numero introuvable sur main."; exit 1; }

if [ "$action" = veto ]; then
  sortie="$(npm run -s postiz -- "$numero" --annuler ${reseaux:+--reseaux "$reseaux"} 2>&1)"; code=$?
elif [ -f "${dossier}urgent.json" ] && [ ! -f "${dossier}postiz-envoi.json" ]; then
  # Feu vert d'un urgent : brouillons et programmation d'un coup, quelques minutes plus tard.
  # La vidéo n'est pas versionnée : elle est restée dans le clone des routines.
  [ -d "$DEPOT/${dossier}rendu" ] || { echo "Vidéo de #$numero absente du Pi ($DEPOT/${dossier}rendu)."; exit 1; }
  ln -s "$DEPOT/${dossier}rendu" "${dossier}rendu"
  [ -n "$reseaux" ] || reseaux="$(node -e 'const u = require(process.argv[1]); process.stdout.write((u.reseaux ?? []).join(","))' "$PWD/${dossier}urgent.json")"
  sortie="$(npm run -s postiz -- "$numero" --rang urgent --commentaire --envoyer --publier ${reseaux:+--reseaux "$reseaux"} 2>&1)"; code=$?
  rm -f "${dossier}rendu"
else
  sortie="$(npm run -s postiz -- "$numero" --programmer ${reseaux:+--reseaux "$reseaux"} 2>&1)"; code=$?
fi
grep -E '^(Programmé|Repassé|Inchangé|Pas de post|Proche|Non connectés|Error|.*Envoi annulé|.*Déjà envoyé|  - )' <<<"$sortie" | sed 's/ ([^)]*)//' || true
[ "$code" = 0 ] || { echo "Échec (npm run postiz, code $code) :"; tail -5 <<<"$sortie"; }

# Le journal de l'épisode (postiz-envoi.json) part sur main, même après un échec partiel :
# c'est lui qui dit à la prochaine commande ce qui est déjà dans Postiz.
if [ -n "$(git status --porcelain -- "$dossier")" ]; then
  git add -- "$dossier" &&
    git -c user.name="Matou (commande)" -c user.email="routines@matou.ai" commit -q -m "Commande $action : #$numero (Hermes, Pi)" || { echo "ATTENTION : commit impossible, journal non versionné."; exit 1; }
  for essai in 1 2 3; do
    { git fetch -q origin main && git rebase -q origin/main && git push -q origin HEAD:main; } >/dev/null 2>&1 && exit "$code"
    git rebase --abort >/dev/null 2>&1
    sleep $((essai * 10))
  done
  echo "ATTENTION : push sur main impossible ; le journal de #$numero n'est pas versionné (à refaire en session)."
  exit 1
fi
exit "$code"
