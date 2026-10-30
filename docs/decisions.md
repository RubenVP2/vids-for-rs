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
| 2026-10-28 | Budget recalé | Flash 75–92 mots prononcés, décrypté 100–118 (ATTENTION au-delà) | Sur #001, Puck a lu à 2,8 mots/s (3,5 sur #000) : trois prises pour passer sous 36 s |
| 2026-10-28 | Diffusion | Postiz : le script crée des **brouillons** sur TikTok, Instagram et YouTube ; ils ne partent qu'après le feu vert de l'utilisateur (`--programmer` ou dans Postiz). Skill officiel `gitroomhq/postiz-agent` copié dans `.claude/skills/postiz/` | Garde la relecture humaine ; les plugins ne se chargent pas en session cloud, les skills versionnés si |
| 2026-10-28 | Plateformes (révision) | Maximiser la diffusion : TikTok, Reels et Shorts restent prioritaires ; relais de la même vidéo sur Facebook, Threads, X et Bluesky. Postiz en abonnement cloud (comptes connectés dans Postiz, une seule clé API pour le script) | Une vidéo coûte la même chose sur 7 réseaux ; un seul texte en plus par épisode (`## Court`) ; pas d'application développeur à créer par réseau |
| 2026-10-28 | Postiz | Abonnement cloud, formule **Standard (5 canaux)**, branché à Claude par le **MCP Postiz** (pas de clé d'API) | Choix de l'utilisateur : configuration la plus courte. Le MCP ne lit pas les fichiers de la session : l'utilisateur dépose la vidéo dans la médiathèque Postiz |
| 2026-10-28 | Postiz : accès | Clé d'API dans la variable `POSTIZ_ENV` ; le MCP reste branché | La clé permet au script de téléverser la vidéo lui-même (le MCP ne lit pas les fichiers de la session) |
| 2026-10-28 | Mention « fait avec l'IA » | Gardée sur TikTok et X (`brand/postiz.json`) | Voix de synthèse : éviter les sanctions et les bannissements |
| 2026-10-28 | Réseaux visés | **TikTok, Instagram Reels, YouTube Shorts, Threads** : les 4 comptes connectés à Postiz. Le 5e canal reste à choisir par l'utilisateur | Choix de l'utilisateur : concentrer l'effort sur ce qui est branché |
| 2026-10-28 | Routines | Tâches planifiées : `episode-du-jour` chaque matin (veille → épisode → brouillons Postiz), rappel de relecture l'après-midi, `bilan` le lundi. Elles poussent sur la branche par défaut | « Le plus autonome possible » : seule la relecture des brouillons reste humaine (règle éditoriale) ; la branche par défaut porte la mémoire (numéros, sujets traités, apprentissages) |
| 2026-10-28 | Choix des sujets | Note sur 12 (impact grand public, potentiel de trafic, concret, explicable en 30 s), seuil 8 ; sinon la réserve `docs/sujets.md`. Le bilan du lundi met à jour `docs/apprentissages.md` à partir des chiffres | Des news qui ont du sens et font du trafic, et un choix qui apprend des vues réelles |
| 2026-10-28 | Garde-fou | Plus de 2 épisodes en attente de relecture : la routine ne produit pas | Ne pas empiler des vidéos que personne ne relit |
| 2026-10-28 | Lancement | La bande-annonce #000 ouvre la chaîne le 28/10 à 18 h, #001 suit le 29/10 à 8 h (programmés sur les 4 réseaux) | Choix de l'utilisateur : Matou se présente avant le premier épisode |
| 2026-10-28 | 5e canal | **Page LinkedIn « Matou AI »** connectée à Postiz (texte d'Instagram). #000 et #002, déjà partis ailleurs, rattrapés le soir même (`--reseaux linkedin`) | Choix de l'utilisateur |
| 2026-10-28 | Branche | Le code et la mémoire des routines vivent sur **`main`** (les routines y poussent) | Choix de l'utilisateur |
| 2026-10-28 | Industrialisation | Skills `episode`, `ecriture-matou`, `publication`, `veille-ia` + sous-agents `documentaliste`, `verificateur-faits`, `spectateur`, `controleur-visuel` | Une recette unique et des relectures indépendantes à chaque épisode |
| 2026-10-29 | Harnais des routines | Les routines quittent les routines cloud Claude pour le **Raspberry Pi** : Hermes (cron) → `scripts/routines/lancer.sh` → **`agy`** (Gemini). Skills et sous-agents restent dans `.claude/`, lus par agy via `.agents/skills.json` et des liens (pas de copie) | Choix de l'utilisateur. Une seule copie des skills : pas de dérive entre les deux harnais |
| 2026-10-29 | Accès Postiz | **CLI `postiz`** (OAuth device flow sur le Pi, ou `POSTIZ_API_KEY`/`POSTIZ_ENV`) pour `npm run postiz` et `npm run bilan` ; le MCP n'est plus utilisé | Aucune clé stockée sur le Pi ; la même CLI marche avec une clé ailleurs |
| 2026-10-29 | Voix (inchangée) | La voix reste **OpenRouter** (Gemini 3.8 Flash TTS / Puck + Whisper). L'essai d'Hermes en API Gemini directe (quota gratuit 10 req./jour, consigne de style prononcée, minutage deviné par un LLM) est abandonné | La voix validée à l'oreille ne change pas ; Whisper donne un vrai minutage des mots |
| 2026-10-29 | Effort d'agy | **high**, imposé : `--effort high` et variantes `-high` des modèles dans `lancer.sh`, modèle par défaut `-high` dans les réglages d'agy du Pi | Choix de l'utilisateur : la qualité prime sur le quota |
| 2026-10-29 | Un post taillé par réseau | Texte propre à chaque réseau ; LinkedIn en **carrousel** (diapos tirées des scènes), sans lien, en semaine 8 h 30, un par jour ouvré ; Threads : vidéo à 9 h + relance texte à 19 h 30 ; vidéos le soir (Instagram 18 h 30, TikTok 19 h, YouTube 20 h) ; toujours 1 épisode par jour | Demande de l'utilisateur (viralité par réseau) ; étude et sources : `docs/reseaux.md` |
| 2026-10-30 | Passage en production : rythme | **2 épisodes par jour** (remplace « 1 vidéo par jour » du 2026-10-28) : le **principal** (meilleur sujet, partout, créneaux du soir + LinkedIn et Threads le matin) et le **second** (sujet suivant, le midi sur TikTok 12 h 30, YouTube 13 h, Threads 12 h). Instagram et LinkedIn gardent 1 post par jour | Choix de l'utilisateur (fin du POC). TikTok, Shorts et Threads récompensent le volume ; Instagram et LinkedIn se cannibalisent au-delà d'un post par jour |
| 2026-10-30 | Passage en production : relecture | **Programmation automatique avec droit de veto** (remplace « l'utilisateur relit toujours avant publication ») : le lanceur programme si l'agent dit `PROGRAMMER: oui` (faits vérifiés sans réserve, source solide, statut affiché) et si `npm run check` passe ; sinon brouillons. Veto jusqu'à l'heure du post : Postiz, « veto #NNN », ou `--annuler`. Au moins 2 h entre l'envoi et le premier post | Choix de l'utilisateur : la relecture devient le goulot à 2 épisodes par jour ; les garde-fous automatiques gardent les règles éditoriales |
| 2026-10-30 | Contexte des agents | **`AGENTS.md` est la source unique** du contexte (un vrai fichier, plus un lien) ; `CLAUDE.md` l'importe (`@AGENTS.md`). Skills et sous-agents restent dans `.claude/` au format standard (`name` = nom du dossier, `description` avec « À utiliser quand… »), corps sans outil propre à un harnais | Demande de l'utilisateur : une convention commune à Claude Code et agy ; un lien symbolique casse sur une copie Windows |
| 2026-10-30 | Le second va partout | Le **second** est décliné comme le principal sur tous les réseaux sauf LinkedIn : Instagram 12 h, Threads 12 h + relance 15 h 30, TikTok 12 h 30, YouTube 13 h (remplace « le midi sur TikTok, YouTube et Threads seulement »). Un épisode = un sujet, le même sur tous ses réseaux | Choix de l'utilisateur : chaque sujet doit être présent partout, au format de chaque réseau ; LinkedIn reste à 1 post par jour ouvré |
| 2026-10-30 | Repli Claude Code | Si agy échoue avec tous ses modèles (quota, panne), le lanceur confie la routine à **Claude Code** (`claude -p`, mêmes skills, même `AGENTS.md`) | Demande de l'utilisateur : le 30/10, les quotas agy ont fait tomber le second |
| 2026-10-30 | Versionnement des épisodes | Dans git : tout ce qui refait la vidéo à l'identique (`source.md`, `scenes.json`, `voix.mp3`, `timings.json`, textes et état Postiz). Hors git : `rendu/` et `controle/` (gardés 30 jours sur le Pi). Voix en MP3 mono 96 kbit/s (au lieu de 192) ; pas de Git LFS. Les routines committent directement sur `main` (pas de branche ni de merge), et un push raté 3 fois part sur une branche `secours/…` | La voix est payante et jamais deux fois la même : elle doit rester dans git. 96 kbit/s suffit pour une voix et divise le poids par deux (~270 Mo par an à 2 épisodes par jour). LFS limite le trafic gratuit à 1 Go par mois, que le clone du Pi consommerait. Un seul auteur sur `main` : une branche par épisode n'apporterait qu'un merge de plus à rater |

## À trancher

| Sujet | Options | Quand |
| --- | --- | --- |
| Fond « cahier » sur téléphone | Regarder la bande-annonce #000 sur un vrai téléphone | Pilote #001 |
| Pseudo `@matou.ai` | Réserver le pseudo sur chaque réseau (Threads reprend celui d'Instagram ; Bluesky : `matou-ai.bsky.social` ou un domaine) | Avant la publication |
| Durée et rémunération TikTok | Le programme Creator Rewards ne paie que les vidéos de plus d'une minute (selon des guides non officiels, à vérifier dans l'app) : nos vidéos de 30 s n'y entrent pas. Garder 30 s, ou faire des « décryptés » de plus de 60 s | Quand le compte approche des seuils (10 000 abonnés) |
