---
name: veille-ia
description: Trouve et classe les annonces IA du moment pour choisir le sujet du prochain épisode de Matou. À utiliser quand l'utilisateur demande « quoi publier », « les news du jour », un sujet, ou n'a pas d'article sous la main.
---

# Veille : choisir le sujet du jour

## Où chercher (sources de premier rang d'abord)

- Blogs et salles de presse officiels : Anthropic (anthropic.com/news), OpenAI
  (openai.com/news), Google DeepMind (deepmind.google/discover/blog), Google
  (blog.google/technology/ai), Meta AI (ai.meta.com/blog), Mistral AI (mistral.ai/news),
  Microsoft (blogs.microsoft.com/ai), Apple (machinelearning.apple.com), NVIDIA
  (blogs.nvidia.com), Hugging Face (huggingface.co/blog), xAI (x.ai/news).
- Médias pour recouper : The Verge, TechCrunch, Ars Technica, Les Échos, Le Monde Pixels,
  Numerama.

Une rumeur ne vient que d'un média reconnu qui cite ses sources ; elle sera traitée
avec le statut `rumeur` et Matou `sceptique`.

## Avant de chercher

Lire `docs/apprentissages.md` (ce qui a fait des vues chez Matou) et `docs/sujets.md`
(la réserve). Lister les sujets déjà traités : `episodes/*/scenes.json` (source et hook).

## Classer

Pour chaque candidat des 48 dernières heures, noter de 1 à 3 :

1. **Impact grand public** : est-ce que ça change quelque chose pour quelqu'un qui
   n'est pas dans la tech (travail, école, téléphone, prix, vie privée) ?
2. **Potentiel de trafic** : un nom que tout le monde connaît (ChatGPT, Google, Apple,
   Meta, WhatsApp…), un effet « quoi ?! » (chiffre, risque, première fois), une actu
   reprise par plusieurs médias grand public, ou ce que `docs/apprentissages.md` a
   confirmé. Une annonce de moins de 24 h prend +1 (plafonné à 3).
3. **Concret** : disponible ou datée > vague promesse.
4. **Explicable en 30 s** : une seule idée tient la vidéo.

Écarter ce qui est déjà traité (même annonce, ou même idée il y a moins de 7 jours) et
ce qui n'a pas de source de premier rang ni de média reconnu. Total sur 12 ; **seuil :
8**. En dessous, ce n'est pas l'actu du jour : prendre la réserve (`docs/sujets.md`).

Le sens avant le buzz : un sujet qui fait du clic mais qu'on ne peut pas expliquer
honnêtement en 30 s (rumeur fragile, polémique sans fait vérifiable) est écarté.

**Fait quand** tu proposes à l'utilisateur 3 sujets classés, chacun avec : titre de
hook possible, source (URL), statut, série (`flash` / `decrypte`), la note et la raison
du classement. L'utilisateur choisit ; ensuite, skill `episode`.

## Mode autonome

Tâche planifiée (`episode-du-jour`), ou l'utilisateur t'a laissé le choix (« fais la
plus populaire », « choisis », « fais-moi une vidéo sur l'actu ») : montre le classement
en quelques lignes, prends le premier au-dessus du seuil (sinon le premier de la
réserve, retiré de `docs/sujets.md`) et enchaîne directement avec le skill `episode`,
sans attendre de réponse. Épisode **second** du jour : le principal est déjà traité,
écarte aussi tout sujet qui le recoupe (même entreprise ou même annonce).
