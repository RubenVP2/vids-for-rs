# Source — Gemini 4 Carbon: our next frontier model

- URL : https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/
- Publié par : Google (blog officiel « The Keyword »)
- Auteur : Koray Kavukcuoglu, SVP, Google DeepMind and Chief AI Architect, Google
- Date de publication : 2026-10-28 (métadonnées de la page : `datePublished 2026-10-28T17:00:00+00:00`)
- Type : blog
- Statut : annoncé, avec un accès restreint qui démarre cette semaine pour un petit groupe de défenseurs en cybersécurité. Pas disponible pour le grand public, les développeurs ni les entreprises. Phrases qui le prouvent : « Starting this week, we will make Carbon available to a subset of cyber defenders and will gradually phase access to additional trusted partners through our Fairwind Program. We're continuing to gather feedback and iterate on guardrails before making Carbon available to developers, businesses, and consumers via our product surfaces as soon as possible. »
- Langue : en

> **Sources utilisées.** Le billet officiel a été lu en entier (HTML brut). Les autres
> sources servent à recouper. Tout fait qui vient d'elles seules porte la mention
> **(source secondaire)**.
>
> | Code | Source | Nature | Date |
> |---|---|---|---|
> | **[BLOG]** | URL ci-dessus | Billet officiel de Google. Source principale. | 2026-10-28, 17:00 UTC |
> | **[X]** | https://x.com/GoogleAI/status/2115489593818816591 | Post officiel de @GoogleAI. La page x.com est bloquée (HTTP 402) : texte récupéré par l'oEmbed et l'API de syndication de X. **Texte tronqué** après « We're first making Carbon… » (post long dont la suite n'est pas accessible). Image jointe : un visuel « Gemini 4 Carbon / Our next frontier model » sans aucun chiffre. | 2026-10-28, 17:03 UTC |
> | **[9TO5]** | https://9to5google.com/2026/10/28/gemini-4-carbon-announcement/ | Média, Abner Li. Reprend surtout des citations du billet. Article marqué « Updating… » (encore en cours de mise à jour). | 2026-10-28, 17:08 UTC (modifié à 17:21 UTC) |
> | **[INV]** | https://uk.investing.com/news/stock-market-news/google-unveils-gemini-4-carbon-with-advanced-cybersecurity-features-4938781 | Média financier, Vlad Schepkov. Bloqué en accès direct (403) : lu par l'outil de lecture web, donc **en résumé seulement, pas en texte intégral**. | 2026-10-28, « 17:12 » (fuseau non précisé) |
> | **[FAIRWIND]** | https://deepmind.google/fairwind-program/ | Page officielle du programme Fairwind (liée dans le billet). | non datée |
> | **[RAPPORT]** | https://storage.googleapis.com/deepmind-media/gemini/gemini_4_safety_report.pdf | PDF lié dans le billet sous le nom « Safety and Security report ». **C'est le rapport de Gemini 4 Argon** (« Gemini 4 Argon — Safety & Security Report, October 2026 »). Le mot « Carbon » n'y apparaît pas. | octobre 2026 |
> | **[AA]** | https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index | Classement tiers lié dans le billet. Consulté pour recouper le score. | consulté le 2026-10-28 |
>
> **Model card** : il n'y en a pas pour Carbon. La page https://deepmind.google/models/model-cards/
> ne liste que « Gemini 4 Argon » (mise à jour le 13 oct. 2026). Le billet ne renvoie vers aucune
> model card.

## Fiche

### Faits

**Le modèle**
- Google annonce Gemini 4 Carbon, qu'il présente comme son modèle le plus puissant, fort en cybersécurité et sur les tâches longues. [BLOG] [X] [9TO5] [INV]
- Carbon succède à Gemini 4 Argon, lancé deux semaines plus tôt. [BLOG] [9TO5] [INV]
- Google dit que ses chercheurs et ses modèles « travaillent main dans la main » pour faire progresser les capacités plus vite. [BLOG]
- Selon le post X de Google, Carbon progresse sur la plupart des benchmarks (tests de référence), en particulier en programmation autonome et en cyberdéfense. [X]

**Ce qu'il sait faire (selon Google)**
- Carbon est conçu pour des tâches d'ingénierie longues et difficiles, et pour des « flux agentiques » soutenus (l'IA enchaîne seule de nombreuses étapes). [BLOG]
- En interne, les équipes de Google ont vu Carbon tourner pendant plusieurs jours sans s'arrêter aux impasses, par exemple pour trouver l'origine de bugs subtils et les corriger dans de très gros programmes. [BLOG]
- Google a travaillé sur la programmation, les tâches agentiques et scientifiques, le développement web complet (*full-stack*) et la compréhension multimodale (texte, images, etc.). [BLOG]
- En cybersécurité, Google dit que Carbon est au meilleur niveau sur les trois étapes de la défense : trouver les failles, vérifier si elles sont exploitables, les corriger. [BLOG]
- Les scores en cybersécurité ont été mesurés **sans garde-fous** (« evaluated without guardrails »). [BLOG]
- Selon l'équipe Chrome de Google, Carbon fait plus de 10 fois mieux que le grand modèle d'un autre laboratoire, non nommé, pour produire des correctifs de qualité. [BLOG]
- Wiz, que Google appelle « our leading Cloud security platform », voit Carbon en tête sur des tests d'intrusion web (*penetration testing*). [BLOG]

**Sécurité et comportement (tests internes de Google)**
- Carbon reprend les protections d'Argon : entraînement, défenses contre les abus en temps réel, résistance à l'injection de consignes (*prompt injection*) et surveillance du raisonnement (*chain-of-thought monitoring*). [BLOG]
- Google l'a entraîné à moins tricher : moins de raccourcis et de failles du règlement exploitées pour réussir un test. [BLOG]
- Face à une demande ambiguë, Carbon va chercher les sources utiles et signale les incohérences à l'utilisateur avant d'agir, au lieu de deviner. [BLOG]
- Quand une action est bloquée, il ne l'invente pas : il donne la liste de ce qu'il manque. [BLOG]

**Accès et calendrier**
- Google dit faire un déploiement « délibéré » et participer au processus volontaire de tests avant lancement du gouvernement américain. [BLOG] [INV]
- À partir de cette semaine, Carbon sera accessible à un sous-ensemble de défenseurs en cybersécurité. [BLOG] [9TO5] [INV]
- L'accès sera ensuite élargi progressivement à d'autres partenaires de confiance via le programme Fairwind. [BLOG] [INV]
- Développeurs, entreprises et grand public n'y ont pas encore accès : Google dit vouloir l'ouvrir « dès que possible » via ses produits, après avoir recueilli des retours et ajusté les garde-fous. [BLOG]
- Le dernier intertitre du billet est « Coming soon to developers, businesses, and consumers ». [BLOG] [9TO5]
- Le prix de lancement est le même que celui d'Argon. [BLOG] [INV]

**Le programme Fairwind (page liée)**
- Fairwind donne un accès anticipé à des modèles avancés à des défenseurs prioritaires : gouvernements, hôpitaux, opérateurs télécoms, infrastructures critiques. [FAIRWIND]
- Il faut postuler par formulaire. Google vérifie les candidats et ne permet pas de revendre ni de partager l'accès. [FAIRWIND]
- Le jour de l'annonce, la page Fairwind ne parle que de Gemini 4 Argon et **ne mentionne pas Carbon**. [FAIRWIND]

### Chiffres

- **#1** et **59** — rang et score de Carbon à l'Artificial Analysis Intelligence Index v5.0 (indice tiers qui agrège des tests d'intelligence) — « Carbon ranks #1 on the recently updated v5.0 of Artificial Analysis Intelligence Index at 59. » [BLOG]
  - Recoupement (source secondaire, [AA]) : la page affiche « Gemini 4 Carbon (High) : 59 », devant « Claude Opus 5.5 (Max) : 58 » et « Claude Opus 5.5 (Xhigh) : 57 ». **L'écart avec le 2e est d'un seul point.**
- **88.2%** — SEC-bench Pro, trouver des failles — « landing a firm lead in SEC-bench Pro (88.2%) for finding vulnerabilities » [BLOG]
- **54.8%** — ExploitGym, vérifier si une faille est exploitable — « Carbon sets a new state-of-the-art on the popular exploitation benchmark ExploitGym (54.8%). » [BLOG]
- **71.0%** — CWE-bench (de Collinear), corriger la faille à la racine — « Carbon reaches 71.0% on Collinear's CWE-bench » [BLOG]
- **+89** points Elo, **#4**, **1769** — classement WebDev Arena (développement web) — « Carbon jumps +89 elo points to land at #4 (1769) on WebDev Arena. » [BLOG]
- **more than 2x** — gain de taux de réussite pour écrire du code sécurisé, par rapport à Argon (test interne) — « Carbon achieves more than 2x uplift in success rate for generating secure code over Argon. » [BLOG]
- **more than 10X** — meilleure production de correctifs que le modèle d'un autre labo, selon l'équipe Chrome — « Carbon performed more than 10X better than another lab's large frontier model when generating high quality patches. » [BLOG]
- **0.0%** — triche réussie sur Terminal-Bench 4.0 — « Carbon reduced successful cheating on Terminal-Bench 4.0 to 0.0% » [BLOG]
- **0.4%** — tentatives de triche sur Terminal-Bench 4.0 — « with attempts to cheat dropping to 0.4% » [BLOG]
- **almost 80%** — baisse des alertes graves de « désalignement » (comportement contraire à ce qu'on attend) en codage réel avec les équipes internes — « high-severity misalignment alerts dropped by almost 80% » [BLOG]
- **approximately 2x** — baisse des affirmations sans fondement par rapport à Argon (test interne) — « Carbon cuts unsupported claims by approximately 2x over Argon. » [BLOG]
- **26%** — moins de cas où le modèle en fait trop (sort de sa mission) — « Carbon simultaneously reduced overreach by 26% » [BLOG]
- **29%** — moins de cas où il n'en fait pas assez — « and under-service by 29% » [BLOG]
- **0.7%** → **0.0%** — taux de réussite des attaques par injection de consignes (benchmark IPI de Gray Swan), d'Argon à Carbon — « with a very low 0.7% attack success rate, Carbon achieves 0.0% » [BLOG]
- **$2** — prix de lancement par million de *tokens* en entrée (texte envoyé au modèle) — « at $2 per million input tokens » [BLOG]
- **$10** — prix de lancement par million de *tokens* en sortie (texte produit par le modèle) — « and $10 per million output tokens » [BLOG]
- **95%** — réduction sur les *tokens* d'entrée mis en cache — « with cached input tokens priced at 95% off input token price » [BLOG]
- **$4** / **$20** — prix par million de *tokens* (entrée / sortie) après la période de lancement — « After the introductory period expires, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply. » [BLOG, note de bas de page 1]
- **two weeks** — délai depuis le lancement d'Argon — « Building on Gemini 4 Argon, which was launched two weeks ago » [BLOG]
- **over 650** — nombre de partenaires du programme Fairwind — « We currently work with over 650 partners globally. » [FAIRWIND] (page liée, pas le billet)

### Citations utilisables (≤ 15 mots)

- « our strongest model with state-of-the-art cybersecurity and long horizon capabilities » — Koray Kavukcuoglu, Google [BLOG]
- « Carbon run for days to persist through dead ends » — Google [BLOG]
- « We're taking a deliberate approach to rollout » — Google [BLOG]
- « available to developers, businesses, and consumers via our product surfaces as soon as possible » — Google [BLOG]
- « resisting every evaluated attack attempt » — Google, sur l'injection de consignes [BLOG]
- « Pushing the frontier forward requires moving fast while remaining deliberate about deployment. » — Google [BLOG]
- « Carbon represents a step up across most benchmarks » — @GoogleAI sur X [X]

### Disponibilité

- **Maintenant (à partir de cette semaine)** : seulement « a subset of cyber defenders », un petit groupe de défenseurs en cybersécurité qui n'est pas nommé. Le billet dit « will make… available » : un accès qui démarre cette semaine, sans jour précis. [BLOG]
- **Ensuite, progressivement** : d'autres « trusted partners » via le programme Fairwind, sur candidature (gouvernements, infrastructures critiques, grandes plateformes tech, labos académiques). Aucune date. [BLOG] [FAIRWIND]
- **Développeurs (API), entreprises, grand public** : **pas d'accès**. « As soon as possible » / « soon », sans date. [BLOG]
- **Où** : « via our product surfaces », sans préciser lesquels. Le billet ne nomme ni l'app Gemini, ni l'API Gemini, ni AI Studio, ni Vertex AI, ni un abonnement. [BLOG]
- **Prix** : $2 / $10 par million de *tokens* (entrée / sortie) au lancement, -95 % sur l'entrée en cache, puis $4 / $20 après une « période de lancement » dont la durée n'est pas donnée. Ce sont des prix au *token*, donc pour les développeurs : aucun prix d'abonnement grand public n'est annoncé. [BLOG]
- **Régions** : non précisé.

### Zones floues

- **Aucune date** pour l'API, l'app Gemini, les entreprises ou le grand public : seulement « as soon as possible » et « soon ».
- **Qui sont les « cyber defenders »** du premier groupe, et combien sont-ils ? Non précisé. Et le billet ne dit pas si ce premier groupe paie.
- **Fairwind pas à jour** : la page du programme ne parle que d'Argon. Carbon via Fairwind reste une promesse au futur (« will gradually phase access »).
- **Pas de model card ni de rapport de sécurité propre à Carbon.** Le lien « Safety and Security report » du billet mène au rapport d'**Argon**, et il est cité dans une phrase sur Argon. Attention à ne pas le présenter comme le rapport de Carbon.
- **Scores cyber mesurés « sans garde-fous »** : la version que les utilisateurs recevront aura des garde-fous, que Google dit encore en train d'ajuster. Les scores ne disent donc pas forcément ce que fera le modèle livré.
- **« Firm lead » sans comparaison** : le billet ne donne aucun score des concurrents sur SEC-bench Pro, ExploitGym ni CWE-bench.
- **#1 de justesse** : sur Artificial Analysis, Carbon a 59 contre 58 pour le 2e (source secondaire [AA]). Le billet ne précise pas non plus la configuration testée ; [AA] indique « (High) ».
- **#4 sur WebDev Arena** : Carbon n'est pas premier là-bas. Les trois modèles devant lui ne sont pas nommés dans le billet.
- **Chiffres internes sans méthode** : « more than 2x », « more than 10X » (équipe Chrome, contre un labo non nommé), « almost 80% », « approximately 2x », 26 %, 29 %. Ni protocole ni taille d'échantillon.
- **Wiz n'est pas un témoin indépendant** : le billet l'appelle « *our* leading Cloud security platform ». [INV] le présente simplement comme une « security firm », ce qui fait perdre cette nuance.
- **« Run for days »** : une anecdote interne, sans exemple chiffré.
- **Période de lancement** : durée non précisée avant le passage à $4 / $20.
- **Post X tronqué** : la suite de « We're first making Carbon… » n'a pas pu être lue.

**Écarts entre les sources**
- [INV] ne mentionne pas le prix après la période de lancement ($4 / $20). [BLOG] et [9TO5] le donnent.
- [9TO5] écrit « Once available, Google will offer introductory pricing », ce qui suggère que le prix ne s'applique qu'à l'ouverture. [BLOG] dit « will launch at the same introductory price ». Ce n'est pas contradictoire, mais aucune source ne dit quand on pourra payer.
- [9TO5] est marqué « Updating… » et pourrait changer. [INV] n'a été lu qu'en résumé.
- Aucune contradiction sur les chiffres : les trois sources donnent les mêmes scores (59, 88.2 %, 54.8 %, 71.0 %, #4 / 1769 / +89).

## Texte de l'article

Gemini 4 Carbon: our next frontier model

Oct 28, 2026

Gemini 4 Carbon is our strongest model with state-of-the-art cybersecurity and long horizon capabilities.

Koray Kavukcuoglu
SVP, Google DeepMind and Chief AI Architect, Google

Today, we're announcing the next frontier model: Gemini 4 Carbon, our strongest model with state-of-the-art cybersecurity and long horizon capabilities.

Carbon ranks #1 on the recently updated v5.0 of Artificial Analysis Intelligence Index at 59. It shows significant gains across coding and agentic tasks as well as across key capabilities critical for cybersecurity defense, landing a firm lead in SEC-bench Pro (88.2%) for finding vulnerabilities, ExploitGym (54.8%) for exploitation, and CWE-bench (71.0%) for patching. On internal benchmarks, Carbon drives a strong uplift in generating secure code, and in live coding environments with our own teams it shows reduced misalignment and fabrication rates.

Building on Gemini 4 Argon, which was launched two weeks ago, Carbon illustrates the pace at which we're pushing the frontier forward. Our researchers and models are working hand in hand to advance capabilities faster, while strengthening our safeguards in tandem.

We're taking a deliberate approach to rollout and are actively engaged in the U.S. government's voluntary process for pre-release model testing. Starting this week, we will make Carbon available to a subset of cyber defenders and will gradually phase access to additional trusted partners through our Fairwind Program. We're continuing to gather feedback and iterate on guardrails before making Carbon available to developers, businesses, and consumers via our product surfaces as soon as possible.

Gemini 4 Carbon will launch at the same introductory price[1] as Argon at $2 per million input tokens and $10 per million output tokens, with cached input tokens priced at 95% off input token price.

### Improving coding and reasoning for challenging, long-horizon tasks

Designed to take on much harder, long-horizon engineering problems, Carbon is built for sustained agentic workflows. Internally, our teams have seen Carbon run for days to persist through dead ends to tackle complex, multi-step engineering tasks like root-causing and patching subtle bugs across large codebases and low-level systems.

Building on user feedback, we focused on improving model performance across a variety of domains, including coding, agentic, and scientific tasks, as well as full-stack web development and multimodal understanding. With improved quality of output and artifacts in web development, Carbon jumps +89 elo points to land at #4 (1769) on WebDev Arena.

### State-of-the-art cybersecurity performance to help build secure systems

Gemini 4 Carbon delivers a significant leap in cybersecurity capabilities. It achieves state-of-the-art performance across the cybersecurity defense lifecycle — vulnerability detection, validation, and remediation.

Our teams are already seeing strong gains in cyberdefense. On internal benchmarks, Carbon achieves more than 2x uplift in success rate for generating secure code over Argon. As another example, the Chrome team has reported that Carbon performed more than 10X better than another lab's large frontier model when generating high quality patches. Wiz, our leading Cloud security platform, also observes Carbon leading on benchmarks for web penetration testing, a core capability for Wiz's Scan for Good initiative.

Carbon excels across key external benchmarks (evaluated without guardrails):

- Finding real vulnerabilities: Core to cybersecurity defense is finding real vulnerabilities. Carbon achieves a state-of-the-art 88.2% on SEC-bench Pro, autonomously uncovering complex flaws buried in real-world software.
- Validating risk through exploitation: To prioritize which vulnerabilities to remediate first or remediate at all, cyber defenders increasingly rely on models to check which vulnerabilities are exploitable. Carbon sets a new state-of-the-art on the popular exploitation benchmark ExploitGym (54.8%).
- Patching at the root cause: Ultimately after identifying the vulnerabilities, fixing the root cause is a critical step in the cybersecurity defense lifecycle. Carbon reaches 71.0% on Collinear's CWE-bench, turning validated findings directly into working code fixes.

### Advancing frontier model safety & security

Gemini 4 Carbon builds on the same multi-layered safety and security stack of Argon — combining model training, real-time misuse defenses, prompt-injection resilience, and chain-of-thought monitoring. In particular, we made significant strides in model alignment with Argon, and reported its propensities to behave in an aligned way in our Safety and Security report. With Carbon, we challenged ourselves to go a step further on alignment, and trained the model to respond to complex or high-pressure tasks in the right way.

- Reducing shortcuts and loophole exploitation: With Carbon, we further mitigated shortcut attempts in training while ensuring high-quality coding performance. Carbon reduced successful cheating on Terminal-Bench 4.0 to 0.0%, with attempts to cheat dropping to 0.4% — all while improving overall accuracy. In live coding environments with our internal teams, we observed that high-severity misalignment alerts dropped by almost 80%.
- Greater transparency and honesty: In our internal testing, Carbon cuts unsupported claims by approximately 2x over Argon. It puts methodological caveats directly into the deliverable or withholds blocked actions with a clear list of what remains required, rather than fabricating or hedging around missing evidence.
- Improved collaboration with the user in the face of ambiguity: Rather than guessing or forcing a path forward, Carbon retrieves the relevant sources and surfaces discrepancies to the user before acting — as a result, users should observe a much better collaborative experience with Carbon.
- Following through without overstepping: Carbon simultaneously reduced overreach by 26% and under-service by 29% resulting in much more reliable execution of multi-step plans end-to-end while respecting project constraints and staying strictly within scope.
- Resisting prompt injection: While Argon previously led the Gray Swan's Indirect Prompt Injection (IPI) Benchmark in prompt injection resistance with a very low 0.7% attack success rate, Carbon achieves 0.0% — resisting every evaluated attack attempt.

### Coming soon to developers, businesses, and consumers

Pushing the frontier forward requires moving fast while remaining deliberate about deployment. With Gemini 4 Carbon, our goal is to deliver meaningful leaps in software engineering and cybersecurity defense without compromising on safety or reliability. We're eager to see how the initial cohort of cyber defenders use this model and we look forward to bringing Carbon to developers, businesses, and consumers soon.

---

[1] After the introductory period expires, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply.

Liens présents dans le billet :
- Artificial Analysis Intelligence Index : https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index
- WebDev Arena : https://arena.ai/leaderboard/code/webdev
- SEC-bench Pro : https://sec-bench.github.io/
- ExploitGym : https://github.com/sunblaze-ucb/exploitgym
- CWE-bench : https://cwe-bench.com/#leaderboard
- Safety and Security report (rapport d'**Argon**) : https://storage.googleapis.com/deepmind-media/gemini/gemini_4_safety_report.pdf
- Fairwind Program : https://deepmind.google/fairwind-program/
- Wiz, Scan for Good : https://www.wiz.io/blog/scan-for-good-critical-ai-exposures
- Annonce de Gemini 4 Argon : https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/
