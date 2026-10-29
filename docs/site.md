# Le site de Matou

Le site (accueil + blog, Astro statique sur Cloudflare Workers) vit dans un dépôt à part :
**[RubenVP2/jev-game](https://github.com/RubenVP2/jev-game)** (à renommer). Son README
explique les pages, les commandes et la mise en ligne.

Il ne copie rien d'ici : à chaque build (toutes les heures), il fait un clone partiel de la
branche **`main`** de ce dépôt et lit seulement ces fichiers.

| Fichier | Ce que le site en fait |
| --- | --- |
| `episodes/NNN-slug/article.md` | L'article du blog (skill `article`) : `titre` (65 caractères max), `description` (80 à 165), corps en Markdown |
| `episodes/NNN-slug/scenes.json` | Numéro, slug (adresse `/blog/<slug>/`), série, source, statut (tampon), verdict et sa raison |
| `episodes/NNN-slug/postiz-envoi.json` | `statut` et `date` : l'article n'est en ligne que si la vidéo est `programmé` et que sa date est passée |
| `episodes/NNN-slug/miniature.jpg` | L'image de l'article (écrite par `npm run render`) |
| `brand/tokens.json` | Toutes les couleurs, les tampons, le Hype-mètre |
| `brand/mascotte/*.svg`, `brand/icones/*.svg` | Matou et les icônes au feutre |

Conséquences :

- Renommer ou déplacer un de ces fichiers, ou changer la forme de `scenes.json` ou de
  `postiz-envoi.json`, casse le site : mettre à jour le dépôt du site en même temps.
- Un `article.md` hors limites (titre, description) fait échouer le build : plus aucune
  mise à jour du blog tant qu'il n'est pas corrigé.
- Rien à faire pour publier un article : pousser l'épisode sur `main`, programmer la
  vidéo dans Postiz ; il apparaît dans l'heure qui suit la diffusion.
