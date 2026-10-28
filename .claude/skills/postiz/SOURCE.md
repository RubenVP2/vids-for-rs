# Origine de ce skill

Copie du skill officiel Postiz : https://github.com/gitroomhq/postiz-agent
(`skills/postiz/SKILL.md` et `PROVIDER_SETTINGS.md`, commit `17f1e27` du 2026-10-22,
licence AGPL-3.0 : `LICENSE`). Fichiers non modifiés.

Pourquoi une copie : les plugins déclarés dans `.claude/settings.json` ne se chargent
pas dans une session cloud, seuls les skills versionnés dans `.claude/skills/` le font.

Dans ce dépôt, la CLI est installée localement : écrire `npx postiz …` là où le skill
écrit `postiz …`. Pour Matou, passer d'abord par le skill **`programmation`**, qui
s'appuie sur celui-ci.

Mettre à jour :

    curl -fsSL https://raw.githubusercontent.com/gitroomhq/postiz-agent/main/skills/postiz/SKILL.md -o .claude/skills/postiz/SKILL.md
    curl -fsSL https://raw.githubusercontent.com/gitroomhq/postiz-agent/main/PROVIDER_SETTINGS.md -o .claude/skills/postiz/PROVIDER_SETTINGS.md
