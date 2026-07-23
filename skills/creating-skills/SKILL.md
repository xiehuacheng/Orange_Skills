---
name: creating-skills
description: Use when the user wants to create a new skill, write a SKILL.md, scaffold skill structure, improve an existing skill, or discuss skill design. Triggers on phrases like "create a skill", "new skill", "write a skill", "skill design", "validate skill", or when the user describes a reusable workflow, technique, or domain guide they want Kimi Code to learn.
metadata:
  author: xiehuacheng
  version: "1.4.0"
---

# Creating Skills

Create effective Kimi Code skills through collaborative brainstorming, clear standards, and human-in-the-loop checkpoints.

> **🔴 Mandatory pre-flight (READ BEFORE STEP 1).** Skipping any of these is the #1 cause of failed skill creation. You MUST read each item below into context, either by opening the file or by `grep`-ing for the relevant section. None of these are optional.
>
> | Pre-flight | Why | Where |
> |---|---|---|
> | Skill standards (frontmatter, structure, naming, **language**) | If you skip this, you will write SKILL.md in the wrong language. | `references/skill-standards.md` |
> | Core principles + question templates | Each Step 1-3 has a template that prevents vague asks. | `references/core-principles.md` |
> | Pre-ship checklist + forward-test protocol | Defines what "done" means. | `references/validation-checklist.md` |
> | Skill creation anti-patterns | Captures the failures observed in real creation sessions. | `references/skill-creation-checklist.md` |
>
> **Default language for `SKILL.md` is English**, unless the user explicitly asks for another language. This is set in `references/skill-standards.md` and applies to every skill you author with this skill. If the user writes to you in Chinese (or any other language) and asks for a skill, that does NOT mean they want the skill in Chinese — they want the skill so they can use it themselves. Always confirm at Step 2, but the default is English.

## What a Good Skill Does

A skill turns Kimi from a general-purpose agent into a specialist for a specific domain, workflow, or tool. It contains a `SKILL.md` plus optional resources (`scripts/`, `references/`, `assets/`). Good skills are reusable across projects, trigger-aware, concise, and composable.

## What a Skill Must Declare

Every skill must make its boundaries and defaults obvious to the agent. Add a short section near the top of `SKILL.md` that covers:

- **Can do** — concrete capabilities the skill provides.
- **Cannot do (without explicit approval)** — operations the skill must never perform automatically.
- **Default behavior** — whether commands are read-only by default, what requires user confirmation, and what assumptions are forbidden.

See `references/skill-standards.md` for a concrete example and writing guidance.

## Core Principles

1. **Brainstorm Before Building** — explore through dialogue and challenge assumptions before designing.
2. **Human Checkpoints** — never write files until scope, triggers, structure, and draft are approved.
3. **Challenge the Plan Before Approving It** — name the weakest assumption and realistic failure modes before asking for approval.
4. **Standards-First Design** — apply `references/skill-standards.md` by default.
5. **Prefer stdin/stdout** — compose scripts through pipes, avoid temporary files.
6. **Progressive Disclosure** — keep `SKILL.md` lean, move details to `references/`.
7. **Use Structured Interaction** — prefer multiple-choice and confirmations over walls of text.
8. **Document Boundaries & Defaults** — make capabilities, limits, and defaults explicit.
9. **Provide Checklists & Patterns** — teach the agent how to work with the user, not just what commands to run.

Detailed guidance, examples, and question templates for each principle are in `references/core-principles.md`.

## How to Behave While Waiting for the User

Skill creation has many human-in-the-loop checkpoints. Between them, you have **no work to do**. This skill explicitly defines what waiting looks like, because "stay ready and answer briefly" is not obvious.

During a wait, do all of the following — no more, no less:

1. Show a brief, evidence-anchored status line at the top of your reply: where you are, what is blocking, what action you want from the user.
2. List the asset(s) needed for the user to act (file path, link, screenshot).
3. Optionally explain why you cannot proceed, but only in one or two sentences. Do not re-litigate earlier decisions.
4. Do NOT run any other tool calls. Do NOT start a subagent. Do NOT preempt the user's reply with "while we wait, let me also…".

Do not do these while waiting:

- Re-read the same file repeatedly.
- Re-ask the same question via `AskUserQuestion`.
- Issue a foreground `bash` to simulate progress (no progress to simulate).
- Mark a TodoList task as in_progress and leave it there. Use one of: in_progress if the wait is actively your turn (rare); drop if the user went silent; or omit the task from the active list entirely and add it back when the user returns.

When the user returns, do not re-summarize the whole conversation. Pick up where you left off in one sentence and resume the next step.

## Skill Creation Workflow

Follow these steps in order. Do not skip checkpoints.
**Track progress with TodoList.** Create a todo list with the seven steps and update as you go. Use the phase-based format below — tasks are strings, **never** nested arrays:

```json
{
  "list": [
    {
      "phase": "Step 1",
      "items": [
        "Explore project context",
        "Identify trigger phrases",
        "Name the weakest assumption"
      ]
    },
    {
      "phase": "Step 2",
      "items": ["Draft description", "List scope failure modes"]
    }
  ]
}
```

Common mistakes:

- Passing `items` as an array of arrays (nested strings). `items` must be a flat list of strings.
- Marking a phase done when only some tasks inside it are done. Mark individual tasks done; promote the phase only when its last task is done.
- Marking a task in_progress that is actually "waiting on the user". A waiting task should be in_progress while waiting is *active* (you just asked), or **dropped** if the user went silent. Never leave a single task in_progress for hours pretending to work.
- Re-`init`-ing the whole list every time you take one step. Use `done` / `start` to advance; re-`init` only when the phase structure genuinely changes (e.g. scope pivot).

### Step 1: Explore & Brainstorm

Understand the user's intent through dialogue. Do not accept the first description at face value — ask the question that could change the entire design.

Identify:

- Concrete trigger phrases
- File types, tools, or APIs involved
- Scope boundaries
- Skill type: workflow, technique, reference, or tool integration
- The weakest assumption in the user's request
- The core tone or feel the skill should have — e.g., ask the user for help, expand its own capabilities, guard boundaries, coach the user
- Any existing built-in or user skills in the same domain; if one exists, read it first and be ready to explain how the new skill differs

If the request is large, propose decomposition before detailing anything.

Before moving to Step 2, state the most fragile assumption and ask the user to confirm or correct it. See `references/core-principles.md` for question templates and examples.

Also lock the core tone early — `ask-for-tools` feels different from `capability-sense`. If unclear, ask before naming.

### Step 2: Define Scope & Triggers

Summarize what the skill will and won't do. Draft the `description` field:

- Include what the skill is for
- Include specific user phrases and contexts that trigger it
- Do **not** summarize the workflow or process steps
- Keep under 500 characters if possible; max 1024

Before asking for approval, list 2-3 realistic ways the scope could fail or be misunderstood. See `references/core-principles.md` for examples.

**If the user says "include everything," push back.** Broad scopes need risk tiers. Propose a tiered approach and confirm.

**Present the content before asking for a choice.** Output the full scope summary, risks, and proposed `description` to the chat as plain text so the user can read and edit it. Then use `AskUserQuestion` only to collect the approval choice. Do not embed the scope text inside the question itself.

### Step 3: Choose Name & Structure

**Confirm install location first.** This decision is hard to undo cleanly and determines whether the skill is shared with the current project.

**Install location:**

- **User-level scope** — the agent's user-level skills directory (e.g., `~/.kimi-code/skills/`). Use this for reusable, personal skills.
- **Project scope** — the current project's `skills/` directory. Use this when the skill belongs to the repo, will be committed, or is tightly coupled to the project.

If the current project is a skills collection or the user has asked to "push" the skill, default to project scope. Otherwise, ask the user to choose.

**First ask for a naming strategy.** Do not jump straight to 2-3 specific names; the user's mental model may not match the options you pick. Ask which strategy fits best:

| Strategy | Example | Best For |
|----------|---------|----------|
| Verb-led / gerund | `creating-skills`, `writing-plans` | Process, technique, workflow skills |
| Noun / domain | `frontend-design`, `kimi-webbridge` | Reference, domain, tool-kit skills |
| Branded / homophone | `gogoal`, `go-goal-go` | Distinctive, memorable skills |
| Other | — | When the user has a specific name or pattern in mind |

Once the user picks a strategy (or says "Other"), propose 2-3 concrete names within that strategy. If the user chose "Other", ask what feeling, reference, or sound they have in mind before proposing names.

Also propose the directory structure:

```
skill-name/
├── SKILL.md
├── scripts/          # if deterministic helpers are needed
├── references/       # if detailed docs are needed
└── assets/           # if templates or media are needed
```

Only include directories that are actually needed. Wait for user approval on location, name, structure, and resources.

**If the user rejects all naming options, do not just produce another batch.** A rejected name usually means the core tone or scope is still misunderstood. Go back to Step 1 and ask one clarifying question about tone or intent before proposing names again.

### Step 4: Design Data Flow

If the skill involves scripts:

- Design them to compose through stdin/stdout where possible
- Document the data flow in SKILL.md
- Avoid intermediate files unless one of the exceptions applies

### Step 5: Draft SKILL.md in Chat

Write the complete SKILL.md content in the conversation first. Include:

- Frontmatter with approved `name` and `description`
- Overview
- When to use / triggers
- **Can do / Cannot do / Default behavior** declarations
- **Pre-run checks** (authentication, scopes, environment, target)
- **Core instructions** with exact commands and options
- **User approval points** — when must the agent stop and ask
- **Expected output examples** so the agent knows what success looks like
- **Error handling & edge cases** — common failures and how to recover
- **Sub-agent prompts** if the skill delegates work to sub-agents
- Any resource references

Do **not** write it to disk yet.

**Keep the draft concise.** Move dense examples and tables to `references/`; summarize them in the draft.

**Draft `SKILL.md` in English by default.** This keeps the authoritative version consistent across skills and lets a translation skill generate `SKILL.<lang>.md` copies later. Only draft in another language if the user explicitly asks for it.

Before asking for approval, append a short "Remaining assumptions" section. List 1-3 assumptions that, if wrong, would require redesign. Every default behavior that could surprise the user should appear here. See `references/core-principles.md` for examples.

**Explicitly ask the user to confirm or challenge the remaining assumptions.** Do not treat the list as fine print. If any assumption is wrong, redesign before moving to Step 6.

Wait for user approval.

### Step 6: Implement

Once the draft is approved, use the location agreed upon in Step 3:

1. Run `scripts/init_skill.py <name> --path <approved-dir> [--resources ...] [--examples]`
2. Replace the generated `SKILL.md` with the approved draft
3. Create or adapt `scripts/`, `references/`, `assets/` as needed
4. Ensure scripts are executable and tested

See `references/validation-checklist.md` for post-write verification steps.

### Step 7: Validate & Iterate

Run structural validation:

```bash
scripts/quick_validate.py <path/to/skill-folder>
```

Fix reported issues. Then follow the type-specific validation approach and pre-ship checklist in `references/validation-checklist.md`. Iterate based on findings and user feedback. Bump the skill `version` whenever behavior changes.

**Forward-test protocol (mandatory before declaring "done").** The forward-test exists to verify that a *clean* agent — one with no context from your creation session — can use the skill correctly. This is the only forward-test that proves anything. Running the skill yourself ("I copied template.tex to /tmp and ran tectonic") is **not** a forward-test; it tests LaTeX, not the skill.

Procedure:

1. Spawn a subagent with the `default` (task) worker. Do not give it any history, recap, or summary of the creation conversation.
2. In the subagent's first message, give only:
   - The skill's path (file:// or skill://).
   - A **realistic single user request** representative of when this skill should trigger (the request must include the trigger phrases listed in your skill's `description`).
   - A clean working directory (e.g. `/tmp/forward-test-<skill-name>/`).
3. Do NOT include: the creation transcript, your design rationale, your hypotheses, the test plan, expected outputs, or anything else. The subagent sees only the skill and the user request.
4. Let the subagent run to completion. Read the artifacts it produced.
5. Pass criteria:
   - The subagent triggered the skill (read the SKILL.md).
   - It followed the skill's own workflow in order.
   - It stopped at every approval point in the SKILL.md.
   - Its output respects the skill's "Cannot do" boundaries.
   - Its output style matches the "Default behavior" declarations.
6. Fail criteria (any of these means the skill is not done):
   - The subagent skipped a step.
   - The subagent did something the "Cannot do" section forbids.
   - The subagent never read the SKILL.md and went freestyle.
   - The subagent asked the user for things the skill said it would default.
7. If the test fails, **fix the SKILL.md**. Do not patch the test, do not patch the subagent's behavior, do not rewrite the skill to match what the subagent *did*. Rewrite until the clean subagent does the right thing.

When the forward-test passes, only then is the skill done. Bump the skill `version` whenever behavior changes.

| Task | Command | Resource |
|------|---------|----------|
| Scaffold a skill | `scripts/init_skill.py <name> --path <dir>` | — |
| Scaffold with resources | `scripts/init_skill.py <name> --path <dir> --resources scripts,references` | — |
| Validate a skill | `scripts/quick_validate.py <skill-dir>` | `references/validation-checklist.md` |
| Check standards | — | `references/skill-standards.md` |

- **`references/skill-standards.md`** — Detailed standards for frontmatter, writing style, directory structure, and naming.
- **`references/validation-checklist.md`** — Pre-ship review checklist for documentation, implementation, testing, and sub-agent forward-testing.
- **`references/skill-creation-checklist.md`** — Anti-patterns observed in real creation sessions; read this before each Step → Next-Step transition.
- **`references/core-principles.md`** — Question templates and patterns for each workflow step.
