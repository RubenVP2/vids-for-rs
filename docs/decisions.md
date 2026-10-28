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
| 2026-10-28 | Mascotte | Matou : chat blanc dessiné à la main, grosses lunettes, doigt levé jaune ☝️ (à redessiner, voir `brand/references/`) | Lunettes = trait distinctif lisible en petit ; ☝️ = rituel « En fait… » |
| 2026-10-28 | Nom | Chaîne **Matou**, pseudo `@matou.ai` partout | La mascotte est la marque |
| 2026-10-28 | Service TTS | OpenRouter (`/api/v1/audio/speech`) + alignement local pour l'horodatage des mots | Choix de l'utilisateur ; couvre aussi le clonage de voix pour la V2 |
| 2026-10-28 | Durée par série | Flash ~30 s, Décrypté jusqu'à 45 s | Un article de blog demande un peu plus de place |

## À trancher

| Sujet | Options | Voir |
| --- | --- | --- |
| Qui parle ? | Matou parle (pressenti) · Un narrateur commente Matou | [brainstorm §6](brainstorm.md#6-la-mascotte--matou--direction-validée-dessin-à-faire) |
| Modèle et voix TTS | Comparer 4–5 voix françaises sur OpenRouter | [brainstorm §9](brainstorm.md#9-le-pipeline--1-session--1-vidéo-) |
| Détails de Matou | Croix sur le ventre, phrase de fin, couleur de fond | [brainstorm §11](brainstorm.md#11-questions-ouvertes) |
| Séries de lancement | Flash · Décrypté · Récap · Mot de l'IA | [brainstorm §3](brainstorm.md#3-formats-séries) |
| Moteur vidéo | Remotion (pressenti) · Motion Canvas · FFmpeg | [brainstorm §9](brainstorm.md#9-le-pipeline--1-session--1-vidéo-) |
