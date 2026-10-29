---
name: programmation
description: Envoie un épisode de Matou prêt dans Postiz en brouillons (TikTok, Instagram, YouTube, Facebook, Threads, LinkedIn, X, Bluesky : les réseaux connectés), puis le programme sur le feu vert de l'utilisateur. À utiliser après l'étape 7 du skill episode, ou quand l'utilisateur dit « envoie dans Postiz », « programme », « planifie la vidéo ».
---

# Programmation : épisode prêt → Postiz

Postiz en abonnement cloud (formule Standard : 5 canaux). Comptes connectés : TikTok,
Instagram, YouTube, Threads, page LinkedIn « Matou AI ». L'utilisateur connecte lui-même
ses comptes dans Postiz (« Add channel »).

Accès : `npm run postiz` passe par la **CLI officielle `postiz`** (`scripts/lib/postiz-cli.ts`),
qui s'authentifie avec son jeton OAuth (`postiz auth:login`, fait une fois sur le Pi) ou
avec une clé (`POSTIZ_API_KEY`, ou `POSTIZ_ENV`). Le script téléverse lui-même la vidéo
et la miniature. Pour le reste (statistiques, calendrier, suppression d'un post), le
skill officiel **`postiz`** s'applique.

**Règle d'or** : rien n'est publié sans un « oui » explicite de l'utilisateur, dans cette
session, pour cet épisode (une tâche planifiée n'est pas un « oui » : la routine
`episode-du-jour` s'arrête aux brouillons). Les posts sont créés en **brouillon** ; ils ne
passent en programmé qu'après ce « oui ».

## 0. Prérequis

- `npm run check -- NNN` affiche « Prêt pour la relecture humaine. »
- `npm run postiz -- --canaux` liste au moins un compte, avec les règles de chaque
  réseau. Refusé : `npx postiz auth:status` dit pourquoi (jeton absent ou expiré : à
  l'utilisateur de relancer `postiz auth:login` sur le Pi) ; s'arrêter et le dire.

Réseaux gérés (un brouillon par compte connecté, les autres ignorés) : TikTok, Instagram,
YouTube, Facebook (page), Threads, LinkedIn (profil ou page), X, Bluesky.

**Fait quand** les comptes sont listés.

## 1. Lire les règles des réseaux (une fois par session)

Dans la sortie de `--canaux`, comparer pour chaque réseau `settings.required` et les
`enum` avec `brand/postiz.json` : un réglage qui ne s'applique pas est **ignoré sans
erreur** (règle 4 du skill `postiz`). Si un champ obligatoire manque, corriger
`brand/postiz.json` et le signaler.

Choix déjà faits dans `brand/postiz.json` (ne pas changer sans l'utilisateur) :
TikTok en `DIRECT_POST` (`UPLOAD` ne publie pas) ; mention « fait avec l'IA » sur TikTok
et X (voix de synthèse, pour éviter les sanctions) ; Instagram en Reel (`post_type: post`) ;
YouTube public, pas « pour enfants » ; Facebook en publication (pas en story) ; X ouvert
aux réponses de tous ; LinkedIn en carrousel (`post_as_images_carousel`).

## 2. Aperçu

`npm run postiz -- NNN --commentaire [--date AAAA-MM-JJ]`

- Chaque réseau a son format, son texte et son **créneau** (`docs/reseaux.md`,
  `brand/postiz.json` → `creneaux`) : TikTok 19 h, Instagram 18 h 30, YouTube 20 h,
  Threads 9 h (vidéo) puis 19 h 30 (relance, texte seul), LinkedIn 8 h 30 en semaine
  (carrousel de `rendu/carrousel/`). Le script prend pour chacun son premier jour libre,
  au moins 3 h après maintenant. LinkedIn ne tente que le créneau suivant : déjà pris →
  « Pas de post : LinkedIn… », c'est voulu.
- Si l'utilisateur a donné un jour : `--date AAAA-MM-JJ` (chaque réseau à son heure ce
  jour-là). `--date AAAA-MM-JJTHH:MM` met tous les réseaux à cette heure : seulement s'il
  le demande.
- `--commentaire` ajoute la ligne « Commentaire à épingler » de `publication.md` en
  premier commentaire partout sauf sur TikTok (qui ne le permet pas) et la relance ; sur
  Threads, X et Bluesky, c'est la première réponse du fil. Il reste à l'épingler à la main
  là où c'est possible, et à le poster à la main sur TikTok.
- Le script écrit `postiz.json` (les charges utiles de `postiz posts:create --json`, une
  par date) et n'envoie rien. Il affiche réseau, date, format et longueur de chaque post.

**Fait quand** la sortie ne contient aucune ligne ATTENTION.

## 3. Créer les brouillons

La même commande avec `--envoyer` : téléverse la vidéo, la miniature et le carrousel,
crée un brouillon par réseau à son créneau, écrit `postiz-envoi.json` (`{envoye, date
(la plus proche), statut, video, miniature, carrousel, postes: [{reseau, postId,
integration, date, statut}]}` ; la relance Threads a pour réseau `threads-relance`).
Committer `postiz.json` et `postiz-envoi.json`.

Le script refuse de renvoyer un épisode qui a déjà un `postiz-envoi.json` : vérifier
d'abord dans Postiz (`npx postiz posts:list`) ; `--force` crée des doublons.

**Réseau connecté après coup** (rattraper un épisode déjà parti ailleurs) :
`npm run postiz -- NNN --envoyer --reseaux linkedin [--date …] [--commentaire]`, puis
`--programmer --reseaux linkedin` sur feu vert. Seuls ces réseaux sont envoyés ; leurs
posts s'ajoutent à `postiz-envoi.json` avec leur propre `date` et `statut`.

**Fait quand** `postiz-envoi.json` existe.

## 4. Faire relire, puis programmer

Dire à l'utilisateur : les brouillons sont dans le calendrier Postiz, chacun à son
créneau, et le premier à relire (celui qui part le plus tôt).
Ce qu'il doit regarder :

- la vidéo et le texte de chaque réseau, la relance Threads ;
- le carrousel LinkedIn et la couverture ;
- le commentaire de sources à épingler.

Ne jamais présenter l'épisode comme publié.

Sur un « oui » explicite (« programme », « vas-y », « publie ») :
`npm run postiz -- NNN --programmer` (ou l'utilisateur programme lui-même dans Postiz),
puis committer `postiz-envoi.json`.

**Fait quand** l'utilisateur a donné son feu vert et que `postiz-envoi.json` dit « programmé ».
