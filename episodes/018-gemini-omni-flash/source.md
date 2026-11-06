# Source — Gemini Omni 1.2 Flash: Fast and cost-effective with longer clips

- URL : https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/
- Publié par : Google (Google DeepMind)
- Auteur : Anish Nangia (Product Manager, Google DeepMind)
- Date de publication : 2026-11-05
- Type : blog
- Statut : disponible — « Today, we’re rolling out Gemini Omni 1.2 Flash, and making it generally available across the Gemini API and Gemini for business. »
- Langue : en

## Fiche

### Faits
- Google lance Gemini Omni 1.2 Flash, son nouveau modèle de génération et d'édition vidéo par IA, axé sur la rapidité et la réduction des coûts.
- Le modèle devient disponible de manière générale (GA) sur l'API Gemini et Google Cloud (Gemini for business).
- La durée maximale des vidéos générées et éditées de manière native passe de 10 secondes (sur Omni 1.1) à 15 secondes.
- La durée peut être spécifiée par incréments d'une seconde, entre 3 et 15 secondes.
- Le prix de l'API est réduit de 30 % par rapport à Gemini Omni 1.1, à 0,07 $ par seconde de vidéo en résolution 720p.
- Le flux de travail permet de générer d'abord un brouillon rapide en 360p ou 720p, d'ajuster des détails par retouche conversationnelle au lieu de tout régénérer, puis d'augmenter la résolution (*upscale*) en 1080p ou 4K.
- L'édition conversationnelle multi-tours (*multi-turn*) permet de modifier un clip existant de 15 secondes étape par étape (remplacer un décor, un produit, changer l'éclairage, la météo ou le ratio d'aspect) sans repartir de zéro.
- Le respect des images et références sources (*reference adherence*) est renforcé : il est possible de combiner des images de personnages, d'objets, de styles, des clips de mouvement (jusqu'à 3 secondes) et des repères audio en conservant les détails intacts du début à la fin.
- La cohérence des visages, vêtements, typographies de packaging et couleurs de marque est maintenue sous différents angles de caméra et dans des mouvements à 360 degrés.
- La cohérence temporelle entre le premier et le dernier photogramme (*first-to-last frame consistency*) est améliorée, limitant le flottement visuel (*visual drift*) et les déformations involontaires (*morphing*).
- La génération de dialogues et de parole devient plus fluide, avec une meilleure synchronisation labiale (*lip-sync*) et la prise en charge de plusieurs interlocuteurs distincts conditionnés par des extraits vocaux d'une seconde.
- Les mouvements de caméra continus et complexes (vols en drone FPV, dézooms dramatiques, orbites) sont plus fluides et contrôlables, avec une réduction nette des coupes franches indésirables (*jump cuts*).
- Pour la première fois, Gemini Omni est accessible de façon générale avec l'infrastructure et la sécurité d'entreprise de Google Cloud, avec prise en charge du débit garanti (*Provisioned Throughput*).
- Les vidéos produites intègrent un filigrane numérique imperceptible SynthID pour certifier leur origine synthétique.
- Gemini Omni 1.2 Flash est déployé dans l'écosystème Google : accessible sans surcoût dans Google Vids (avec compte Google ou Workspace), dans Flow pour la mise en scène, dans Google Ads pour les campagnes publicitaires, et en cours de déploiement dans l'application Gemini pour les abonnés Google AI Ultra.
- Google indique poursuivre le développement pour améliorer les scènes d'action sportive rapide, les changements rapides de script et la gestion de la physique complexe.

### Chiffres
- 1.2 Flash — version du modèle Gemini Omni annoncé — « Today, we’re rolling out Gemini Omni 1.2 Flash »
- 15-second — durée maximale native de création et d'édition de vidéo — « Gemini Omni 1.2 Flash introduces native 15-second video creation »
- 10 seconds — durée maximale de génération sur le modèle précédent Gemini Omni 1.1 — « up from 10 seconds with Omni 1.1 »
- 30% — baisse de prix par rapport à la version Gemini Omni 1.1 — « We have dropped the price 30% from Gemini Omni 1.1 »
- $0.07 per second — tarif par seconde de vidéo générée en 720p sur l'API — « making it available at $0.07 per second for 720p video »
- 720p — résolution de référence pour le prix de base de 0,07 $/s et pour le brouillonnage — « making it available at $0.07 per second for 720p video »
- 360p or 720p — résolutions proposées pour le travail préparatoire rapide à bas coût — « you can draft fast at 360p or 720p »
- 1080p or 4K — résolutions d'export final après agrandissement — « then upscale your best creations to 1080p or 4K »
- one-second increments — granularité de sélection de la durée du clip — « specify duration in one-second increments from 3 to 15 seconds »
- 3 to 15 seconds — intervalle de durée de vidéo paramétrable par l'utilisateur — « from 3 to 15 seconds »
- up to three seconds — durée maximale des clips vidéo de mouvement utilisables comme référence — « short motion clips (up to three seconds) »
- one-second — durée des échantillons vocaux fournis en référence pour guider la voix d'un personnage — « four character, mouth, and one-second voice references »
- 4-shot — nombre de plans articulés dans l'exemple de vidéo explicative de 15 secondes — « Turns one style frame into a 4-shot, 15-second macro science explainer »
- 10-second — durée du plan continu de dézoom dramatique présenté en démonstration — « in one 10-second shot with natural scale and zero cuts »

### Citations utilisables (≤ 15 mots)
- « native 15-second video creation, multi-turn conversational editing capabilities » — Anish Nangia (Google DeepMind)
- « We have dropped the price 30% from Gemini Omni 1.1 » — Anish Nangia (Google DeepMind)
- « fix a detail with a follow-up edit instead of re-generating the entire clip » — Anish Nangia (Google DeepMind)
- « Gemini Omni is now generally available, backed by Google Cloud’s enterprise-grade infrastructure » — Anish Nangia (Google DeepMind)
- « generate 15-second clips at no additional cost in Google Vids » — Anish Nangia (Google DeepMind)

### Disponibilité
- **Qui** : Développeurs (API Gemini, Google AI Studio), entreprises (console Google Cloud), utilisateurs de Google Vids (titulaires d'un compte Google ou abonnement Workspace), annonceurs (Google Ads), créateurs (Flow) et abonnés payants à la formule Google AI Ultra (dans l'application Gemini).
- **Où** : API Gemini, Google AI Studio, Google Cloud Console, Google Vids, Flow, Google Ads, application mobile et web Gemini.
- **Quand** : Disponible dès le 5 novembre 2026 en disponibilité générale (GA) sur l'API et Google Cloud ; déploiement progressif en cours sur l'application Gemini pour les abonnés Ultra.
- **Prix** : 0,07 $ par seconde en 720p sur l'API (-30 % vs 1.1) ; inclus sans surcoût additionnel dans Google Vids ; inclus pour les abonnés Google AI Ultra ; options d'upscale 1080p/4K et tarification du Provisioned Throughput non détaillées.

### Zones floues
- **Tarification des résolutions supérieures et upscaling** : Le prix communiqué concerne uniquement la résolution 720p (0,07 $/s) ; le coût du passage en 1080p ou 4K ainsi que la facturation exacte des retouches multi-tours ne sont pas précisés dans l'article.
- **Temps de génération** : Aucun délai moyen de rendu ou débit de génération par seconde de vidéo n'est chiffré.
- **Accès grand public très restreint** : Dans l'application Gemini, la fonction est réservée aux abonnés de la formule la plus onéreuse (« Google AI Ultra ») en cours de déploiement, excluant l'accès gratuit ou intermédiaire (AI Pro).
- **Faiblesses physiques et dynamiques reconnues sans calendrier** : Google reconnaît que le modèle peine encore sur le sport rapide, les changements rapides de script et la physique complexe, sans date pour de futurs correctifs.
- **Conditions d'accès à l'outil Flow** : L'outil « Flow » est cité pour diriger des scènes et dialogues multi-personnages, mais son statut (bêta, public, sur invitation) n'est pas explicité.

## Texte de l'article

Gemini Omni 1.2 Flash: Fast and cost-effective with longer clips

Gemini Omni 1.2 Flash brings 15-second clips, stronger consistency, and faster, more cost-effective generation.

Anish Nangia
Product Manager, Google DeepMind

November 5, 2026

Today, we’re rolling out Gemini Omni 1.2 Flash, and making it generally available across the Gemini API and Gemini for business. Gemini Omni 1.2 Flash introduces native 15-second video creation, multi-turn conversational editing capabilities, and enhanced reference following. We have dropped the price 30% from Gemini Omni 1.1 making it available at $0.07 per second for 720p video.

Here’s an overview of what’s new:

Fast and cost-effective at scale

Beyond the lower price, the workflow keeps costs down: you can draft fast at 360p or 720p, fix a detail with a follow-up edit instead of re-generating the entire clip, and then upscale your best creations to 1080p or 4K.

Longer clips up to 15 seconds

You can now generate and edit videos natively up to 15 seconds long, up from 10 seconds with Omni 1.1. You can also specify duration in one-second increments from 3 to 15 seconds, giving you room to tell complete stories, create product explainers, or produce full social ad spots in a single generation.

Better reference adherence

You can guide generation combining character, product, or style images, short motion clips (up to three seconds), and audio cues — and Omni 1.2 Flash holds onto those details from start to finish. Faces, garments, packaging typography, and brand colors stay consistent across camera angles, making it easy to turn existing product photography or character sheets into virtual try-on clips, catalog spins, and branded video ads.

Combining one model photo with front-and-back product shots of three outfits, Gemini Omni 1.2 Flash generates a 15-second virtual try-on sequence across 360-degree turns and match cuts while keeping the model’s identity and each garment’s cut, drape, and back details consistent.

More consistent results

You can maintain stronger character, object, and scene consistency from the first to the last frame, with less visual drift or morphing across motion and camera transitions. Whether you’re interpolating between a first and last keyframe, or extending a clip to build a longer sequence, products, characters, props, and environments stay consistent from shot to shot.

Given the same static studio lighting exhibition poster and five-layer animation prompt, Gemini Omni 1.1 Flash does not match the reference image as closely as 1.2 does. Gemini Omni 1.2 Flash builds the poster sequentially layer by layer on the dusty-pink cyclorama rising the hexagonal plinth, assembling the ribbed glass, warm filament, faceted crystal, and coiled-cord letterforms for HALO, GLOW, and LUMEN, and locking every material, shadow, and typographic detail consistently through the final frame.

Easier editing in conversation

You can refine the same clip turn by turn — such as swapping a product or background, changing the lighting or weather, or switching the aspect ratio — instead of starting over from scratch. Multi-turn conversational editing works across full 15-second clips, making it easy to produce ad variants for different audiences and placements without re-briefing or re-generating.

Starting from one generated clip, multi-turn conversational prompts swap the background turn by turn — from a striped pavilion tent to an oak forest, a stable with a white horse, a market fair, and a stone castle — while keeping both characters’ performances, armor reflections, and camera framing intact.

More natural speech

You can generate scenes with more fluid, natural-sounding dialogue, clearer lip-sync, and distinct multi-speaker conditioning. This will show up whether you’re directing multi-character dialogue in Flow, creating video explainers in Gemini for business, or creating polished, pro videos with avatars, music and narration in Google Vids.

Conditioned on one conservatory scene image alongside four character, mouth, and one-second voice references, Gemini Omni 1.2 Flash routes each sampled voice to the right character with expressive lip-sync and natural comedic timing across a 15-second animated scene.

More controllable, cinematic look

You can direct complex, continuous camera movements like sweeping FPV flythroughs to dramatic zoom-outs and orbits with significantly fewer unwanted jump cuts, steadier scale, and a more polished, cinematic look.

Guided by two architectural reference photos, Gemini Omni 1.2 Flash directs one continuous FPV drone flight across the piazza, through the bronze doors, and up through the Pantheon’s coffered dome to the oculus with zero jump cuts.

Longer clips with smoother motion and tighter consistency

Gemini Omni 1.2 Flash generates clips up to 15 seconds long that hold references together better than before. You can scroll through to see characters, text, and camera moves stay consistent across longer shots, multiple turns and transitions with no cuts.

- 15 second long clips: Turns one style frame into a 4-shot, 15-second macro science explainer with accurately spelled, motion-tracked callouts.
- Multi-turn motion transfer: Generates a rippling octopus in Turn 1, then replaces it in Turn 2 with a dancer whose gown mirrors the exact fluid motion.
- First-to-last frame consistency (1.1 vs. 1.2): Connects an exterior start frame and interior end frame in one continuous camera push in 1.2 Flash. You can see subtle differences like the cats on the roof, the soup ladle turning into chopsticks, and some other minor changes.
- Unbroken crash zoom-out: Pulls continuously from a tight shoreline close-up to an aerial island vista in one 10-second shot with natural scale and zero cuts.

Real-world results, from creatives to global brands

Businesses, startups, and creatives are already using Gemini Omni 1.2 Flash in their workflows. And for the first time, Gemini Omni is now generally available, backed by Google Cloud’s enterprise-grade infrastructure and security. Provisioned Throughput is available, and outputs carry an imperceptible SynthID watermark.

Get started with Gemini Omni 1.2 Flash

While development is ongoing to further improve things like fast sports action, rapid script changes and complex physics, Gemini Omni 1.2 Flash is ideal for businesses, developers, and creators producing videos at scale. You can get started with Gemini Omni 1.2 Flash today as it rolls out across Google’s products and developer platforms:

- For developers using the Gemini API: Prototype in Google AI Studio, explore interactive starter apps, and check out the developer documentation and pricing.
- For businesses: Try it in the Google Cloud console, and build enterprise solutions with the API.
- For everyone using Google apps: Direct scenes and multi-turn edits in Flow, generate 15-second clips at no additional cost in Google Vids with a Google account or Google Workspace subscription, create 15-second videos in the Gemini app (rolling out to Google AI Ultra subscribers), and scale video campaigns in Google Ads.
