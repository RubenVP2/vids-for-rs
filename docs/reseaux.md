# Réseaux : ce qui marche sur chacun

Étude du 29/10/2026 (sources en bas). Elle fixe, pour chaque réseau connecté, le format,
le texte, l'heure et le rythme. Les chiffres viennent surtout d'études d'outils de
programmation (Buffer, Metricool…) : ce sont des tendances, pas des lois. Les créneaux
sont dans `brand/postiz.json` → `creneaux` ; le skill `bilan` les corrige avec les
chiffres de Matou (`docs/apprentissages.md`).

## En un coup d'œil

| Réseau | Format | Ce que l'algorithme récompense | Principal (Paris) | Second (Paris) | Rythme |
| --- | --- | --- | --- | --- | --- |
| TikTok | vidéo | taux de vidéo regardée jusqu'au bout, revisionnages, partages, commentaires | 19 h 00 | 12 h 30 | 2 par jour |
| Instagram | Reel (vidéo) | temps de visionnage, **envois en message privé**, puis likes et enregistrements | 18 h 30 | — | 1 par jour |
| YouTube | Short (vidéo) | satisfaction et durée de session ; les Shorts vivent des semaines par la recherche | 20 h 00 | 13 h 00 | 2 par jour |
| LinkedIn (page) | **carrousel** (document à feuilleter) | temps passé sur le post, commentaires ; les liens freinent la portée | 8 h 30, en semaine | — | 1 par jour ouvré, au plus |
| Threads | vidéo + texte de conversation, puis une **relance texte** | réponses, vite et en fil | 9 h 00, puis 19 h 30 | 12 h 00 | 3 par jour |

Volume par jour (production, depuis le 30/10/2026) : **2 épisodes**.

- Le **principal** (le meilleur sujet) est décliné en 6 posts : TikTok, Instagram,
  YouTube, Threads ×2, LinkedIn les jours ouvrés.
- Le **second** (le sujet suivant, jamais la même actu) fait 3 posts le midi : TikTok,
  YouTube, Threads. Le midi est la 2e fenêtre la plus citée pour la vidéo courte.

Pourquoi pas plus partout :

- TikTok, Shorts et Threads jugent chaque post à part, et le volume y fait grandir un
  compte (la plupart des études citent 1 à 3 vidéos par jour pour croître).
- Instagram et LinkedIn mettent en concurrence les posts d'un même compte : un 2e post
  le même jour freine le premier.

C'est un pari à mesurer : le bilan compare le second au principal, et un second qui fait
baisser les vues du principal (3 semaines de suite) fera revoir ce rythme.

## Par réseau

### TikTok
- La vidéo fait tout : hook lisible sans le son en moins de 2 s (déjà la règle).
- Légende : la promesse avec les **mots que les gens tapent** (TikTok est un moteur de
  recherche : « ChatGPT », « Google », « IA »), puis une question qui fait commenter.
- 3 à 5 hashtags. Pas de lien possible ; la source est à l'écran.
- Le soir (18 h–21 h) est le créneau le plus cité ; la pause de midi vient ensuite.

### Instagram (Reels)
- Le signal fort est l'**envoi à quelqu'un** : finir sur « Envoie-la à quelqu'un qui… ».
- 1re ligne : la promesse, coupée à ~125 caractères dans le fil.
- **5 hashtags au plus** (Instagram n'en garde pas plus).
- Vidéo rendue par nous, jamais un export TikTok (le filigrane fait baisser la portée).
- Fin d'après-midi, soirée (18 h–20 h).

### YouTube (Shorts)
- Titre cherchable : le nom connu et le fait d'abord (« ChatGPT … »), 60 caractères.
- La description garde l'URL de la source. 2 à 4 hashtags.
- Le Short continue d'être vu par la recherche : le titre compte plus qu'ailleurs.
- Soirée (19 h–21 h, pic vers 20 h).

### LinkedIn (page « Matou AI »)
- Format : **carrousel** (images qui deviennent un document à feuilleter). Toutes les
  études le placent devant la vidéo pour la portée. Les diapos sortent de `scenes.json`
  (`npm run carrousel`), il n'y a rien à écrire en plus.
- Texte : l'accroche tient dans les ~210 caractères avant « voir plus ». L'angle : ce que
  ça change **pour le travail** (l'audience « pros hors tech »). Paragraphes courts, 2–3
  flèches, une question à la fin. 3 hashtags au plus.
- **Pas de lien dans le post** : la source va dans le 1er commentaire (`--commentaire`).
- Les pages marchent en semaine, le matin (8 h–10 h, mardi–jeudi en tête). Pas le week-end.
- Rythme : 1 par jour ouvré au plus. `suivantSeulement` : si le prochain créneau est pris,
  l'épisode ne va pas sur LinkedIn (une actu vieille de 4 jours n'y a pas sa place).

### Threads
- C'est un réseau de **conversation** : les réponses dans la 1re heure pèsent le plus.
  Un post avec média fait mieux qu'un texte seul ; un texte seul sans question, le moins bien.
- Post du matin : la vidéo, avec un texte écrit pour Threads (une prise de position,
  une question), pas la légende TikTok. Un seul sujet (hashtag). La source en 1re réponse.
- Relance du soir : texte seul, une question qui fait débattre, sur le même sujet.
- 2 à 3 posts par jour sont la norme citée ; au-delà de 5, ça dilue. Le second épisode
  ajoute un post vidéo à midi (3 par jour en tout).
- Matin en semaine (6 h–11 h), et une 2e fenêtre le soir (19 h–21 h).

### X, Bluesky, Facebook (pas connectés)
Le script les gère encore : X et Bluesky reprennent la section `Court` (280 caractères),
Facebook le texte d'Instagram. À revoir le jour où ils sont connectés.

## Ce qu'on mesure (skill `bilan`)

Chaque ligne d'hypothèse de `docs/apprentissages.md` (Publier) se vérifie réseau par
réseau : rang (principal ou second), créneau (`npm run bilan` donne le jour et l'heure de chaque post), format
(carrousel contre vidéo sur LinkedIn), relance Threads (réponses obtenues). Un créneau
change après 3 épisodes qui vont dans le même sens, dans `brand/postiz.json`.

## Sources

- Buffer, format par réseau (45 M de posts) : https://buffer.com/resources/data-best-content-format-social-media/
- Buffer, meilleures heures 2026 : https://buffer.com/resources/best-time-to-post-social-media/
- Buffer, Threads (2,5 M de posts) : https://buffer.com/resources/the-best-time-to-post-on-threads/
- Metricool, meilleures heures 2026 : https://metricool.com/best-time-to-post-social-networks/
- AuthoredUp, formats LinkedIn 2026 : https://authoredup.com/blog/best-performing-content-on-linkedin
- LinkPost, formats LinkedIn (438 k posts) : https://www.linkpost.gg/en/blog/formats-post-linkedin-performance
- Compleadly, algorithme LinkedIn 2026 : https://compleadly.com/blog/linkedin-algorithm-2026
- Social Champ, heures LinkedIn (pages) : https://www.socialchamp.com/blog/best-time-to-post-on-linkedin/
- Teract, Threads (10 k posts) : https://www.teract.ai/resources/threads-content-strategy-2026
- Socialync, algorithme Threads 2026 : https://www.socialync.io/blog/threads-algorithm-2026
- Hootsuite, algorithmes 2026 : https://blog.hootsuite.com/social-media-algorithm/
- Fastlane, Reels 2026 : https://www.usefastlane.ai/blog/instagram-reels-algorithm-2026
- Socialecho, heures des vidéos courtes : https://www.socialecho.net/en/blog/docs/best-posting-time-video-platforms/?read=1
- Mirkaat, heures pour la France : https://www.mirkaat.com/tools/best-time-to-post/france
