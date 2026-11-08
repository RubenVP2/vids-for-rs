---
titre: "Google Antigravity : concevoir des molécules en une heure"
description: "Google DeepMind ajoute des compétences de chimie à Antigravity pour concevoir des molécules contre le cancer en une heure. Ce qui change et les vraies limites."
---

## En bref

- Google DeepMind intègre des outils de chimie computationnelle à sa plateforme **Google Antigravity**.
- L'outil est **disponible** dès maintenant via le plugin Science de l'application et sur les comptes Google Cloud.
- L'agent explore des milliers de composés et conçoit des molécules candidates en **une heure**, mais ces calculs restent des hypothèses qui exigent une validation en laboratoire.

## Une heure au lieu de plusieurs jours

La découverte d'un nouveau médicament est traditionnellement un travail de longue haleine. Pour imaginer une seule molécule candidate, les chimistes doivent éplucher des centaines d'articles scientifiques, rassembler des tableaux de données hétérogènes et entraîner des modèles de prédiction. Une boucle de travail qui prend facilement plusieurs jours pour chaque itération.

Le 3 novembre 2026, Google DeepMind a présenté une démonstration concrète sur des traitements réels du cancer du poumon non à petites cellules. En s'appuyant sur sa suite d'outils dédiée, un agent autonome a fouillé la littérature, filtré les molécules non pertinentes, modélisé l'affinité chimique et proposé de nouvelles structures moléculaires complètes avec leurs voies de synthèse en tout juste une heure.

## Comment l'ordinateur fait de la chimie

Pour transformer Antigravity en un véritable banc de travail scientifique, DeepMind a relié les modèles de langage à des bibliothèques de chimie déterministes. Le système utilise notamment RDKit, une boîte à outils open source développée depuis deux décennies par la communauté, ainsi que les bases de données de référence ChEMBL et PubChem.

Le modèle d'intelligence artificielle assure l'orchestration, la recherche dans les bases et le raisonnement scientifique. Dès qu'un calcul précis sur la structure d'une molécule est nécessaire, il passe le relais aux outils de calcul spécialisés.

En fait, la démonstration s'est concentrée sur une méthode classique en chimie médicinale appelée la rigidification. Dans le corps, une molécule flexible peut adopter de multiples formes dans l'espace. Pour bloquer efficacement sa cible tumorale, elle doit se figer dans une configuration précise. En ajoutant des liaisons pour fermer la structure en anneau (un macrocycle), les chimistes éliminent les liaisons rotatives et augmentent la puissance du traitement. C'est exactement ce qu'a fait l'agent : il a analysé le passage du crizotinib (cinq liaisons rotatives) au lorlatinib (zéro liaison rotative), puis conçu de nouveaux dérivés capables de franchir la barrière protectrice du cerveau.

## Des hypothèses de calcul, pas des pilules

Cette vitesse d'exécution impressionnante ne doit pas faire oublier la réalité de la médecine. DeepMind insiste lui-même sur les limites fondamentales de l'approche :

> Attention : les conceptions générées par ordinateur sont des hypothèses testables, pas des médicaments finis. Le manque de données et les marges d'erreur limitent la précision des modèles. Chaque molécule proposée doit impérativement être synthétisée et testée dans un véritable laboratoire expérimental.

Dans l'étude publiée, aucune des nouvelles molécules imaginées par l'agent n'a été fabriquée en laboratoire ni testée sur des cellules vivantes. L'algorithme réduit considérablement le temps de réflexion initiale, mais il ne raccourcit pas les années d'essais biologiques et cliniques indispensables avant d'arriver dans une pharmacie.

## Qui peut l'utiliser ?

Les nouvelles fonctions de chimio-informatique sont accessibles dès aujourd'hui :
- Dans l'application **Google Antigravity**, en activant le plugin Science.
- Pour les entreprises et équipes de recherche via leur compte professionnel Google Cloud.
- Google offre également un accès gratuit de 6 mois à 10 000 scientifiques sélectionnés sur dossier pour accélérer leurs recherches.

Les tarifs commerciaux généraux de la plateforme n'ont en revanche pas été communiqués.

## Et pour toi ?

Tu ne prendras pas de pilule conçue par Antigravity demain matin. Mais si les chercheurs gagnent plusieurs jours précieux à chaque cycle de tri théorique, les traitements de pointe contre des maladies graves comme le cancer pourraient voir le jour un peu plus vite.
