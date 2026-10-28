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
| 2026-10-28 | Voix (migration) | `voice.ts` passe d'OpenRouter à la **clé Google AI Studio** : même modèle `gemini-3.8-flash-tts` / Puck, style en directive « Speak in a… » (non prononcée, patron vérifié par transcription) ; minutage mots par `gemini-3-flash-preview` | Zéro dérive vocale (validée à l'oreille par l'utilisateur) ; une seule clé (`GEMINI_API_KEY`) pour tout le pipeline voix. Secours OpenRouter conservés si clé présente |
| 2026-10-28 | Branche | Le code et la mémoire des routines vivent sur **`main`** (les routines y poussent) | Choix de l'utilisateur |
| 2026-10-28 | Industrialisation | Skills `episode`, `ecriture-matou`, `publication`, `veille-ia` + sous-agents `documentaliste`, `verificateur-faits`, `spectateur`, `controleur-visuel` | Une recette unique et des relectures indépendantes à chaque épisode |
| 2026-10-28 | Harness (migration) | Passer de Claude Code à **Antigravity CLI (`agy`)** avec un modèle Gemini : skills et sous-agents copiés vers `.agents/`, contexte `AGENTS.md`, MCP Postiz installé chez agy. Modèle : **`gemini-3.8-flash-high`** (choix de l'utilisateur) | Utiliser l'abonnement Google AI Pro plutôt que l'abonnement Anthropic ; format de skills standard partagé, migration mécanique |
| 2026-10-28 | Accès Postiz (révision) | La **CLI `postiz`** (OAuth2 device flow, jeton dans `~/.postiz/credentials.json`) remplace la clé d'API et le MCP : `scripts/postiz.ts` et `scripts/bilan.ts` passent par la CLI (`lib/postiz-cli.ts`), `postiz upload` téléverse la vidéo | Option B de l'utilisateur : **zéro secret stocké** par nos soins. L'OAuth dynamique MCP est rejeté par Postiz (redirect_uri d'agy non vérifié) ; le device flow n'a pas de redirect_uri |

## À trancher

| Sujet | Options | Quand |
| --- | --- | --- |
| Fond « cahier » sur téléphone | Regarder la bande-annonce #000 sur un vrai téléphone | Pilote #001 |
| Pseudo `@matou.ai` | Réserver le pseudo sur chaque réseau (Threads reprend celui d'Instagram ; Bluesky : `matou-ai.bsky.social` ou un domaine) | Avant la publication |
| Durée et rémunération TikTok | Le programme Creator Rewards ne paie que les vidéos de plus d'une minute (selon des guides non officiels, à vérifier dans l'app) : nos vidéos de 30 s n'y entrent pas. Garder 30 s, ou faire des « décryptés » de plus de 60 s | Quand le compte approche des seuils (10 000 abonnés) |
