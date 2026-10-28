# Journal des décisions

Chaque décision validée avec l'utilisateur est consignée ici : date, choix, raison.
Les options explorées sont dans [`brainstorm.md`](brainstorm.md).

## Décisions prises

| Date | Sujet | Décision | Raison |
| --- | --- | --- | --- |
| 2026-10-28 | Thème | Vidéos d'information sur l'IA : news + articles de blog des grandes entreprises | Objectif de départ du projet |
| 2026-10-28 | Cohérence | Un design system commun à toutes les vidéos, avec une mascotte | Reconnaissance et fidélisation |
| 2026-10-28 | Production | Cible : une session Claude = une vidéo (vidéo + description + hashtags) | Pouvoir publier régulièrement sans effort de montage |
| 2026-10-28 | Audience | Grand public + pros hors tech | Le public le plus large et le moins bien servi par les comptes actuels |
| 2026-10-28 | Plateformes | TikTok, Instagram Reels, YouTube Shorts. Pas de LinkedIn | Un seul format vertical pour les trois |
| 2026-10-28 | Langue | Français uniquement | — |
| 2026-10-28 | Voix | V1 : synthèse vocale (TTS). V2 : la voix de l'utilisateur | Démarrer vite et 100 % automatisé, humaniser ensuite |
| 2026-10-28 | Présence à l'écran | L'utilisateur n'apparaît jamais : seulement la voix et la mascotte | Choix personnel ; la mascotte porte l'identité |
| 2026-10-28 | Ton | Pédagogie grand public avant tout, avec une touche de fun | Informer d'abord |
| 2026-10-28 | Rythme | 1 vidéo par jour, au minimum 1 tous les 2 jours | Régularité = algorithme + habitude chez les viewers |
| 2026-10-28 | Inspiration | Fireship (YouTube), adapté au format court des réseaux | Densité, rythme, humour pince-sans-rire, jamais de visage |
| 2026-10-28 | Durée | Format standard d'environ 30 secondes | Version « réseaux sociaux » du concept Fireship |
| 2026-10-28 | Mascotte | Matou : chat blanc dessiné à la main, grosses lunettes, doigt levé jaune ☝️, croix grise sur le ventre (« cicatrice de bug ») | Lunettes = trait distinctif lisible en petit ; ☝️ = rituel « En fait… » |
| 2026-10-28 | Droits du dessin | Dessin original de l'utilisateur : on le vectorise fidèlement. La main ☝️ est redessinée si c'est l'emoji d'Apple | L'utilisateur est l'auteur |
| 2026-10-28 | Nom | Chaîne **Matou**, pseudo `@matou.ai` partout | La mascotte est la marque |
| 2026-10-28 | Service TTS | OpenRouter (`/api/v1/audio/speech`) + alignement local pour l'horodatage des mots | Choix de l'utilisateur ; couvre aussi le clonage de voix pour la V2 |
| 2026-10-28 | Durée par série | Flash ~30 s, Décrypté jusqu'à 45 s | Un article de blog demande un peu plus de place |
| 2026-10-28 | Qui parle | Matou lui-même, voix masculine | La voix est Matou ; en V2, la voix de l'utilisateur devient la sienne |
| 2026-10-28 | Phrases signatures | « ☝️ En fait… » pour lancer l'explication ; « C'était Matou, et c'est tout. » pour finir | Rituel reconnaissable |
| 2026-10-28 | Fond | Papier crème quadrillé façon cahier d'écolier, jaune utilisé comme surligneur (choix de Claude, à valider sur maquette) | Raconte la pédagogie, cohérent avec le trait fait main, se démarque des comptes IA sombres |
| 2026-10-28 | Séries de lancement | Flash (~30 s) + Décrypté (≤ 45 s). Récap et Mot de l'IA plus tard | Roder le pipeline sur un seul squelette |
| 2026-10-28 | Moteur vidéo | Remotion (licence gratuite pour un particulier ou une structure ≤ 3 personnes). Plan B : HyperFrames | Mature, outils intégrés pour les sous-titres mot par mot et l'alignement local (whisper.cpp), scènes typées et validées |
| 2026-10-28 | Voix de Matou (V1) | Gemini 3.8 Flash TTS, voix « Puck », avec une consigne de jeu (complice, pince-sans-rire). Secours : MAI « Marc », ElevenLabs « Brian » | Meilleure note d'un casting de 11 voix masculines (accent natif, naturel, ton du personnage). Validée à l'oreille par l'utilisateur sur la bande-annonce #000 (« j'aime trop »). Extraits : `brand/voix/essais/` |
| 2026-10-28 | Minutage des mots | Transcription horodatée (Whisper large v3 via OpenRouter) + alignement sur le script, au lieu de whisper.cpp en local | Même résultat sans compiler d'outil à chaque session ; le script garde son orthographe |
| 2026-10-28 | Typographies | Permanent Marker (titres) + Shantell Sans (texte, sous-titres) | Esprit feutre et écriture à la main, très lisibles, accents français complets, licences libres |
| 2026-10-28 | Zones de sécurité | 220 px en haut, 420 px en bas, 150 px à droite, 72 px à gauche | Commun à TikTok, Reels et Shorts |
| 2026-10-28 | Icônes | Icônes dessinées maison au feutre, pas d'emoji à l'écran | Style homogène, aucun droit tiers |
| 2026-10-28 | Son | Bruitages synthétisés maison, signature « Ma-tou ! » en 3 notes de marimba, musique de fond générée (Lyria) à 7 % | Identité sonore propre et sans droits tiers |
| 2026-10-28 | Épisode #000 | Bande-annonce de la chaîne (Matou se présente) ; le pilote sur un vrai article devient #001 | Sert de test du moteur et peut ouvrir la chaîne |
| 2026-10-28 | Durée réelle | ~3,4 mots/s : flash = 80–105 mots, décrypté = 110–145 mots | Mesuré sur la voix choisie (le budget de 75–85 mots donnait ~25 s) |
| 2026-10-28 | Industrialisation | Skills `episode`, `ecriture-matou`, `publication`, `veille-ia` + sous-agents `documentaliste`, `verificateur-faits`, `spectateur`, `controleur-visuel` | Une recette unique et des relectures indépendantes à chaque épisode |

## À trancher

| Sujet | Options | Quand |
| --- | --- | --- |
| Fond « cahier » sur téléphone | Regarder la bande-annonce #000 sur un vrai téléphone | Pilote #001 |
| Pseudo `@matou.ai` | Réserver le pseudo sur TikTok, Instagram et YouTube | Avant la publication |
