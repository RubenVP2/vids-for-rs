---
name: programmation
description: Envoie un épisode de Matou prêt dans Postiz en brouillons (TikTok, Instagram, YouTube, Facebook, Threads, LinkedIn, X, Bluesky : les réseaux connectés), puis le programme sur le feu vert de l'utilisateur. À utiliser après l'étape 7 du skill episode, ou quand l'utilisateur dit « envoie dans Postiz », « programme », « planifie la vidéo ».
---

# Programmation : épisode prêt → Postiz

Le script `npm run postiz` fait le travail ; ce skill dit quand et comment l'utiliser.
Pour tout ce qu'il ne couvre pas (lister ou supprimer des posts, statistiques), le skill
officiel **`postiz`** s'applique, avec `npx postiz …` à la place de `postiz …`.

**Règle d'or** : rien n'est publié sans un « oui » explicite de l'utilisateur, dans cette
session, pour cet épisode. Les posts sont créés en **brouillon** ; seul `--programmer`
les fait partir, et seulement après ce « oui ».

## 0. Prérequis

Postiz en abonnement cloud (postiz.com) : l'utilisateur connecte lui-même ses comptes dans
Postiz (« Add channel », connexion au réseau, aucune application développeur à créer).
Un brouillon part sur chaque réseau connecté parmi : TikTok, Instagram, YouTube, Facebook
(page), Threads, LinkedIn (profil ou page), X, Bluesky. Les autres sont ignorés.

- `npm run check -- NNN` affiche « Prêt pour la relecture humaine. »
- Accès à Postiz : `npm run postiz -- --canaux` liste les comptes. Une erreur 401 = la
  clé manque. Dire à l'utilisateur de l'ajouter lui-même à l'environnement (jamais dans
  le chat) : menu de l'environnement dans la barre de titre de la session → *Edit* →
  *Network secrets* → hôte `api.postiz.com`, en-tête `Authorization` **sans préfixe**,
  la clé de Postiz (Settings › Developers › Public API) en valeur. Ou bien une variable
  d'environnement `POSTIZ_API_KEY`. Puis ouvrir une nouvelle session.

**Fait quand** `--canaux` montre au moins un des réseaux ci-dessus.

## 1. Lire les règles des réseaux (une fois par session)

`npm run postiz -- --canaux` affiche, pour chaque réseau, les `rules` et le schéma des
réglages renvoyés par Postiz. Comparer avec `brand/postiz.json` : un réglage qui ne
s'applique pas est **ignoré sans erreur** par Postiz (règle 4 du skill `postiz`). Si un
champ obligatoire manque ou qu'une valeur ne correspond plus, corriger `brand/postiz.json`
et le signaler à l'utilisateur.

Choix déjà faits dans `brand/postiz.json` (ne pas changer sans l'utilisateur) :
TikTok en `DIRECT_POST` (`UPLOAD` ne publie pas) ; mention « fait avec l'IA » sur TikTok
et X (voix de synthèse, encore à trancher) ; Instagram en Reel (`post_type: post`) ;
YouTube public, pas « pour enfants » ; Facebook en publication (pas en story) ; X ouvert
aux réponses de tous.

## 2. Aperçu

`npm run postiz -- NNN [--date AAAA-MM-JJTHH:MM] [--commentaire]`

- Date : par défaut demain à l'heure de `brand/postiz.json` (heure de Paris). Rythme
  visé : 1 vidéo par jour. Si l'utilisateur a donné un jour, le prendre ; sinon vérifier
  avec `npx postiz posts:list` qu'aucun autre épisode n'est déjà prévu ce jour-là.
- `--commentaire` ajoute la ligne « Commentaire à épingler » de `publication.md` en
  premier commentaire partout sauf sur TikTok (qui ne le permet pas) ; sur Threads, X et
  Bluesky, c'est la première réponse du fil. Il reste à l'épingler à la main là où c'est
  possible, et à le poster à la main sur TikTok.

**Fait quand** la sortie ne contient aucune ligne ATTENTION.

## 3. Envoyer les brouillons

`npm run postiz -- NNN --envoyer` (mêmes options qu'à l'aperçu). Le script téléverse la
vidéo (et la miniature pour YouTube), crée un brouillon par réseau, puis écrit
`postiz-envoi.json` (ids des posts). Il refuse un second envoi ; `--force` crée des
doublons, ne l'utiliser qu'après avoir vérifié dans Postiz.

**Fait quand** `postiz-envoi.json` existe. Le committer avec `postiz.json`.

## 4. Faire relire, puis programmer

Dire à l'utilisateur : les brouillons sont dans le calendrier Postiz, à la date prévue.
Ce qu'il doit regarder là-bas :

- la vidéo et le texte de chaque réseau ;
- la couverture sur TikTok, Instagram et Facebook (la miniature n'est envoyée qu'à YouTube) ;
- le commentaire de sources à épingler.

Ne jamais présenter l'épisode comme publié.

Sur un « oui » explicite (« programme », « vas-y », « publie ») :
`npm run postiz -- NNN --programmer`. Il peut aussi programmer lui-même depuis Postiz.
Après le passage en programmé, committer `postiz-envoi.json` (statut « programmé »).

**Fait quand** l'utilisateur a donné son feu vert et que `postiz-envoi.json` dit « programmé »,
ou qu'il a dit qu'il s'en chargeait dans Postiz.
