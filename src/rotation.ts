/**
 * Rang d'un épisode dans une liste de `taille` variantes : rotation sur le numéro, sans tirage.
 * Principal et second alternent pairs et impairs : ⌊n/2⌋ avance d'un cran par jour pour
 * chacun des deux (avec n seul, 4 variantes → le principal n'en verrait que 2), et + n % 2
 * décale le second pour que les deux épisodes du jour n'aient pas la même.
 * Sert aux gabarits de texte (brand/publication.json), de montage (brand/montage.json)
 * et à la mise en page de la vidéo (Matou à gauche ou à droite).
 */
export const rang = (n: number, taille: number) => (Math.floor(n / 2) + (n % 2)) % taille;
