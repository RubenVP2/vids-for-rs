# #005 mistral-large-le-chonk : épisode reconstitué

Routine `episode-du-jour second` du 30/10/2026 (7 h 13). L'épisode a été fini et envoyé
dans Postiz, mais agy a rendu un statut ERROR : l'ancien lanceur l'a pris pour un échec
et a effacé le travail (`reset --hard`) avant tout commit. Le lanceur garde désormais ce
cas (réponse qui finit par `EPISODE: NNN`).

Ce qui a survécu, et d'où ça vient :

- `voix.mp3` : la copie de `public/episodes/` dans le clone des routines (celle du rendu).
- `postiz-envoi.json` : les posts trouvés dans Postiz ; vidéo et miniature dans sa
  médiathèque. `serie` (« flash ») est déduite : une annonce, 31 s.
- `publication.md` : les textes des posts, plus Instagram et la relance Threads écrits après coup.
- Le résumé de l'agent : `~/.local/state/matou/2026-10-30-0713-episode-du-jour-second.log` sur le Pi.

Perdus : `source.md`, `scenes.json`, `timings.json`. L'épisode ne peut donc pas être
rendu à nouveau ; la vidéo publiée est `https://uploads.postiz.com/xNxrqAzOcD.mp4`.

Source : https://mistral.ai/news/mistral-large-4-oss/ (billet du 29/10/2026). Chiffres
vérifiés par `verificateur-faits` pendant la routine : 1 000 milliards de paramètres
(52 milliards actifs), entraînement en Europe sur 3 800 processeurs, 89 % à HumanEval,
licence Apache 2.0.
