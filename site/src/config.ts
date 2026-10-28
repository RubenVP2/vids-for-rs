// Ce qui décrit Matou sur le site. Les comptes ont été vérifiés le 28/10/2026 :
// c'est @matou_ai partout (TikTok, Instagram, Threads, YouTube).
export const MARQUE = {
  nom: 'Matou',
  nomComplet: "Matou · l'IA expliquée",
  slogan: "L'actu de l'IA en 30 secondes. Un chat t'explique.",
  description:
    "Matou explique l'actu de l'IA en vidéos de 30 secondes : une annonce par jour, sans jargon, sources à l'appui. Et un blog pour aller un peu plus loin.",
  langue: 'fr',
  locale: 'fr_FR',
};

export type Reseau = {id: string; nom: string; url: string; pseudo: string};

// Ordre d'affichage = ordre de priorité (TikTok, Reels et Shorts d'abord).
export const RESEAUX: Reseau[] = [
  {id: 'tiktok', nom: 'TikTok', url: 'https://www.tiktok.com/@matou_ai', pseudo: '@matou_ai'},
  {id: 'instagram', nom: 'Instagram', url: 'https://www.instagram.com/matou_ai/', pseudo: '@matou_ai'},
  {id: 'youtube', nom: 'YouTube', url: 'https://www.youtube.com/@matou_ai', pseudo: '@matou_ai'},
  {id: 'threads', nom: 'Threads', url: 'https://www.threads.com/@matou_ai', pseudo: '@matou_ai'},
  // LinkedIn : ajouter ici l'adresse de la page « Matou AI » quand elle est connue.
];
