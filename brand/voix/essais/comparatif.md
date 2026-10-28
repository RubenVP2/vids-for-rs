# Essais de voix

Phrase : « L'actu de l'IA va trop vite ? En fait, c'est simple. Moi, c'est Matou, et chaque jour je t'explique une annonce en trente secondes. C'était Matou, et c'est tout. »

| Essai | Modèle / voix | Durée | Mots/s | Hauteur | Fidélité |
| --- | --- | --- | --- | --- | --- |
| mai-marc | `microsoft/mai-voice-2.1` / `fr-FR-Marc:MAI-Voice-2.1` | 7.9 s | 4.43 | 119 Hz | 97 % |
| mai-grant | `microsoft/mai-voice-2.1` / `fr-FR-Grant:MAI-Voice-2.1` | 11.9 s | 2.95 | 111 Hz | 97 % |
| aura-hector | `deepgram/aura-2` / `aura-2-hector-fr` | 11.9 s | 2.95 | 180 Hz | 97 % |
| eleven-v3-george | `elevenlabs/eleven-v3` / `george` | 9.7 s | 3.60 | 137 Hz | 97 % |
| eleven-v3-liam | `elevenlabs/eleven-v3` / `liam` | 9.6 s | 3.63 | 116 Hz | 97 % |
| eleven-ml2-brian | `elevenlabs/eleven-multilingual-v2` / `brian` | 9.5 s | 3.68 | 96 Hz | 97 % |
| gemini-puck | `google/gemini-3.8-flash-tts` / `Puck` | 9.3 s | 3.75 | 147 Hz | 97 % |
| gemini-charon | `google/gemini-3.8-flash-tts` / `Charon` | 8.9 s | 3.95 | 133 Hz | 97 % |
| gemini-fenrir | `google/gemini-3.8-flash-tts` / `Fenrir` | 9.5 s | 3.70 | 180 Hz | 97 % |
| grok-rex | `x-ai/grok-voice-tts-1.0` / `rex` | 9.0 s | 3.89 | 124 Hz | 97 % |
| grok-leo | `x-ai/grok-voice-tts-1.0` / `leo` | 9.6 s | 3.63 | 126 Hz | 97 % |

Hauteur : fréquence médiane de la voix (une voix d'homme se situe vers 85–155 Hz).
Fidélité : part des mots retrouvés par la transcription (Whisper large v3).

## Écoute à l'aveugle (2026-10-28)

Chaque extrait a été noté par un modèle capable d'écouter (Gemini, entrée audio), avec
la consigne : « directeur de casting pour un chat pédagogue et pince-sans-rire ».
Ce n'est pas une oreille humaine : c'est un premier tri, à confirmer en écoutant.

| Essai | Accent FR | Naturel | Note | Remarque |
| --- | --- | --- | --- | --- |
| **gemini-puck** | 10 | 9 | **9** | « Ton posé et légèrement pince-sans-rire, parfait pour le personnage » → **choisie** |
| gemini-charon | 10 | 9 | 9 | Un peu « voix off pub » |
| gemini-fenrir | 10 | 9 | 9 | Plus « YouTube », bruit de bouche au début |
| mai-marc | 10 | 8 | 8,5 | Un peu lisse, débit rapide → secours n° 1 |
| eleven-ml2-brian | 9 | 8 | 8,5 | Posé → secours n° 2 |
| grok-leo | 10 | 8 | 8 | Un peu publicitaire |
| eleven-v3-liam | 10 | 8 | 7 | Manque de peps |
| grok-rex | 10 | 6 | 6 | Scolaire |
| eleven-v3-george | 6 | 5 | 5,5 | Raide |
| aura-hector | 2 | 3 | 2 | Accent étranger marqué |

Pour changer de voix : modifier `brand/voix.json`, puis `npm run voice -- <épisode> --force`.
