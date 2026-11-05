---
titre: "Gemini 4 Carbon : l'IA la plus forte de Google… pas pour toi"
description: "Google annonce Gemini 4 Carbon, taillé pour trouver et réparer les failles de sécurité. Ses scores, leurs limites, et qui peut l'utiliser (pas toi, pour l'instant)."
---

## En bref

- Google **annonce** Gemini 4 Carbon, qu'il présente comme son modèle le plus puissant.
- Sa spécialité : la **cybersécurité**. Trouver les failles d'un logiciel, vérifier si un pirate peut s'en servir, les corriger.
- Cette semaine, Google commence à l'ouvrir à **un petit groupe de défenseurs en cybersécurité**. Le grand public : « dès que possible », sans date.

## Le nouveau champion de Google

Le 28 octobre 2026, Google a présenté Gemini 4 Carbon, deux semaines seulement après Gemini 4 Argon. Google le décrit comme son modèle le plus puissant, fort en cybersécurité et sur les tâches longues.

Sur un classement indépendant qui combine plusieurs tests d'intelligence, l'Artificial Analysis Intelligence Index, Carbon arrive premier avec 59 points. D'une courte tête : selon le site du classement, le deuxième, Claude Opus 5.5, a 58 points.

## Un chasseur de failles

En fait, la défense d'un logiciel se fait en trois étapes, et Google dit que Carbon est au meilleur niveau sur les trois :

1. **Trouver la faille** : 88,2 % de réussite au test SEC-bench Pro.
2. **Vérifier si elle est dangereuse**, c'est-à-dire si un pirate peut vraiment s'en servir : 54,8 % au test ExploitGym.
3. **La corriger à la racine** : 71,0 % au test CWE-bench.

> Attention : ces scores ont été mesurés **sans garde-fous**, et Google les règle encore. La version qui sera livrée n'aura donc pas forcément les mêmes résultats. Google ne donne pas non plus les scores des concurrents sur ces trois tests.

Google cite aussi ses propres équipes. Selon l'équipe de Chrome, Carbon produit des correctifs de qualité plus de 10 fois mieux que le grand modèle d'un autre laboratoire, qui n'est pas nommé. Et en interne, Carbon a pu travailler **plusieurs jours** sur des tâches complexes, comme trouver l'origine de bugs subtils dans de très gros programmes, sans s'arrêter aux impasses.

## Plus prudent, d'après Google

Google dit avoir entraîné Carbon à moins tricher pour réussir un test, et à signaler ce qui cloche plutôt que deviner. Face à une demande ambiguë, il va chercher les sources utiles et signale les incohérences avant d'agir. Quand une action est bloquée, il ne l'invente pas : il dit ce qu'il manque.

Ces affirmations viennent des tests internes de Google, sans méthode détaillée. Il n'existe pas encore de fiche technique publique (*model card*) propre à Carbon.

## Qui y a accès ?

- **Cette semaine** : un petit groupe de défenseurs en cybersécurité, non nommés.
- **Ensuite, progressivement** : d'autres partenaires choisis, via le programme Fairwind de Google (sur candidature : gouvernements, hôpitaux, opérateurs télécoms, infrastructures critiques).
- **Développeurs, entreprises, grand public** : pas encore. Google veut l'ouvrir « dès que possible », après avoir ajusté ses garde-fous. Aucune date.

Pour les développeurs, le prix de lancement est annoncé : 2 $ par million de *tokens* envoyés et 10 $ par million de *tokens* produits, puis 4 $ et 20 $ après une période de lancement dont la durée n'est pas précisée.

## Et pour toi ?

Rien à installer aujourd'hui. Mais bien utilisé par ceux qui défendent les logiciels, un outil comme Carbon pourrait laisser **moins de failles** dans les applis que tu utilises tous les jours.
