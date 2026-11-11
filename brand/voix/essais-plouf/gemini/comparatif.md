# Casting de la voix de Plouf (série gemini)

Chaque essai : Plouf (« Matou, l'actu de l'IA va trop vite. J'y comprends plus rien ! »), la vraie voix de Matou (Gemini « Puck », 125 Hz environ), puis Plouf (« Attends… c'était quoi la question, déjà ? »). Regénérer : `python3 scripts/prototype/casting-plouf.py --serie gemini`.

Consigne de jeu : « Tu joues Plouf, un petit poisson rouge de dessin animé. Voix d'enfant d'environ huit ans, aiguë et légère, curieuse, un peu naïve et très enthousiaste. Français de France, accent neutre. Rythme vif, intonation très expressive qui monte sur les questions, jamais récitée ni robotique. »

| N° | Candidate | Moteur | Réglages | Hauteur | Mots/min |
| --- | --- | --- | --- | --- | --- |
| 1 | Leda (jeune) | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Leda"}` | 235 Hz | 157 |
| 2 | Zephyr (lumineuse) | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Zephyr"}` | 320 Hz | 165 |
| 3 | Laomedeia (enjouée) | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Laomedeia"}` | 296 Hz | 186 |
| 4 | Aoede (légère) | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Aoede"}` | 275 Hz | 220 |
| 5 | Sadachbia (vive) | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Sadachbia"}` | 296 Hz | 186 |
| 6 | Fenrir (excité) | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Fenrir"}` | 307 Hz | 214 |
| 7 | Leda, montée de 2 tons | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Leda", "montee": 1.12}` | 262 Hz | 157 |
| 8 | Zephyr, montée de 2 tons | openrouter | `{"modele": "google/gemini-3.8-flash-tts", "voice": "Zephyr", "montee": 1.12}` | 355 Hz | 166 |
