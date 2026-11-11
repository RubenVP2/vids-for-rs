# Casting de la voix de Plouf (voix gratuites)

Chaque essai : Plouf (« Matou, l'actu de l'IA va trop vite. J'y comprends plus rien ! »), la vraie voix de Matou (Gemini « Puck », 125 Hz environ), puis Plouf (« Attends… c'était quoi la question, déjà ? »). Regénérer : `python3 scripts/prototype/casting-plouf.py --voix <dossier Piper>`.

| N° | Candidate | Moteur | Réglages | Hauteur | Mots/min |
| --- | --- | --- | --- | --- | --- |
| 1 | Éloïse (voix d'enfant) | edge | `{"voice": "fr-FR-EloiseNeural"}` | 307 Hz | 167 |
| 2 | Éloïse, plus vive | edge | `{"voice": "fr-FR-EloiseNeural", "rate": "+12%", "pitch": "+10Hz"}` | 320 Hz | 187 |
| 3 | Denise, plus aiguë | edge | `{"voice": "fr-FR-DeniseNeural", "rate": "+8%", "pitch": "+35Hz"}` | 250 Hz | 182 |
| 4 | Vivienne | edge | `{"voice": "fr-FR-VivienneMultilingualNeural", "rate": "+8%"}` | 177 Hz | 208 |
| 5 | Henri, voix de dessin animé | edge | `{"voice": "fr-FR-HenriNeural", "rate": "+10%", "pitch": "+45Hz"}` | 163 Hz | 197 |
| 6 | Rémy, plus aigu | edge | `{"voice": "fr-FR-RemyMultilingualNeural", "rate": "+8%", "pitch": "+35Hz"}` | 126 Hz | 193 |
| 7 | Siwis montée (voix du test) | piper | `{"modele": "fr_FR-siwis-medium", "montee": 1.16}` | 242 Hz | 229 |
| 8 | Jessica | piper | `{"modele": "fr_FR-upmc-medium", "locuteur": 0, "montee": 1.06}` | 238 Hz | 208 |
| 9 | Pierre, monté | piper | `{"modele": "fr_FR-upmc-medium", "locuteur": 1, "montee": 1.22}` | 153 Hz | 215 |
