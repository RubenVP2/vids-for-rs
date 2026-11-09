---
titre: "Amazon dévoile HOPE pour alléger les modèles d'IA de 50 %"
description: "Amazon publie HOPE, une méthode open source pour supprimer 50 % des experts d'une IA sans dégrader ses performances. Explications et impact."
---

## En bref

- Les chercheurs d'Amazon présentent HOPE, une méthode d'élagage mathématique capable de supprimer la moitié des experts d'un grand modèle d'intelligence artificielle.
- L'outil et son code source sont **disponibles** dès aujourd'hui en accès libre sur GitHub, avec une publication scientifique complète sur arXiv.
- Sur les tests de code autonome, un modèle allégé de 50 % avec HOPE maintient son score à 42,3, égalant la version complète d'origine.

## Le gouffre de mémoire des modèles géants

Les architectures dites Mixture-of-Experts (MoE) ont permis de faire grimper les modèles de langage à des centaines de milliards de paramètres. Mais cette puissance cache une facture d'infrastructure exorbitante : chaque sous-réseau spécialisé doit rester chargé dans la mémoire vive de la carte graphique, même si seule une poignée est sollicitée pour chaque mot généré.

Sur un modèle comme Qwen3.5-122B, 95 % des 250 gigaoctets de mémoire occupée par les paramètres servent uniquement à stocker ces experts. Pourtant, à chaque étape de calcul, seuls huit experts sur les 256 d'une couche sont réellement activés. Les 248 autres restent totalement inactifs tout en monopolisant de précieux gigaoctets.

## Des experts qui travaillent toujours en équipe

Pour alléger ces géants sans devoir les réentraîner depuis zéro, les ingénieurs utilisent le « pruning », ou élagage. L'idée est simple : supprimer définitivement les experts les moins utiles pour réduire l'empreinte mémoire.

Jusqu'ici, les méthodes classiques attribuaient une note d'importance à chaque expert pris isolément. Les moins bien notés étaient coupés un par un. Le problème, c'est que cette approche oublie une règle fondamentale : au sein du réseau, les experts ne travaillent jamais seuls.

Dès le début de l'apprentissage, les sous-réseaux forment des grappes coopératives soudées et s'activent systématiquement ensemble. Si un algorithme supprime un expert jugé secondaire de manière isolée, il risque de paralyser son binôme indispensable. Lors d'un élagage massif à 50 %, ces coupes aveugles finissent par disloquer l'ensemble du réseau, provoquant une chute brutale de 13 % des performances sur les méthodes antérieures comme REAP.

## Comment HOPE préserve les binômes de calcul

En fait, l'équipe d'Amazon a conçu une méthode du second ordre baptisée HOPE. Plutôt que de noter chaque composant individuellement, l'algorithme construit une matrice qui mesure à quel point les experts coopèrent deux à deux lors d'une passe de calibration.

Le système résout ensuite un programme mathématique en une à deux secondes par couche pour identifier la combinaison d'experts à retirer qui minimise la perturbation globale. HOPE accepte ainsi de sacrifier certains experts isolés au score individuel élevé pour sauver des binômes cohérents.

> À garder en tête : l'avantage de HOPE est maximal sur des élagages très agressifs (entre 40 et 50 %). En dessous de 20 %, les méthodes classiques plus simples font jeu égal. Par ailleurs, l'algorithme travaille couche par couche sans modéliser les échanges entre les étages du modèle, et les gains effectifs en temps de réponse sur GPU de production restent encore à quantifier.

## Des scores intacts à 50 % d'élagage

Les expérimentations menées sur trois modèles (Qwen3.5-122B, Qwen3.5-35B et GLM-4.5-Air) montrent que HOPE se hisse en tête des méthodes comparées. Sur le banc d'essai SWE-Bench Pro, qui évalue la capacité d'agents d'IA à résoudre des bugs réels de programmation, le modèle Qwen3.5-35B élagué à 50 % affiche un score de 42,3, égalant les 41,8 du modèle complet d'origine. Les chercheurs constatent même que supprimer les experts superflus peut parfois réduire le bruit et améliorer la précision.

Le modèle résultant s'exporte au format Hugging Face habituel et fonctionne directement avec les moteurs d'inférence standards comme vLLM ou SGLang, sans exiger de modification logicielle.

## Et pour toi ?

Pour l'instant, HOPE s'adresse aux développeurs et aux équipes d'infrastructure qui hébergent des modèles. Mais cette recherche ouvre la voie à des modèles très avancés capables de tourner sur des machines beaucoup plus modestes, voire directement sur nos ordinateurs de bureau, sans faire exploser la facture de mémoire.
