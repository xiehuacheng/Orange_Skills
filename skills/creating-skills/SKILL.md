---
name: creating-skills
description: Use when the user wants to create a new skill, write a SKILL.md, scaffold skill structure, improve an existing skill, or discuss skill design. Triggers on phrases like "create a skill", "new skill", "write a skill", "skill design", "validate skill", or when the user describes a reusable workflow, technique, or domain guide they want Kimi Code to learn.
metadata:
  author: xiehuacheng
  version: "1.5.0"
---

# Creating Skills

Create effective Kimi Code skills through collaborative brainstorming, clear standards, and human-in-the-loop checkpoints.

> **🔴 Mandatory pre-flight (READ BEFORE STEP 1).** Skipping any of these is the #1 cause of failed skill creation. You MUST read each item below into context, either by opening the file or by `grep`-ing for the relevant section. None of these are optional.
>
> | Pre-flight | Where |
> |---|---|
> | Skill standards (frontmatter, structure, naming, **language**) | `references/skill-standards.md` |
> | Core principles + question templates | `references/core-principles.md` |
> | Pre-ship checklist + anti-patterns | `references/validation-checklist.md`, `references/skill-creation-checklist.md` |
> | Waiting + forward-test protocol | `references/waiting-and-forward-test.md` |
>
> **Default language for `SKILL.md` is English**, unless the user explicitly asks otherwise. The user writing to you in Chinese does **not** mean they want the skill in Chinese — they want the skill so they can use it themselves. Confirm at Step 2; default is English.

## What a Skill Does

A skill turns Kimi from a general-purpose agent into a specialist. It contains a `SKILL.md` plus optional `scripts/`, `references/`, `assets/`. Good skills are reusable, trigger-aware, concise, composable.

Every skill must declare near the top of `SKILL.md`: **Can do** (concrete capabilities), **Cannot do (without explicit approval)** (operations the skill must never auto-perform), **Default behavior** (read-only by default, what needs confirmation, forbidden assumptions). See `references/skill-standards.md`.

## Core Principles

1. **Brainstorm before building** — explore through dialogue, challenge assumptions, ask what would invalidate the design.
2. **Human checkpoints** — never write files until scope, triggers, structure, and draft are approved.
3. **Challenge the plan before approving** — name the weakest assumption and 2-3 failure modes before each approval.
4. **Standards-first design** — apply `references/skill-standards.md` by default.
5. **Progressive disclosure** — keep SKILL.md lean; move dense examples and schemas to `references/`.
6. **Document boundaries & defaults** — capabilities, limits, forbidden assumptions explicit.

Detailed guidance, question templates, and patterns per principle: `references/core-principles.md`.

## Workflow

**Track progress with TodoList** in phase format:

```json
{ "list": [
  { "phase": "Step 1", "items": ["Explore", "Identify triggers", "Name weakest assumption"] }
]}
```

`items` must be flat strings (never nested arrays). Mark tasks `done` as they complete. A task waiting on the user should be `in_progress` only while actively waiting — `drop` it if the user goes silent. See `references/waiting-and-forward-test.md` for the full waiting protocol.

### Step 1 — Explore & Brainstorm

Understand intent through dialogue. Identify: trigger phrases, file types/tools/APIs, scope boundaries, skill type (workflow/technique/reference/tool), the weakest assumption, and the core tone. Lock the core tone early — `ask-for-tools` feels different from `capability-sense`. If the request is large, propose decomposition. Before Step 2, state the most fragile assumption and ask the user to confirm or correct it.

### Step 2 — Define Scope & Triggers

Draft the `description` field: include what the skill is for and which user phrases trigger it. Do **not** summarize the workflow in `description` — agents will follow that instead of reading the body. Keep under 500 chars; max 1024. List 2-3 realistic ways the scope could fail before asking for approval. **If the user says "include everything," push back** — propose a tiered approach. Output the full scope summary as plain text first, then use `AskUserQuestion` only for the approval choice.

### Step 3 — Choose Name & Structure

**Confirm install location first** (user-level `~/.kimi-code/skills/` vs project `skills/`). Ask for a naming strategy before proposing names:

| Strategy | Example | Best for |
|---|---|---|
| Verb-led / gerund | `creating-skills`, `writing-plans` | Process, technique, workflow skills |
| Noun / domain | `frontend-design`, `kimi-webbridge` | Reference, domain, tool-kit skills |
| Branded / homophone | `gogoal`, `go-goal-go` | Distinctive, memorable skills |

Then propose 2-3 names within the chosen strategy. If the user rejects all, do not just produce another batch — go back to Step 1 and ask about tone. Propose directory structure (`SKILL.md` + only the `scripts/` / `references/` / `assets/` directories actually needed). Wait for approval on location, name, structure, and resources.

### Step 4 — Design Data Flow

If the skill has scripts: design them to compose through stdin/stdout. Avoid intermediate files unless the user asked for a persistent artifact, a downstream tool can only read files, or data volume makes pipes impractical. Document the data flow in SKILL.md.

### Step 5 — Draft SKILL.md in Chat

Write the complete SKILL.md in the conversation first: frontmatter + overview + when-to-use + Can do/Cannot do/Default + pre-run checks + core instructions + approval points + expected outputs + error handling + sub-agent prompts + resource references. Do **not** write it to disk yet. **Default to English.** Before asking for approval, append a "Remaining assumptions" section listing 1-3 assumptions that, if wrong, would force a redesign. Explicitly ask the user to confirm or challenge them — do not treat the list as fine print.

### Step 6 — Implement

Once the draft is approved:

1. `scripts/init_skill.py <name> --path <approved-dir> [--resources ...] [--examples]`
2. Replace the generated `SKILL.md` with the approved draft
3. Create or adapt `scripts/`, `references/`, `assets/` as needed
4. `chmod +x` on scripts

### Step 7 — Validate & Iterate

Run `scripts/quick_validate.py <skill-dir>`. Fix reported issues. Then run a forward-test — see `references/waiting-and-forward-test.md` for the mandatory protocol. If the forward-test fails, **fix the SKILL.md** (do not patch the test). Bump `metadata.version` whenever behavior changes.

## References

- `references/skill-standards.md` — frontmatter, structure, naming, language defaults
- `references/core-principles.md` — question templates and patterns per principle
- `references/validation-checklist.md` — pre-ship review checklist
- `references/skill-creation-checklist.md` — anti-patterns observed in real sessions
- `references/waiting-and-forward-test.md` — waiting behavior + forward-test protocol

| Task | Command |
|------|---------|
| Scaffold a skill | `scripts/init_skill.py <name> --path <dir>` |
| Scaffold with resources | `scripts/init_skill.py <name> --path <dir> --resources scripts,references` |
| Validate a skill | `scripts/quick_validate.py <skill-dir>` |