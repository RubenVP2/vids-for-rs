# Source — Gemini 4 Carbon is now available

- URL : https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/ (redirection depuis https://deepmind.google/blog/gemini-4-carbon-is-now-available/)
- Publié par : Google (The Keyword / Google DeepMind)
- Auteur : Koray Kavukcuoglu (SVP, Google DeepMind and Chief AI Architect, Google)
- Date de publication : 2026-11-10
- Type : blog
- Statut : disponible — « Today, we’re making Gemini 4 Carbon available to developers, enterprises, scientists, and consumers. » (Disponible immédiatement via API payante dans AI Studio / Android Studio, dans Gemini for business / Antigravity / CodeMender pour entreprises, et pour les abonnés payants Google AI Ultra dans l'application Gemini, Antigravity et AI Mode in Search ; accès gratuit 6 mois pour scientifiques sur sélection ; accès cyberdéfense sur sélection Fairwind).
- Langue : en

## Fiche

### Faits
- Google déploie et rend disponible publiquement son modèle de pointe Gemini 4 Carbon auprès des développeurs, des entreprises, des scientifiques et des particuliers (abonnés Ultra).
- Carbon est qualifié par Google de modèle le plus puissant de l'entreprise (« our strongest model »), offrant des performances de frontière en cybersécurité et sur les flux de travail agentiques de longue durée (travail intellectuel complexe, génie logiciel, raisonnement scientifique).
- Le modèle avait été initialement mis à disposition deux semaines plus tôt auprès d'un cercle restreint de cyberdéfenseurs via le programme Fairwind.
- Carbon repousse les frontières par rapport à Gemini 4 Argon, récemment lancé ; Argon reste le choix recommandé par Google pour la majorité des développements et du travail de connaissances, tandis que Carbon cible les tâches poussant l'intelligence du modèle à ses limites (débogage et codage multi-étapes, recherche scientifique ouverte).
- Pour approfondir le raisonnement et exécuter des boucles de vérification étendues, Carbon utilise un volume de jetons (tokens) supérieur à celui d'Argon.
- Carbon se positionne au 1er rang des bancs d'essai indépendants de travail en conditions réelles CursorBench 4.0, Perplexity WANDR et Zapier AutomationBench, avec un coût par tâche annoncé comme deux fois inférieur au meilleur modèle concurrent externe.
- Google lance en préversion l'outil « /swarm » dans Google Antigravity, permettant à partir d'une consigne unique de piloter une équipe d'agents coordonnée en temps réel (Carbon y assurant les rôles exigeant le raisonnement le plus poussé comme l'architecture, la coordination ou l'audit, assisté par des modèles plus légers et des vérificateurs contradictoires).
- En travail de bureau et analyse documentaire, Google s'est associé à Artificial Analysis pour concevoir le benchmark Multimodal Knowledge Agent (MKA), testant le traitement agentique de documents denses mêlant tableaux, graphiques, plans et schémas ; Carbon s'y classe 2e avec un coût moyen 6 fois moindre que le modèle en tête.
- Démonstrations agentiques réalisées avec /swarm :
  - Reconstruction 3D Three.js interactive de la construction de la Tour Eiffel (1887–1889) à partir de photos historiques et de planches techniques en un seul prompt.
  - Modélisation 3D Three.js de 906 000 triangles du bâtiment « Platform 37 » de Google à partir de 7 PDF d'urbanisme municipaux (206 dessins techniques) en un seul prompt et 10 boucles nocturnes.
  - Visualiseur textile interactif multi-échelles modélisant un cadre d'éléments finis pour fibres virtuelles avec maillage 3D de fil et suivi polaire de 110 fibres à partir d'un article scientifique.
- En finance, Carbon égale le meilleur modèle testé sur l'évaluation Hebbia E2E Financial Agentic et termine premier parmi 23 configurations de pointe sur le benchmark General Financial Intelligence de Balyasny Asset Management (expertise légale, exécution d'outils agentiques, code, analyse de données, compréhension contextuelle).
- En développement logiciel et conception 3D/UI, Carbon gère des boucles complètes de compilation-vérification, de récupération d'erreurs et d'inspection visuelle du code et de l'interface rendue.
- Démonstrations créatives et logicielles :
  - Création d'un jeu 3D en monde ouvert sous Three.js explorant le campus Google de Mountain View incarné par un pélican à vélo GBike (modélisation 3D Blender issue de références Omni et Nano Banana, shaders WebGL, effets Web Audio procéduraux et bande-son Lyria).
  - Refonte complète de la boutique Google Merchandise Store en 2 prompts, incluant 5 concepts artistiques et des visuels produits générés avec Nano Banana 2.1.
  - Scène cinématographique de l'Atlantide sous-marine conçue dans Blender (ruines procédurales, caustiques volumétriques, simulation de fluide) puis transposée dans Three.js à partir d'une vidéo Gemini Omni.
  - Modélisation jouable d'un pianoforte Stein-Schule (vers 1780) avec physique d'échappement à 61 touches d'après des radiographies et plans CAD, intégré dans la salle Koerner Hall à Toronto avec acoustique spatiale personnalisée selon le siège.
- En cybersécurité, Carbon prend la tête des benchmarks d'identification de failles (SEC-bench Pro), d'exploitation (ExploitGym) et de correction (CWE-bench v1).
- Dans le cadre de Project Fortify (système autonome de Google pour le scan, le triage et la remédiation), Carbon atteint 100 % de rappel en détection et 95 % de précision en triage sur benchmark interne, avec un gain relatif de rappel de plus de 25 % sur dépôts open source par rapport à Argon.
- L'équipe Cloud Vulnerability Research (CVR) de Google a utilisé Carbon pour démontrer l'exploitabilité de deux bugs dans un logiciel open source réputé (gravité équivalente à PHP2Shell), incitant les mainteneurs à les requalifier en critiques et à diffuser un correctif immédiat.
- Dans l'initiative « Scan for Good » de Wiz, Carbon a identifié des vulnérabilités zero-day chez deux fournisseurs majeurs de logiciels SaaS en moins de deux heures.
- En recherche scientifique et raisonnement mathématique :
  - L'entreprise de toxicologie pharmaceutique Axiom Bio adopte Carbon et Argon en production après que Carbon a mis en lumière de nouveaux mécanismes de toxicité inédits.
  - Des chercheurs de Google ont conçu « AlphaProof Code » (cadre de vérification formelle) : Carbon a généré des millions de lignes de code en langage Lean pour démontrer mathématiquement les propriétés du protocole cryptographique de Signal en quelques semaines, remplaçant des années d'expertise humaine.
  - En laboratoire d'enzymologie, Carbon a analysé des carnets de laboratoire et données brutes pour diagnostiquer des anomalies expérimentales subtiles (mélange automatisé incomplet dans des microplaques, report de traces d'échantillons).
  - En biologie computationnelle (AlphaFold), des agents Carbon ont permis de multiplier par 40 en moyenne la détection d'homologues lointains dans des bases péta-octets pour 7 familles de protéines orphelines du banc CASP17, sans nécessiter de réentraînement de modèle.
- Programme scientifique gratuit : Google étend à Carbon l'accès gratuit pendant six mois sur Antigravity initialement ouvert à 10 000 chercheurs (Argon), avec intégration continue sur sélection.
- Sécurité et alignement :
  - Face à un agent de red-teaming adaptatif sur ExploitBench et CyScenarioBench, Carbon neutralise 99 % des trajectoires d'attaque, abaissant le taux de compromission par essai à 0,8 % (contre 3,1 % sur Argon).
  - Taux de réussite des requêtes d'attaque automatisées réduit à 2,17 % lors des tests de Gray Swan (contre 9,86 % pour Argon).
  - Aucune vulnérabilité de jailbreak universel découverte par le cabinet externe Trajectory Labs après 132 heures et plus de 13 000 requêtes.
  - Sur le benchmark d'honnêteté agentique (375 tâches), Carbon atteint 92 % de réussite (contre 70 % pour Argon), refusant d'extrapoler ou falsifier des données absentes dans 98 % des cas et pointant des biais méthodologiques dans 68 % des cas.
  - Taux de succès d'attaque par injection de prompt indirecte maintenu à 0 % sur le benchmark Gray Swan IPI.
- Tarification et modalités d'accès :
  - Développeurs : API payante dans Google AI Studio et Android Studio. Prix d'introduction égal à celui d'Argon (2 $ par million de tokens d'entrée, 10 $ par million de tokens de sortie) jusqu'au 30 novembre 2026. Plein tarif fixé à 4 $ / million d'entrée et 20 $ / million de sortie dès le 1er décembre 2026.
  - Entreprises : Gemini for business (API ou menu), Google Antigravity, CodeMender.
  - Particuliers : application Gemini et mode IA dans la recherche Google, sous réserve d'un abonnement payant Google AI Ultra.
  - Chercheurs : candidatures ouvertes pour accès sans frais de 6 mois dans Antigravity.
  - Cyberdéfenseurs : accès sur dossier via le programme Fairwind.

### Chiffres
- Two weeks ago — Ancienneté de la mise à disposition restreinte de Carbon aux défenseurs en cybersécurité via Fairwind — « Two weeks ago , we released Carbon to a set of cybersecurity defenders via our Fairwind Program . »
- #1 — Classement de Carbon sur CursorBench 4.0, Perplexity WANDR et Zapier AutomationBench — « It ranks #1 on CursorBench 4.0 , Perplexity’s WANDR , and Zapier’s AutomationBench »
- 4.0 — Numéro de version du benchmark CursorBench — « CursorBench 4.0 »
- > 2X (more than 2X) — Facteur de réduction du coût par tâche de Carbon par rapport au meilleur modèle externe concurrent — « at more than 2X lower cost per task compared to the next best external model. »
- $2 — Tarif promotionnel d'entrée via l'API par million de tokens (identique à Argon) — « ($2 per million input tokens and $10 per million output tokens) »
- $10 — Tarif promotionnel de sortie via l'API par million de tokens (identique à Argon) — « ($2 per million input tokens and $10 per million output tokens) »
- November 30, 2026 — Date de fin de la tarification d'introduction — « After the introductory period expires on November 30, 2026 »
- $4 — Tarif standard d'entrée par million de tokens à partir du 1er décembre 2026 — « the price of $4 per 1M input tokens and $20 per 1M output tokens will apply. »
- $20 — Tarif standard de sortie par million de tokens à partir du 1er décembre 2026 — « the price of $4 per 1M input tokens and $20 per 1M output tokens will apply. »
- #2 — Classement de Carbon sur le benchmark Multimodal Knowledge Agent (MKA) — « Carbon ranks #2 while being more than 6X lower in average cost per task compared to the top performing model. »
- > 6X (more than 6X) — Facteur d'économie de coût moyen par tâche de Carbon par rapport au premier sur MKA — « while being more than 6X lower in average cost per task compared to the top performing model. »
- 1887–1889 — Période historique de construction de la Tour Eiffel reconstituée en Three.js — « Eiffel Tower's 1887–1889 construction from a single prompt. »
- 7 — Nombre de documents PDF d'urbanisme fournis pour modéliser le bâtiment Platform 37 — « With seven public City Council planning PDFs »
- 206 — Nombre de vues de dessins techniques extraites des PDF — « (206 extracted engineering drawing views) »
- 906K — Nombre de polygones (triangles) du modèle 3D Three.js de Platform 37 généré — « interactive 906K-triangle Three.js reconstruction of Google’s Platform 37 office »
- 10 — Nombre de boucles nocturnes exécutées par l'équipe d'agents pour achever Platform 37 — « across 10 overnight loops. »
- 110 — Nombre de fibres textiles suivies en coordonnées polaires dans la modélisation — « 110-fiber polar tracking »
- 23 — Nombre de configurations de modèles de pointe comparées sur le benchmark financier de Balyasny — « ranked at the top out of 23 frontier model configurations on Balyasny Asset Management’s General Financial Intelligence benchmark »
- 2 — Nombre de prompts requis pour reconcevoir le site Google Merchandise Store — « reimagined the Google Merchandise Store in two prompts »
- 5 — Nombre de directions artistiques formulées pour la boutique — « proposing five art direction concepts »
- 2.1 — Version du modèle visuel Nano Banana utilisé pour l'imagerie produit — « with Nano Banana 2.1 »
- c. 1780 — Date historique estimée du pianoforte Stein-Schule reconstitué — « playable c. 1780 Stein-Schule fortepiano »
- 61-key — Nombre de touches avec mécanisme physique d'échappement modélisé — « 61-key escapement physics »
- v1 — Version du benchmark de correctifs de vulnérabilités CWE-bench — « CWE-bench v1 »
- 100% — Taux de rappel en détection de vulnérabilités dans Project Fortify — « Carbon hit 100% recall on scanning »
- 95% — Taux de précision en triage de vulnérabilités dans Project Fortify — « and 95% precision on triage, on our internal benchmark. »
- > 25% (over 25%) — Progression relative du taux de rappel sur les dépôts de code open source par rapport à Argon — « over 25% relative improvement on Argon's already strong recall rate »
- 2 — Nombre de vulnérabilités critiques prouvées exploitables dans un logiciel open source par Google CVR — « prove that two bugs in a popular open-source software were in fact exploitable vulnerabilities »
- < 2 hours (under two hours) — Durée nécessaire à Carbon pour découvrir des vulnérabilités zero-day chez deux éditeurs SaaS — « uncovered 0-day vulnerabilities in under two hours »
- millions — Lignes de code formel en langage Lean générées pour valider le protocole Signal — « generate millions of lines of code in Lean »
- weeks — Délai de validation formelle du code de Signal permis par Carbon (contre plusieurs années requises d'ordinaire) — « prove key security properties in weeks — a task that historically takes expert teams years. »
- 7 — Nombre de familles de protéines à faible homologie analysées dans le test à l'aveugle CASP17 — « across 7 low-homolog protein families from the CASP17 blind test set »
- 17 — Édition de la compétition CASP (CASP17) — « CASP17 blind test set »
- 40-fold — Multiplicateur moyen du volume d'homologues lointains identifiés par Carbon — « increased the number of homologs retrieved by 40-fold on average »
- Four weeks ago — Ancienneté du lancement de l'offre d'accès gratuit pour 10 000 chercheurs — « Four weeks ago, we opened applications to give 10,000 scientists access »
- 10,000 — Nombre de scientifiques ciblés par le programme d'accès gratuit de 6 mois — « to give 10,000 scientists access to Argon in Google Antigravity free of charge for six months »
- six months — Durée de la gratuité accordée aux scientifiques — « free of charge for six months »
- thousands — Nombre de chercheurs déjà acceptés et formés sur la plateforme — « we’ve onboarded thousands of scientists already. »
- 99% — Part des trajectoires de cyberattaque neutralisées face à l'agent d'intrusion adaptatif — « Carbon blocked 99% of attack trajectories from our adaptive red-teaming agent »
- 0.8% — Taux d'intrusion résiduel par tentative obtenu avec les garde-fous de Carbon — « lowered the per-attempt breach rate to just 0.8% »
- 3.1% — Taux d'intrusion résiduel constaté sur Argon — « (down from 3.1% on Argon) »
- 2.17% — Taux de succès des cyberattaques automatisées sur Carbon dans l'évaluation Gray Swan — « automated cyberattack query success rate to 2.17% in Gray Swan’s testing »
- 9.86% — Taux de succès des cyberattaques automatisées sur Argon dans l'évaluation Gray Swan — « compared to 9.86% on Argon »
- 0 — Nombre de jailbreaks universels identifiés par Trajectory Labs — « found zero new universal jailbreaks »
- 132 hours — Temps d'audit cumulé par Trajectory Labs — « across 132 hours »
- > 13,000 (over 13,000) — Nombre de requêtes malveillantes injectées lors du test Trajectory Labs — « and over 13,000 requests. »
- 375 — Nombre de scénarios du banc d'évaluation d'honnêteté des agents — « on our 375-task agentic honesty benchmark »
- 92% — Pourcentage de réussite de Carbon au test d'honnêteté agentique — « it passed 92% of tasks »
- 70% — Pourcentage de réussite d'Argon au test d'honnêteté agentique — « (compared to 70% for Argon) »
- 98% — Fréquence à laquelle Carbon refuse d'inventer des données de laboratoire manquantes — « declining to fill in missing experimental data 98% of the time »
- 68% — Fréquence à laquelle Carbon dénonce spontanément des failles méthodologiques — « and flagging methodological flaws 68% of the time. »
- 0% — Taux de réussite des attaques par injection de prompt indirecte sur le benchmark Gray Swan IPI — « achieved a 0% prompt injection attack success rate on the Gray Swan IPI benchmark »

### Citations utilisables (≤ 15 mots)
- « Carbon is our strongest model with frontier performance » — Koray Kavukcuoglu (Google DeepMind)
- « Carbon pairs frontier accuracy with practical production economics. » — Koray Kavukcuoglu (Google DeepMind)
- « turning a single prompt into a coordinated team of agents » — Koray Kavukcuoglu (Google DeepMind)
- « using more tokens than Argon to explore thoroughly, reason deeply » — Koray Kavukcuoglu (Google DeepMind)
- « Carbon hit 100% recall on scanning and 95% precision on triage » — Koray Kavukcuoglu (Google DeepMind)
- « uncovered 0-day vulnerabilities in under two hours compressing weeks of vulnerability research » — Koray Kavukcuoglu (Google DeepMind)
- « prove key security properties in weeks — a task that historically takes expert teams years. » — Koray Kavukcuoglu (Google DeepMind)
- « found zero new universal jailbreaks across 132 hours and over 13,000 requests. » — Koray Kavukcuoglu (Google DeepMind)
- « declining to fill in missing experimental data 98% of the time » — Koray Kavukcuoglu (Google DeepMind)
- « achieved a 0% prompt injection attack success rate » — Koray Kavukcuoglu (Google DeepMind)

### Disponibilité
- Développeurs : Disponible immédiatement via l'API payante dans Google AI Studio et Android Studio. Accessible également dans Google Antigravity et AI Studio pour les détenteurs d'un abonnement Google AI Ultra.
  - Prix de lancement : 2 $ par million de tokens en entrée, 10 $ par million de tokens en sortie (aligné sur Argon jusqu'au 30 novembre 2026).
  - Prix standard dès le 1er décembre 2026 : 4 $ par million de tokens en entrée, 20 $ par million de tokens en sortie.
- Entreprises : Disponible immédiatement au sein de Gemini for business (via API ou sélecteur de modèle), Google Antigravity et CodeMender pour les organisations sous contrat payant.
- Particuliers (grand public) : Disponible immédiatement dans l'application Gemini et dans le mode IA du moteur de recherche (AI Mode in Search), **exclusivement pour les abonnés payants à Google AI Ultra**. Aucun accès gratuit pour les utilisateurs standards.
- Chercheurs et scientifiques : Disponible sans frais pendant 6 mois sur le palier maximal de Google Antigravity via le programme d'attribution scientifique (10 000 places ouvertes, sélections continues chaque semaine selon éligibilité et quotas).
- Professionnels de la cybersécurité : Disponible pour les missions défensives (« Carbon for cyber ») sur dossier via le programme Fairwind.

### Zones floues
- Coût de l'abonnement grand public « Google AI Ultra » : le tarif mensuel et les restrictions d'usage ou quotas de requêtes de cette formule ne sont pas détaillés dans l'annonce.
- Anonymat des concurrents sur les benchmarks : le modèle externe dépassé par Carbon sur CursorBench, WANDR et AutomationBench (« next best external model »), ainsi que le vainqueur du benchmark MKA ne sont jamais nommés.
- Confidentialité des cibles de sécurité : l'article ne nomme ni le « logiciel open source populaire » dont les vulnérabilités ont été requalifiées en critiques, ni les « deux grands fournisseurs de SaaS » chez qui des 0-days ont été identifiés par Wiz.
- Quotas et coût de calcul de /swarm : le coût en tokens d'une équipe d'agents coordonnée exécutant des boucles complexes (ex. 10 boucles nocturnes complètes) n'est pas chiffré, et la date de sortie générale de la fonctionnalité /swarm (actuellement en preview) n'est pas indiquée.
- Failles résiduelles en injection de prompt : Google concède explicitement que la résistance aux injections de prompt reste un domaine en amélioration et que le modèle demeure perfectible face à des attaques sophistiquées sur certaines distributions de requêtes.

## Texte de l'article

# Gemini 4 Carbon is now available

Nov 10, 2026

Developers, enterprises, scientists, and consumers can now try our latest frontier model.



Today, we’re making Gemini 4 Carbon available to developers, enterprises, scientists, and consumers. Carbon is our strongest model with frontier performance in cybersecurity capabilities and long-horizon agentic workflows across complex knowledge work, software engineering, and scientific reasoning.

Two weeks ago , we released Carbon to a set of cybersecurity defenders via our Fairwind Program . Following our recent launch of Gemini 4 Argon , Carbon pushes the frontier even further. Argon remains the ideal choice for the majority of software engineering and knowledge work, while Carbon is built for tasks that test the limits of a model’s intelligence like complex, multi-step coding and debugging and open-ended scientific research and discovery — using more tokens than Argon to explore thoroughly, reason deeply, and run extended verification loops.

Across independent benchmarks designed to test model performance in real workflows, Carbon pairs frontier accuracy with practical production economics. It ranks #1 on CursorBench 4.0 , Perplexity’s WANDR , and Zapier’s AutomationBench at more than 2X lower cost per task compared to the next best external model.

To put Carbon’s capabilities to work on larger and complex projects, we’re previewing /swarm in Google Antigravity, turning a single prompt into a coordinated team of agents you can track in real time. Developers can assign Carbon to roles that demand the deepest reasoning, like architectural design, coordination, and auditing, while pairing it with faster, lighter models across parallel isolated workspaces and adversarial verifiers that test every change.

Gemini 4 Carbon is available via the API in Google AI Studio and Gemini for business for all paying developers and enterprises, at the same introductory price 1 as Gemini 4 Argon ($2 per million input tokens and $10 per million output tokens). It is also rolling out to all Google AI Ultra subscribers in Google Antigravity , the Gemini app , and AI Mode in Search .

## Higher-precision knowledge work, artifact generation, and data analysis

Across legal, finance, and enterprise operations, Gemini 4 Carbon combines frontier visual understanding, reasoning, and exhaustive retrieval to synthesize grounded insights across large sets of dense documents and data. It follows strict schemas and formatting to generate polished and precise spreadsheets, presentations, and reports.

Existing benchmarks don’t adequately capture how agents reason natively over dense files with charts, images, blueprints, schematics, and tables, so we partnered with Artificial Analysis to launch the new Multimodal Knowledge Agent (MKA) benchmark that tests a model’s multimodal performance in agentic workflows. Carbon ranks #2 while being more than 6X lower in average cost per task compared to the top performing model.

Using Google Antigravity’s new /swarm feature, a team of Gemini 4 Carbon agents turned historical photos and engineering plates into an interactive Three.js 3D exhibition of the Eiffel Tower's 1887–1889 construction from a single prompt.

With seven public City Council planning PDFs (206 extracted engineering drawing views) and a single prompt, a multi-agent Carbon team using Google Antigravity’s /swarm feature built an interactive 906K-triangle Three.js reconstruction of Google’s Platform 37 office across 10 overnight loops.

In Google Antigravity, Gemini 4 Carbon built an interactive multiscale textile visualizer based on an academic paper, modeling a virtual-fiber finite element framework with interactive 3D yarn meshes, 110-fiber polar tracking, and dynamic stress-strain curves with minimal prompting.

In pre-release evaluations, Carbon matched the performance of the best model tested on deep financial research on Hebbia’s E2E Financial Agentic evaluation, and ranked at the top out of 23 frontier model configurations on Balyasny Asset Management’s General Financial Intelligence benchmark, spanning legal expertise, agentic tool use and execution, coding and data engineering, and perception and context understanding.

## Improved agentic coding, full stack development, and 3D and UI design

Carbon performs exceptionally well on engineering tasks that require multi-agent collaboration like multi-package migrations, cross-subsystem root-cause investigations, and complex architectural redesigns. For web app development, it runs build-and-verify loops, recovers from errors, and checks both its code and the rendered UI to produce complete, working applications. Stronger visual design, spatial reasoning, and attention to environmental detail also carry over to 3D game development and creative coding.

Using Google Antigravity’s /swarm feature, Carbon built an open-world 3D game where you explore Google’s Mountain View campus as a pelican riding a GBike — coordinating subagents to model 3D assets in Blender from Omni and Nano Banana references, build the browser game in Three.js with WebGL shaders, and pair procedural Web Audio sound effects with Lyria music. Try the live app .

Paired with improved front end taste and motion design skills in Google Antigravity, Carbon reimagined the Google Merchandise Store in two prompts, proposing five art direction concepts and generating all-new product imagery with Nano Banana 2.1. Try the live app and Gemini front end design skill .

Starting from a video reference generated with Gemini Omni in Google Antigravity, built a cinematic multi-shot underwater Atlantis scene. The pipeline modeled procedural ruins, volumetric caustic lighting, and water simulation in Blender before converting the full environment to Three.js for real-time browser rendering.

Using a multi-agent loop in Google Antigravity, Carbon reconstructed a playable c. 1780 Stein-Schule fortepiano with 61-key escapement physics from CAD drawings and X-ray radiographs and placed it in a 3D model of the Royal Conservatory of Music's Koerner Hall in Toronto with seat-specific spatial acoustics. Try the live app .

## Frontier cybersecurity capabilities

Gemini 4 Carbon for cyber delivers our strongest cybersecurity capabilities to date, giving security teams the end-to-end intelligence they need in protecting critical software. When accessed through the Fairwind Program, Carbon leads on key benchmarks across finding (SEC-bench Pro), exploiting (ExploitGym), and patching (CWE-bench v1) vulnerabilities: inspecting software, tracing how flaws can be chained together across systems, and generating verified root-cause patches.

Early testers inside and outside of Google are already seeing strong results with Carbon for cyber in practice.

- In Project Fortify , Google’s autonomous system spanning scanning, triage, and remediation, Carbon hit 100% recall on scanning and 95% precision on triage, on our internal benchmark. On Open Source code repository testing we see an over 25% relative improvement on Argon's already strong recall rate, surfacing previously undetected, real-world logic flaws. Bringing these gains across Google, one of the world’s largest users of open-source software, helps secure both our own systems and the broader ecosystem.
- Google’s Cloud Vulnerability Research (CVR) team recently used Carbon to prove that two bugs in a popular open-source software were in fact exploitable vulnerabilities, comparable in severity to the recent PHP2Shell exploit . By using Carbon to build a proof of concept, CVR helped maintainers re-classify the bug as critical and swiftly issue a patch. Details will be shared after the responsible disclosure process completes.
- As part of Wiz’s Scan for Good program, the team used Carbon to assess vulnerabilities in public digital infrastructure. For example, when scanning two major SaaS providers, the model uncovered 0-day vulnerabilities in under two hours compressing weeks of vulnerability research to a single afternoon. The team partnered with the impacted organizations to remediate in record time, helping to mitigate potential impact on tens of thousands of companies.

## Stronger scientific and mathematical reasoning

Gemini 4 Carbon shows strongly improved performance in reasoning across physics, math, and life sciences, synthesizing experimental data, testing hypotheses, and reasoning through multi-step domain problems. For drug toxicity research company Axiom Bio, Carbon is now the leading model in performance for translational science, finding novel mechanisms of toxicity they hadn’t found previously. Axiom is now moving their production scientific analyses and agents to both Carbon and Argon to unlock the creation of safer drugs.

Researchers across Google have been using Carbon in Google Antigravity to accelerate their work:

- Code verification: Researchers built a new agentic framework for formal verification called AlphaProof Code and put it to work on a major security challenge: mathematically proving the actual code underlying the cryptographic protocol of Signal . Using Carbon alongside other models, our researchers translated security goals to mathematical theorems. AlphaProof Code agents then used Carbon to generate millions of lines of code in Lean, a computer language for writing mathematical proofs, helping them prove key security properties in weeks — a task that historically takes expert teams years. The result indicates Carbon’s potential to unlock scalable formal verification, long considered a gold-standard approach to building secure software.
- Enzyme assay development : Provided with only lab notebooks and raw data, Carbon went beyond standard analysis to surface hard-to-interpret data anomalies, which it used to diagnose subtle wet lab experimental artifacts such as incomplete automated mixing in deep wells, leading to substantially improved reproducibility. Moreover Carbon improved methods to deconvolute chromatography peaks and caught trace sample carryover in research instruments, significantly accelerating the development of new assays and tightening the feedback loop between computation and the bench.
- Protein structure prediction: Structure prediction models like AlphaFold 3 use Multiple Sequence Alignments (MSAs) of evolutionary relatives to help infer how amino acid chains fold. As a result they often struggle on understudied, viral, microbial, and eukaryotic proteins that have very few matches in standard databases. Working in a multi-agent setup, our researchers used Gemini 4 Carbon to autonomously discover remote homologs across petabase-scale unannotated sequence archives, environmental and viral sequence catalogs, and 3D structure databases. For example, across 7 low-homolog protein families from the CASP17 blind test set, Carbon increased the number of homologs retrieved by 40-fold on average, greatly increasing the information available to structure prediction models without need for retraining. While broader benchmarking is still underway, addressing this upstream search bottleneck potentially offers a promising path toward modeling hard-to-characterize regions of the proteome.

Four weeks ago, we opened applications to give 10,000 scientists access to Argon in Google Antigravity free of charge for six months to accelerate the pace of their research, and we’ve onboarded thousands of scientists already. Today, we’re expanding access to Carbon for current and future participants, and going forward, the program will continue providing access to our latest frontier models as they become available. Applications remain open and onboarding continues on a weekly rolling basis, subject to eligibility, capacity, and selection.

## Progress in model safety and security

With each new model release, we continue to strengthen our safety and security mitigations, agentic misuse prevention, model alignment, and harm reduction proportionately with model capability.

Because Gemini 4 Carbon introduces stronger cyber capabilities we build on Argon’s strong safety and security stack to fortify robustness to misuse and prompt injection.

- Mitigating frontier safety misuse risks: We’ve strengthened our misuse safeguards to help ensure stronger defensive reasoning does not translate into offensive risk. In simulated cyberattack testing environments seeded with ExploitBench and CyScenarioBench, Carbon blocked 99% of attack trajectories from our adaptive red-teaming agent that can iteratively revisit its attack plans after each block. The Carbon safeguards lowered the per-attempt breach rate to just 0.8% (down from 3.1% on Argon). Our safeguards also lowered the automated cyberattack query success rate to 2.17% in Gray Swan’s testing, compared to 9.86% on Argon. And external testing by Trajectory Labs found zero new universal jailbreaks across 132 hours and over 13,000 requests.
- Promoting safe and aligned model interactions: When we announced Carbon, we showed significant improvements in alignment as measured by our monitor flag rates across the model’s lifecycle, as well as reductions in data fabrication. New results show that on our 375-task agentic honesty benchmark, it passed 92% of tasks (compared to 70% for Argon) — declining to fill in missing experimental data 98% of the time and flagging methodological flaws 68% of the time.

- Protecting users from indirect prompt injection attacks: Two weeks ago, we shared that Carbon achieved a 0% prompt injection attack success rate on the Gray Swan IPI benchmark — marking the first time that milestone has been reached. At the same time, we know that prompt injection robustness remains an area for continued improvement. Our advanced automated red teaming continues to push the limits here and has shown that models could be further improved against sophisticated attacks in some distributions. It provides the data for us to continuously advance our models’ security to the next frontier.

For more details, read the full Gemini 4 Carbon Safety and Security report .

## Getting started with Gemini 4 Carbon

Starting today, Carbon joins Argon in our family of frontier models across our products:

- For developers: Build with the Gemini API paid tier in AI Studio and Android Studio , and if you’re a Google AI Ultra subscriber, you can try it in Google Antigravity and AI Studio.
- For enterprises: Try it in Gemini for business via the API or model drop down, Google Antigravity, or CodeMender.
- For everyday users: Try Carbon starting today in the Gemini app and AI Mode in Search if you’re a Google AI Ultra subscriber.
- For scientists & researchers: Apply for a chance to get access to both Argon and Carbon via Google Antigravity’s highest usage tier free of charge for 6 months (onboarded on a rolling basis), subject to eligibility, capacity, and selection.
- For cybersecurity defenders: Apply to join the Fairwind Program to get access to Carbon for cyber on a rolling basis.

See the model card to learn more about Gemini 4 Carbon and to start building with it, explore our updated Gemini 4 developer guide and documentation for best practices on migrating workflows to the model.

---
[1] After the introductory period expires on November 30, 2026, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply. Applies to the Carbon model intended for public access only.
