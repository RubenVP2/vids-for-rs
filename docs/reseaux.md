# Réseaux : ce qui marche sur chacun

Étude du 29/10/2026 (sources en bas). Elle fixe, pour chaque réseau connecté, le format,
le texte, l'heure et le rythme. Les chiffres viennent surtout d'études d'outils de
programmation (Buffer, Metricool…) : ce sont des tendances, pas des lois. Les créneaux
sont dans `brand/postiz.json` → `creneaux` ; le skill `bilan` les corrige avec les
chiffres de Matou (`docs/apprentissages.md`).

## En un coup d'œil

| Réseau | Format | Ce que l'algorithme récompense | Principal, matin (Paris) | Second, soir (Paris) | Rythme |
| --- | --- | --- | --- | --- | --- |
| TikTok | vidéo | taux de vidéo regardée jusqu'au bout, revisionnages, partages, commentaires | 12 h 30 | 19 h 00 | 2 par jour |
| Instagram | Reel (vidéo) | temps de visionnage, **envois en message privé**, puis likes et enregistrements | 12 h 00 | 18 h 30 | 2 par jour |
| YouTube | Short (vidéo) | satisfaction et durée de session ; les Shorts vivent des semaines par la recherche | 18 h 00 (13 h 00 jusqu'au 09/11/2026) | 20 h 00 | 2 par jour |
| LinkedIn (page) | **carrousel** de fond (retour d'expérience ou coulisses), pas l'actu | temps passé sur le post, commentaires ; les liens freinent la portée | mardi à jeudi, 8 h 30 (post de la semaine) | — | 1 par semaine |
| Threads | vidéo + texte de conversation (relance texte arrêtée le 09/11/2026) | réponses, vite et en fil | 9 h 00 | 19 h 30 | 2 par jour |

Volume par jour (production, depuis le 30/10/2026) : **2 épisodes**, chacun publié dans
la fenêtre qui suit sa production (décision du 30/10/2026) :

- Le **principal** (produit vers 5 h, le meilleur sujet de la nuit) : Threads le matin,
  puis Instagram et TikTok à midi, YouTube à 18 h. Le matin ne vaut que pour Threads ; pour la vidéo courte, le
  midi est la 2e fenêtre la plus citée. YouTube passe à 18 h le 09/11/2026 : à 13 h, le
  Short du principal fait une médiane de 122 vues contre 464 pour celui de 20 h, et le
  plus tardif des deux gagne 7 jours sur 8 (`docs/bilans/analyse-metriques-2026-11-09.md`).
- Le **second** (produit vers 14 h, jamais la même actu que le principal) : Instagram,
  TikTok, Threads et YouTube le soir, la 1re fenêtre de la vidéo courte. Il attrape les annonces américaines de l'après-midi (heure de Paris) : l'actu
  du soir est celle du jour, pas celle de la nuit d'avant.
- Règle commune : **un épisode = un sujet, le même sur tous ses réseaux**, chaque post au
  format du réseau. Deux épisodes = deux sujets, chacun présent partout.
- Chaque post part **le jour même** : à son heure, sinon 2 h 30 plus tard, sinon pas du
  tout (`brand/postiz.json`). Deux posts d'un même réseau gardent 90 min d'écart : ils se
  partageraient le premier public test et, sur Instagram, LinkedIn et Threads, le 2e
  freine le 1er dans le fil. Entre réseaux différents, aucune contrainte.

Pourquoi LinkedIn est à part (1 post par semaine depuis le 10/11/2026) :

- TikTok, Shorts et Threads jugent chaque post à part, et le volume y fait grandir un
  compte (la plupart des études citent 1 à 3 vidéos par jour pour croître).
- LinkedIn montre surtout les personnes, et une page qui débute n'a presque pas de portée :
  l'actu du jour, que tout le monde publie, n'y a pas pris. Ce qui y vit, c'est le vécu et
  les chiffres réels, qu'on ne trouve nulle part ailleurs.
- Instagram met aussi en concurrence les posts d'un même compte : c'est le pari de
  l'utilisateur (30/10/2026).

C'est un pari à mesurer : le bilan compare le midi au soir, et un épisode qui fait
baisser les vues de l'autre (3 semaines de suite, Instagram surtout) fera revoir ce rythme.

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
- **Un post de fond par semaine** (10/11/2026), plus l'actu des épisodes. Deux modes
  (skill `linkedin`, `brand/linkedin.json`) :
  - **retour d'expérience** : le lundi, avec le bilan, une question part sur Discord
    (« Quel outil d'IA t'a fait gagner du temps cette semaine ? ») ; si l'utilisateur
    répond (« réponse : … » à Hermes), sa réponse devient le carrousel, sans son nom ;
  - **coulisses** (sans réponse) : une histoire vraie du dépôt, avec ses chiffres : un pari
    et ce que les bilans en ont dit, une panne et son correctif.
- Format : **carrousel** (images qui deviennent un document à feuilleter). Toutes les
  études le placent devant la vidéo pour la portée. Diapos : `src/Coulisses.tsx`.
- Texte : l'accroche tient dans les ~210 caractères avant « voir plus ». Paragraphes
  courts, 2–3 flèches, une question ouverte à la fin. 3 hashtags au plus, **aucun lien**.
- Les pages marchent en semaine, le matin (8 h–10 h, mardi–jeudi en tête) : le post part
  le mardi, mercredi ou jeudi à 8 h 30, au moins 2 h après sa production (veto).
- Ce que l'utilisateur fait : rien, ou répondre à la question du lundi. Veto : « veto
  linkedin » à Hermes.

### Threads
- C'est un réseau de **conversation** : les réponses dans la 1re heure pèsent le plus.
  Un post avec média fait mieux qu'un texte seul ; un texte seul sans question, le moins bien.
- 1er post : la vidéo, avec un texte écrit pour Threads (une prise de position,
  une question), pas la légende TikTok. Un seul sujet (hashtag). La source en 1re réponse.
- Relance (texte seul, quelques heures plus tard) : **arrêtée le 09/11/2026**. 20 relances
  publiées, médiane 9 vues, 1 réponse ; elle ne bat la vidéo du même épisode que 11 fois
  sur 19. La rétablir : remettre `relance` sur un créneau Threads de `brand/postiz.json`.
- 2 à 3 posts par jour sont la norme citée ; au-delà de 5, ça dilue. Principal : 9 h ;
  second : 19 h 30 (2 par jour).
- Matin en semaine (6 h–11 h), et une 2e fenêtre le soir (19 h–21 h).

### X, Bluesky, Facebook (pas connectés)
Le script les gère encore : X et Bluesky reprennent la section `Court` (280 caractères),
Facebook le texte d'Instagram. À revoir le jour où ils sont connectés.

## Ce qu'on mesure (skill `bilan`)

Les textes (question de fin, 1re ligne, titre) suivent des gabarits en rotation, comparés
par le bilan : `docs/publication.md`.

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
