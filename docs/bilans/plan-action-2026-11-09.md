# Plan d'action réseaux — 9 novembre 2026

Deux semaines de publication (28/10 → 09/11), 25 épisodes, 125 posts mesurés. Relevé
Postiz du 09/11 au soir (`npm run bilan`, `postiz analytics:platform -d 30`). Ce plan
complète le bilan du jour et `analyse-metriques-2026-11-09.md` : il ne refait pas leurs
tableaux, il dit quoi changer.

## 1. Où on en est

| Réseau | Vues sur 2 semaines | Par post (médiane) | Abonnés gagnés | Commentaires du public |
| --- | --- | --- | --- | --- |
| YouTube Shorts | ~7 100 (1 146 min regardées) | 254 (de 24 à 1 258) | +16, −3 | 3 |
| TikTok | ~6 300 | 257 (de 235 à 274) | non fourni par Postiz | 8 |
| Instagram Reels | 3 031 (2 703 comptes touchés) | 123 | non fourni | 2 |
| Threads | 619 | 7 (vidéo), 9 (relance) | non fourni | 3 |
| LinkedIn (page) | 63 clics, 33 vues de page | — | +1 | 1 |

En clair : ~17 000 vues, 17 commentaires du public, 13 abonnés YouTube nets. **Chaque
réseau nous montre à son lot de départ, puis s'arrête.** Aucune vidéo n'a été élargie.
La machine de production tient (25 épisodes en 13 jours, 0 veto) ; ce qui manque, c'est
le signal du public.

## 2. Le diagnostic, en 5 points

1. **TikTok ne réagit à rien de ce qu'on règle.** 25 vidéos, toutes entre 235 et 274 vues
   (#025, 118, a 2 h d'âge). Heure, gabarit, durée, sujet : aucun effet. Le lot test ne
   retient pas ou ne réagit pas (1 % de likes, 4 partages en tout). Tant que la rétention
   n'est pas lue dans TikTok Studio, on règle à l'aveugle.
2. **YouTube est le seul réseau vivant**, et ce qui y fait la différence est le sujet et
   l'heure. Les 6 Shorts au-dessus de 500 vues : ChatGPT coupe la discussion (#007),
   école sans Google (#014), feux rouges de ta ville (#021), médicaments (#023), OpenAI
   rachète (#017). Les 7 sous 60 vues : RAM d'Altman, avatar Google Vids, Meta au Brésil,
   budget d'Apple, Gemini Omni Flash, espionne chez Nvidia.
3. **La veille choisit des sujets que nos propres chiffres disent perdants.** Un billet
   de blog officiel vaut 20 points, un média 8 : le 06/11 et le 07/11, « Gemini Omni 1.2
   Flash » et « Google Workspace Weekly Recap » (35, un billet officiel frais) passent
   devant des sujets repris par 3 à 5 médias français grand public (score 32 à 40). Le
   score ne prédit pas les vues (ρ = 0,15 sur YouTube). Rien dans le score ne mesure
   « ça touche le quotidien » ni « nom que tout le monde connaît », les deux seuls
   constats confirmés de `docs/apprentissages.md`.
4. **La rétention YouTube est retombée depuis le 05/11.** Durée moyenne regardée par
   jour (compte entier) : 35 s le 01/11, 21 s le 02, 42 s le 03, 23 s le 04, puis
   **15 s, 12 s, 12 s** les 05, 06 et 07/11, soit depuis le débit accéléré et les vidéos
   de ~20–27 s. Le bilan du matin lisait l'inverse (« +180 % ») : il comparait deux
   moyennes de semaine. Trois jours ne prouvent pas la cause, mais la ligne « confirmé »
   ne tient plus.
5. **Personne ne nous parle, et on ne parle à personne.** 17 commentaires du public en
   125 posts. Threads (réseau de conversation) et LinkedIn (page à 1 abonné) reçoivent
   5 posts par jour pour ~3 % des vues. Un compte neuf qui diffuse sans jamais répondre
   ni commenter ailleurs n'a aucun signal d'entrée.

## 3. Le plan, par ordre d'impact

### A. Cette semaine (impact fort, effort faible)

| # | Action | Qui | Pourquoi | Mesure le 23/11 |
| --- | --- | --- | --- | --- |
| A1 | **Relever la rétention à la main** sur 10 vidéos (5 meilleures, 5 pires) : TikTok Studio (rétention à 3 s, % regardé, source du trafic), YouTube Studio (« vus / balayés », courbe), Instagram (taux de passage à 3 s) | Toi, 15 min | C'est le chiffre que les réseaux récompensent et Postiz ne le donne pas. Il dit si on perd les gens à 2 s (hook) ou à 10 s (corps) : les deux remèdes sont opposés | 10 lignes dans le prochain bilan |
| A2 | **Veille : noter le quotidien et le nom connu.** Dans `brand/veille.json` : `officiel` 20 → 10, un bonus « grand public » (+15 si le sujet contient un mot du quotidien : école, emploi, salaire, arnaque, vie privée, santé, téléphone, WhatsApp, gratuit, interdit…), un bonus « nom connu » (+10 : ChatGPT, Google, Apple, WhatsApp, Instagram, iPhone), et un média français compte double | Moi (code) | Constat 3. C'est le seul levier que nos chiffres confirment sur 3 épisodes et plus | Médiane YouTube des sujets « quotidien » contre les autres, à créneau égal |
| A3 | **Threads : arrêter la relance**, garder 1 post par épisode | Toi (décision), moi (réglage) | 20 relances, médiane 9 vues, 1 réponse. Deux posts par jour de moins à produire et à vérifier | Vues du compte Threads avant et après |
| A4 | **15 min par jour à la main** : répondre à chaque commentaire dans l'heure, et laisser 5 commentaires utiles de Matou sous des posts récents de gros comptes IA francophones (Threads, TikTok, LinkedIn) | Toi (ou moi en brouillons que tu colles) | Constat 5. Jamais automatisé : TikTok et Threads le déclassent | Visites de profil, abonnés, réponses |
| A5 | **Étiquette « fait avec l'IA » de TikTok** : aujourd'hui `video_made_with_ai: true` sur chaque post (`brand/postiz.json`). Elle est obligatoire pour du contenu réaliste ; notre animation dessinée avec voix de personnage n'y est a priori pas soumise (`docs/viralite.md`, § 7), et TikTok permet depuis 2025 de réduire le contenu étiqueté IA dans son fil | Toi (décision, après relecture de la règle TikTok) | Seule piste technique pour un plafond aussi régulier. C'est une hypothèse, pas un constat | Test de 10 vidéos : sortie de la fourchette 235–274 ou non |

### B. Dans les 2 semaines (impact fort, effort moyen)

| # | Action | Pourquoi |
| --- | --- | --- |
| B1 | **Le second devient 3 fois par semaine un épisode intemporel** : « C'est quoi un agent IA ? », « ChatGPT gratuit ou payant : la différence », « Comment repérer une image IA ». Série à part, titre cherchable | Une actu meurt en 48 h, une explication est cherchée pendant des mois (YouTube et TikTok sont des moteurs de recherche). Les jours sans grosse actu, la veille racle des billets à 23 points : autant ne pas les faire. Déjà notée « à tester » dans `docs/viralite.md` § 5 |
| B2 | **Le hook parle au spectateur, toujours.** Règle d'écriture : la 1re phrase contient « tu / ton / ta » ou une question dont il est le sujet ; un sujet qui ne s'y prête pas est écarté à la veille | Ouverture « toi » sur YouTube : 131, 859, 561, 819 vues ; les autres ouvertures à 13 h : 24 à 128. Encore 4 posts, donc une piste, mais elle va dans le sens du constat 2 |
| B3 | **Revenir à ~30 s et à un débit plus posé sur la moitié des épisodes** (test A/B une semaine) | Constat 4 : la durée regardée a été divisée par deux depuis le 05/11 |
| B4 | **Montrer la preuve** : capture réelle de l'article ou de l'interface dans la carte scotchée, zoom, surligneur (chantier 5 de `docs/viralite.md`, pas encore fait), et un micro-événement toutes les 2 s (chantier 4) | Les deux chantiers restants de l'étude du 01/11 |
| B5 | **Historiser les relevés** (`stats-historique.jsonl`) | Sans vues à âge égal (J+2, J+7), chaque comparaison est biaisée (R5 de l'analyse) |

### C. Paris plus gros (à discuter)

| # | Idée | Ce que ça change |
| --- | --- | --- |
| C1 | **1 épisode fort par jour au lieu de 2 moyens**, pendant 2 semaines | Le temps du second sert au sujet, au hook et à la preuve. Risque : moins de tirages à la loterie (Buffer : le volume fait monter le 90e percentile). À ne tenter que si A1 montre une rétention faible partout |
| C2 | **LinkedIn par ton profil personnel** : tu repartages le carrousel de la page avec deux lignes à toi | Une page à 1 abonné n'a pas de portée organique ; un profil en a. Tu n'apparais pas à l'écran, la règle est tenue. Sinon : LinkedIn à 2 posts par semaine, les sujets « travail » seulement |
| C3 | **Matou répond en vidéo** à un commentaire (10 s, fond cahier) | Fonction native TikTok et Reels, fort signal de conversation, et de l'apport original. Demande des commentaires : après A4 |
| C4 | **Un rendez-vous hebdo** : « Le Hype-mètre de la semaine », le dimanche, les 3 actus classées, format long 60 s | Un format qu'on attend et qu'on partage, cherchable, et il recycle la veille de la semaine |
| C5 | **Sujet chaud, vite** : utiliser l'« urgent » sur 1 à 2 grosses actus par semaine (jamais utilisé jusqu'au bout : #013 est resté sans « ok ») | Fireship a percé sur les très grosses sorties, traitées dans l'heure. Nos 2 créneaux fixes sortent l'actu 7 à 15 h après |

## 4. Ce qu'on ne touche pas

- Les créneaux Instagram et TikTok (l'heure n'y change rien), les gabarits de texte (aucun
  ne se détache, 3 à 6 posts par case), le test YouTube du principal à 18 h (en cours,
  lecture le 23/11).
- L'univers visuel, Matou, le Hype-mètre, les règles éditoriales.

## 5. Décisions attendues

1. A2 (veille « quotidien ») : je le code ? Recommandé : **oui**.
2. A3 (fin de la relance Threads) : recommandé **oui**.
3. A5 (étiquette IA TikTok) : à toi de trancher après lecture de la règle.
4. B1 (série intemporelle, 3 seconds par semaine) : recommandé **oui**, en test de 2 semaines.
5. B3 (retour à ~30 s sur un épisode sur deux) : recommandé **oui**, en test d'une semaine.
6. C1 à C5 : lesquels t'intéressent.

Et de ton côté, sans attendre : A1 (les captures de TikTok Studio et YouTube Studio).
