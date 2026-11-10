---
name: linkedin
description: Écrit le post LinkedIn de la semaine de Matou — un carrousel de fond (retour d'expérience tiré de la réponse de l'utilisateur à la question de la semaine, ou « coulisses » tirées du dépôt), le contrôle, le rend et le dépose en brouillon dans Postiz. À utiliser quand une tâche planifiée le demande (routine linkedin), ou quand l'utilisateur dit « post LinkedIn », « carrousel LinkedIn », « coulisses ».
---

# Le post LinkedIn de la semaine

Depuis le 10/11/2026, LinkedIn ne reprend plus l'actu des épisodes : **un post de fond par
semaine**, en carrousel (`docs/decisions.md`). Une page qui débute ne gagne rien à une actu
de plus ; elle gagne avec ce que personne d'autre ne peut écrire : du vécu et des chiffres
réels. L'utilisateur ne fait rien, sauf s'il a répondu à la question du lundi.

Réglages : `brand/linkedin.json`. Commandes : `npm run linkedin` (en tête de
`scripts/linkedin.ts`). Sous `scripts/routines/lancer.sh` : aucune commande git, jamais
`--programmer`, la consigne est déjà préparée.

## 1. Lire la consigne

`linkedin/<semaine>/consigne.md` (à la main : `npm run linkedin -- --preparer`). Elle dit
le **mode** :

- **`reponse`** : la question de la semaine et la réponse de l'utilisateur, telle quelle.
  C'est la **seule** source des faits vécus. Ne rien y ajouter : pas d'outil, de chiffre,
  de durée ou d'anecdote qu'elle ne contient pas. On peut l'éclairer avec un fait du dépôt
  (une décision, un chiffre de bilan), en citant le fichier dans `sources`.
- **`coulisses`** : la matière des 8 derniers jours (décisions, bilans, changements du
  moteur). Choisir **une seule histoire** : un pari et ce que les chiffres en ont dit, une
  panne et son correctif, un choix et sa raison. Lire le fichier avant d'en tirer un
  chiffre. Éviter l'angle d'un post déjà publié (liste en bas de la consigne).

## 2. Écrire `linkedin/<semaine>/post.json`

Le schéma est dans `src/Coulisses.tsx` (`postLinkedinSchema`) :

```json
{
  "semaine": "2026-S46", "mode": "coulisses", "question": "id si mode reponse",
  "titre": "La promesse en 3 à 9 mots, ==mot== surligné",
  "matou": "sceptique",
  "diapos": [{"titre": "…", "texte": "1 ou 2 phrases", "chiffre": "9 vues", "icone": "ampoule"}],
  "lecon": {"titre": "…", "texte": "ce qu'on en retient"},
  "texte": "le texte du post LinkedIn",
  "sources": ["docs/decisions.md", "réponse de la semaine"]
}
```

- **Voix** : « nous », « chez Matou ». L'utilisateur n'est **jamais nommé** et rien de
  personnel ni d'interne ne sort : ni nom, ni lien, ni @, ni chemin, ni identifiant, ni
  clé, ni salon Discord (`npm run linkedin` les refuse, liste `interdits`). Les outils par
  leur nom public, oui (Claude Code, Gemini, Postiz, un Raspberry Pi).
- **Diapos** : 3 à 6, une idée chacune, dans l'ordre de l'histoire (le pari, ce qui s'est
  passé, le chiffre, la décision). Un `chiffre` seulement s'il est dans la source.
- **Texte** (le post, 600 à 1 300 caractères) : l'accroche tient en **210 caractères**
  (avant « voir plus ») et donne envie d'ouvrir le carrousel ; paragraphes courts, 2 ou 3
  flèches `→` ; il finit par une **question ouverte** qui appelle un récit (« Quel format
  gardez-vous par habitude… ? »), jamais oui/non. 3 hashtags au plus, **aucun lien**.
- **Honnêteté** : un échec raconté vaut mieux qu'un succès gonflé. Annoncé, testé, mesuré :
  dire lequel. Un test en cours n'a pas de résultat (« on saura le 23/11 »).
- `sources` : « réponse de la semaine » et/ou les fichiers du dépôt d'où viennent les faits.

## 3. Contrôler et rendre

`npm run linkedin -- linkedin/<semaine>` : il refuse les fuites (lien, nom, identifiant…),
une accroche trop longue, plus de 3 hashtags, une question fermée ou absente, et **tout
chiffre absent des sources**. Corriger jusqu'à ce que tout soit OK ; il rend alors les
diapos dans `rendu/` (non versionné). Regarder la couverture et une diapo de contenu
(texte qui déborde, coupure) ; sous-agent `controleur-visuel` si besoin.

## 4. Brouillon Postiz

`npm run linkedin -- linkedin/<semaine> --envoyer` : un brouillon au prochain mardi,
mercredi ou jeudi à 8 h 30, au moins 2 h plus tard (veto). Le lanceur le programme si tes
garde-fous passent. À la main : `--programmer`, et le veto : `--annuler` (ou « veto
linkedin » à Hermes).

## 5. Message final

Court : le mode, le titre, l'idée en une phrase, la date du post, et la source (« réponse
de la semaine » ou les fichiers). Puis l'avant-dernière ligne :

- `PROGRAMMER: oui` seulement si `npm run linkedin -- linkedin/<semaine>` passe, que chaque
  fait vient de la consigne ou d'un fichier cité, et qu'aucun détail personnel ne sort ;
- sinon `PROGRAMMER: non — <raison>`.

Dernière ligne : `LINKEDIN: <semaine>` (ou `LINKEDIN: aucun` si rien n'a pu être écrit).
