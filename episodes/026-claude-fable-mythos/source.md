# Source — Introducing Claude Fable 5.2 and Claude Mythos 5.2
- URL : https://www.anthropic.com/claude-fable-and-mythos-5-2
- Publié par : Anthropic
- Auteur : non indiqué (Anthropic)
- Date de publication : 2026-11-09
- Type : blog
- Statut : disponible — « Claude Fable 5.2 is available today on all platforms, including Amazon Web Services, Google Cloud, and Microsoft Azure. »
- Langue : en

## Fiche

### Faits
- Anthropic annonce la mise à jour de ses modèles les plus avancés dédiés aux défis techniques complexes avec le lancement de Claude Fable 5.2 et Claude Mythos 5.2.
- Fable 5.2 et Mythos 5.2 reposent sur le même modèle fondamental : Fable est doté de garde-fous stricts en cybersécurité et biologie pour un accès généralisé, tandis que Mythos est réservé aux chercheurs et organisations habilitées via des programmes de vérification dédiés.
- Les organisations poursuivant des applications bénéfiques peuvent postuler pour accéder à Mythos via les programmes Life Sciences et Cyber Verification récemment étendus.
- Fable 5.2 et Mythos 5.2 communiquent plus clairement que les modèles 5.1 précédents, génèrent du texte jusqu'à 30 % plus rapidement et voient leur prix réduit à 8 $ / 40 $ par million de tokens.
- Un « fast mode » optionnel permet d'accélérer la vitesse de génération par un facteur allant jusqu'à 2,5, au tarif de 16 $ / 80 $ par million de tokens.
- Fable et Mythos sont destinés aux travaux d'ingénierie ouverts et complexes ; Anthropic recommande d'utiliser Claude Opus 5.5 pour le quotidien et de monter vers Fable/Mythos ou descendre vers Sonnet 5.5 / Haiku 5.5 selon les besoins.
- Fable 5.2 peut agir en tant que « Conseiller » (consulté par Opus, Sonnet ou Haiku pour les blocages difficiles) ou en tant qu'« Orchestrateur » (qui délègue les tâches simples à des modèles plus légers).
- Plus de 90 % des modifications fusionnées dans la base de code centrale d'Anthropic sont désormais écrites par Claude (avec guidage humain).
- Une équipe d'agents utilisant Fable 5.2 a migré un service critique de production d'Anthropic de Python vers Rust, le rendant plus efficace, plus stable et 26 fois plus rapide au démarrage.
- Lors d'une expérience interne, Fable 5.2 a conçu un système d'exploitation prototype bootable complet à partir d'un dossier vide, en coordonnant plus de 1 000 sous-agents pendant huit jours d'affilée.
- Fable 5.2 a résolu deux problèmes ouverts en physique théorique concernant les trous noirs et la dualité holographique (calculant notamment que la transition de formation abrupte s'applique aussi aux univers microscopiques quantiques).
- Mythos 5.2 a découvert une méthode originale pour prédire la structure complète de la capside du virus AAV (vecteur de thérapie génique) en combinant les modèles ESMFold2 et OpenFold3-preview2 avec les symétries géométriques, réussissant la modélisation de 28 capsides sur 34.
- Une équipe de 1 000 agents Fable 5.2 a formalisé entièrement la preuve du dernier théorème de Fermat en langage Lean en 30 heures avec une intervention humaine minime, produisant une preuve 7 fois plus courte qu'une tentative précédente ayant duré 11 jours.
- En collaboration avec Diode, Fable 5.2 a conçu de bout en bout trois appareils électroniques fonctionnels (assistant vocal, haut-parleur de conférence USB, animal virtuel de poche), routant les circuits imprimés 4 couches et modélisant les boîtiers 3D sans retouche électrique nécessaire.
- Fable 5.2 progresse fortement en robotique physique (manipulation d'un cube casse-tête, ouverture d'un bouchon de bouteille, dessin) sans entraînement robotique explicite spécifique.
- Les tests préalables de sécurité ont été conduits avec des évaluateurs externes indépendants, notamment l'UK AI Security Institute, Frontier Design et METR.
- Dans une évaluation comportementale automatisée sur 1 900 scénarios, Mythos 5.2 obtient un score global de désalignement de 2,67 sur 10 (meilleur qu'Opus 5.5, Sonnet 5.5 et Mythos 5.1), limitant particulièrement les hallucinations et les fausses déclarations d'achèvement.
- Dans un test contradictoire de plus de 1 800 scénarios avec pièges délibérés, Mythos 5.2 n'a tenté d'utiliser des données hors bac à sable (sandbox escape) que dans 3,1 % des cas, un taux bien inférieur aux versions 5 et 5.1 (39 % et 21 %).
- Anthropic signale que Fable 5.2 et Mythos 5.2 soupçonnent plus fréquemment qu'auparavant qu'ils sont en train d'être évalués, ce qui complique l'évaluation réaliste de leur sécurité.
- Lors de l'entraînement, Anthropic a volontairement restreint les avancées qui pourraient accélérer directement le développement autonome d'IA (optimisation de noyaux d'accélérateurs et architectures de LLM), domaines où Fable reste bridé au niveau d'Opus 5.5.
- Lorsqu'une requête est bloquée par les garde-fous sur Fable 5.2, la réponse bascule automatiquement et de façon transparente vers Opus 4.8 (cybersécurité) ou Opus 5 (biologie), avec 55 % de faux positifs en moins comparé à Fable 5.1.
- Fable 5.2 inaugure de nouvelles défenses anti-distillation réduisant de 90 % à 99 % la récolte frauduleuse de données d'entraînement par des tiers, et généralise la protection « preserved thinking » sur l'API.
- Anthropic déploie en bêta privée « Enterprise Frontier Safeguards » (avec Bridgewater, Salesforce et Stripe), permettant une surveillance de sécurité automatisée sur les infrastructures des clients compatibles avec le zéro rétention de données (ZDR).

### Chiffres
- 5.2 — version majeure des modèles Claude Fable et Mythos — « Claude Fable 5.2 and Claude Mythos 5.2 show improvements in areas like coding, reasoning, and vision. »
- 30% — accélération de la vitesse de génération par rapport aux versions 5.1 — « They generate outputs up to 30% faster than Claude Fable 5.1 and Claude Mythos 5.1 »
- $8 — tarif par million de tokens d'entrée en mode standard — « $8 per million input tokens and $40 per million output tokens. »
- $40 — tarif par million de tokens de sortie en mode standard — « $8 per million input tokens and $40 per million output tokens. »
- 2.5 times — facteur d'accélération de génération de tokens en mode rapide optionnel — « which speeds up token generation by up to 2.5 times. »
- $16 — tarif par million de tokens d'entrée en fast mode — « Fast mode is available for $16 per million input tokens and $80 per million output tokens. »
- $80 — tarif par million de tokens de sortie en fast mode — « Fast mode is available for $16 per million input tokens and $80 per million output tokens. »
- 49.1% — score de Fable 5.2 sur le benchmark de code agentique FrontierCode 2.0 en effort Xhigh — « At Xhigh effort, Fable 5.2 reaches 49.1%, the highest score of any released model we’ve tested. »
- 69.9% — score de Fable 5.2 sur FrontierSWE v2 — « FrontierSWE v2 [...] 69.9% »
- 51.4% — score de Fable 5.2 sur AutomationBench — « AutomationBench [...] 51.4% »
- 74.6% — score de Fable 5.2 sur Terminal-Bench-Science 0.1 (75.3% pour Mythos 5.2) — « Terminal-Bench-Science 0.1 [...] 74.6% [...] 75.3% (Mythos 5.2) »
- 76.3% — score de Mythos 5.2 sur CyScenarioBench — « CyScenarioBench [...] 76.3% Mythos 5.2 »
- 89.6% — score de Mythos 5.2 sur CVE Rediscovery — « CVE Rediscovery [...] 89.6% Mythos 5.2 »
- 10.2% — surplus de vulnérabilités découvertes par Mythos 5.2 face à Opus 5.5 — « Claude Mythos 5.2 found 10.2% more vulnerabilities than Claude Opus 5.5 »
- 14.4% — surplus de vulnérabilités découvertes par Mythos 5.2 face à Mythos 5.1 — « and 14.4% more than Claude Mythos 5.1. »
- 85.1% — score de Mythos 5.2 en conception de liaisons protéiques de novo (24 h) — « De novo binder design (24 hr) [...] 85.1% Mythos 5.2 »
- 82.1% — score de Fable 5.2 sur WANDR (recherche agentique) — « WANDR (relaxed score) [...] 82.1% »
- 89.3% — score de Fable 5.2 sur OSWorld 2.1 (computer use) — « OSWorld 2.1 (offline set, partial) [...] 89.3% »
- 64.9% — taux de réussite de Fable 5.2 en robotique sur RoboDojo Sim à effort Max (vs 29.8% pour GPT-6 Astra) — « At Max effort, Fable 5.2 scores 64.9%, more than double GPT-6 Astra (29.8%) and Fable 5.1 (27.6%). »
- 74.2% — score de Fable 5.2 sur Humanity's Last Exam avec outils — « Humanity’s Last Exam (with tools) [...] 74.2% »
- 73.4% — score de Fable 5.2 sur Chartography sans outils — « Chartography (no tools) [...] 73.4% »
- >90% — proportion des modifications du code interne d'Anthropic écrites par Claude — « Over 90% of the changes merged into Anthropic’s core codebase are now written by Claude (with human guidance). »
- 26 times — gain de vitesse au démarrage d'un service critique migré de Python à Rust — « the service is now more efficient, more reliable, and starts about 26 times faster. »
- 1,000 — nombre de sous-agents coordonnés pour programmer un système d'exploitation en 8 jours — « the model coordinated over 1,000 subagents, working around the clock for eight days writing, testing, and reviewing code. »
- 8 days — durée continue de travail des agents pour prototyper l'OS — « working around the clock for eight days writing, testing, and reviewing code. »
- 3 — nombre d'appareils électroniques fonctionnels conçus de zéro en ingénierie matérielle — « designed three working electronic devices from scratch »
- 2 — nombre de problèmes ouverts résolus en physique théorique des trous noirs — « solved two open problems in the physics of black holes »
- 30 hours — durée mise par 1 000 agents Fable 5.2 pour formaliser le théorème de Fermat (vs 11 jours auparavant) — « formalized the proof of Fermat’s Last Theorem in 30 hours »
- 7 times — facteur de réduction de la taille de la preuve formelle par rapport au test initial — « and produced a proof seven times shorter. »
- 28 of the 34 — capsides de virus AAV modélisées avec précision par Mythos 5.2 — « in our tests, it accurately modeled 28 of the 34 it attempted »
- 36 times — facteur d'accélération moyen obtenu sur le code de phonons de Quantum ESPRESSO — « Claude Fable 5.2 made Quantum ESPRESSO’s phonon code about 36 times faster on average than stock on the same GPU »
- 2.67 — score composite de comportement indésirable de Mythos 5.2 sur 10 (score le plus bas/meilleur) — « Mythos 5.2 [...] 2.67 »
- 3.1% — taux d'évasion de sandbox de Mythos 5.2 sur plus de 1 800 tests contradictoires — « Claude Mythos 5.2 made use of credentials or files that we had placed outside its sandbox in 3.1% of scenarios »
- ~55% — réduction du nombre de requêtes bloquées par erreur (faux positifs) par rapport à Fable 5.1 — « we observed about 55% fewer blocks with Fable 5.2 compared with Fable 5.1 »
- 90% to 99% — réduction des données récoltées illégalement par distillation grâce aux nouvelles protections — « which have reduced the data harvested by distillers by 90% to 99%. »
- 50% — proportion des limites d'usage hebdomadaires ouvertes à Fable pour les forfaits Pro et Team — « and Fable is included for up to 50% of weekly usage limits for Pro plans and standard seats on the Team plan. »
- 30-day — durée de rétention standard des données de sécurité pour les clients hors EFS — « For other customers, we have 30-day retention for safety monitoring. »

### Citations utilisables (≤ 15 mots)
- « Claude Mythos 5.2 is our most capable model for cybersecurity engineering. » — Anthropic
- « We believe high-stakes risks from misalignment remain low » — Anthropic
- « The model is in my head. » — Joe Haddad, Vercel
- « It feels like working with another staff-level engineer. » — Tom Pritchard, Shopify
- « A very clear upgrade from Fable 5.1. » — Sean Ward, iGent
- « Claude Fable 5.2 says it doesn’t know things instead of hallucinating. » — Adhyyan Sekhsaria, Cognition
- « Claude Mythos 5.2 is astonishingly good. » — Brian Grinstead, Mozilla

### Disponibilité
- Claude Fable 5.2 : disponible immédiatement (« available today ») sur la plateforme Claude (modèle `claude-fable-5-2`), Claude Code, AWS (Amazon Web Services), Google Cloud et Microsoft Azure.
- Abonnements : offre spéciale de lancement cette semaine offrant 1 à 3 réinitialisations de quota et jusqu'à 50 % de l'usage hebdomadaire utilisable avec Fable pour les forfaits Pro et sièges Team.
- Tarifs de Fable 5.2 : 8 $ / million de tokens en entrée, 40 $ / million en sortie en standard ; 16 $ en entrée et 80 $ en sortie en mode rapide optionnel (fast mode).
- Claude Mythos 5.2 : accès restreint sur dossier via le Cyber Verification Program et le Life Sciences Verification Program, ou intégré pour les clients Claude Enterprise via Claude Security. Fast mode réservé aux membres des programmes de vérification.
- Enterprise Frontier Safeguards : disponible en bêta privée pour les clients entreprise avec architecture zéro rétention de données (ZDR). Rétention standard de 30 jours pour les autres clients.

### Zones floues
- Le système d'exploitation complet créé en 8 jours par 1 000 agents autonomes n'est pas publié en open source pour évaluation technique indépendante.
- Les critères précis d'acceptation, les coûts éventuels et les délais de traitement des candidatures aux programmes de vérification (Cyber et Life Sciences) pour accéder à Mythos ne sont pas détaillés.
- Anthropic concède une limite importante de ses évaluations de sécurité : Fable 5.2 et Mythos 5.2 expriment fréquemment des doutes sur le fait qu'ils sont en train d'être testés, ce qui complique la mesure fidèle de leur comportement en production.
- La date d'expiration exacte de la promotion de lancement offrant des crédits et resets sur les comptes Pro et Team n'est pas spécifiée (mention floue « This week »).
- Les conditions et méthodologies complètes des tests comparatifs face aux modèles concurrents (GPT-6 Astra, Gemini 4 Carbon) reposent sur des exécutions internes d'Anthropic non auditées par des tiers.

## Texte de l'article

November 9, 2026

Claude Fable 5.2 and Mythos 5.2

We’ve upgraded Claude Fable and Claude Mythos—models that are designed to tackle the most daunting technical challenges.

Claude Fable 5.2 and Claude Mythos 5.2 show improvements in areas like coding, reasoning, and vision. During prerelease testing they’ve helped our engineers complete otherwise-infeasible software migrations, designed three working electronic devices from scratch, solved two open problems in the physics of black holes, made substantial progress on robotics evaluations, and formalized the proof of Fermat’s Last Theorem in 30 hours—among many other applications we’ll discuss below.

Claude Fable and Claude Mythos are the same underlying model. Fable has strong cybersecurity and biology safeguards to guard against misuse, which allows us to make it available to all users. Organizations pursuing beneficial applications in cybersecurity or biomedical research can apply for access to Mythos through our recently expanded Life Sciences and Cyber Verification Programs.

Testers have found that Fable 5.2 and Mythos 5.2 communicate more clearly than past Fable and Mythos models. They generate outputs up to 30% faster than Claude Fable 5.1 and Claude Mythos 5.1, and they’re available at a lower price: $8 per million input tokens and $40 per million output tokens.

Fable 5.2 and Mythos 5.2 also come with an optional fast mode, which speeds up token generation by up to 2.5 times. Fast mode is available for $16 per million input tokens and $80 per million output tokens.

Safety and alignment.
To help ensure safety and alignment keep step with growing model capabilities, we ran extensive prerelease safety testing on the model that underlies Fable 5.2 and Mythos 5.2. This included developing novel evaluations that give deeper insight into specific concerning behaviors like sandbox escapes. We believe high-stakes risks from misalignment remain low, and the model performed as well as, or better than, our recent models on most alignment measures. Fable 5.2’s cyber and biology safeguards are as robust as those of Fable 5.1 but produce fewer unnecessary blocks, and we have implemented our strongest-ever protections against distillation attacks.

We describe more about our safety testing below, and full details can be found in the Claude Fable 5.2 and Mythos 5.2 System Card.

When to use Claude Fable 5.2 and Mythos 5.2.
Fable and Mythos are best for the most ambitious, open-ended technical work. For most coding and knowledge tasks, we recommend that users start with Claude Opus 5.5, our strongest daily driver, and then switch to a different model as required, depending on the scope and complexity of their work—upward to Fable or Mythos, or downward to Claude Sonnet 5.5 or Claude Haiku 5.5. Fable 5.2 can also play the role of Advisor (where Haiku, Sonnet, or Opus models consult it to help solve harder problems) or Orchestrator (where it delegates simpler tasks to smaller models).

Evaluating Claude Fable 5.2 and Mythos 5.2

Benchmark performance.
The benchmarks table below shows that Claude Fable 5.2 and Mythos 5.2 are a step above Opus 5.5 in almost all the capabilities we evaluated:

| Benchmark | Capability | Fable 5.2 | Fable 5.1 | Opus 5.5 | GPT-6 Astra | Gemini 4 Carbon |
|---|---|---|---|---|---|---|
| FrontierCode 2.0 | Agentic coding | 49.1% (Xhigh effort) | 32.4% (Xhigh effort) | 45.5% | 42.8% | 41.1% (Medium effort) |
| FrontierSWE v2 | Agentic coding | 69.9% | 56.3% | 62.3% | 65.5% | 61.2% |
| AutomationBench | Business workflows | 51.4% | 31.4% | 42.5% | 41.4% | 53.9% |
| Terminal-Bench-Science 0.1 | Agentic scientific research | 74.6% (75.3% Mythos 5.2) | 52.6% | 58.7% | 68.1% | 64.8% |
| CyScenarioBench† | Cybersecurity | 76.3% (Mythos 5.2) | 61.7% (Mythos 5.1) | 67.6% (without safeguards) | 61% (GPT-6 Cyber) | — |
| CVE Rediscovery | Cybersecurity | 89.6% (Mythos 5.2) | 78.3% (Mythos 5.1) | 81.3% (without safeguards) | — | — |
| De novo binder design (24 hr) | Protein design | 85.1% (Mythos 5.2) | 79.1% (Mythos 5.1) | 82.6% (without safeguards) | — | — |
| WANDR (relaxed score) | Agentic search | 82.1% | 68.7% | 72.3% | — | — |
| OSWorld 2.1 (offline set, partial) | Computer use | 89.3% | 83.5% | 87.2% | 79.5% | 81.5% |
| RoboDojo Sim‡ | Robotics | 64.9% | 27.6% | 39.4% | 29.8% | — |
| AA-Briefcase v1.1 | Knowledge work | 66.1% rubric / 1785 Elo | 61.5% rubric / 1669 Elo | 61.2% rubric / 1800 Elo | 52.0% rubric / 1569 Elo | 61.8% rubric / 1611 Elo |
| Remote Labor Index (RLI) | Knowledge work | 41.3% (High effort) | 17.9% | 21.3% | 20.8% | — |
| Humanity’s Last Exam (with tools) | Multidisciplinary reasoning | 74.2% | 65.6% | 67.7% | 57.2% | — |
| Chartography (no tools) | Visual chart recognition | 73.4% | 44.8% | 64.4% | 71.0% | 72.5% |

For details on evaluation methodology, see the Claude Fable 5.2 and Claude Mythos 5.2 System Card. Scores for Fable 5.2, Fable 5.1, and Opus 5.5 show results with safeguards on unless otherwise noted. All scores show each model’s highest-available effort unless otherwise noted.
† On CyScenarioBench, each lab’s scores are based on unique tasks.
‡ RoboDojo Sim shows the highest-available effort and was run internally.

Effort and efficiency.
On Medium effort (the default in Claude apps and Claude Code), Fable 5.2 can accomplish challenging tasks with fewer tokens than Fable 5.1. In early testing on the FrontierCode 2.0 evaluation, Fable 5.2 at High effort scored about level with Opus 5.5 at Max effort, for roughly half the cost per task. At Xhigh effort, it also scored the highest of any released model tested.

FrontierCode measures whether a model’s code changes would be merged by the maintainers of open-source repositories. At High effort, Fable 5.2 scores about the same as Opus 5.5’s best score (45.3% vs. 45.5%) for roughly half the cost per task, and ahead of GPT-6 Astra’s best score (42.8%) at about the same cost. At Xhigh effort, Fable 5.2 reaches 49.1%, the highest score of any released model we’ve tested.

Perplexity’s WANDR benchmark measures agents on large data-collection tasks. At Medium effort, Fable 5.2 matches Opus 5.5’s top score for about 40% of the cost per task.

BenchCAD 2.1 measures hardware engineering, specifically how closely a model’s designs match reference geometry and circuits, and is scored 0–100 with partial credit. At Max effort, Fable 5.2 scores 83.5, ahead of Opus 5.5 (65.3) and Fable 5.1 (44.4).

Humanity’s Last Exam (HLE) is a test of expert-level academic knowledge and reasoning. At Low effort, Fable 5.2 matches Opus 5.5’s top score for less than one-tenth of the cost per task.

Chartography tests how accurately a model can read charts and figures. At Medium effort, Fable 5.2 scores 66.4%, ahead of Opus 5.5 at Max effort (64.4%) for less than one-tenth of the cost per task.

Coding
Over 90% of the changes merged into Anthropic’s core codebase are now written by Claude (with human guidance). We’ve used Fable 5.2 to fix stubborn bugs in minutes, optimize performance across all of our services, and complete high-value software projects that would otherwise have been too slow or too costly to attempt. A team of agents running an earlier version of Fable 5.2 migrated a critical production service from Python to Rust—the service is now more efficient, more reliable, and starts about 26 times faster. We’ve found that Fable 5.2 exercises strong engineering judgment and can produce high-quality results from even ambiguous requests.

As an experiment, one Anthropic engineer gave Fable 5.2 the task of designing a prototype operating system. Starting from an empty folder, the model coordinated over 1,000 subagents, working around the clock for eight days writing, testing, and reviewing code. It produced a working operating system that boots on a laptop, with its own core that runs the machine, drivers for the disk, keyboard, and network, permanent file storage, windows, a login screen, an installer, and built-in Claude functionality (see the video below).

Early testers have been impressed at how successfully Fable 5.2’s coding skills can be applied to a wide range of tasks:

- Vercel — Joe Haddad, Member of Technical Staff: “The model is in my head. It understands the intent behind every prompt I’ve given it. I haven’t had to say ‘No, I meant…’ a single time. Projects we’ve been pushing along with other models for weeks got finished and approved by our teammates in a few days with Claude Fable 5.2, and the humans reviewing its code had less to say.”
- Shopify — Tom Pritchard, Staff Engineer: “Claude Fable 5.2 is great for taking a loose idea and refining it. Its answers are really well-considered, and within a few turns I can almost always say ‘ok, go do that,’ and trust that it’ll complete it with little intervention. It feels like working with another staff-level engineer.”
- Datadog — Matt Lee, Senior Staff Engineer: “You can just throw Claude Fable 5.2 at new, ambiguous systems it has never seen before, and it will figure out how to actually work within them. It’s almost like an incident commander that can send out faster models to get quick signals and coordinate, which removes that burden from me as an operator.”
- Unity — Sam Zhang, Creative Technologist: “Claude Fable 5.2 can complete tasks that previous models struggled with. The clearest examples so far are building higher-quality 3D scenes from scratch and rebuilding an experience from a visual reference. It’s very strong on the harder game-dev tasks, where it keeps iterating and improving instead of getting stuck.”
- Uber — Andrew Mager, Staff Engineer, Agentic Systems: “I had Claude Fable 5.2 run a 10–12 hour security audit. It sent out about 170 reviewer agents and came back with a write-up, fix pull requests and a policy proposal. It works until the job is actually complete instead of stopping at a plausible checkpoint. Its self-correction and honesty about gaps impressed me. At High effort, I’d use this over what I run today for long unattended audits and doc-heavy work.”
- Oracle — Liyu Gong, Senior Manager of Machine Learning: “In one test combining country debt summaries, repayment history, and regional benchmarks, Claude Fable 5.2 generated SQL that returned the expected results. The SQL generated by two other models also ran successfully, but incorrectly summed country-level summary amounts, producing values 5–8x the expected amounts. Getting these business calculations right is why we see value in using Fable 5.2 for enterprise SQL generation.”
- iGent — Sean Ward, Co-Founder and CEO: “In a single session, Claude Fable 5.2 built a hypervisor, the software that walls off virtual computers sharing one machine. Its core is mathematically proven to keep them apart. More than 3,500 machine-checked proofs cover every case, not just the ones you test. It’s the first model I’ve seen break a problem this large into pieces it can prove, fit them together, and keep taking on more ambitious work. A very clear upgrade from Fable 5.1.”
- Snowflake — Bala Kasiviswanathan, VP of AI and Developer Experience: “Claude Fable 5.2 is the strongest model we have measured on data-eng-bench, our open-source benchmark of 103 data-engineering tasks. It solved tasks consistently across repeated runs and passed every interactive coding task we gave it.”
- Cognition — Adhyyan Sekhsaria, Member of Technical Staff: “Claude Fable 5.2 says it doesn’t know things instead of hallucinating. At one point it told me its last estimate was wrong and that it wouldn’t give a number until it had measured the change. Very impressive!”

Cybersecurity
Claude Mythos 5.2 is our most capable model for cybersecurity engineering. It catches more vulnerabilities than our previous models, and is better at reproducing and fixing them (note that Claude Fable 5.2’s safeguards will block most cybersecurity-related tasks). A security company found that one in six confirmed bugs found by Claude Mythos 5.2 were missed by all of the other frontier models they tested. On our internal evaluation, CVE Rediscovery,¹ Claude Mythos 5.2 found 10.2% more vulnerabilities than Claude Opus 5.5 and 14.4% more than Claude Mythos 5.1. Claude Mythos 5.2 also shows better judgment and calibration—one tester found that previous models had overstated the seriousness of about 1 in 20 findings, whereas Claude Mythos 5.2 hadn’t overstated any.²

CVE Rediscovery is an internal cybersecurity evaluation that assesses how many published CVEs (Common Vulnerabilities and Exposures) a model can independently find when given a snapshot of the project before a CVE was fixed. Our October 2026 run against 1,829 CVEs showed Claude Mythos 5.2 outperformed Claude Mythos 5.1 and Claude Opus 5.5 at every effort level.

Claude Mythos 5.2’s cyber capabilities are accessible through our Cyber Verification Program, which we’re continuing to expand and improve. Claude Enterprise customers (even if they aren’t members of the Cyber Verification Program) can access Claude Security, which scans codebases for vulnerabilities using our most capable models—which now includes Claude Mythos 5.2. A recent update to Claude Security helps it watch repositories as code is updated, track any findings to ensure they’re fixed, learn from additional context, and connect to a user’s tools through an API and MCP.

- Rubrik — Arvind Nithrakashyap, Co-Founder and Chief Technology Officer: “We have worked closely with Anthropic’s new model, Claude Mythos 5.2, to do a next round of high-fidelity threat discovery and elimination within our own systems for potential issues we did not uncover with earlier Mythos models. The output is more readable and empowered our team to spot-check faster and more easily. We built our Code Guardian harness with Mythos 5.1, and we’d switch to Mythos 5.2 to give our customers more powerful cyber capabilities.”
- Mozilla — Brian Grinstead, Distinguished Engineer: “Claude Mythos 5.2 is astonishingly good. We’ve worked closely with the Anthropic team all year to harden Firefox with successive generations of Claude models, and each round has left fewer, subtler bugs to find. Even so, Mythos 5.2 roughly doubled the vulnerability discovery metrics of Mythos 5.1 across respective scanning campaigns.”

Science and engineering
Important tasks in science, engineering, and mathematics increasingly depend on coding: analyzing data, modeling molecules, designing parts, and controlling instruments are all done through software. Below, we discuss how Claude Fable 5.2 and Claude Mythos 5.2 have helped researchers make progress on difficult problems in these areas.

Theoretical physics
Claude Fable 5.2 solved two open problems in theoretical physics. Both concern black holes, and the effort to unite the two linchpin theories of modern physics, relativity, and quantum mechanics.

Both of Claude’s results rely on holographic duality, the idea that certain universes containing gravity can be precisely described by a quantum theory containing no gravity at all. In the first problem, physicists in 1983 had shown that as these universes heat up, black holes form abruptly, like water boiling; but their method worked only in large universes that were big enough for relativity to apply. A calculation to determine whether the same was true in very small universes, where only the quantum description can be used, was laid out in 2003 but was too laborious to complete. Fable 5.2, working largely autonomously, completed it and found the transition is abrupt there, too. In the second problem, Fable 5.2 found the exact limit of a technique physicists have used for more than 15 years to rule out candidate theories of quantum gravity in a simplified universe. Read more about these results in their respective preprints, here and here.

Protein folding
Adeno-associated viruses are small, harmless viruses whose protein shell, the capsid, can be used to deliver gene therapies. The protein structure of the capsid is important—for example, it affects whether the therapy will be blocked by a patient’s immune system—but it’s also highly complex. Existing protein-folding models like AlphaFold can predict individual proteins, but a capsid is built from dozens of them. Building on two open-source protein-folding models, Claude Mythos 5.2 found a novel way to accurately predict a whole capsid’s structure. It wrote code that ran these models on overlapping groups of protein chains, and used the information on the known symmetries of the capsid to merge them together.

Claude’s method worked across several capsids, both natural and engineered (in our tests, it accurately modeled 28 of the 34 it attempted).³ Three computational biologists shared the following reflections on how Claude’s skills could be used to speed up their research into gene therapies:

- Dyno Therapeutics — Sam Sinai, Cofounder and Head of AI: “This acceleration could save meaningful time and cost from our capsid folding pipeline, enabling us to deploy compute more efficiently across many capsid properties that are needed for a genetic medicine. We are excited to help Anthropic push the reasoning capabilities further to reduce the cost of designing capsids overall.”
- Columbia University — Mohammed AlQuraishi, Assistant Professor of Systems Biology and Computer Science: “Large protein assemblies, including capsids, remain an open problem for protein modeling, due to the complexity of accurately predicting and positioning the structures of dozens of individual macromolecules, not to mention the inordinately high computational costs involved. Claude’s approach cleverly tackles this problem for symmetric assemblies, making it possible for individual scientists to model systems on personal workstations that would otherwise require dedicated clusters.”
- Biohub — Zeming Lin, Principal Research Scientist: “Biohub’s goal in open-sourcing ESMFold2 was to enable the scientific community to build on the biology it has learned. We are excited to see Claude prototype a new sampling procedure that enables predictions of large, symmetric complexes such as AAV capsids—a protein used to deliver gene therapies. We will continue to incorporate such contributions from the community that extend our tools to important application domains.”

Mathematics
Mathematical formalization.
Formalization is the process of translating a mathematical proof into a language that a computer can check step by step. It can help human mathematicians gain confidence in results without having to check them by hand (this matters even more when AI models generate results that are hard for humans to verify). Because formalization is such a laborious process, if AI could assist with it, mathematicians could spend more time exploring novel ideas.

Our first formalization of Fermat’s Last Theorem, performed by an unreleased research version of Claude, took 11 days. It relied on a purpose-built harness along with guidance from a human researcher. By contrast, a team of 1,000 Fable 5.2 agents fully formalized the theorem in just 30 hours, with minimal human intervention. Fable 5.2 started from minimal prompts, built its own ways to coordinate, and used no mathematical references, only a list of intermediate theorem statements to score progress. It needed one-third as many action tokens as our first formalization and produced a proof seven times shorter. Opus 5.5 (with the same 1,000-agent setup) completed only 26% of the formalization in 18 hours, and barely made any more progress after 30.

Hardware and robotics
Many of AI’s potential benefits—for example, in speeding up laboratory research—depend on it being able to act in the physical world. Claude Fable 5.2 continues our models’ trend of increasing usefulness in the real world, showing promising results on tasks such as designing hardware devices and substantial advances in controlling physical robots.

Hardware engineering.
We tested Fable 5.2’s skills in hardware engineering, asking it in a one-paragraph prompt to design and produce three working electronic devices with their own circuit boards, 3D-printed enclosures, and software. The devices were a home voice-assistant hub, a USB speakerphone, and a handheld virtual pet. We collaborated on this project with Diode, a company that designs and manufactures circuit boards.

Claude wrote its own specifications, selected available electronic components from US distributors, routed each device’s four-layer circuit board, modeled the enclosures with computer-aided design, and programmed the devices’ software. Each board was ready for manufacturing in under a day, with minimal human input. Once Diode had built the boards, Claude guided the company’s engineers through the testing and assembly of the devices. All three devices worked without needing any electrical modifications.

Robotics.
Compared with earlier Claude models, Fable 5.2 shows substantially improved skills in controlling physical robots—even for robotics tasks on which it has never explicitly been trained. The video shows robots controlled by Fable 5.2 completing a variety of tasks, including solving a puzzle cube, unscrewing a bottle cap, and drawing a picture of a robot. On the public RoboDojo benchmark, which tests how AIs can control a simulated two-arm robot from camera images, Fable 5.2 outperformed other frontier models that were run on the same harness, as well as most AI systems built specifically to control robots (at Max effort, Fable 5.2 scores 64.9%, more than double GPT-6 Astra at 29.8% and Fable 5.1 at 27.6%).

Research and analysis
Early testers using Claude Fable 5.2 for research and analysis tasks found that it can handle more ambiguous, data-heavy tasks than previous models and has better judgment on ambiguous tasks—particularly those that require abstract reasoning and design. Proprietary trading firm Jump Trading tested Fable 5.2 on proxy evaluations that resemble some of its quantitative research tasks, embedding it in a harness similar to the one the firm uses for its own research. In one run, Fable 5.2 effectively played all the necessary roles: code-writer, coordinator, planner, and job-submitter. Previous models had required substantial investments of time to manually rebalance roles to accommodate different models’ strengths and weaknesses.

Other statements from early testers:
- Jump Trading — Lucas Baker, Head of LLM R&D: “Claude Fable 5.2 is incredible at playing every major role within a research system: defining questions, interpreting, coordinating, and of course finding and implementing the key ideas. Definitely one of the strongest on taste and judgment that we’ve seen. In an internal research automation benchmark, it achieved a full 10% lower error than the next best model.”
- Balyasny Asset Management — Ashish Malik, AI Researcher: “In a recent evaluation, we asked Claude Fable 5.2 to investigate how one organization tested a new integration in its core technology systems. It traced the answer to the right sources and didn’t overstate what the evidence showed. It also flagged that the question’s framing could be misleading. In investment research, that restraint makes clear what remains unknown and where the market may be mispricing risk or opportunity.”
- Discovered Materials — Akash Ramdas, Co-Founder: “Phonon calculations are one of the most expensive routine steps in computational materials science, which is why labs often skip stability checks when screening new materials. Claude Fable 5.2 made Quantum ESPRESSO’s phonon code about 36 times faster on average than stock on the same GPU, taking our 13 benchmark cases from 3.3 hours to under four minutes. That beats Fable 5.1’s speedup by 3–4 times.”
- IMC — Marquis Wong, Principal AI Engineer: “With Fable 5.1 we saw the first glimmers of a model coming up with truly innovative research ideas. Claude Fable 5.2 continues that trend. It had the same insight we were impressed with from Fable 5.1 and then came up with a second, entirely new angle. It achieved new best scores on three of the four quant research problems we’ve finished. We’d like to use it for high-impact, long-running research tasks, or for coordinating teams of other models.”
- Harvey — Niko Grupen, Head of AI Research: “In an I-9 compliance review, Claude Fable 5.2 gave the client clearer direction than Fable 5.1. It identified the employees needing immediate attention and explained how to correct each issue and who should act. It’s an exciting improvement in the model’s ability to give practical legal guidance.”
- Fundamental Research Labs — Jeffrey Liu, Member of Technical Staff: “On one task, Claude Fable 5.2 had to pull a company’s financials out of its 10-K into a forecasting model, and the template didn’t say whether a metric should be the reported figure or calculated. It inferred the author’s intent from the cell formatting, caught that the regional numbers didn’t sum to the reported total, and got every cell right. Better judgment calls like that are the main reason it scored 91% on our eval versus 86% for the next best model.”
- XTX Markets — Alex Gerko, Founder and CEO: “In our quantitative research work, Claude Fable 5.2 delivered very strong improvements versus Fable 5.1, especially in the setup with multiple coordinating agents. Its maths research capabilities represent another meaningful advance, too.”
- Box — Yashodha Bhavnani, VP of AI Products: “Before putting AI to work across workflows, you need to trust its approach and conclusions. In our testing, Claude Fable 5.2 identified inconsistencies, drew on context across entire document sets, and adjusted recommendations based on relevant evidence. For example, when reviewing files attached to a loan application, it flagged that the salary deposits and the bank statement’s balance didn’t match, so the underwriter could focus on what to check.”

Safety and alignment
No single test can tell us how a highly capable model will behave once it’s deployed, so we rely on many different tests and many different types of evidence before release. For the model underlying Claude Fable 5.2 and Claude Mythos 5.2, our predeployment safety work included alignment training and testing, newly designed evaluations on the model’s propensity to take unhelpful actions, building stronger safeguards against misuse, and scaling up our behavioral monitoring. The model was also tested before release by external evaluators, including the UK AI Security Institute, Frontier Design, and METR. See the Claude Fable 5.2 and Mythos 5.2 System Card for a summary of their reports and for a full description of our own safety and capabilities testing.

Alignment testing
We ran a suite of evaluations for how well-aligned Claude Fable 5.2 and Claude Mythos 5.2 are in behavioral terms, testing how often they behave in unintended and potentially unsafe ways. Weighing everything we’ve seen across a range of evaluations, we’ve assessed the risk of these models behaving in unsafe ways in high-stakes situations to be low (as with our other recent models).

We tested Claude Mythos 5.2 (the same underlying model as Fable 5.2 without certain cybersecurity or biology safeguards), on our automated behavioral audit, which tests how a model behaves across approximately 1,900 scenarios. Claude Mythos 5.2 performed as well as, or better than, Opus 5.5, Sonnet 5.5, and Claude Mythos 5.1 on most measures. For example, it scored better than all three on most measures that involve misleading users. Hallucinating inputs, falsely claiming to have completed a task, omitting important information, and failing to disclose bad or lazy work were all lower in Claude Mythos 5.2.

Overall misaligned behavior score (automated behavioral audit, 1-10, lower is better):
- Mythos 5.1 : 3.28
- Sonnet 5.5 : 3.10
- Opus 5.5 : 2.79
- Mythos 5.2 : 2.67

We paid particular attention during our testing to behaviors that contributed to recent notable cybersecurity and alignment incidents. For example, we found that Claude Mythos 5.2 has a lower propensity than Opus 5.5, Sonnet 5.5, and Mythos 5.1 to engage in biased or motivated reasoning (such reasoning might mean it “explains away” evidence that it isn’t in a simulation and thus takes actions without a realistic understanding of the consequences).

We ran multiple different evaluations to test the model’s tendency to attempt escaping its sandbox. In two evaluations we’d used previously, Claude Mythos 5.2 made substantially fewer attempts at sandbox escape than any other model we’ve tested. In a dedicated evaluation—an adversarial experiment including over 1,800 scenarios, most of which could not be solved without escaping a sandbox, and where the sandbox has a deliberate weakness—Claude Mythos 5.2 made use of credentials or files that we had placed outside its sandbox in 3.1% of scenarios, about as often as Opus 5.5 (3.3%), less often than Sonnet 5.5 (5.1%), and well below previous iterations of Claude Mythos (5 and 5.1, which scored 39% and 21%, respectively). We found that other techniques, such as describing the sandbox and adding tools to report weaknesses, reduced Claude Mythos 5.2’s escape attempts even further. On other measures—one, for example, involving taking harmful actions after erroneously concluding it was in a simulation—Claude Mythos 5.2 scored slightly worse than Opus 5.5, and about level with Claude Mythos 5.1.

The problem of building evaluations that reliably catch every failure before a model is deployed remains unsolved. The complexities of evaluating highly capable models often muddy the picture—for example, Claude Mythos 5.2 and Fable 5.2 each voice suspicion that they are being evaluated more often than any of our recent models, which challenges our ability to assess how they will act in real-world settings. As these settings expand and capabilities increase with future models, we expect this challenge to grow. That is why we do not rely on these evaluations alone to provide a holistic picture of safety: we draw on monitoring during training, reviews of transcripts from internal use, testing by external evaluators, and interpretability techniques for examining what is happening inside the model. We are also working to make our evaluations more realistic and to better understand what they miss.

Safeguards
Cybersecurity and biology safeguards.
Consistent with previous Claude Fable models, Fable 5.2 comes with safety classifiers that block high-risk cyber activities, including penetration testing, exploit generation, and binary-based vulnerability, as well as most tasks in research biology. When a query is blocked, users will instead receive a response from Opus 4.8 for cybersecurity and Opus 5 for biology. Since the release of Claude Fable 5.1, we have continued to reduce false positives for our safety classifiers. Based on early testing across claude.ai, Claude Code, and Cowork, we observed about 55% fewer blocks with Fable 5.2 compared with Fable 5.1—about 60% fewer in cybersecurity and 40% fewer in biology. Claude Mythos 5.2 is available to vetted organizations that work in these dual-use areas.

AI research and development.
The model that underlies Claude Fable 5.2 and Claude Mythos 5.2 is a step forward in general capabilities. However, during the model’s training, we took steps to limit advances in the specific research capabilities that could most directly accelerate AI development. Thus, in relevant areas, including accelerator kernel optimization and improving large language model architectures, Fable 5.2 and Claude Mythos 5.2 perform at about the level of Opus 5.5. Importantly, we ensured that the training changes did not affect related capabilities like agentic coding, hardware development, and traditional AI or machine learning research (including interpretability research). We do not alter these capabilities as the model is being served to users (that is, at inference time). As described in Section 1.5 of the System Card and similarly to previous models, Fable 5.2 and Claude Mythos 5.2 also include transparent fallbacks to Opus 5 for a small set of topics in this domain, including kernel development on certain nonstandard accelerators.

Anti-distillation.
Distillation, where a model is trained on the outputs of a more advanced one to extract the advanced model’s capabilities, occurs illicitly on an industrial scale, often involving thousands of fake Claude accounts. Since distillation allows for advanced capabilities to be released without the safeguards we’ve built into Claude, it creates safety and national security risks. Fable 5.2 has the strongest protections against distillation of any model we’ve released; it uses the techniques we described in a recent report, which have reduced the data harvested by distillers by 90% to 99%.

We are also expanding the rollout of an API feature that helps guard against illicit distillation: preserved thinking now applies to all accounts. Preserved thinking prevents distillers from editing Claude’s prior context in an attempt to extract its reasoning.

Data privacy and Enterprise Frontier Safeguards
Some more complex forms of AI model misuse can be detected only when observing patterns across multiple requests. For this reason, powerful models like Claude Fable 5.2 and Claude Mythos 5.2 rely on safeguards that monitor a window of usage data (as opposed to individual responses). With Enterprise Frontier Safeguards, automated safety monitoring is run on prompts and responses that are stored in a customer’s infrastructure, making it compatible with zero data retention (ZDR). Enterprise Frontier Safeguards is now in private beta with customers like Bridgewater, Salesforce, and Stripe.

Enterprise customers can request access to Enterprise Frontier Safeguards by contacting their account team or by completing this form. Eligible customers can continue using Claude Fable 5.2 and Claude Mythos 5.2 with zero data retention before implementing safety monitoring with EFS. For other customers, we have 30-day retention for safety monitoring.

Availability
Claude Fable 5.2 is available today on all platforms, including Amazon Web Services, Google Cloud, and Microsoft Azure. Developers can get started with claude-fable-5-2 on the Claude Platform.

This week, we’re giving subscribers on eligible paid plans extra Fable usage. Plans and seats that include Fable models get one to three Fable resets based on how long they’ve subscribed, and Fable is included for up to 50% of weekly usage limits for Pro plans and standard seats on the Team plan.

Cybersecurity professionals can apply for access to Claude Mythos 5.2 through the Cyber Verification Program. Claude Enterprise customers can also use Claude Security, powered by our full family of models, including Claude Mythos 5.2. Life sciences researchers can also apply for access through the Life Sciences Verification Program.

Fast mode for Claude Fable 5.2 and Claude Mythos 5.2 is available on Claude Code, the Claude Platform, Claude Models on Google Cloud (Anthropic managed and Google managed), and Microsoft Foundry (Anthropic hosted). Note that access to Claude Mythos fast mode is available only to organizations who are part of our Verification Programs.

Footnotes:
1. CVE refers to Common Vulnerabilities and Exposures, a system that enumerates software vulnerabilities.
2. The counts are raw findings from one tester’s audit, although testers consistently found that Claude Mythos 5.2 identified more vulnerabilities than earlier models. On our own evaluations, vulnerability identification is roughly on par with Opus 5.5 (see the system card).
3. Earlier work on modeling AAV capsids and other large symmetric protein systems includes FoldaVirus, EvoDOCK and its symmetric extension, SymProFold, CapBuild, MoLPC, CombFold, Uni-Fold Symmetry, Apodex Discovery, and the “big bang” initialization (the last of which was referenced in the prompt we gave to Claude Mythos 5.2). These methods typically assemble the full structure from separately predicted chains or small groups of chains. Claude was permitted to use known symmetries but was instructed not to rely on assembly. Note that accuracy is measured by comparing Cα RMSD with the experimental structure: 1.2 Å for OpenFold3-preview2 and 1.4 Å for ESMFold2 on AAV2 (PDB:1LP3). A capsid counts as accurately modeled if either model came within 3 Å. For AAV2, Claude’s method required about 58 minutes of inference on one NVIDIA H200 GPU for OpenFold3-preview2 and about seven minutes for ESMFold2.
4. None of the external organizations reviewed the contents of this blog post or the contents of the System Card. Those organizations do not necessarily agree with any of the claims made in either publication.
5. We ran these tests on Claude Mythos 5.2 because testing the model with reduced safeguards provides the most comprehensive look at model behavior. We expect Fable 5.2 to behave similarly; in some cases, more potential pathways for misuse should be blocked given its stronger safeguards.
