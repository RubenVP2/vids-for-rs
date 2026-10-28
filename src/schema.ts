import {z} from 'zod';
import {ETATS} from './mascot/MatouSvg';
import {ICONES} from './components/Icones';

// Le fichier de scènes (episodes/<dossier>/scenes.json) décrit tout l'épisode.
// Chaque scène porte la phrase que Matou dit (`texte`) : le minutage de la vidéo
// vient de la voix (timings.json), on n'écrit jamais de temps à la main.
//
// Dans `texte` et dans les textes affichés, ==mot== surligne « mot » au fluo jaune.

const etat = z.enum(ETATS);
const icone = z.enum(ICONES);

const base = {
  /** Ce que Matou dit pendant la scène. Phrases courtes, à l'oral. */
  texte: z.string().min(1),
  /** Expression de Matou pendant la scène. */
  matou: etat.optional(),
};

/** Un élément qui apparaît quand Matou prononce le mot `quand` (sinon, réparti dans le temps). */
const element = z.object({
  texte: z.string().min(1).max(60),
  icone: icone.optional(),
  quand: z.string().optional(),
});

export const sceneSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('hook'),
    ...base,
    /** Gros titre à l'écran, 2 à 7 mots. */
    titre: z.string().min(1).max(60),
    icone: icone.optional(),
  }),
  z.object({
    type: z.literal('source'),
    ...base,
    /** Titre de l'article tel que publié (ou sa traduction courte), pour la carte source. */
    titreArticle: z.string().min(1).max(110),
  }),
  z.object({
    type: z.literal('point'),
    ...base,
    titre: z.string().min(1).max(60),
    corps: z.string().max(120).optional(),
    icone: icone.optional(),
  }),
  z.object({
    type: z.literal('chiffre'),
    ...base,
    /** Le chiffre tel qu'affiché : « 2× », « 40 % », « 1 M ». Doit venir de la source. */
    valeur: z.string().min(1).max(10),
    legende: z.string().min(1).max(70),
    quand: z.string().optional(),
  }),
  z.object({
    type: z.literal('liste'),
    ...base,
    titre: z.string().min(1).max(50),
    elements: z.array(element).min(2).max(4),
  }),
  z.object({
    type: z.literal('comparaison'),
    ...base,
    avant: z.object({titre: z.string().max(24), texte: z.string().max(70)}),
    apres: z.object({titre: z.string().max(24), texte: z.string().max(70), quand: z.string().optional()}),
  }),
  z.object({
    type: z.literal('pourquoi'),
    ...base,
    titre: z.string().min(1).max(40).default('Et pour toi ?'),
    corps: z.string().min(1).max(120),
    icone: icone.optional(),
  }),
  z.object({
    type: z.literal('verdict'),
    ...base,
    /** Une ligne qui justifie le verdict. */
    raison: z.string().min(1).max(80),
  }),
  z.object({
    type: z.literal('fin'),
    ...base,
  }),
]);
export type Scene = z.infer<typeof sceneSchema>;
export type TypeScene = Scene['type'];

export const episodeSchema = z
  .object({
    numero: z.number().int().min(0),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    serie: z.enum(['flash', 'decrypte']),
    source: z.object({
      /** Qui publie : « OpenAI », « Google DeepMind », « The Verge »… */
      nom: z.string().min(1).max(30),
      url: z.string().url(),
      /** Date de publication, AAAA-MM-JJ. */
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      type: z.enum(['blog', 'article', 'papier', 'communique', 'video', 'post']),
    }),
    statut: z.enum(['annonce', 'disponible', 'rumeur']),
    verdict: z.enum(['buzz', 'prometteur', 'gameChanger']),
    /** Titre de la miniature (couverture), 2 à 6 mots. Par défaut, le titre du hook. */
    miniature: z.string().max(50).optional(),
    musique: z.boolean().default(true),
    scenes: z.array(sceneSchema).min(4).max(10),
  })
  .superRefine((ep, ctx) => {
    const types = ep.scenes.map((s) => s.type);
    if (types[0] !== 'hook') ctx.addIssue({code: 'custom', message: 'La première scène doit être le hook.'});
    if (!types.includes('source')) ctx.addIssue({code: 'custom', message: 'Il faut une scène « source ».'});
    if (types[types.length - 1] !== 'fin') ctx.addIssue({code: 'custom', message: 'La dernière scène doit être « fin ».'});
    if (types[types.length - 2] !== 'verdict')
      ctx.addIssue({code: 'custom', message: 'L’avant-dernière scène doit être le verdict (Hype-mètre).'});
  });
export type Episode = z.infer<typeof episodeSchema>;

// Produit par `npm run voice` : la voix et le minutage de chaque mot.
export const timingsSchema = z.object({
  audio: z.string(),
  duree: z.number().positive(),
  voix: z.object({modele: z.string(), voix: z.string()}),
  /** Part des mots du script retrouvés par la transcription (0–1). Bas = voix qui a mal lu. */
  alignement: z.number().min(0).max(1).optional(),
  mots: z.array(
    z.object({
      texte: z.string(),
      debut: z.number(),
      fin: z.number(),
      scene: z.number().int(),
      surligne: z.boolean(),
    }),
  ),
  scenes: z.array(z.object({debut: z.number(), fin: z.number()})),
  /** Volume de la voix, une valeur 0–1 par image (30 i/s) : sert à animer la bouche. */
  enveloppe: z.array(z.number()),
});
export type Timings = z.infer<typeof timingsSchema>;

export const episodePropsSchema = z.object({
  episode: episodeSchema,
  timings: timingsSchema,
  /** Chemin de l'audio dans public/ (copié par le script de rendu). */
  audio: z.string(),
});
export type EpisodeProps = z.infer<typeof episodePropsSchema>;

// {affiché|prononcé} : « {GPT-5|G P T 5} » s'affiche GPT-5 dans les sous-titres mais se dit « G P T 5 ».
const PRONONCIATION = /\{([^|}]+)\|([^}]+)\}/g;

/** Texte lu par la voix : sans les marqueurs ==…==, avec les prononciations. */
export const texteParle = (t: string) => t.replace(/==/g, '').replace(PRONONCIATION, '$2');

/** Texte des sous-titres : avec les marqueurs ==…==, la forme affichée des prononciations. */
export const texteAffiche = (t: string) => t.replace(PRONONCIATION, '$1');
