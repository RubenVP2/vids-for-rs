---
titre: "Claude Fable 5.2 : un système d'exploitation créé en 8 jours"
description: "Anthropic dévoile Claude Fable 5.2 et démontre la création d'un système d'exploitation par 1 000 agents en huit jours. Décryptage des avancées."
---

## En bref

- Anthropic lance Claude Fable 5.2 et Claude Mythos 5.2, ses modèles les plus perfectionnés dédiés aux projets d'ingénierie complexe et de code autonome.
- Claude Fable 5.2 est **disponible** dès aujourd'hui sur l'ensemble des plateformes cloud majeures, tandis que Mythos 5.2 reste réservé aux chercheurs habilités.
- Lors d'une démonstration interne, une équipe de 1 000 agents coordonnés a programmé un système d'exploitation bootable complet en huit jours d'affilée.

## Un dossier vide pour tester l'autonomie

Pour mesurer jusqu'où pouvait aller son nouveau modèle, un ingénieur d'Anthropic lui a confié un défi inédit : créer un système d'exploitation prototype de zéro, en partant d'un dossier vide sur le disque dur.

Pendant huit jours et sans interruption, Fable 5.2 a coordonné une flotte de plus de 1 000 sous-agents. Ces programmes ont écrit, vérifié et compilé chaque brique logicielle nécessaire pour faire fonctionner une machine : le noyau central qui pilote le matériel, les pilotes pour le disque, le clavier et le réseau, le système de stockage permanent des fichiers, les fenêtres graphiques, et jusqu'à l'écran de connexion initial.

À l'arrivée, l'ensemble démarre pour de vrai sur un ordinateur portable standard.

## De l'aide ponctuelle aux flottes d'agents

Jusqu'ici, l'assistance au code se résumait le plus souvent à compléter une fonction ou à suggérer une correction dans un éditeur de texte. Avec cette nouvelle génération de modèles, Anthropic cherche à basculer vers le code agentique de grande envergure.

Sur le banc d'essai FrontierCode 2.0, qui mesure si les modifications de code proposées par une IA sont acceptées par les mainteneurs de projets open source, Fable 5.2 atteint 49,1 % de réussite avec un effort maximal, se classant en tête des modèles publics testés. L'entreprise indique d'ailleurs que plus de 90 % des modifications intégrées dans son propre code informatique sont désormais rédigées par Claude avec supervision humaine.

La collaboration entre agents permet aussi d'aborder des problèmes théoriques monumentaux. Une équipe de 1 000 agents Fable 5.2 a par exemple formalisé la preuve mathématique du dernier théorème de Fermat en 30 heures seulement dans le langage Lean, contre onze jours lors d'une tentative précédente.

## Fable et Mythos : deux visages d'un même moteur

Fable 5.2 et Mythos 5.2 partagent en réalité la même architecture sous le capot. La différence tient aux barrières de sécurité intégrées.

Fable 5.2 est bridé pour bloquer les requêtes à haut risque liées à la cybersécurité offensive ou à la biologie dangereuse, ce qui permet à Anthropic de l'ouvrir à tous les clients. Mythos 5.2 conserve quant à lui ses capacités intégrales d'analyse de vulnérabilités informatiques et de modélisation moléculaire, mais son accès est strictement soumis à candidature auprès des programmes de vérification spécialisés.

En fait, Anthropic a également fait le choix de brider l'entraînement de ses modèles sur certaines compétences précises, comme l'optimisation des architectures de réseaux neuronaux, pour éviter qu'une IA ne perfectionne trop vite ses propres algorithmes de façon incontrôlée.

> À garder en tête : le système d'exploitation développé en 8 jours reste un prototype expérimental de démonstration et n'a pas été publié en open source pour un audit technique indépendant. De plus, Anthropic souligne dans sa documentation de sécurité que ces modèles détectent désormais plus fréquemment qu'auparavant le fait qu'ils sont soumis à des évaluations, ce qui complique la mesure exacte de leur fiabilité en conditions réelles.

## Et pour toi ?

Tu n'auras sans doute pas besoin d'installer un nouvel OS généré par une machine demain matin. En revanche, l'arrivée de Claude Fable 5.2 montre que la programmation logicielle change d'échelle. Pour les développeurs, le métier évolue rapidement : plutôt que d'aligner du code ligne par ligne, la valeur se déplace vers la coordination d'équipes de programmes capables de prototyper des briques complètes en quelques heures.
