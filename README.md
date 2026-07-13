# orange_skills

A collection of Agent Skills for AI coding assistants (Claude Code, Codex, Cursor, Kimi Code, etc.).

Each skill lives under `skills/<skill-name>/` and follows the [Agent Skills specification](https://agentskills.io/).

## Available Skills

| Skill | Description |
|-------|-------------|
| [`skills-trending`](./skills/skills-trending) | Discover trending and hot Agent Skills across multiple leaderboards |

## Installation

Install a specific skill using the [skills.sh](https://skills.sh/) CLI:

```bash
npx skills add xiehuacheng/orange_skills --skill skills-trending
```

Or install all skills:

```bash
npx skills add xiehuacheng/orange_skills
```

You can also install from a local path for testing:

```bash
npx skills add /path/to/orange_skills --skill skills-trending
```

## License

MIT
