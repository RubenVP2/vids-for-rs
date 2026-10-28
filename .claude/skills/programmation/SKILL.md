---
name: programmation
description: Envoie un épisode de Matou prêt dans Postiz en brouillons (TikTok, Instagram, YouTube, Facebook, Threads, LinkedIn, X, Bluesky : les réseaux connectés), puis le programme sur le feu vert de l'utilisateur. À utiliser après l'étape 7 du skill episode, ou quand l'utilisateur dit « envoie dans Postiz », « programme », « planifie la vidéo ».
---

# Programmation : épisode prêt → Postiz

Postiz en abonnement cloud (formule Standard : 5 canaux). L'utilisateur connecte lui-même
ses comptes dans Postiz (« Add channel »). Deux accès :

- **Clé d'API** (variable `POSTIZ_ENV` de l'environnement) : la voie normale. Si
  `npm run postiz -- --canaux` liste les comptes, suivre la section « Avec la clé d'API »
  en bas : le script téléverse la vidéo lui-même.
- **MCP Postiz** (outils `mcp__Postiz__*`) : sans clé, étapes 0 à 4 ci-dessous ; la vidéo
  doit alors être déposée à la main dans Postiz. Le MCP sert aussi, avec la clé, à
  consulter le calendrier (`postsListTool`) ou supprimer un post.

Pour le reste (statistiques…), le skill officiel **`postiz`** s'applique.

**Règle d'or** : rien n'est publié sans un « oui » explicite de l'utilisateur, dans cette
session, pour cet épisode. Les posts sont créés en **brouillon** (`type: "draft"`) ; ils ne
passent en programmé qu'après ce « oui ».

## 0. Prérequis

- `npm run check -- NNN` affiche « Prêt pour la relecture humaine. »
- `mcp__Postiz__integrationList` renvoie au moins un compte. Liste vide : dire à
  l'utilisateur de connecter ses réseaux dans Postiz. Outils `mcp__Postiz__*` absents :
  le connecteur Postiz n'est pas branché sur cette session.
- **La vidéo est dans la médiathèque Postiz.** Le MCP ne lit pas les fichiers de la
  session, et `uploadFromUrlTool` exige une URL publique. Envoyer à l'utilisateur la vidéo
  et la miniature (`rendu/`), lui demander de les déposer dans Postiz (Media › Upload),
  puis les retrouver avec `mcp__Postiz__mediaListTool` (`search` : `NNN-slug`). Ne jamais
  publier la vidéo sur un hébergeur tiers pour obtenir une URL.

Réseaux gérés (un brouillon par compte connecté, les autres ignorés) : TikTok, Instagram,
YouTube, Facebook (page), Threads, LinkedIn (profil ou page), X, Bluesky.

**Fait quand** les comptes sont listés et que la vidéo et la miniature ont un `path` dans
la médiathèque.

## 1. Lire les règles des réseaux (une fois par session)

Pour chaque réseau connecté : `mcp__Postiz__integrationSchema` (`platform` = son
`identifier`, `isPremium: false`). Comparer `settings.required` et les `enum` avec
`brand/postiz.json` : un réglage qui ne s'applique pas est **ignoré sans erreur** (règle 4
du skill `postiz`). Si un champ obligatoire manque, corriger `brand/postiz.json` et le
signaler.

Choix déjà faits dans `brand/postiz.json` (ne pas changer sans l'utilisateur) :
TikTok en `DIRECT_POST` (`UPLOAD` ne publie pas) ; mention « fait avec l'IA » sur TikTok
et X (voix de synthèse, pour éviter les sanctions) ; Instagram en Reel (`post_type: post`) ;
YouTube public, pas « pour enfants » ; Facebook en publication (pas en story) ; X ouvert
aux réponses de tous.

## 2. Aperçu

`npm run postiz -- NNN --commentaire [--date AAAA-MM-JJTHH:MM]`

- Date : par défaut demain à l'heure de `brand/postiz.json` (heure de Paris), convertie
  en UTC. Rythme visé : 1 vidéo par jour. Si l'utilisateur a donné un jour, le prendre ;
  sinon vérifier avec `mcp__Postiz__postsListTool` qu'aucun épisode n'est déjà prévu ce
  jour-là.
- `--commentaire` ajoute la ligne « Commentaire à épingler » de `publication.md` en
  premier commentaire partout sauf sur TikTok (qui ne le permet pas) ; sur Threads, X et
  Bluesky, c'est la première réponse du fil. Il reste à l'épingler à la main là où c'est
  possible, et à le poster à la main sur TikTok.
- Le script écrit `postiz-mcp.json` : l'argument de `integrationSchedulePostTool` pour les
  8 réseaux, textes en HTML, couverture sur chaque vidéo.

**Fait quand** la sortie ne contient aucune ligne ATTENTION.

## 3. Créer les brouillons

Partir de `postiz-mcp.json` :

1. Garder les entrées des réseaux connectés ; remplacer `<id Réseau>` par l'`id` du compte
   (`integrationList`). Deux comptes pour un même réseau : demander lequel.
2. Remplacer `<chemin de …mp4>` et `<chemin de …png>` par les `path` de la médiathèque ;
   dans le réglage YouTube `thumbnail`, mettre aussi l'`id` de la miniature.
3. Appeler `mcp__Postiz__integrationSchedulePostTool` avec `socialPost`, `type` restant
   `"draft"`. En cas d'`output.errors`, corriger et relancer.

Écrire `postiz-envoi.json` dans le dossier de l'épisode : `{envoye, date, statut:
"brouillon", video, miniature, postes: [{reseau, postId, integration}]}`, ids tirés de la
réponse. Committer `postiz-mcp.json` et `postiz-envoi.json`. Ne jamais recréer des
brouillons si `postiz-envoi.json` existe : vérifier d'abord avec `postsListTool`.

**Fait quand** `postiz-envoi.json` existe et que les liens `previewUrl` sont donnés à
l'utilisateur.

## 4. Faire relire, puis programmer

Dire à l'utilisateur : les brouillons sont dans le calendrier Postiz, à la date prévue
(donner les `previewUrl`). Ce qu'il doit regarder :

- la vidéo et le texte de chaque réseau ;
- la couverture ;
- le commentaire de sources à épingler.

Ne jamais présenter l'épisode comme publié.

Sur un « oui » explicite (« programme », « vas-y », « publie ») : le MCP n'a pas d'outil
pour changer le statut d'un post. Soit l'utilisateur programme les brouillons lui-même
dans Postiz, soit tu rappelles `integrationSchedulePostTool` avec le même `socialPost` en
`type: "schedule"`, puis tu supprimes les brouillons (`deletePostTool`, ids de
`postiz-envoi.json`) et tu vérifies avec `postsListTool` qu'il reste un seul post par
réseau. Avec une clé d'API, `npm run postiz -- NNN --programmer` suffit. Mettre ensuite
`statut: "programmé"` et les nouveaux ids dans `postiz-envoi.json`, et committer.

**Fait quand** l'utilisateur a donné son feu vert et que `postiz-envoi.json` dit « programmé ».

## Avec la clé d'API

Clé lue dans `POSTIZ_ENV` (ou `POSTIZ_API_KEY`, ou secret réseau sur `api.postiz.com`).
Mêmes règles que ci-dessus (brouillons, relecture, « oui » explicite), en trois commandes :

1. `npm run postiz -- --canaux` : comptes et règles de chaque réseau (étapes 0 et 1).
2. `npm run postiz -- NNN --commentaire` (aperçu, étape 2), puis la même commande avec
   `--envoyer` : téléverse la vidéo et la miniature, crée un brouillon par compte, écrit
   `postiz-envoi.json`. Committer `postiz.json`, `postiz-mcp.json` et `postiz-envoi.json`.
3. Après le « oui » : `npm run postiz -- NNN --programmer`, puis committer
   `postiz-envoi.json`.
