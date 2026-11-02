# Source — OpenAI CEO says it's 'quite terrible' for your PC to have RAM — Sam Altman says data centers offer better utilization

- URL : https://www.tomshardware.com/tech-industry/data-centers/openai-ceo-says-its-quite-terrible-for-your-pc-to-have-ram-sam-altman-says-data-centers-offer-better-utilization
- Publié par : Tom's Hardware
- Auteur : Andrew E. Freedman
- Date de publication : 2026-10-30
- Type : article
- Statut : disponible — « In an interview over beers with the YouTube channel Cheeky Pint, Altman said that local inference, and, by extension, people having DRAM in computers at home, is "quite terrible." »
- Langue : en

## Fiche

### Faits
- Dans une interview accordée autour d'une bière à la chaîne YouTube « Cheeky Pint », le PDG d'OpenAI Sam Altman a jugé « franchement terrible » (*quite terrible*) l'inférence locale et le fait que les particuliers possèdent de la mémoire DRAM dans leurs ordinateurs personnels.
- Interrogé (au repère des 29 minutes) sur l'hypothèse selon laquelle les gens feront tourner de l'IA locale avec des modèles open source sur leurs propres PC existants ou à monter, Altman a expliqué pourquoi il estime que c'est une mauvaise idée.
- Selon Altman, d'un point de vue d'allocation globale des ressources dans un contexte d'approvisionnement mondial très contraint en DRAM, laisser cette mémoire stockée dans les ordinateurs personnels où elle n'est utilisée que 5 % du temps est inefficace comparé à une utilisation maximale centralisée dans le cloud.
- Altman remarque que l'intuition de nombreuses personnes va pourtant à l'opposé de cette logique d'optimisation dans le cloud.
- Bien qu'OpenAI propose certains modèles open source, l'essentiel de son activité commerciale repose sur des modèles fermés (propriétaires) hébergés dans des centres de données, ce qui l'amène à défendre le modèle économique de l'entreprise.
- Même si OpenAI n'est pas directement menacée pour l'instant par les ordinateurs portables ou les PC de jeu, l'essor de l'IA locale pourrait un jour inciter les utilisateurs à payer moins d'abonnements pour des modèles cloud (comme un éventuel GPT-6 Luna) s'ils ont la puissance matérielle suffisante chez eux.
- Les propos d'Altman suggèrent qu'OpenAI préférerait voir la mémoire vive allouée en priorité à ses propres centres de données plutôt qu'aux ordinateurs des particuliers.
- Cette position réactive les craintes des passionnés d'informatique de ne plus être propriétaires de leur matériel ni de leurs logiciels, et de devoir louer un agent et un ordinateur dans le cloud.
- L'argumentation d'Altman repose sur l'hypothèse que l'expansion des centres de données ne faiblira pas et postule que faire fonctionner de la RAM 24h/24 et 7j/7 dans des centres de données d'IA a plus de valeur que de l'utiliser pour des tableurs, du surf web, du jeu vidéo ou de l'IA locale occasionnelle.
- Le reste de l'interview aborde également des failles de sécurité PHP récentes, l'isolation (*sandboxing*) des modèles durant l'entraînement et les recherches d'OpenAI en mathématiques.

### Chiffres
- 32GB — quantité de mémoire vive d'un ordinateur fixe citée en exemple par l'auteur — « but seemingly it's the 32GB of RAM in your desktop that's the problem. »
- 29-minute mark — repère temporel de l'interview vidéo où Sam Altman développe son argumentaire sur la DRAM — « Then he explained why that's a bad idea (at the 29-minute mark): »
- 5% — part du temps pendant laquelle la DRAM d'un ordinateur personnel est réellement utilisée d'après Sam Altman — « sitting in their own computer and being used 5% of the time »
- GPT-6 Luna — exemple d'un futur modèle sous abonnement cloud mentionné par l'auteur — « paying less for subscriptions to models like GPT-6 Luna if they have the power to run them at home. »
- 24/7 — sollicitation continue (24h/24, 7j/7) de la RAM dans les centres de données d'IA — « It also assumes that RAM being used in AI data centers 24/7 is more worthwhile than RAM that is used for spreadsheets, web browsing, gaming, and maybe even local AI occasionally. »

### Citations utilisables (≤ 15 mots)
- « quite terrible » — Sam Altman
- « From a global allocation perspective, actually, it's quite terrible » — Sam Altman
- « You want maximum utilization in the cloud » — Sam Altman
- « And somehow many people's intuition is the opposite of that. » — Sam Altman
- « sitting in their own computer and being used 5% of the time » — Sam Altman

### Disponibilité
- **Qui** : Utilisateurs grand public, possesseurs de PC et abonnés aux services d'IA.
- **Où** : Sur ordinateurs personnels (inférence locale avec modèles open source) ou via le cloud et les centres de données d'OpenAI. Interview complète disponible sur la chaîne YouTube « Cheeky Pint ».
- **Quand** : Interview diffusée fin octobre 2026 (article publié le 30 octobre 2026). L'exécution locale et les offres cloud existent dès aujourd'hui.
- **Prix** : Accès gratuit à l'interview ; modèles open source utilisables gratuitement en local sur son matériel ; abonnements payants pour les modèles cloud propriétaires d'OpenAI.

### Zones floues
- **Chiffre des 5 % sans méthodologie** : L'affirmation d'Altman selon laquelle la RAM d'un PC n'est active que 5 % du temps ne s'appuie sur aucune étude statistique, mesure technique ni source vérifiable citée dans le texte.
- **Pénurie de DRAM non quantifiée** : Altman invoque un « environnement aux approvisionnements très contraints », sans qu'aucune donnée chiffrée sur la production mondiale de DRAM ni sur les volumes absorbés par les data centers ne soit fournie.
- **Absence de mesure concrète** : Il s'agit d'une prise de position en interview plaidant pour la centralisation dans le cloud, sans proposition formelle ni annonce de mesure visant à limiter la vente de RAM au grand public.
- **Statut de « GPT-6 Luna »** : La référence à un modèle « GPT-6 Luna » provient d'une hypothèse formulée par l'auteur de l'article, non d'une annonce officielle d'OpenAI.
- **Jugement de valeur sur l'utilité des usages PC** : L'idée qu'allouer la mémoire 24h/24 à des data centers d'IA est supérieur aux usages PC quotidiens (bureautique, navigation, jeu) reflète la vision d'OpenAI et son intérêt commercial dans le cloud, sans consensus objectif.

## Texte de l'article

OpenAI CEO Sam Altman has data centers full of memory, but seemingly it's the 32GB of RAM in your desktop that's the problem. In an interview over beers with the YouTube channel Cheeky Pint, Altman said that local inference, and, by extension, people having DRAM in computers at home, is "quite terrible."

When discussing local inference on home computers with open-source models, Altman discussed the assumption that people will be able to run local AI on their own computers, the ones they may already own or want to build. Then he explained why that's a bad idea (at the 29-minute mark):

"From a global allocation perspective, actually, it's quite terrible to have everybody have a bunch of the world's limited supply of DRAM sitting in their own computer and being used 5% of the time," Altman said. "You want maximum utilization in the cloud if you're trying to deal with this very supply-constrained environment. And somehow many people's intuition is the opposite of that."

While OpenAI does have some open-source models, its primary business is in closed-source models that run in data centers, so he's really defending the company's business model.

OpenAI isn't exactly threatened by some laptops and gaming rigs just yet, but local AI could mean people one day paying less for subscriptions to models like GPT-6 Luna if they have the power to run them at home. Altman's talk suggests that the company would prefer that more RAM go to OpenAI's data centers rather than home computers, which also sparks enthusiast fears of not being able to own your own hardware or software, but rather rent an agent and a computer in the cloud.

Some of what Altman is saying is based on an idea that data center buildouts won't slow down. It also assumes that RAM being used in AI data centers 24/7 is more worthwhile than RAM that is used for spreadsheets, web browsing, gaming, and maybe even local AI occasionally.

The rest of the wide-ranging interview includes talk of this week's PHP vulnerabilities, sandboxing models in training, and OpenAI's research in mathematics.
