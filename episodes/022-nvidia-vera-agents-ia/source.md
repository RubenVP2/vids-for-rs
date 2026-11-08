# Source — Vera Delivers the Best of Both Worlds: Highest Throughput and Fastest Agents

- URL : https://blogs.nvidia.com/blog/vera-cpu-highest-throughput-fastest-agents/
- Publié par : NVIDIA
- Auteur : Hannah Coutand
- Date de publication : 2026-11-05
- Type : blog
- Statut : annoncé — « Partners are already putting Vera to work. Early adopters see the same exceptional performance in production-style tests: Perplexity : Ran agentic coding tasks 1.5x faster with Vera than on traditional CPUs. Perplexity plans to deploy Vera in an upcoming production system. »
- Langue : en

## Fiche

### Faits
- Les agents d'IA effectuent plus que simplement générer des réponses : ils recherchent des informations, interrogent des bases de données, écrivent et testent du code, et passent à l'action.
- Chaque étape d'action d'un agent repose sur un processeur (CPU), les agents alternant entre le raisonnement sur processeur graphique (GPU) et l'exécution sur processeur (CPU) tout au long d'une tâche.
- Les centres de données et usines d'IA (« AI factories ») font face à des limites strictes de puissance électrique disponible.
- NVIDIA présente le processeur NVIDIA Vera, conçu pour combiner haute vitesse d'exécution d'agents et grande capacité par watt au sein d'un seul CPU.
- Dans une comparaison modélisée sur un centre de données de 100 mégawatts, NVIDIA affirme qu'un seul CPU Vera surpasse à la fois le CPU x86 le plus rapide et le CPU x86 le plus économe en énergie.
- Le CPU Vera permet de faire tourner 1,6 fois plus d'agents par watt par rapport au processeur x86 le plus rapide.
- Le CPU Vera offre une vitesse d'exécution des agents 2 fois plus rapide comparé au CPU x86 le plus économe en énergie.
- Des partenaires et premiers utilisateurs testent déjà Vera en pré-production : Perplexity, DeepInfra, ClickHouse, DuckLabs, Daytona et Modal.
- Perplexity a exécuté des tâches de code d'agents 1,5 fois plus vite sur Vera que sur des CPU traditionnels et prévoit de déployer Vera dans un système de production à venir.
- DeepInfra a atteint jusqu'à 2,2 fois la vitesse du meilleur processeur x86 sur l'orchestration d'agents en production.
- Le binaire standard de ClickHouse a scalé de façon quasi linéaire sur 176 cœurs et a pris la tête du classement ClickBench.
- DuckLabs a atteint environ 1,5 fois la performance médiane TPC-H SF1000 par rapport à une base Intel Xeon 6.
- Daytona a démarré 1 000 bacs à sable (sandboxes) d'agents en 10,8 secondes sur Vera contre 88,4 secondes sur x86.
- Modal a atteint jusqu'à 2 fois le débit de sandboxes par cœur par rapport à du matériel x86 équivalent.

### Chiffres
- 100-megawatt — échelle de comparaison du centre de données — « In a 100-megawatt data center comparison, NVIDIA found that a single Vera CPU performs better than the fastest x86 CPU and the most energy-efficient x86 CPU. »
- 1.6x — multiplication du nombre d'agents par watt par rapport au processeur x86 le plus rapide — « Vera delivers industry-leading agent speed while enabling 1.6x more agents per watt versus the fastest x86 CPU. »
- 2x — accélération de la vitesse d'agent comparée au CPU x86 le plus économe — « Vera delivers 2x faster agent speed with leading energy efficiency compared with the most energy-efficient x86 CPU. »
- 1.5x — accélération constatée par Perplexity sur les tâches de code d'agents — « Ran agentic coding tasks 1.5x faster with Vera than on traditional CPUs. »
- 2.2x — accélération maximale rapportée par DeepInfra sur l'orchestration d'agents — « Delivered up to 2.2x speed of the best x86 processor on agentic orchestration »
- 176 — nombre de cœurs CPU de la puce Vera testés avec ClickHouse — « scaled near-linearly across 176 cores and topped the ClickBench hardware leaderboard. »
- 1.5x — gain de performance DuckLabs au benchmark TPC-H SF1000 vs Intel Xeon 6 — « Achieved about 1.5x the median TPC-H SF1000 performance of an Intel Xeon 6 baseline. »
- 1,000 — nombre de bacs à sable d'agents démarrés en parallèle par Daytona — « Brought 1,000 agent sandboxes online in 10.8 seconds »
- 10.8 seconds — temps de démarrage de 1 000 sandboxes sur Vera chez Daytona — « Brought 1,000 agent sandboxes online in 10.8 seconds »
- 88.4 seconds — temps de démarrage des mêmes 1 000 sandboxes sur x86 chez Daytona — « using Vera versus 88.4 seconds with x86. »
- 12.7 — nombre de tâches achevées par seconde à 2 000 sandboxes simultanées chez Daytona — « achieved 12.7 completed jobs per second at 2,000 concurrent sandboxes »
- 2,000 — nombre de bacs à sable simultanés testés par Daytona — « at 2,000 concurrent sandboxes »
- 2x — débit maximal de sandboxes par cœur rapporté par Modal — « Achieved up to 2x sandbox throughput per core versus comparable x86 hardware »

### Citations utilisables (≤ 15 mots)
- « AI agents do more than generate answers. » — NVIDIA
- « each of those steps relies on a CPU » — NVIDIA
- « AI factories are power limited. » — NVIDIA
- « maximizes the work done for every watt. » — NVIDIA
- « Vera delivers both fast agent performance and high capacity per watt » — NVIDIA

### Disponibilité
- Qui : Fournisseurs d'infrastructure d'IA et centres de données (partenaires en test : Perplexity, DeepInfra, Daytona, Modal...). Pas destiné au grand public directement mais pour les serveurs faisant tourner les services IA.
- Où : Déploiements en centres de données (data centers).
- Quand : Annoncé le 5 novembre 2026. Tests de production en cours avec des partenaires ; déploiement prévu prochainement chez Perplexity.
- Prix : Non précisé.

### Zones floues
- Prix unitaire et date de disponibilité générale commerciale non précisés.
- Consommation électrique exacte en watts non divulguée (seuls des ratios relatifs sont fournis).
- Architecture exacte sous-jacente (ARM v9, détails des cœurs) non détaillée dans le billet de blog.
- Comparatifs basés en partie sur des simulations (comparaison sur un data center de 100 MW).

## Texte de l'article

AI agents do more than generate answers. They search for information, query databases, write and test code and take action.
Each of those steps relies on a CPU, with agents moving between GPU reasoning and CPU execution throughout a task.
As businesses put more agents to work, AI factories need CPUs that can execute those steps quickly and support many agents at once, all within the limits of available power.

What this means:
AI infrastructure providers need to support more agents without making each one wait longer to get work done. And critically, AI factories are power limited. This means operators need to choose infrastructure that maximizes the work done for every watt.

Why it matters:
NVIDIA Vera delivers both fast agent performance and high capacity per watt within a single CPU. That gives providers one CPU for a range of agent workloads, rather than having to mix and match fast and dense x86 parts to balance speed and capacity.

The data that proves it:
In a 100-megawatt data center comparison, NVIDIA found that a single Vera CPU performs better than the fastest x86 CPU and the most energy-efficient x86 CPU.
Vera delivers industry-leading agent speed while enabling 1.6x more agents per watt versus the fastest x86 CPU.
Vera delivers 2x faster agent speed with leading energy efficiency compared with the most energy-efficient x86 CPU.

Partners are already putting Vera to work. Early adopters see the same exceptional performance in production-style tests:
Perplexity: Ran agentic coding tasks 1.5x faster with Vera than on traditional CPUs. Perplexity plans to deploy Vera in an upcoming production system.
DeepInfra: Delivered up to 2.2x speed of the best x86 processor on agentic orchestration for its production agent workload, achieving the fastest of the four architectures tested.
ClickHouse: Its standard binary, with no Vera-specific tuning, scaled near-linearly across 176 cores and topped the ClickBench hardware leaderboard.
DuckLabs: Achieved about 1.5x the median TPC-H SF1000 performance of an Intel Xeon 6 baseline.
Daytona: Brought 1,000 agent sandboxes online in 10.8 seconds, and achieved 12.7 completed jobs per second at 2,000 concurrent sandboxes, using Vera versus 88.4 seconds with x86.
Modal: Achieved up to 2x sandbox throughput per core versus comparable x86 hardware, with gains that grow under heavy load.
