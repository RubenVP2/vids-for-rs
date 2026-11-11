#!/usr/bin/env python3
"""Voix d'essai GRATUITE pour les prototypes en duo (docs/personnages.md).

Lit scenes.json, fait dire `plouf` puis `texte` de chaque scène par Piper (synthèse libre,
hors ligne : https://github.com/rhasspy/piper), et écrit voix.mp3 + timings.json comme
`npm run voice`. Sert à juger un format, jamais à publier : `npm run check` refuse cette voix.

  pip install piper-tts
  python3 scripts/prototype/voix-libre.py prototypes/903-duo-plouf --voix <dossier des .onnx>

Voix (à télécharger depuis huggingface.co/rhasspy/piper-voices, dossier fr/fr_FR) :
Matou = fr_FR-tom-medium ; Plouf = fr_FR-siwis-medium, montée d'un ton (poisson de dessin animé).

Minutage : Piper ne le donne pas avec ces voix. Chaque phrase est synthétisée seule (son
début et sa fin sont donc exacts), puis sa durée est répartie entre ses mots au prorata de
leurs phonèmes. Assez juste pour des sous-titres, pas pour un épisode publié.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

FPS = 30
TAUX = 24000
PRONONCIATION = re.compile(r"\{([^|}]+)\|([^}]+)\}")
SILENCE_SCENE = 0.32
SILENCE_REPLIQUE = 0.22
SILENCE_PHRASE = 0.12
MONTEE_PLOUF = 1.16  # environ +2,5 demi-tons

ap = argparse.ArgumentParser()
ap.add_argument("dossier")
ap.add_argument("--voix", required=True, help="dossier des modèles .onnx de Piper")
args = ap.parse_args()
dossier = Path(args.dossier)
episode = json.loads((dossier / "scenes.json").read_text())
voix = {
    "matou": PiperVoice.load(str(Path(args.voix) / "fr_FR-tom-medium.onnx")),
    "plouf": PiperVoice.load(str(Path(args.voix) / "fr_FR-siwis-medium.onnx")),
}
reglages = {"matou": SynthesisConfig(length_scale=0.84), "plouf": SynthesisConfig(length_scale=0.85)}


def normaliser(m: str) -> str:
    return re.sub(r"[^\w%]", "", m.lower().replace("’", "").replace("'", ""))


def unites(texte: str):
    """Les mots affichés, avec leur forme lue et leur surlignage (mêmes règles que voice.ts)."""
    sortie = []
    for k, morceau in enumerate(re.split(r"==(.+?)==", texte.strip())):
        morceau = PRONONCIATION.sub(lambda m: m.group(1).replace(" ", " ") + "\u0001" + m.group(2).replace(" ", " "), morceau)
        for brut in morceau.split():
            affiche, _, lu = brut.partition("\u0001")
            affiche = affiche.replace(" ", " ")
            lu = (lu or affiche).replace(" ", " ")
            if not normaliser(affiche) and sortie:
                sortie[-1]["texte"] += affiche if re.match(r"^[,.…)]", affiche) else " " + affiche
                sortie[-1]["lu"] += " " + lu
            else:
                sortie.append({"texte": affiche, "lu": lu, "surligne": k % 2 == 1})
    return sortie


def phrases(us):
    """Coupe la liste de mots en phrases (fin par . ? ! …)."""
    groupe = []
    for u in us:
        groupe.append(u)
        if re.search(r"[.?!…]$", u["texte"]):
            yield groupe
            groupe = []
    if groupe:
        yield groupe


def reechantillonner(x: np.ndarray, taux: int) -> np.ndarray:
    if taux == TAUX:
        return x
    n = int(round(len(x) * TAUX / taux))
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)


def monter(x: np.ndarray) -> np.ndarray:
    """Monte la voix de Plouf d'un ton sans changer son débit (ffmpeg asetrate + atempo)."""
    with tempfile.TemporaryDirectory() as d:
        e, s = Path(d) / "e.f32", Path(d) / "s.f32"
        x.astype(np.float32).tofile(e)
        subprocess.run(
            ["ffmpeg", "-loglevel", "error", "-f", "f32le", "-ar", str(TAUX), "-ac", "1", "-i", str(e),
             "-af", f"asetrate={int(TAUX * MONTEE_PLOUF)},aresample={TAUX},atempo={1 / MONTEE_PLOUF:.5f}",
             "-f", "f32le", "-ar", str(TAUX), "-ac", "1", str(s)], check=True)
        return np.fromfile(s, dtype=np.float32)


def rogner(x: np.ndarray, seuil=0.015):
    fort = np.where(np.abs(x) > seuil)[0]
    return x[max(0, fort[0] - 240): fort[-1] + 480] if len(fort) else x


def dire(qui: str, groupe):
    """Synthétise une phrase ; renvoie l'audio et le poids (phonèmes) de chaque mot."""
    lu = " ".join(u["lu"] for u in groupe)
    morceaux = list(voix[qui].synthesize(lu, syn_config=reglages[qui]))
    audio = np.concatenate([reechantillonner(c.audio_float_array, c.sample_rate) for c in morceaux])
    if qui == "plouf":
        audio = monter(audio)
    audio = rogner(audio)
    phon = [p for c in morceaux for p in c.phonemes]
    mots_phon = [len([p for p in m if p.isalpha()]) for m in "".join(phon).split(" ") if m.strip()]
    lus = [len(u["lu"].split()) for u in groupe]
    if sum(lus) == len(mots_phon):
        poids, i = [], 0
        for n in lus:
            poids.append(sum(mots_phon[i:i + n]) or 1)
            i += n
    else:
        poids = [max(1, len(normaliser(u["lu"]))) for u in groupe]
    # une virgule ou un point prend un peu de temps après le mot
    poids = [p + (2 if re.search(r"[,;:]$", u["texte"]) else 3 if re.search(r"[.?!…]$", u["texte"]) else 0) for p, u in zip(poids, groupe)]
    return audio, poids


pistes = []  # (audio, qui)
mots = []
t = 0.05
pistes.append((np.zeros(int(t * TAUX), dtype=np.float32), None))
for i, scene in enumerate(episode["scenes"]):
    repliques = ([("plouf", scene["plouf"])] if scene.get("plouf") else []) + [("matou", scene["texte"])]
    for j, (qui, texte) in enumerate(repliques):
        if j > 0:
            pistes.append((np.zeros(int(SILENCE_REPLIQUE * TAUX), dtype=np.float32), None))
            t += SILENCE_REPLIQUE
        for k, groupe in enumerate(phrases(unites(texte))):
            if k > 0:
                pistes.append((np.zeros(int(SILENCE_PHRASE * TAUX), dtype=np.float32), None))
                t += SILENCE_PHRASE
            audio, poids = dire(qui, groupe)
            duree = len(audio) / TAUX
            total, cumul = sum(poids), 0
            for u, p in zip(groupe, poids):
                debut = t + duree * cumul / total
                cumul += p
                mots.append({"texte": u["texte"], "debut": round(debut, 3), "fin": round(t + duree * cumul / total, 3),
                             "scene": i, "surligne": u["surligne"], **({"locuteur": "plouf"} if qui == "plouf" else {})})
            pistes.append((audio, qui))
            t += duree
    pistes.append((np.zeros(int(SILENCE_SCENE * TAUX), dtype=np.float32), None))
    t += SILENCE_SCENE

signal = np.concatenate([a for a, _ in pistes])
# enveloppe de la bouche, une par personnage
par_image = TAUX // FPS
n = int(np.ceil(len(signal) / par_image))
rms = np.array([np.sqrt(np.mean(signal[k * par_image:(k + 1) * par_image] ** 2)) for k in range(n)])
haut = np.quantile(rms, 0.95) or 1
niveau = np.round(np.minimum(1, rms / haut), 2)
qui_par_image = np.full(n, "", dtype=object)
pos = 0
for a, qui in pistes:
    qui_par_image[pos // par_image:(pos + len(a)) // par_image + 1] = qui or ""
    pos += len(a)
enveloppe = [float(v) if q == "matou" else 0.0 for v, q in zip(niveau, qui_par_image)]
enveloppe_plouf = [float(v) if q == "plouf" else 0.0 for v, q in zip(niveau, qui_par_image)]

with tempfile.TemporaryDirectory() as d:
    brut = Path(d) / "voix.f32"
    signal.astype(np.float32).tofile(brut)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(TAUX), "-ac", "1", "-i", str(brut),
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-b:a", "160k", str(dossier / "voix.mp3")], check=True)

duree = round(len(signal) / TAUX, 3)
scenes = []
for i in range(len(episode["scenes"])):
    ms = [m for m in mots if m["scene"] == i]
    scenes.append({"debut": ms[0]["debut"], "fin": ms[-1]["fin"]})
timings = {
    "audio": "voix.mp3",
    "duree": duree,
    "voix": {"modele": "piper (essai, gratuit)", "voix": "Matou : fr_FR-tom-medium ; Plouf : fr_FR-siwis-medium monté"},
    "alignement": 1,
    "mots": mots,
    "scenes": scenes,
    "enveloppe": enveloppe,
    "enveloppePlouf": enveloppe_plouf,
}
(dossier / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=1))
for i, s in enumerate(scenes):
    print(f"  scène {i + 1} ({episode['scenes'][i]['type']}) : {s['debut']:.2f} → {s['fin']:.2f} s")
print(f"OK : {dossier / 'timings.json'} ({duree:.1f} s)", file=sys.stderr)
