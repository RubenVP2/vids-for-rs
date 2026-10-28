# Le site de Matou

Une page d'accueil et un blog, en **Astro**, servis en **statique sur Cloudflare Workers**
(aucun code exécuté côté serveur : le plus rapide et le moins cher possible). Code : `site/`.

Rôle : recevoir le trafic des réseaux (lien en bio → `/liens/`), être trouvé sur Google
grâce aux articles, et plus tard créer de la valeur (newsletter, offres…).

## Pages

| Adresse | Contenu |
| --- | --- |
| `/` | Accueil : la promesse, le programme, les tampons, le Hype-mètre, les 3 derniers articles, les réseaux |
| `/blog/` | Tous les articles, du plus récent au plus ancien |
| `/blog/<slug>/` | Un article = la version texte d'un épisode |
| `/liens/` | Page « lien en bio » (non indexée) : dernier article, blog, réseaux |
| `/rss.xml`, `/sitemap-index.xml`, `/robots.txt` | Flux, plan du site, robots |

## D'où vient le contenu

Rien n'est copié : le site lit le dépôt au moment du build.

- **Couleurs** : `brand/tokens.json`. **Matou** : `brand/mascotte/*.svg` (inline).
- **Polices** : `site/public/fonts/`, versions allégées de `public/brand/fonts/`
  (caractères latins seulement, Shantell Sans figée à « informel 60 » : 52 Ko au lieu de 174).
- **Articles** : `episodes/NNN-slug/article.md` (skill `article`), complété par
  `scenes.json` (numéro, série, source, tampon, Hype-mètre), `miniature.jpg`
  (`npm run render`) et `postiz-envoi.json` (date).
- **Réseaux** : `site/src/config.ts` (comptes `@matou_ai` vérifiés le 28/10/2026).

**Quand un article est en ligne** : seulement si `postiz-envoi.json` dit `programmé`
(l'utilisateur a donné son feu vert) **et** que la date de la vidéo est passée au moment
du build. Le blog suit donc la relecture humaine sans étape en plus. Les routines poussent
sur `main` chaque matin : chaque poussée reconstruit le site, et l'article de la veille
apparaît.

## Commandes (dans `site/`)

Node **24** (fichier `.node-version` ; Astro 7 refuse Node 22.22).

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview   # dist/ servi par Wrangler, comme en production
npm run check     # types
```

## Mise en ligne (une fois)

Cloudflare › **Workers & Pages** › **Create** › **Import a repository** › `RubenVP2/vids-for-rs` :

| Réglage | Valeur |
| --- | --- |
| Branche de production | `main` |
| Dossier racine (*root directory*) | `site` |
| Commande de build | `npm run build` |
| Commande de déploiement | `npx wrangler deploy` |
| Variable de build | `SITE_URL` = l'adresse publique, ex. `https://matou.ai` |

`SITE_URL` est obligatoire : sans elle, le build sur Cloudflare s'arrête (les liens
canoniques, le plan du site et le flux RSS seraient faux). Domaine perso : Worker ›
**Settings** › **Domains & Routes** › **Add** › **Custom domain**.

Ensuite : déclarer le site dans Google Search Console et y envoyer
`/sitemap-index.xml` ; mettre `https://<domaine>/liens/` dans la bio de chaque réseau.

## Performance et SEO

Mesuré avec Lighthouse le 28/10/2026 (accueil et article) : **100** en performance,
accessibilité, bonnes pratiques et SEO ; 90 Ko pour l'accueil, 116 Ko pour un article.

- Zéro JavaScript envoyé au navigateur ; CSS inline ; polices préchargées.
- Images en WebP aux bonnes tailles (Astro), cache d'un an sur `/_astro/` (`public/_headers`).
- Titre, description, lien canonique, Open Graph (`public/og.png`), données structurées
  (Organization, WebSite, Blog, BlogPosting avec la source en `citation`, fil d'Ariane).

## Plus tard (idées, rien n'est commencé)

- Newsletter : un formulaire et un Worker qui enregistre l'adresse (D1 ou un service).
- Vidéo dans l'article : il faudra l'héberger (R2, Stream) ou intégrer le Short YouTube.
- Image de partage propre à chaque article (aujourd'hui : la même pour tout le site).
- Mentions légales : à ajouter avec les informations de l'éditeur avant toute monétisation.
