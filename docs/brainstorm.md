# Brainstorm — Vids for RS

> Document de travail. Rien n'est figé ici : les choix validés partent dans
> [`decisions.md`](decisions.md).
>
> Légende : ⭐ recommandation · ❓ question ouverte pour toi · ⚠️ point de vigilance

---

## 1. Positionnement

L'actu IA sur les réseaux est saturée de comptes « hype » (« Cette IA va remplacer
100 % des devs 🤯 »). C'est notre opportunité : se différencier par la **fiabilité**.

**Promesse proposée** ⭐ : *« L'actu IA, décryptée en 60 secondes. Sourcée, sans bullshit. »*

Ce qui nous rend différents :

- **Sourcé** : chaque vidéo affiche sa source. On devient le compte « de confiance ».
- **Décrypté** : pas juste *quoi*, mais *pourquoi ça compte pour toi*.
- **Un verdict** : chaque vidéo se termine par une note claire (voir le Hype-mètre, §4).
- **Une personnalité** : la mascotte apporte la chaleur et l'humour que les comptes
  « news » sérieux n'ont pas.

❓ **Audience cible principale** — ça change le vocabulaire, le rythme et les sujets :

| Option | Profil | Conséquence |
| --- | --- | --- |
| A. Grand public curieux | Utilise ChatGPT, entend parler d'IA partout | Zéro jargon, analogies, sujets « grand public » |
| B. Pros de la tech | Devs, PM, data | Jargon OK, sujets pointus (modèles, API, benchmarks) |
| C. Pros non-tech | Entrepreneurs, marketeux, managers | Focus usages concrets et impact business |

⭐ Je recommande **A+C** : « des gens intelligents qui ne sont pas dans la tech ».
C'est le plus grand public, et le moins bien servi par les comptes actuels.

---

## 2. Formats (séries)

Avoir des séries nommées crée des rendez-vous et une impression de « collection ».

| Série | Contenu | Durée | Fréquence |
| --- | --- | --- | --- |
| **Flash** | Une news, un fait | 30–45 s | Quotidien / quand ça tombe |
| **Décrypté** | Un article de blog d'une grande boîte, expliqué | 60–90 s | 1–2 / semaine |
| **Le Récap** | Le top 5 de la semaine | 60–90 s | Rendez-vous fixe (ex. dimanche) |
| **Le Mot de l'IA** *(plus tard)* | Un concept expliqué (token, RAG, agent…) | 30–45 s | Contenu intemporel |

⭐ Démarrer avec **2 séries seulement** (Flash + Décrypté), ajouter Le Récap quand le
rythme de production est stable. Le Mot de l'IA est excellent pour recruter de
nouveaux abonnés (contenu intemporel, très partageable) : à garder en réserve.

---

## 3. Squelette d'une vidéo

Une structure fixe = des vidéos qui se ressemblent + une production automatisable.

| Temps | Bloc | Rôle |
| --- | --- | --- |
| 0–2 s | **Hook** | Une phrase-choc + visuel fort. Pas de logo, pas d'intro. |
| 2–6 s | **Contexte** | Qui, quoi, quand. Logo/nom de la source. |
| 6–45 s | **Les points clés** | 3 maximum, une idée par écran. |
| ~45 s | **Pourquoi ça compte** | L'impact concret pour le viewer. |
| fin | **Verdict** | Le Hype-mètre de la mascotte. |
| fin | **Signature** | Phrase de fin récurrente + appel à l'action naturel. |

Règles de rythme :

- Sous-titres **toujours** présents (beaucoup regardent sans le son), mot par mot.
- Un changement visuel toutes les 2–3 secondes.
- ⚠️ Jamais d'intro avec logo : les 2 premières secondes décident de tout.
- Idéalement la fin « boucle » sur le début, pour favoriser le re-visionnage.

---

## 4. Mécaniques de fidélisation

Ce qui fait qu'on s'abonne et qu'on revient :

1. **Le Hype-mètre** ⭐ — Chaque vidéo se termine par le verdict de la mascotte,
   par exemple sur 3 niveaux : 🫧 *Pur buzz* · 🌱 *Prometteur* · 🚀 *Game changer*.
   - Donne une raison de **rester jusqu'à la fin** (rétention).
   - Provoque le **débat en commentaires** (« t'es pas d'accord avec la note ? »).
   - Devient la **signature** reconnaissable de la chaîne.
2. **Numérotation des épisodes** (`#042`) — sentiment de collection, envie de « tout voir ».
3. **Signature sonore** — un son court (≤ 0,5 s) reconnaissable, au moment du verdict
   ou en transition. On reconnaît la vidéo avant même de la regarder.
4. **Une couleur signature** — reconnaissable dans le fil en moins d'une seconde.
5. **Phrase de fin récurrente** — une catchphrase propre à la mascotte.
6. **Le lore de la mascotte** — des running gags légers qui évoluent (elle a peur d'être
   remplacée par un modèle plus récent, elle « se met à jour » à chaque épisode…).
   Les habitués comprennent les clins d'œil → sentiment d'appartenance.
7. **Répondre aux commentaires en vidéo** — TikTok permet de répondre à un commentaire
   par une vidéo : contenu facile et très engageant.
8. **Rendez-vous fixe** — Le Récap du dimanche.

---

## 5. La mascotte

### La contrainte clé

La mascotte sera **animée par du code à chaque vidéo**. Elle doit donc être :

- **Vectorielle (SVG)** et faite de **formes simples**.
- Pilotée par un nombre fini d'**états** : neutre, parle, surprise, réfléchit,
  sceptique, contente, alerte. Chaque vidéo pioche dans ces états.
- **Lisible en petit** (dans un coin de l'écran pendant que l'info est au centre).

Une mascotte trop détaillée nécessiterait un illustrateur pour chaque vidéo :
incompatible avec « une session = une vidéo ».

### Pistes

**A. Le Curseur** ⭐ — Le petit bloc clignotant `▍` qui apparaît quand une IA écrit
sa réponse, avec deux yeux.
- ✅ Ultra « natif IA », tout le monde l'a déjà vu sans le remarquer.
- ✅ Très simple à animer ; le clignotement = sa respiration.
- ✅ Peut « taper » du texte à l'écran : il devient l'outil narratif.
- ⚠️ Peut sembler froid : la personnalité passe par les yeux et le ton.

**B. La Bulle** — Une bulle de dialogue avec des yeux.
- ✅ Elle peut afficher des mots, emojis ou chiffres *dans son propre corps*.
- ✅ Évoque la conversation, le chat.
- ⚠️ Forme déjà vue dans pas mal de logos de messagerie.

**C. Le Hibou de veille** — Un hibou géométrique qui « fait la veille » la nuit à ta place.
- ✅ Chaleureux, jeu de mots avec « veille technologique ».
- ⚠️ Risque fort de confusion avec Duolingo (hibou vert iconique).

**D. Hybride Curseur + Bulle** — Le curseur vit *dans* une bulle, ou se transforme en bulle
quand il parle.

Pistes de noms (à tester à voix haute) : *Blink*, *Tok*, *Bip*, *Prompt*, *Kursor*…

❓ Quelle(s) piste(s) te parle(nt) ? On fera des croquis SVG de 2 pistes en phase 2
avant de trancher.

---

## 6. Nom de la chaîne

« Vids for RS » est le nom du projet, pas forcément celui de la chaîne.
Quelques idées de départ :

- *IA en Clair*
- *Le Fil IA*
- *Décode IA*
- *Prompt du Jour*
- Le nom de la mascotte lui-même (ex. *Blink*) — la mascotte **est** la marque.

❓ As-tu déjà un nom ou des comptes ouverts ? Sinon, on vérifiera la disponibilité des
pseudos sur chaque plateforme avant de trancher.

---

## 7. Identité visuelle (pistes, à figer en phase 2)

- **Format** : vertical 1080×1920, avec des **zones de sécurité** (l'interface TikTok /
  Reels masque le bas et la droite de l'écran).
- **Couleurs** : une base (sombre ou claire) + **une couleur signature** + des couleurs
  de verdict pour le Hype-mètre.
  ⚠️ Éviter le cliché « dégradé violet néon » qu'utilisent tous les comptes IA.
- **Typographie** : une police d'affichage très grasse pour les hooks, une police lisible
  pour les sous-titres. Polices libres de droits (Google Fonts / licence OFL).
- **Logos des entreprises** : usage informatif uniquement, avec parcimonie.
- **Son** : 2–3 musiques de fond libres de droits fixes + la signature sonore.

Prochaine étape : un **moodboard** de comptes existants (ce que tu aimes / n'aimes pas).

---

## 8. Le pipeline « 1 session = 1 vidéo » (cible)

```
Article (texte ou URL)
  → Analyse + vérification des faits
  → Script (texte de la voix + découpage en scènes)
  → Fichier de scènes (JSON validé)
  → Voix (synthèse vocale + horodatage des mots pour les sous-titres)
  → Rendu vidéo (MP4 1080×1920)
  → Livrables : vidéo + miniature + description + hashtags par plateforme
```

### Choix techniques à valider

**Moteur vidéo** — ⭐ [Remotion](https://www.remotion.dev) : les vidéos sont du code
(React), le rendu MP4 se fait sans interface. Idéal pour que Claude génère une vidéo
à partir d'un fichier de scènes. Licence gratuite pour les particuliers et petites
structures (à vérifier pour ton cas). Alternatives : Motion Canvas, FFmpeg brut.

❓ **La voix** — la décision la plus structurante :

| Option | Avantages | Inconvénients |
| --- | --- | --- |
| Voix de synthèse (ex. ElevenLabs) | 100 % automatisé, horodatage des mots fourni | Coût d'API, moins « humain », étiquetage IA parfois exigé |
| Ta propre voix | Authenticité, lien avec l'audience | Tu enregistres chaque vidéo : la session n'est plus 100 % autonome |
| Voix de la mascotte (synthèse stylisée) | Cohérent avec le personnage | Peut fatiguer sur la durée |
| Pas de voix (texte + musique) | Simple, aucun coût | Rétention généralement plus faible |

Un mode **hybride** est possible : Claude écrit le script, tu l'enregistres, Claude
fait tout le montage.

⚠️ Les clés d'API (synthèse vocale…) devront être configurées dans l'environnement
des sessions Claude, et le réseau doit autoriser ces services.

---

## 9. Règles éditoriales

- Toujours citer la source (à l'écran + dans la description).
- Ne jamais inventer un chiffre absent de l'article.
- Distinguer : annoncé / disponible / rumeur.
- Résumer et commenter, ne pas recopier (droit d'auteur).
- ⚠️ Vérifier les règles d'étiquetage « contenu généré par IA » de chaque plateforme.
- Relecture humaine avant chaque publication.

---

## 10. Questions ouvertes pour toi

1. **Audience** : A, B, C, ou A+C (§1) ?
2. **Plateformes** : TikTok, Reels, Shorts, LinkedIn ? Toutes au même format ?
3. **Langue** : français uniquement ? Version anglaise un jour ?
4. **Voix** : synthèse, la tienne, celle de la mascotte, ou pas de voix (§8) ?
5. **Mascotte** : quelle(s) piste(s) explorer (§5) ?
6. **Nom** : un nom en tête ou des comptes déjà créés (§6) ?
7. **Rythme** : combien de vidéos par semaine vises-tu ?
8. **Ton** : plutôt sérieux-pédago, ou fun-décalé ? Où se situe l'humour ?
9. **Toi à l'écran** : apparais-tu (visage, voix) ou la mascotte est-elle seule ?
10. **Inspirations** : des comptes (même hors IA) dont tu aimes le style ?
