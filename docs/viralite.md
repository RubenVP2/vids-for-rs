# Viralité : ce que disent les données, et où en est Matou

Étude du 01/11/2026 : quatre recherches en parallèle (accroche et rétention, montage et
son, règles des plateformes pour un compte automatisé, comptes d'actu qui percent),
croisées avec les épisodes #004 à #007. Elle complète `docs/reseaux.md` (heures, textes)
et `docs/publication.md` (gabarits de texte) ; elle porte sur **la vidéo elle-même**.

Niveaux de confiance : **officiel** (règle ou responsable d'une plateforme), **étude**
(jeu de données chiffré, souvent d'un vendeur d'outil), **avis** (blogs, praticiens).
Les plateformes ne publient **aucun seuil chiffré** : les « 70 % de complétion » qui
circulent sont des avis. Ce qui compte, ce sont les courbes de Matou.

## Ce qui a été fait (01/11/2026, à partir de #008)

Retenus par l'utilisateur : les écarts 1 (gabarit), 2 (3 premières secondes), 3 (fin) et
6 (avis de Matou). Détail dans `docs/decisions.md` ; écriture : skill `ecriture-matou` ;
réglages : `brand/montage.json` ; contrôle : `npm run validate`. Pas encore faits : le
rythme (4), les captures réelles et l'angle « pour toi » dans la veille (5), les petits
réglages (7).

## Le diagnostic

Sur TikTok, chaque vidéo s'arrête autour de 250 vues (#000 : 260, #001 : 259, #002 :
253), sans commentaire ni partage. Ce n'est pas une sanction : chaque vidéo est d'abord
montrée à un premier lot de quelques centaines de personnes, et n'est élargie que si ce
lot regarde, termine, partage ou commente (TikTok, officiel 2020 ; « prison des 200
vues », avis). Un plafond identique à chaque fois dit que **le premier lot ne retient
pas**, et c'est d'abord une affaire de premières secondes.

Postiz ne donne pas la rétention. Elle se lit à la main : TikTok Studio (courbe,
rétention à 3 s), YouTube Studio (« vus / balayés »), Instagram (« taux de passage » des
3 premières secondes, ajouté début 2026, officiel).

## Déjà aligné (à garder)

| Pratique | Chez Matou |
| --- | --- |
| Une seule idée, 20-35 s pour un compte qui démarre (étude) | `flash` 25-35 s |
| Débit 150-180 mots/min (avis) | 2,7-3,5 mots/s |
| Voix dès la 1re image, titre lisible sans le son (officiel TikTok, Mosseri) | 1er mot à 0-0,3 s, titre du hook en 1re image |
| Sous-titres gros, une ligne, mot prononcé surligné, hors des zones de l'interface | ≤ 24 caractères, y 1010-1170 |
| Entrées sèches, visuel avant la voix | ressort ~8 images, 4 images d'avance |
| Univers propre et reconnaissable, rendu « fait main » (TikTok conseille le moins léché) | cahier, feutre, surligneur |
| Personnage récurrent ; un personnage dessiné crée autant d'attachement qu'un humain (étude, N = 179) | Matou |
| Source et date visibles : la crédibilité d'un personnage sans visage vient de là | en-tête permanent |
| Envoi en message privé, question ouverte, nom connu (signaux Instagram, officiel) | gabarits de texte |
| Même MP4 sans filigrane sur les 3 réseaux : aucune pénalité connue | rendu propre |

## Les écarts, par impact attendu

### 1. Un gabarit identique, deux fois par jour

C'est le point où les quatre recherches convergent.

- YouTube (15/07/2025, officiel) : la règle « contenu inauthentique » vise les vidéos
  « faites sur un gabarit avec peu ou pas de variation » et le contenu IA « au gabarit
  générique qui donne une impression de production en masse ». Elle touche la
  monétisation ; YouTube précise qu'utiliser l'IA ne suffit pas à être visé.
- TikTok (règles du 24/09/2026, officiel) : le contenu « non original, sans rien de
  nouveau » n'est pas éligible au fil Pour toi. TikTok teste depuis juillet 2026 des
  filtres visant les **comptes** qui publient en série des vidéos IA « sur le même
  modèle », l'actu parmi les thèmes cités (presse ; application inconnue). Depuis
  novembre 2025, chacun peut réduire la part de contenu IA dans son fil.
- Instagram (avril 2026, officiel) : un compte jugé non original sur 30 jours glissants
  n'est plus recommandé aux non-abonnés ; voix off et commentaire comptent comme apport
  original. Mosseri annonce un classement qui favorisera l'originalité.

Chez Matou, tout est fixe : 8 scènes dans le même ordre, la même ouverture, le même
décor, Matou en bas, la même fin. **À faire** : plusieurs structures et ouvertures en
rotation (comme les gabarits de texte), de nouveaux types de cartes, Matou qui se déplace
dans le cadre, et surtout un **avis propre** à chaque épisode (voir 6). Garder ce qui
fait la marque : cahier, polices, surligneur, tampons, Hype-mètre.

### 2. Les 3 premières secondes

Sur #007, la 1re image montre l'en-tête, « ChatGPT va couper court » (ce qu'on coupe
n'est pas dit) et beaucoup de papier vide. Vient ensuite la scène `source` (3 à 4 s :
qui, quoi, quand), au moment précis où le spectateur décide de rester.

- Montrer le message clé dans les 3 premières secondes (TikTok, guide créatif, officiel).
  Sauter l'intro, livrer le concret tout de suite (études de vendeurs).
- **À faire** :
  - l'image 1 montre la chose concrète : une fausse fenêtre ChatGPT « Conversation
    terminée », une capture, un chiffre géant, avec un mouvement dès la 1re image ;
  - un titre de 6 mots au plus, qui complète la voix au lieu de la répéter ;
  - le hook dit le bénéfice ou la menace pour le spectateur, pas l'annonce (voir 5) ;
  - la scène `source` disparaît : le tampon et la source deviennent une incrustation
    pendant la 1re explication (« OpenAI vient de l'annoncer » tient en une demi-phrase).
    La règle « toujours citer la source » reste tenue par l'en-tête et la description.

### 3. La fin dit « tu peux partir »

« Abonne-toi. C'était Matou, et c'est tout. » est un signal de fin : outros et appels à
s'abonner font balayer (avis, unanime). Le temps de visionnage et les revisionnages sont
des signaux forts (officiel TikTok et Instagram).

- **À faire** : annoncer le verdict dès le hook (« verdict au Hype-mètre à la fin ») pour
  en faire une boucle ouverte, puis finir sur une phrase qui renvoie au hook (la vidéo
  repart). La signature devient courte et sonore (« Ma-tou ! »), sans « Abonne-toi ».
  HugoDécrypte garde un appel à s'abonner, mais avec un visage et un public acquis.

### 4. Le rythme et ce qu'il y a à lire

Les scènes durent 2 à 4,5 s, avec un changement visuel par scène. Les praticiens
conseillent un changement toutes les 1,5 à 2,5 s (étude OpusClip : plans de 2,5 s, +35 %
de complétion, corrélation). Sur #007, la carte `point` affiche une phrase entière qui
paraphrase la voix (« En cas d'obsession violente, le chat s'arrête net. ») pendant que
les sous-titres en affichent une autre : deux textes à lire en même temps.

- **À faire** : des micro-événements toutes les ~2 s dans une scène (zoom, tampon, mot
  qui apparaît, réaction de Matou) ; une carte porte 3 à 6 mots, pas une phrase ;
  réduire le papier vide (cartes plus grandes, Matou plus présent).

### 5. Montrer la preuve, choisir l'angle « pour toi »

- Captures réelles (article, interface, tweet) dans la carte scotchée, avec un zoom et un
  coup de surligneur : c'est le point commun de Fireship et des comptes FR qui marchent
  (avis), le meilleur levier de confiance pour un personnage sans visage (étude), et de
  l'apport original si elle est commentée (Instagram, officiel). Ne pas reprendre les
  vidéos de démo des entreprises telles quelles.
- Les sujets qui font les vues : ce qui change pour le spectateur (emploi, arnaque,
  vie privée, « tu peux maintenant… »), pas l'annonce corporate. Fireship a explosé sur
  les très grosses sorties (GPT-4), pas sur les mineures. En France, le public dit
  « ChatGPT » (63 à 72 % des utilisateurs d'IA) ; Mistral pèse 6 % (Crédoc, Ifop 2025).
- Une série **intemporelle** (« Matou t'explique les agents en 30 s ») à côté de l'actu,
  cherchable et regardée en rafale (modèle « in 100 Seconds » de Fireship). À tester.

### 6. Un personnage avec des avis

Duolingo a percé quand sa mascotte s'est moquée d'elle-même et a réagi à l'époque ;
Fireship vit de sa pique. YouTube exige un « commentaire original » pour la monétisation.
Matou résume bien, mais il donne peu son avis (« une blague maximum par épisode »).

- **À faire** : une prise de position assumée par épisode (dans le Hype-mètre ou
  « Et pour toi ? »), un peu d'auto-dérision de chat, et des questions qui donnent envie
  de le contredire.
- Répondre aux commentaires dans la 1re heure, à la main, avec parfois une réponse vidéo.
  Pas de réponses automatiques : TikTok interdit l'automatisation qui contourne ses
  systèmes, Threads déclasse les réponses génériques (officiel).

### 7. Petits réglages

- Voix : plus d'expressivité sur le hook et le verdict (consigne au TTS), silences entre
  scènes raccourcis. La voix est attribuée à un personnage, c'est mieux accepté qu'une
  voix off anonyme (études).
- Étiquette IA : pas obligatoire pour une animation non réaliste et une voix qui n'imite
  personne (YouTube, TikTok, officiel) ; la dire dans la bio reste cohérent avec le sujet.
- Couverture : la grille Instagram est recadrée en 3:4 au centre (janvier 2025) : titre
  et Matou dans les 1080 × 1440 du milieu.
- Musique : faire tourner plusieurs pistes plutôt qu'un seul marimba.

## Ce qui ne bouge pas (pour l'instant)

- **2 épisodes par jour.** Buffer (11,4 M de posts TikTok, 2025) : la médiane des vues ne
  dépend pas du volume, mais le 90e percentile monte avec lui ; publier plus donne plus
  de chances de succès. Le risque est le gabarit identique (1), pas le nombre. À revoir
  si une plateforme signale le compte (« Statut du compte » Instagram).
- **La durée** : ~30 s par défaut ; depuis le 01/11, un sujet qui le demande passe en
  format long, jusqu'à ~60 s (`ecriture-matou`). Buffer : les TikTok de plus de 60 s ont
  plus de portée, à rétention égale. Le bilan compare les deux formats.
- **Publier par Postiz** : aucune pénalité prouvée de l'API. Les sons tendance ne passent
  pas par l'API, et pèsent peu sur un format parlé.

## Mesurer

Chaque changement se juge sur 10 à 15 vidéos, sur les courbes de rétention plus que sur
les vues. Les relevés manuels (rétention à 3 s, complétion, « vus / balayés ») sont à
noter chaque lundi avec le bilan, puisque Postiz ne les donne pas.

## Sources principales

- TikTok, recommandation (2020) : https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok, bonnes pratiques créatives (juin 2025) : https://ads.tiktok.com/help/article/creative-best-practices
- TikTok, intégrité et authenticité : https://www.tiktok.com/community-guidelines/en/integrity-authenticity
- TikTok, curseur IA (nov. 2025) : https://techcrunch.com/2025/11/18/tiktok-now-lets-you-choose-how-much-ai-generated-content-you-want-to-see/
- TikTok, comptes IA en série (juil. 2026) : https://siecledigital.fr/2026/07/15/tiktok-declare-la-guerre-aux-comptes-qui-saturent-la-plateforme-de-videos-generees-par-ia/
- YouTube, monétisation et contenu inauthentique : https://support.google.com/youtube/answer/1311392
- YouTube, précisions (juil. 2025) : https://www.searchenginejournal.com/youtube-clarifies-monetization-update-targeting-spam-not-reaction-channels/550755/
- YouTube, contenu synthétique : https://support.google.com/youtube/answer/14328491
- YouTube, comptage des vues des Shorts : https://support.google.com/youtube/answer/10059070
- Instagram, contenu original : https://creators.instagram.com/original-content-guidelines/
- Instagram, agrégateurs (avr. 2026) : https://techcrunch.com/2026/04/30/instagram-restricts-reach-of-content-aggregators-in-new-crackdown/
- Instagram, signaux (Mosseri, janv. 2025) : https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/
- Buffer, fréquence TikTok (11,4 M de posts) : https://buffer.com/resources/how-often-should-you-post-on-tiktok/
- OpusClip, durée et rétention : https://www.opus.pro/blog/tiktok-length-format-retention-data
- Fireship : https://read.engineerscodex.com/p/how-fireship-became-youtubes-favorite
- Duolingo : https://thedrum.com/news/duolingo-s-tiktok-mastermind-its-unhinged-social-strategy-and-killing-its-mascot
- Influenceurs virtuels et attachement (2024) : https://journals.sagepub.com/doi/reader/10.1177/14614448221102900
- Usage de l'IA en France (Ifop 2025) : https://fr.themedialeader.com/ia-generative-45-des-sondes-declarent-ladopter-au-quotidien-selon-une-etude/
