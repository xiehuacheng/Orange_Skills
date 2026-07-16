# Kimi Code Skill Standards

Reference guide for the structural and writing standards that every generated skill should follow.

## SKILL.md Frontmatter

Required fields:

- `name`: hyphen-case, lowercase letters/digits/hyphens only, max 64 chars, matches directory name
- `description`: what the skill is for + when to use it + concrete trigger phrases

Optional fields:

- `metadata`: product-specific metadata if needed

Avoid embedding workflow summaries in `description`. The description should help Kimi decide whether to load the skill, not serve as a shortcut for the body content.

## SKILL.md Body

- Use imperative/infinitive form: "Parse the file", "Validate input"
- Avoid second person: "You should..."
- Keep it focused; move heavy reference material to `references/`
- Use code examples for technical skills
- Include a "When NOT to use" section if boundaries matter

## Directory & Resource Rules

- Only create resource directories that are actually used
- Do not create README.md, CHANGELOG.md, or other auxiliary documentation
- `scripts/` — executable helpers, tested, executable bit set
- `references/` — docs loaded on demand, referenced from SKILL.md
- `assets/` — templates, images, boilerplate used in output

## Cross-Referencing Other Skills

- Reference by skill name: `Use superpowers:test-driven-development`
- Do not use `@` links to force-load files
- Mark clearly when a sub-skill is required

## Naming Rules

- Lowercase letters, digits, hyphens only
- No leading/trailing hyphens, no consecutive hyphens
- Folder name matches skill `name`
- Prefer active, verb-led names for process skills
- Prefer noun/domain names for reference skills

## What NOT to Create

Do not create skills for:

- One-off solutions
- Project-specific conventions (use CLAUDE.md / AGENTS.md instead)
- Things enforceable by simple validation (automate those instead)
