# Ce qui marche (apprentissages)

Mis à jour chaque lundi par le skill `bilan`, à partir des chiffres Postiz. Lu par
`veille-ia` (choisir), `ecriture-matou` (écrire le hook) et `publication` (textes).

Deux statuts : **confirmé** (au moins 3 épisodes vont dans le même sens, épisodes cités)
et **hypothèse** (bonne pratique du format court, pas encore mesurée chez Matou). Une
ligne démentie est barrée, avec la date et les épisodes qui la démentent.

## Choisir le sujet

| Statut | Constat | Preuve |
| --- | --- | --- |
| Confirmé (02/11/2026) | Un nom que tout le monde connaît (ChatGPT, Google, Apple, Meta, WhatsApp, Instagram) attire plus qu'un nom de modèle ou de labo | #001, #004, #006, #007 (> 250 à 1 240 vues YouTube, > 120 Insta) battent #002 (105 vues YouTube) et #005 (229 vues YouTube) |
| Confirmé (02/11/2026) | Ce qui touche le quotidien (téléphone, travail, école, argent, vie privée) bat la performance technique | #004, #006, #007 battent #002 (105 vues), #003 (107 vues Insta) et #005 (229 vues) ; re-confirmé le 09/11/2026 par #014 (école, 859 vues YT, 13 likes TT) et #021 (ville, 813 vues YT) battant #016 (24 vues YT) et #018 (51 vues YT) |
| Confirmé (09/11/2026) | Les sujets corporate, RH ou de cuisine budgétaire interne sans impact direct sur l'utilisateur font les pires scores | #002 (105 vues YT), #015 (24 vues YT), #016 (24 vues YT) |
| Hypothèse | Une actu de moins de 24 h fait plus de vues que la même à 3 jours | — (toutes les actus traitées avaient < 48 h) |
| Hypothèse (rétrogradé le 09/11/2026) | Un chiffre surprenant ou un risque concret (sécurité, arnaque, emploi) fait commenter | Les preuves comptaient notre commentaire de sources (1 par post sur Instagram, Threads et LinkedIn). Commentaires du public seulement : #003 (1 TT), #007 (2 YT), #009 (2 TT), #010 (1 LI), #011 (2 IG, 1 TT), #014 (1 TH), mais aussi #005, #006, #012, #017 et #022 (`npm run bilan -- --local`). 17 commentaires du public en tout, sur 117 posts : trop peu pour conclure |

## Écrire (hook et rythme)

| Statut | Constat | Preuve |
| --- | --- | --- |
| Confirmé (09/11/2026) | La nouvelle trame visuelle sans carton de source, les cartes dynamiques avec bruitages et le débit TTS soutenu (~205 mots/min) font bondir la rétention sur YouTube Shorts | Pourcentage moyen de visionnage passé de 24,7 % à 69,2 % (+180 %) et durée moyenne de 8,4 s à 22,6 s sur le compte YouTube (#012 à #023) |
| Hypothèse (rétrogradé le 09/11/2026) | L'ouverture de montage « toi » (bénéfice ou menace directe pour le spectateur) surperforme les ouvertures descriptives « fenêtre » ou « chiffre » | Les totaux tous réseaux mélangeaient les créneaux (YouTube fait l'écart). À créneau égal, sur YouTube, « toi » a la meilleure médiane : 13 h #014 859, #022 122 ; 20 h #017 561, #021 813. Mais 2 posts par case, il en faudrait ~14 pour voir un effet ×4 |
| Hypothèse | Le hook se comprend sans le son, en moins de 2 s (gros titre à l'écran) | — (rétention à 2 s non fournie par Postiz, nécessite TikTok Studio) |
| Hypothèse | Une question ou une promesse précise retient mieux qu'un constat | — |

## Publier

| Statut | Constat | Preuve |
| --- | --- | --- |
| Confirmé pour YouTube seulement (corrigé le 09/11/2026) | Le soir est le bon créneau du Short YouTube ; pour Instagram et TikTok, l'heure ne change rien | YouTube : médiane 464 vues à 20 h contre 122 à 13 h (9 posts chacun, #015 compris : 24 vues à 20 h) ; le plus tardif des deux Shorts du jour gagne 7 jours sur 8. Instagram : 131 à 12 h, 127 à 18 h 30 ; TikTok : 254 à 12 h 30 et à 19 h. D'où le Short du principal à 18 h (`docs/decisions.md`, 09/11/2026) |
| Hypothèse | Une question en fin de description TikTok fait commenter | — (0 à 1 com sur TikTok, volume trop faible pour conclure) |
| ~~Confirmé (09/11/2026)~~ | ~~« Envoie-la à quelqu'un qui… » en fin de légende Instagram fait partager~~ | Démenti le 09/11/2026 : les partages de #014, #020 et #021 sont des partages **TikTok** (sans « Envoie-la »). Sur Instagram : 2 partages en 23 posts (#002, #009) |
| ~~Confirmé (09/11/2026)~~ | ~~Sur LinkedIn, le carrousel touche plus de monde que la vidéo et génère systématiquement des interactions~~ | Démenti le 09/11/2026 : le « 1 commentaire » de chaque carrousel est notre commentaire de sources (8 des 9 commentaires relevés). Commentaires du public : #010 (1), #002 (1). Reste à mesurer : les clics de la page (11 puis 52 par semaine) |
| Hypothèse | LinkedIn en semaine à 8 h 30, texte sans lien (source en commentaire) | Règle éditoriale respectée sur #003, #010, #011, #014, #016, #018, #024 |
| ~Hypothèse~ | ~Threads : un texte de prise de position fait plus répondre que la légende reprise de TikTok ; la relance (texte seul, quelques heures après) ajoute des réponses~ | Démenti pour les réponses le 02/11/2026 (#003, #005, #006, #007, #009 : 0 réponse sur les relances) |
| Hypothèse (rétrogradé le 09/11/2026) | Threads : la relance texte d'après-midi/soirée augmente fortement la portée et le nombre de vues (+50 % à +300 % par rapport au post vidéo) | La relance bat la vidéo du même épisode 11 fois sur 19 seulement : #007, #008, #014 (1 contre 51), #016 (0 contre 28), #017, #018, #019 et #020 vont dans l'autre sens. Médianes : relance 10 vues, vidéo 6. Toutes deux sous 75 vues |
| Confirmé (02/11/2026) | Un 2e épisode par jour ajoute des vues sans faire baisser celles de l'autre (rythme de production depuis le 30/10 ; matin + soir depuis le 31/10) | #005, #007, #009 (soir) vs #004, #006, #008 (midi) : aucune baisse sur TikTok, Instagram ou YouTube ; re-confirmé le 09/11/2026 |
| Confirmé pour YouTube seulement (corrigé le 09/11/2026) | Le second, produit l'après-midi avec l'actu du jour, fait plus de vues le soir qu'un épisode produit le matin | YouTube : médiane 464 (second, 9 posts) contre 122 (principal, 10 posts), mais #015 (second, 24 vues) et #014 (principal, 859) contredisent. Instagram (123 contre 122) et TikTok (254 contre 259) : aucun écart. Le rang et l'heure se confondent : le Short du principal à 18 h les séparera |
| Hypothèse (rétrogradé le 09/11/2026) | Sur Threads, le gabarit « pari » en vidéo et « horizon » en relance maximisent la visibilité | Les moyennes tenaient à un post chacune : #014 (51 vues, pari) et #022 (74 vues, horizon). Médianes : pari 15 (4 posts), horizon 20 (6). Sur Threads, il faut ~35 posts par gabarit pour voir un effet ×2 |
| Hypothèse (rétrogradé le 09/11/2026) | Sur YouTube Shorts, le gabarit de titre « pourquoi » surperforme nettement « nom-fait » et « chiffre » | 3 posts, et la moyenne tient à #014 (859 vues). À créneau égal, à 20 h : pourquoi 461 (1 post), nom-fait 382 à 752 (3), chiffre 24 à 813 (3). Il faut ~50 posts par gabarit pour voir un effet ×2 sur YouTube |
| Confirmé (09/11/2026) | TikTok reste verrouillé dans le palier initial des 250 vues pour un compte naissant sans base établie | 24 épisodes sur 24 (#000 à #023) sont entre 235 et 273 vues, seule l'interaction varie (#014 : 13 likes, 1 partage ; #020 : 2 partages) |
