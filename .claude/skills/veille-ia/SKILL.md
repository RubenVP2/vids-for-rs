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

## Classer

Pour chaque candidat des 48 dernières heures, noter de 1 à 3 :

1. **Impact grand public** : est-ce que ça change quelque chose pour quelqu'un qui
   n'est pas dans la tech (travail, école, téléphone, prix, vie privée) ?
2. **Concret** : disponible ou datée > vague promesse.
3. **Explicable en 30 s** : une seule idée tient la vidéo.
4. **Pas déjà traité** : vérifier les `episodes/*/scenes.json` existants.

**Fait quand** tu proposes à l'utilisateur 3 sujets classés, chacun avec : titre de
hook possible, source (URL), statut, série (`flash` / `decrypte`), et la raison du
classement. L'utilisateur choisit ; ensuite, skill `episode`.

Si l'utilisateur t'a déjà laissé le choix (« fais la plus populaire », « choisis »,
« fais-moi une vidéo sur l'actu ») : montre le classement en quelques lignes, prends le
premier et enchaîne directement avec le skill `episode`, sans attendre de réponse.
