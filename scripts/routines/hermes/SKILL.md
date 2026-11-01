---
name: matou
description: Piloter Matou (@matou.ai, vidéos d'actu IA) depuis Discord — épisode urgent sur une grosse actu, feu vert (« ok #NNN »), veto, ce qui part aujourd'hui, chiffres. À utiliser quand Ruben parle de Matou, écrit dans #matou, donne un lien d'actu IA à mettre en vidéo, ou dit « urgent », « big news », « ok #NNN », « programme #NNN », « veto #NNN », « annule #NNN », « qu'est-ce qui part », « stats Matou ».
version: 1.0.0
author: Claude Code (vids-for-rs)
metadata:
  hermes:
    tags: [matou, social-media, video, postiz, discord]
---

# Matou : le content manager sur Discord

Matou produit seul deux épisodes par jour (routines no-agent : principal 5 h 13, second
14 h 13, rappel 11 h 07 et 17 h 07, bilan lundi 10 h 37 → `lancer.sh` → #matou
`1565406564091961616`). Tu ne fabriques jamais une vidéo toi-même : tu lances les
commandes ci-dessous, tu relaies leur sortie, fidèlement et en 3 lignes au plus.

Dépôt des routines : `~/matou/vids-for-rs` — **ne jamais y modifier un fichier, ni y lancer
git** (une routine peut tourner dedans). Ne touche pas aux crons Matou sans que Ruben le
demande. Doc complète : `~/matou/vids-for-rs/docs/routines.md`.

## Commandes

Une seule entrée, `~/.hermes/scripts/matou.sh` (elle prend toujours la dernière version
des scripts sur `main`) :

| Ruben dit | Tu lances |
| --- | --- |
| « urgent <lien> [réseaux] », « fais une vidéo sur <lien> », « big news : <lien> » | `~/.hermes/scripts/matou.sh urgent '<lien>' [tiktok,threads]` |
| « ok #NNN [réseaux] », « programme #NNN », « publie #NNN » | `~/.hermes/scripts/matou.sh ok NNN [réseaux]` |
| « veto #NNN [réseaux] », « annule #NNN », « stop #NNN » | `~/.hermes/scripts/matou.sh veto NNN [réseaux]` |
| « qu'est-ce qui part aujourd'hui ? », « état Matou » | `~/.hermes/scripts/matou.sh etat` |
| « stats Matou », « ça a marché ? » | `~/.hermes/scripts/matou.sh stats` (résume : vues par réseau, meilleur post) |

Réseaux : `tiktok`, `instagram`, `youtube`, `threads`, `linkedin` (les comptes connectés),
séparés par des virgules, sans espace. « partout » ou rien : ne pas en passer.

## Règles

- **Rien ne part sans un « ok #NNN » de Ruben pour ce numéro-là**, écrit par lui, dans ce
  message. Un « ok » sans numéro : demande lequel (`commande.sh etat` montre ce qui attend).
  Une approbation ne vaut que pour l'épisode nommé.
- Urgent : il faut **le lien de l'article**. Sans lien (« OpenAI vient de sortir X ») :
  cherche la source officielle ou un média reconnu, propose le lien, et lance seulement
  après son « oui ». Ne lance jamais un urgent de ta propre initiative ; si tu vois passer
  une très grosse annonce IA (veille, digest), tu peux le proposer en une ligne.
- Un urgent prend ~45 min (plus si une routine occupe le Pi) ; la vidéo arrive sur #matou
  avec « réponds ok #NNN ». Au « ok », les posts partent 5 à 15 min après. Un urgent
  publié entre midi et 14 h 13 remplace l'épisode second du jour (le lanceur le saute).
- Après « ok » ou « veto », recopie les lignes « Programmé / Repassé / Pas de post /
  Proche » telles quelles. « Échec » : dis-le avec la raison, ne réessaie pas en boucle.
- `commande.sh etat` lit le journal des épisodes : un changement fait à la main dans
  Postiz n'y apparaît pas. Le dire si Ruben a touché Postiz.
