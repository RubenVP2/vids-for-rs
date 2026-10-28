// Accès Postiz par la CLI officielle (`postiz`), authentifiée par OAuth2 device flow
// (`postiz auth:login`, jeton dans ~/.postiz/credentials.json). Aucune clé API, aucun
// secret dans l'environnement : la migration « option B » (docs/decisions.md).
import {execFileSync} from 'node:child_process';

/** Exécute `postiz <args…>` et renvoie sa sortie JSON. Les commandes préfixent parfois d'un libellé : on prend le premier JSON. */
export const cli = <T>(...args: string[]): T => {
  let sortie: string;
  try {
    sortie = execFileSync('postiz', args, {encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
  } catch (e) {
    const err = e as {stdout?: string; stderr?: string; message?: string};
    throw new Error(`postiz ${args.join(' ')} : ${(err.stdout ?? err.stderr ?? err.message ?? '').trim()}`);
  }
  const debuts = ['[', '{'].map((c) => sortie.indexOf(c)).filter((i) => i >= 0);
  if (!debuts.length) throw new Error(`postiz ${args.join(' ')} : sortie sans JSON (${sortie.trim()})`);
  return JSON.parse(sortie.slice(Math.min(...debuts))) as T;
};

/** Normalise les listes de la CLI : soit un tableau, soit `{posts: […]}` ou `{integrations: […]}`. */
export const enListe = <T>(brut: unknown, cle: 'posts' | 'integrations' = 'posts'): T[] => {
  if (Array.isArray(brut)) return brut as T[];
  const objet = brut as Record<string, unknown>;
  if (Array.isArray(objet?.[cle])) return objet[cle] as T[];
  throw new Error(`postiz : liste « ${cle} » absente de la réponse (${JSON.stringify(brut).slice(0, 200)})`);
};
