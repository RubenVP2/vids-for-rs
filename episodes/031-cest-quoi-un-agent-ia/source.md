# Source — What are AI agents? Definition, examples, and types

- URL : https://cloud.google.com/discover/what-are-ai-agents
- Publié par : Google Cloud
- Auteur : inconnu (non précisé)
- Date de publication : 2026-04-02 (indiqué dans le texte : « Last Updated: 04/02/2026 » ; date de création initiale inconnue)
- Type : article
- Statut : disponible — « Organizations have been deploying agents to address a variety use cases », « Google Cloud provides a portfolio of products and solutions in the AI agent space. »
- Langue : en

## Fiche

### Faits
- Un agent IA est un système logiciel utilisant l'intelligence artificielle pour poursuivre des objectifs et exécuter des tâches pour le compte d'utilisateurs.
- Les agents IA font preuve de capacités de raisonnement, de planification, de mémoire et possèdent un niveau d'autonomie pour prendre des décisions, apprendre et s'adapter.
- Leurs capacités reposent en grande partie sur la nature multimodale de l'IA générative et des modèles de fondation, capables de traiter simultanément texte, voix, vidéo, audio, code et autres données.
- Les agents peuvent collaborer entre eux pour coordonner et mener à bien des flux de travail (workflows) complexes.
- Les fonctionnalités clés des agents dérivent du framework ReAct (Reasoning and Acting) et se décomposent en six capacités : raisonner, agir, observer, planifier, collaborer et s'auto-améliorer (self-refining).
- L'action d'un agent peut être physique (dans le cas de l'IA incarnée / embodied AI) ou numérique (envoi de messages, mise à jour de données, déclenchement de processus).
- L'observation s'effectue via des capteurs, la vision par ordinateur ou le traitement automatique du langage naturel pour comprendre le contexte.
- L'auto-amélioration permet à l'agent d'adapter son comportement à partir des retours d'expérience et d'algorithmes d'optimisation.
- Un agent IA se distingue d'un assistant IA et d'un bot par son autonomie proactive, sa capacité à exécuter des tâches complexes multi-étapes et sa prise de décision autonome.
- Un assistant IA est conçu pour collaborer directement avec l'utilisateur sous sa supervision, réagissant à ses demandes et recommandant des actions, mais laissant la décision finale à l'humain.
- Un bot est le système le moins autonome, réactif, appliquant des règles préprogrammées simples avec peu ou pas d'apprentissage.
- L'architecture de fonctionnement d'un agent IA s'articule autour de quatre piliers : le persona (rôle, personnalité, style de communication), la mémoire (court terme, long terme, épisodique, consensus), les outils (fonctions et API externes) et le modèle (LLM servant de « cerveau »).
- La mémoire d'un agent se divise en quatre types : court terme (interactions immédiates), long terme (historique et conversations passées), épisodique (expériences vécues) et consensus (informations partagées entre plusieurs agents).
- Les outils externes manipulés par un agent peuvent disposer d'interfaces physiques, graphiques ou programmatiques (API).
- Les agents peuvent être classés selon leur mode d'interaction : partenaires interactifs / agents de surface (en dialogue direct avec l'humain, déclenchés par une requête utilisateur) ou processus d'arrière-plan autonomes (agents de workflow sans interaction humaine directe, déclenchés par des événements).
- Les agents peuvent aussi être classés selon leur nombre : agent unique (single agent, opérant seul avec un seul modèle de fondation) ou multi-agents (plusieurs agents collaborant ou en compétition, chacun pouvant s'appuyer sur des modèles de fondation différents).
- Google Cloud classe les cas d'usage d'agents en entreprise en six catégories : agents clients (service client et recommandation multicanal), agents collaborateurs (productivité interne et tâches répétitives), agents créatifs (génération de contenu, design, campagnes), agents de données (analyse complexe et recherche d'insights vérifiés), agents de code (génération et assistance de code) et agents de sécurité (mitigation des attaques, prévention et enquêtes).
- Les agents IA présentent des limites notables : inaptitude aux tâches requérant une forte empathie ou intelligence émotionnelle (thérapie, travail social, gestion de conflits), incapacité de jugement moral dans des contextes éthiques critiques (justice, maintien de l'ordre, santé), difficultés face à des environnements physiques imprévisibles (chirurgie, secours en cas de catastrophe), et coût de calcul élevé rendant le déploiement difficile pour de petits budgets.
- Google Cloud propose plusieurs solutions pour construire et héberger des agents : la plateforme Gemini, Customer Experience Agent Studio, Agent Garden (catalogue d'agents préconstruits), Agent Development Kit (SDK Python open source), le protocole d'interopérabilité open source A2A, et Cloud Run pour l'hébergement conteneurisé serverless (avec mise à l'échelle jusqu'à zéro).

### Chiffres
- 04/02/2026 — date de mise à jour du document Google Cloud — « Last Updated: 04/02/2026 »
- six — nombre de grandes catégories de cas d'usage des agents identifiées en entreprise — « which we group into six key broader categories »
- one — nombre maximal de modèle de fondation pouvant être pris en charge par un agent unique — « Can only handle one foundation model for its processing. »
- zero — niveau d'instances conteneurisées atteint par Cloud Run lorsque l'agent est inactif — « can scale down to zero when the agent is idle »

### Citations utilisables (≤ 15 mots)
- « software systems that use AI to pursue goals and complete tasks » — Google Cloud
- « reasoning and acting (as described in ReAct Framework) » — Google Cloud
- « LLMs act as the "brain" of an agent » — Google Cloud
- « scale down to zero when the agent is idle » — Google Cloud
- « interoperable with any service, platform, or infrastructure » — Google Cloud
- « agents divide tasks like specialized workers, getting more done overall » — Google Cloud

### Disponibilité
- **Produits et outils Google Cloud** : Disponibles pour les entreprises et développeurs sur la console Google Cloud (plateforme Gemini, Agent Studio, Cloud Run).
- **Frameworks open source** : Le SDK Agent Development Kit (ADK) et le protocole A2A sont accessibles en open source sur GitHub.
- **Accès / Tarification** : Modèle serverless à l'usage sur Cloud Run (facturation exacte des ressources consommées) ; offre de bienvenue Google Cloud de 300 $ de crédits gratuits et plus de 20 produits gratuits en libre accès.

### Zones floues
- Il s'agit d'un article de vulgarisation et de cadrage SEO (« Topic »), non d'une annonce produit datée ou d'une étude scientifique indépendante.
- La date de publication d'origine n'est pas mentionnée (seule la date de mise à jour « 04/02/2026 » figure en tête de page).
- Aucun auteur individuel n'est crédité.
- Aucune donnée chiffrée n'appuie les affirmations d'efficacité et de productivité (« significant gains in productivity », « getting more done overall »).
- Aucun détail tarifaire précis n'est fourni concernant les coûts cumulés de calcul (serveurs + requêtes LLM) pour faire tourner une architecture multi-agents à grande échelle, alors même que le coût est identifié comme un frein majeur.

## Texte de l'article

# What is an AI agent?

Last Updated: 04/02/2026

AI agents are software systems that use AI to pursue goals and complete tasks on behalf of users. They show reasoning, planning, and memory and have a level of autonomy to make decisions, learn, and adapt.

Their capabilities are made possible in large part by the multimodal capacity of generative AI and AI foundation models. AI agents can process multimodal information like text, voice, video, audio, code, and more simultaneously; can converse, reason, learn, and make decisions. They can learn over time and facilitate transactions and business processes. Agents can work with other agents to coordinate and perform more complex workflows.


## Key features of an AI agent

As explained above, while the key features of an AI agent are reasoning and acting (as described in ReAct Framework ) more features have evolved over time.

- Reasoning: This core cognitive process involves using logic and available information to draw conclusions, make inferences, and solve problems. AI agents with strong reasoning capabilities can analyze data, identify patterns, and make informed decisions based on evidence and context.
- Acting : The ability to take action or perform tasks based on decisions, plans, or external input is crucial for AI agents to interact with their environment and achieve goals. This can include physical actions in the case of embodied AI, or digital actions like sending messages, updating data, or triggering other processes.
- Observing : Gathering information about the environment or situation through perception or sensing is essential for AI agents to understand their context and make informed decisions. This can involve various forms of perception, such as computer vision, natural language processing, or sensor data analysis.
- Planning : Developing a strategic plan to achieve goals is a key aspect of intelligent behavior. AI agents with planning capabilities can identify the necessary steps, evaluate potential actions, and choose the best course of action based on available information and desired outcomes. This often involves anticipating future states and considering potential obstacles.
- Collaborating : Working effectively with others, whether humans or other AI agents, to achieve a common goal is increasingly important in complex and dynamic environments. Collaboration requires communication, coordination, and the ability to understand and respect the perspectives of others.
- Self-refining : The capacity for self-improvement and adaptation is a hallmark of advanced AI systems. AI agents with self-refining capabilities can learn from experience, adjust their behavior based on feedback, and continuously enhance their performance and capabilities over time. This can involve machine learning techniques, optimization algorithms, or other forms of self-modification.


## What is the difference between AI agents, AI assistants, and bots?

AI assistants are AI agents designed as applications or products to collaborate directly with users and perform tasks by understanding and responding to natural human language and inputs. They can reason and take action on the users' behalf with their supervision.

AI assistants are often embedded in the product being used. A key characteristic is the interaction between the assistant and user through the different steps of the task. The assistant responds to requests or prompts from the user, and can recommend actions but decision-making is done by the user.

|  | AI agent | AI assistant | Bot ﻿ |
| Purpose | Autonomously and proactively perform tasks | Assisting users with tasks | Automating simple tasks or conversations |
| Capabilities | Can perform complex, multi-step actions; learns and adapts; can make decisions independently | Responds to requests or prompts; provides information and completes simple tasks; can recommend actions but the user makes decisions | Follows pre-defined rules; limited learning; basic interactions |
| Interaction | Proactive; goal-oriented | Reactive; responds to user requests | Reactive; responds to triggers or commands |


### Key differences

- Autonomy : AI agents have the highest degree of autonomy, able to operate and make decisions independently to achieve a goal. AI assistants are less autonomous, requiring user input and direction. Bots are the least autonomous, typically following pre-programmed rules.
- Complexity : AI agents are designed to handle complex tasks and workflows, while AI assistants and bots are better suited for simpler tasks and interactions.
- Learning : AI agents often employ machine learning to adapt and improve their performance over time. AI assistants may have some learning capabilities, while bots typically have limited or no learning.


## How do AI agents work?

Every agent defines its role, personality, and communication style, including specific instructions and descriptions of available tools.

- Persona : A well defined persona allows an agent to maintain a consistent character and behave in a manner appropriate to its assigned role, evolving as the agent gains experience and interacts with its environment.
- Memory : The agent is equipped in general with short term, long term, consensus, and episodic memory. Short term memory for immediate interactions, long-term memory for historical data and conversations, episodic memory for past interactions, and consensus memory for shared information among agents. The agent can maintain context, learn from experiences, and improve performance by recalling past interactions and adapting to new situations.
- Tools : Tools are functions or external resources that an agent can utilize to interact with its environment and enhance its capabilities. They allow agents to perform complex tasks by accessing information, manipulating data, or controlling external systems, and can be categorized based on their user interface, including physical, graphical, and program-based interfaces. Tool learning involves teaching agents how to effectively use these tools by understanding their functionalities and the context in which they should be applied.
- Model : Large language models (LLMs) serve as the foundation for building AI agents, providing them with the ability to understand, reason, and act. LLMs act as the "brain" of an agent, enabling them to process and generate language, while other components facilitate reason and action.


## What are the types of agents in AI?

AI agents can be categorized in various ways based on their capabilities, roles, and environments. Here are some key categories of agents:

There are different definitions of agent types and agent categories.


### Based on interaction

One way to categorize agents is by how they interact with users. Some agents engage in direct conversation, while others operate in the background, performing tasks without direct user input:

- Interactive partners (also known as, surface agents): Assisting us with tasks like customer service, healthcare, education, and scientific discovery, providing personalized and intelligent support. Conversational agents include Q&A, chit chat, and world knowledge interactions with humans. They are generally user query triggered and fulfill user queries or transactions.
- Autonomous background processes (also known as, background agents): Working behind the scenes to automate routine tasks, analyze data for insights, optimize processes for efficiency, and proactively identify and address potential issues. They include workflow agents. They have limited or no human interaction and are generally driven by events and fulfill queued tasks or chains of tasks.


### Based on number of agents

- Single agent : Operate independently to achieve a specific goal. They utilize external tools and resources to accomplish tasks, enhancing their functional capabilities in diverse environments. They are best suited for well defined tasks that do not require collaboration with other AI agents. Can only handle one foundation model for its processing.
- Multi-agent : Multiple AI agents that collaborate or compete to achieve a common objective or individual goals. These systems leverage the diverse capabilities and roles of individual agents to tackle complex tasks. Multi-agent systems can simulate human behaviors, such as interpersonal communication, in interactive scenarios. Each agent can have different foundation models that best fit their needs.


### Benefits of using AI agents

AI agents can enhance the capabilities of language models by providing autonomy, task automation, and the ability to interact with the real world through tools and embodiment.


#### Efficiency and productivity

Increased output : Agents divide tasks like specialized workers, getting more done overall

Simultaneous execution : Agents can work on different things at the same time without getting in each other's way

Automation : Agents take care of repetitive tasks, freeing up humans for more creative work


#### Improved decision-making

Collaboration : Agents work together, debate ideas, and learn from each other, leading to better decisions

Adaptability : Agents can adjust their plans and strategies as situations change

Robust reasoning : Through discussion and feedback, agents can refine their reasoning and avoid errors


#### Enhanced capabilities

Complex problem-solving : Agents can tackle challenging real-world problems by combining their strengths

Natural language communication : Agents can understand and use human language to interact with people and each other

Tool use : Agents can interact with the external world by using tools and accessing information

Learning and self-improvement : Agents learn from their experiences and get better over time


#### Social interaction and simulation

Realistic simulations : Agents can model human-like social behaviors, such as forming relationships and sharing information

Emergent behavior : Complex social interactions can arise organically from the interactions of individual agents


## Challenges with using AI agents

While AI agents offer many benefits, there are also some challenges associated with their use:

Tasks requiring deep empathy / emotional intelligence or requiring complex human interaction and social dynamics – AI agents can struggle with nuanced human emotions. Tasks like therapy, social work, or conflict resolution require a level of emotional understanding and empathy that AI currently lacks. They may falter in complex social situations that require understanding unspoken cues.

Situations with high ethical stakes – AI agents can make decisions based on data, but they lack the moral compass and judgment needed for ethically complex situations. This includes areas like law enforcement, healthcare (diagnosis and treatment), and judicial decision-making.

Domains with unpredictable physical environments – AI agents can struggle in highly dynamic and unpredictable physical environments where real-time adaptation and complex motor skills are essential. This includes tasks like surgery, certain types of construction work, and disaster response.

Resource-intensive applications – Developing and deploying sophisticated AI agents can be computationally expensive and require significant resources, potentially making them unsuitable for smaller projects or organizations with limited budgets.


## Deploy AI agents for scale and efficiency with Cloud Run

AI agents, with their inherent need for flexible compute power to handle reasoning, planning, and tool use, can be an excellent fit for Cloud Run . This fully managed serverless platform allows you to deploy your agent's code—often packaged within a container—as a scalable, reliable service or job. This approach abstracts away infrastructure management, letting developers concentrate on refining the agent's logic.

Cloud Run offers several features that directly support the architecture and demands of sophisticated AI agents:

- Scalability and cost-efficiency: Cloud Run automatically scales the number of container instances up to meet peak demand and, crucially, can scale down to zero when the agent is idle. This means you only pay for the exact compute resources consumed during the agent's active execution, making it cost-effective for goal-oriented, intermittent workloads.
- Agent orchestration and serving: The core agent logic—which manages the model calls, tool selection, and reasoning process—runs as a Cloud Run service. This service provides a stable HTTPS endpoint, making the agent easily accessible via an API for user-facing applications or for communication with other agents
- Agent-to-Agent, or A2A: Frameworks like the Agent Development Kit (ADK) are designed to integrate seamlessly with Cloud Run for easy deployment.

By leveraging Cloud Run's secure, auto-scaling, and flexible environment, organizations can operationalize complex single- or multi-agent systems efficiently.


### Use cases for AI agents

Organizations have been deploying agents to address a variety use cases , which we group into six key broader categories:


### Customer agents

Customer agents deliver personalized customer experiences by understanding customer needs, answering questions, resolving customer issues, or recommending the right products and services. They work seamlessly across multiple channels including the web, mobile, or point of sale, and can be integrated into product experiences with voice or video.


### Employee agents

Employee agents boost productivity by streamlining processes, managing repetitive tasks, answering employee questions, as well as editing and translating critical content and communications.


### Creative agents

Creative agents supercharge the design and creative process by generating content, images, and ideas, assisting with design, writing, personalization, and campaigns.


### Data agents

Data agents are built for complex data analysis. They have the potential to find and act on meaningful insights from data, all while ensuring the factual integrity of their results.


### Code agents

Code agents accelerate software development with AI-enabled code generation and coding assistance, and to ramp up on new languages and code bases. Many organizations are seeing significant gains in productivity, leading to faster deployment and cleaner, clearer code.


### Security agents

Security agents strengthen security posture by mitigating attacks or increasing the speed of investigations. They can oversee security across various surfaces and stages of the security life cycle: prevention, detection, and response.


## Google Cloud and AI agents

Google Cloud provides a portfolio of products and solutions in the AI agent space. These include integrated AI assistants, pre-built AI agents, AI applications, and a platform of agent and developer tools to build custom AI agents.

- Gemini Secure platform to discover, create, run, and govern AI agents across your organization.
- Gemini platform Create AI agents and applications using natural language or a code-first approach. Easily ground your agents or apps in enterprise data with a range of options.
- Customer Experience Agent Studio Build hybrid conversational agents with both deterministic and generative AI functionality.
- Agent Garden Curated collection of pre-built agent samples, solutions, tools, and frameworks to accelerate the development and deployment of AI agents.
- Agent Development Kit (ADK) Open-source Python SDK to build sophisticated multi-agent systems with orchestration, memory, and developer tools.
- A2A Protocol An open-source framework originally developed by Google to help build AI agents. An AI agent built with A2A Protocol will be interoperable with any service, platform, or infrastructure.
- Cloud Run A fully managed serverless platform that allows you to deploy containerized agents and applications, providing auto-scaling and pay-per-use efficiency.


#### Additional resources

Continue learning about AI agents with additional resources.

- Google ADK on Github
- Google Agents White Paper (via Kaggle)
- Google Agents Companion White Paper (via Kaggle)
- Skillsboost Advanced Generative AI for Developers Learning
