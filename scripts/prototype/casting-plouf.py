#!/usr/bin/env python3
"""Casting de la voix de Plouf (docs/personnages.md).

Chaque candidate dit deux répliques de Plouf autour de la vraie voix de Matou
(brand/voix/essais/gemini-puck.mp3) : on juge Plouf en duo, pas seul. Sorties dans
brand/voix/essais-plouf/ : un MP3 par candidate, comparatif.md (durée, débit, hauteur),
et casting-plouf.mp4 (toutes les candidates à la suite, numéro et nom à l'écran).

Deux séries :
- `--serie gemini` (retenue le 11/11/2026 : les voix gratuites sonnaient trop robotiques) :
  Gemini 3.8 Flash TTS par OpenRouter, le modèle de Matou. Gemini n'a pas de voix d'enfant
  toute faite : chaque voix reçoit une consigne de jeu « enfant de huit ans », et deux
  essais sont en plus montés d'environ 2 demi-tons. Clé : OPENROUTER_API_KEY ou
  OPENROUTER_KEY. Coût : environ 0,02 $ par voix. Sorties dans essais-plouf/gemini/.
    python3 scripts/prototype/casting-plouf.py --serie gemini
- `--serie gratuit` : edge-tts (voix de Microsoft Edge, gratuites mais sans licence de
  production) et Piper (libre, hors ligne).
    pip install edge-tts piper-tts
    python3 scripts/prototype/casting-plouf.py --serie gratuit --voix <dossier des .onnx de Piper>
"""
import argparse
import asyncio
import json
import os
import ssl
import subprocess
import tempfile
from pathlib import Path

import urllib.error
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFont

RACINE = Path(__file__).resolve().parents[2]
SORTIE = RACINE / "brand/voix/essais-plouf"
MATOU = RACINE / "brand/voix/essais/gemini-puck.mp3"
AVANT = "Matou, l'actu de l'IA va trop vite. J'y comprends plus rien !"
APRES = "Attends… c'était quoi la question, déjà ?"
TAUX = 24000

CONSIGNE_ENFANT = (
    "Tu joues Plouf, un petit poisson rouge de dessin animé. Voix d'enfant d'environ huit ans, aiguë et légère, "
    "curieuse, un peu naïve et très enthousiaste. Français de France, accent neutre. Rythme vif, intonation très "
    "expressive qui monte sur les questions, jamais récitée ni robotique."
)
GEMINI = {"modele": "google/gemini-3.8-flash-tts", "instructions": CONSIGNE_ENFANT}

# (id, nom affiché, moteur, réglages)
SERIE_GEMINI = [
    ("leda", "Leda (jeune)", "openrouter", {**GEMINI, "voice": "Leda"}),
    ("zephyr", "Zephyr (lumineuse)", "openrouter", {**GEMINI, "voice": "Zephyr"}),
    ("laomedeia", "Laomedeia (enjouée)", "openrouter", {**GEMINI, "voice": "Laomedeia"}),
    ("aoede", "Aoede (légère)", "openrouter", {**GEMINI, "voice": "Aoede"}),
    ("autonoe", "Autonoe (claire)", "openrouter", {**GEMINI, "voice": "Autonoe"}),
    ("despina", "Despina (douce)", "openrouter", {**GEMINI, "voice": "Despina"}),
    ("sadachbia", "Sadachbia (vive)", "openrouter", {**GEMINI, "voice": "Sadachbia"}),
    ("fenrir", "Fenrir (excité)", "openrouter", {**GEMINI, "voice": "Fenrir"}),
    ("leda-montee", "Leda, montée de 2 tons", "openrouter", {**GEMINI, "voice": "Leda", "montee": 1.12}),
    ("zephyr-montee", "Zephyr, montée de 2 tons", "openrouter", {**GEMINI, "voice": "Zephyr", "montee": 1.12}),
]

SERIE_GRATUITE = [
    ("eloise", "Éloïse (voix d'enfant)", "edge", {"voice": "fr-FR-EloiseNeural"}),
    ("eloise-vive", "Éloïse, plus vive", "edge", {"voice": "fr-FR-EloiseNeural", "rate": "+12%", "pitch": "+10Hz"}),
    ("denise-aigue", "Denise, plus aiguë", "edge", {"voice": "fr-FR-DeniseNeural", "rate": "+8%", "pitch": "+35Hz"}),
    ("vivienne", "Vivienne", "edge", {"voice": "fr-FR-VivienneMultilingualNeural", "rate": "+8%"}),
    ("henri-cartoon", "Henri, voix de dessin animé", "edge", {"voice": "fr-FR-HenriNeural", "rate": "+10%", "pitch": "+45Hz"}),
    ("remy-aigu", "Rémy, plus aigu", "edge", {"voice": "fr-FR-RemyMultilingualNeural", "rate": "+8%", "pitch": "+35Hz"}),
    ("piper-siwis", "Siwis montée (voix du test)", "piper", {"modele": "fr_FR-siwis-medium", "montee": 1.16}),
    ("piper-jessica", "Jessica", "piper", {"modele": "fr_FR-upmc-medium", "locuteur": 0, "montee": 1.06}),
    ("piper-pierre", "Pierre, monté", "piper", {"modele": "fr_FR-upmc-medium", "locuteur": 1, "montee": 1.22}),
]


def lire(fichier: Path) -> np.ndarray:
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(fichier), "-ac", "1", "-ar", str(TAUX), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.float32)


def ecrire(x: np.ndarray, fichier: Path):
    with tempfile.TemporaryDirectory() as d:
        brut = Path(d) / "x.f32"
        x.astype(np.float32).tofile(brut)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(TAUX), "-ac", "1", "-i", str(brut),
                        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-b:a", "160k", str(fichier)], check=True)


def monter(x: np.ndarray, facteur: float) -> np.ndarray:
    if facteur == 1:
        return x
    with tempfile.TemporaryDirectory() as d:
        e, s = Path(d) / "e.f32", Path(d) / "s.f32"
        x.astype(np.float32).tofile(e)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "f32le", "-ar", str(TAUX), "-ac", "1", "-i", str(e), "-af",
                        f"asetrate={int(TAUX * facteur)},aresample={TAUX},atempo={1 / facteur:.5f}", "-f", "f32le", "-ar", str(TAUX),
                        "-ac", "1", str(s)], check=True)
        return np.fromfile(s, dtype=np.float32)


def rogner(x: np.ndarray, seuil=0.01):
    fort = np.where(np.abs(x) > seuil)[0]
    return x[max(0, fort[0] - 240): fort[-1] + 480] if len(fort) else x


def openrouter(texte: str, r: dict) -> np.ndarray:
    """Gemini TTS par OpenRouter : PCM 16 bits, 24 kHz."""
    cle = os.environ.get("OPENROUTER_API_KEY") or os.environ.get("OPENROUTER_KEY")
    if not cle:
        raise SystemExit("Clé OpenRouter absente : OPENROUTER_API_KEY ou OPENROUTER_KEY.")
    corps = {"model": r["modele"], "input": texte, "voice": r["voice"], "response_format": "pcm", "instructions": r["instructions"]}
    requete = urllib.request.Request("https://openrouter.ai/api/v1/audio/speech", data=json.dumps(corps).encode(),
                                     headers={"Authorization": f"Bearer {cle}", "Content-Type": "application/json"})
    for essai in range(3):
        try:
            with urllib.request.urlopen(requete, timeout=120) as rep:
                return np.frombuffer(rep.read(), dtype=np.int16).astype(np.float32) / 32768
        except urllib.error.HTTPError as e:
            message = e.read().decode()[:300]
            if e.code in (401, 402, 403) or essai == 2:
                raise SystemExit(f"OpenRouter {r['voice']} : HTTP {e.code} {message}")


def dire(moteur: str, r: dict, texte: str, dossier_piper: Path) -> np.ndarray:
    with tempfile.TemporaryDirectory() as d:
        if moteur == "openrouter":
            return rogner(monter(openrouter(texte, r), r.get("montee", 1)))
        if moteur == "edge":
            import edge_tts
            import edge_tts.communicate

            # Derrière un proxy qui réécrit le TLS : SSL_CERT_FILE pointe vers son autorité.
            if os.environ.get("SSL_CERT_FILE"):
                edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])
            f = Path(d) / "x.mp3"
            for essai in range(3):  # le service répond parfois à vide : on réessaie
                try:
                    asyncio.run(edge_tts.Communicate(texte, r["voice"], rate=r.get("rate", "+0%"), pitch=r.get("pitch", "+0Hz")).save(str(f)))
                    break
                except edge_tts.exceptions.NoAudioReceived:
                    if essai == 2:
                        raise
            return rogner(lire(f))
        from piper import PiperVoice, SynthesisConfig
        v = PiperVoice.load(str(dossier_piper / f"{r['modele']}.onnx"))
        morceaux = list(v.synthesize(texte, syn_config=SynthesisConfig(speaker_id=r.get("locuteur"), length_scale=0.88)))
        x = np.concatenate([c.audio_float_array for c in morceaux])
        sr = morceaux[0].sample_rate
        x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * TAUX / sr)), np.arange(len(x)), x).astype(np.float32)
        return rogner(monter(x, r.get("montee", 1)))


def hauteur(x: np.ndarray) -> int:
    """Hauteur médiane (Hz) par autocorrélation sur des fenêtres voisées."""
    y = x[::3]  # 8 kHz
    n, f0s = 320, []
    for i in range(0, len(y) - n, 160):
        w = y[i:i + n]
        e = float(np.dot(w, w))
        if e / n < 1e-3:
            continue
        c = np.correlate(w, w, "full")[n - 1:]
        lo, hi = 8000 // 500, 8000 // 70
        lag = lo + int(np.argmax(c[lo:hi]))
        if c[lag] / e > 0.5:
            f0s.append(8000 / lag)
    return int(np.median(f0s)) if f0s else 0


def police(taille: int):
    """Permanent Marker (convertie depuis le woff2 du dépôt si fontTools est là), sinon une police du système."""
    ttf = Path(tempfile.gettempdir()) / "matou-permanent-marker.ttf"
    if not ttf.exists():
        try:
            from fontTools.ttLib import TTFont
            f = TTFont(str(RACINE / "public/brand/fonts/PermanentMarker.woff2"))
            f.flavor = None
            f.save(str(ttf))
        except Exception:
            pass
    for chemin in [ttf, Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")]:
        if chemin.exists():
            return ImageFont.truetype(str(chemin), taille)
    return ImageFont.load_default(taille)


def carte(numero: int, nom: str, fichier: Path):
    im = Image.new("RGB", (1080, 1080), "#FBF5E6")
    d = ImageDraw.Draw(im)
    grande, petite, mini = police(300), police(70), police(40)
    d.rectangle([340, 250, 740, 600], fill="#FFE14A")
    d.text((540, 430), str(numero), font=grande, fill="#1C1B1A", anchor="mm")
    d.text((540, 760), nom, font=petite, fill="#1C1B1A", anchor="mm")
    d.text((540, 900), "Plouf, puis Matou, puis Plouf", font=mini, fill="#555", anchor="mm")
    im.save(fichier)


ap = argparse.ArgumentParser()
ap.add_argument("--serie", choices=["gemini", "gratuit"], default="gemini")
ap.add_argument("--voix", help="série gratuite : dossier des modèles .onnx de Piper")
args = ap.parse_args()
if args.serie == "gratuit" and not args.voix:
    raise SystemExit("--voix <dossier Piper> est requis pour la série gratuite.")
CANDIDATES = SERIE_GEMINI if args.serie == "gemini" else SERIE_GRATUITE
if args.serie == "gemini":
    SORTIE = SORTIE / "gemini"
SORTIE.mkdir(parents=True, exist_ok=True)
matou = rogner(lire(MATOU))
blanc = np.zeros(int(0.35 * TAUX), dtype=np.float32)
lignes, segments = [], []
with tempfile.TemporaryDirectory() as tmp:
    for k, (ident, nom, moteur, r) in enumerate(CANDIDATES, 1):
        a, b = dire(moteur, r, AVANT, Path(args.voix or ".")), dire(moteur, r, APRES, Path(args.voix or "."))
        duo = np.concatenate([a, blanc, matou, blanc, b, blanc])
        ecrire(duo, SORTIE / f"{k:02d}-{ident}.mp3")
        seul = np.concatenate([a, b])
        mots = len((AVANT + " " + APRES).split())
        reglages = {c: v for c, v in r.items() if c != "instructions"}
        lignes.append(f"| {k} | {nom} | {moteur} | `{json.dumps(reglages, ensure_ascii=False)}` | {hauteur(seul)} Hz | {round(mots / (len(seul) / TAUX) * 60)} |")
        print(lignes[-1])
        img = Path(tmp) / f"{k}.png"
        carte(k, nom, img)
        seg = Path(tmp) / f"{k}.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(img), "-i", str(SORTIE / f"{k:02d}-{ident}.mp3"),
                        "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-ar", "44100",
                        "-shortest", str(seg)], check=True)
        segments.append(seg)
    liste = Path(tmp) / "liste.txt"
    liste.write_text("".join(f"file '{s}'\n" for s in segments))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(liste), "-c", "copy",
                    str(SORTIE / "casting-plouf.mp4")], check=True)

(SORTIE / "comparatif.md").write_text(
    f"# Casting de la voix de Plouf (série {args.serie})\n\n"
    f"Chaque essai : Plouf (« {AVANT} »), la vraie voix de Matou (Gemini « Puck », 125 Hz environ), puis Plouf "
    f"(« {APRES} »). Regénérer : `python3 scripts/prototype/casting-plouf.py --serie {args.serie}`."
    + (f"\n\nConsigne de jeu : « {CONSIGNE_ENFANT} »" if args.serie == "gemini" else "") + "\n\n"
    "| N° | Candidate | Moteur | Réglages | Hauteur | Mots/min |\n| --- | --- | --- | --- | --- | --- |\n"
    + "\n".join(lignes) + "\n"
)
print(SORTIE / "casting-plouf.mp4")
