// Aligne les mots du script (texte exact, avec ponctuation) sur les mots entendus
// par la transcription (horodatés). Les mots du script gardent leur orthographe ;
// ceux que la transcription a ratés reçoivent un temps interpolé.
import type {MotTranscrit} from './openrouter';

export const normaliser = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9%]/g, '');

const ressemblance = (a: string, b: string) => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.startsWith(b) || b.startsWith(a)) return 0.7;
  // distance d'édition courte
  const m = a.length,
    n = b.length;
  const d = Array.from({length: m + 1}, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  const sim = 1 - d[m][n] / Math.max(m, n);
  return sim >= 0.6 ? sim * 0.8 : 0;
};

export type MotAligne = {texte: string; debut: number; fin: number; trouve: boolean};

export const aligner = (motsScript: string[], entendus: MotTranscrit[], dureeTotale: number): MotAligne[] => {
  const a = motsScript.map(normaliser);
  const b = entendus.map((e) => normaliser(e.mot));
  const m = a.length,
    n = b.length;
  // Needleman-Wunsch : on maximise la ressemblance, les trous coûtent un peu
  const TROU = -0.2;
  const score = Array.from({length: m + 1}, () => new Float64Array(n + 1));
  const choix = Array.from({length: m + 1}, () => new Uint8Array(n + 1));
  for (let i = 1; i <= m; i++) {
    score[i][0] = i * TROU;
    choix[i][0] = 1;
  }
  for (let j = 1; j <= n; j++) {
    score[0][j] = j * TROU;
    choix[0][j] = 2;
  }
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const diag = score[i - 1][j - 1] + (ressemblance(a[i - 1], b[j - 1]) || -0.5);
      const haut = score[i - 1][j] + TROU;
      const gauche = score[i][j - 1] + TROU;
      if (diag >= haut && diag >= gauche) {
        score[i][j] = diag;
        choix[i][j] = 0;
      } else if (haut >= gauche) {
        score[i][j] = haut;
        choix[i][j] = 1;
      } else {
        score[i][j] = gauche;
        choix[i][j] = 2;
      }
    }
  const res: (MotAligne | null)[] = motsScript.map(() => null);
  let i = m,
    j = n;
  while (i > 0 || j > 0) {
    const c = choix[i][j];
    if (i > 0 && j > 0 && c === 0) {
      if (ressemblance(a[i - 1], b[j - 1]) > 0) {
        const e = entendus[j - 1];
        // plusieurs mots du script sur un même mot entendu (ex. « 30 » → « trente ») : on garde le premier
        res[i - 1] = {texte: motsScript[i - 1], debut: e.debut, fin: e.fin, trouve: true};
      }
      i--;
      j--;
    } else if (i > 0 && (j === 0 || c === 1)) i--;
    else j--;
  }
  // interpolation des mots non retrouvés, au prorata du nombre de lettres
  let k = 0;
  while (k < res.length) {
    if (res[k]) {
      k++;
      continue;
    }
    let fin = k;
    while (fin < res.length && !res[fin]) fin++;
    const t0 = k > 0 ? res[k - 1]!.fin : 0;
    const t1 = fin < res.length ? res[fin]!.debut : dureeTotale;
    const poids = motsScript.slice(k, fin).map((w) => Math.max(1, normaliser(w).length));
    const total = poids.reduce((x, y) => x + y, 0);
    let t = t0;
    for (let q = k; q < fin; q++) {
      const d = ((t1 - t0) * poids[q - k]) / total;
      res[q] = {texte: motsScript[q], debut: t, fin: t + d, trouve: false};
      t += d;
    }
    k = fin;
  }
  // monotonie
  const out = res as MotAligne[];
  for (let q = 1; q < out.length; q++) {
    if (out[q].debut < out[q - 1].debut) out[q].debut = out[q - 1].debut;
    if (out[q].fin < out[q].debut) out[q].fin = out[q].debut + 0.05;
  }
  return out;
};
