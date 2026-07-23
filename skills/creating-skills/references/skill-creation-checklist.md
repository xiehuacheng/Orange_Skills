# Skill Creation Anti-Patterns

This file complements `skill-standards.md` and `core-principles.md`. Where those describe the *correct* shape of a skill, this one lists things **not** to do — observed failures from real creation sessions.

Use it as a self-check before each Step → Next-Step transition. If you catch yourself doing any of these, stop and correct.

---

## Step 1 · Explore & Brainstorm

### Don't

- **Asking too many questions.** If you have asked 4+ multiple-choice questions and the user has answered "either way is fine" at least once, you are over-asking. Synthesize what you have, write an AS-IS / TO-BE diff, and ask one binary question: "Does this match your intent?"
- **Defaulting to your own language for the skill.** Just because the user is speaking Chinese with you, the skill must default to English (per `skill-standards.md`). Confirm at Step 2 if uncertain.
- **Skipping pre-flight reads.** This skill's SKILL.md has a "Mandatory pre-flight" block at the top. If you write SKILL.md without first reading `skill-standards.md`, you will write it wrong.
- **Proceeding without asking the user about scope**. "Just do it for me" is not an answer to "What are the scope boundaries?"

### Do

- Lock the core tone early. "Helpful mentor" vs "tool integration" vs "creative collaborator" yield very different skills.
- Read any existing skills in the same domain (search the local `skills/` and user-level `~/.kimi-code/skills/`) before designing. State explicitly how the new one differs.

---

## Step 2 · Define Scope & Triggers

### Don't

- **Embedding the scope text inside the AskUserQuestion prompt.** Users can't easily edit text that lives inside the question UI. Present scope first as plain text, then ask for approval.
- **Writing description fields that summarize the workflow.** Per `skill-standards.md`, the `description` field triggers discovery — never outline the steps. If the description reads like a tutorial, agents will follow it instead of reading the body.
- **Promising "include everything".** Push back. Broad scopes need risk tiers — propose T1 / T2 / T3 narrowing and confirm.

### Do

- List 2-3 realistic "failure modes" of the scope before asking approval. The user's mind fills in gaps you have not thought of.
- Test your trigger phrases against a real session log if available. "复刻这份简历" / "clone this layout" — does either phrase correspond to a moment when an agent should load the skill?

---

## Step 3 · Choose Name & Structure

### Don't

- **Producing more naming options after a rejection.** A rejected name usually signals a misunderstood tone. Go back to Step 1 and ask about tone before re-proposing names.
- **Creating `assets/`, `scripts/`, `references/` directories you don't need.** Each unused directory is a maintenance burden and a "where do I put my file?" question for future readers. Use only what you actually need.
- **Picking install location without asking.** User-level vs project scope is a 5-minute mistake to debug later. Always confirm.

### Do

- Match verb-led naming for process skills, noun for reference skills. See the strategy table in SKILL.md.

---

## Step 4 · Design Data Flow

### Don't

- Writing intermediate files when stdin/stdout compose. `cmd1 | cmd2` beats `cmd1 > tmp.json && cmd2 < tmp.json`.
- Forgetting to specify what happens on script failure (exit code, error JSON, log path).

---

## Step 5 · Draft SKILL.md

### Don't

- **Writing to disk before approval.** Step 5's whole job is to land content in the chat. The user reads, edits, and approves. Disk writes come in Step 6.
- **Drafting in a non-English language by default.** See Step 1 anti-pattern. If the user explicitly requested another language, do that. Otherwise English.
- **Apologizing for length.** A long SKILL.md is acceptable when content is load-bearing. Padding is not. Cut filler, not real guidance.
- **Front-loading with subtle context or repeated facts in different words.** Each unique fact should appear once; cross-reference rather than restate.

### Do

- Include "Remaining assumptions" at the end. List 3-5 things that, if wrong, would force you to redesign. This is where you hand off uncertainty honestly.
- Reference every `references/`, `scripts/`, `assets/` file by path. Unreferenced resources are dead weight.

---

## Step 6 · Implement

### Don't

- Running multiple `init_skill.py` scaffolds in the same session and losing track of which path they created.
- Replacing the generated `SKILL.md` with the wrong draft (e.g. a version you already revised in chat). Re-read the latest draft into context before `cp`.
- Forgetting `chmod +x` on scripts/ executables. The skill ships half-broken.

### Do

- Run quick_validate immediately after each file is written, not after all files. Catch issues per-file.

---

## Step 7 · Validate & Iterate

### Don't

- **Treating "I ran it myself" as a forward-test.** Reading the skill is not testing the skill. Forward-testing means a *clean* subagent (no creation history) gets only the skill path + a user request, and you observe what it does.
- Patching the test or rewriting expectations to match what came out. If a clean subagent misbehaves, the **skill** is wrong.
- Skipping the forward-test when "the validation script passed". The validation script checks structure, not behavior.

### Do

- For any executable reference (script), confirm `os.access(path, os.X_OK)` returns true. File-system permissions are a frequent pitfall when skills are transferred between machines.
- Add a "Pre-ship checklist" section to your skill if it has any non-trivial workflow steps. Future-you will thank present-you.

---

## Cross-cutting · TodoList

### Don't

- Marking tasks `in_progress` and leaving them in that state through a long wait. **The user's silence is not "in progress".** Use `drop`, or remove the task entirely until work resumes.
- Re-`init`-ing the TodoList every turn. The `init` operation replaces the list, losing structure. Use `done` / `start` to advance.
- Passing nested arrays as `items`. The format is `{ phase: string, items: string[] }`. Each `items` entry must be a flat string.

### Do

- Use `view` to re-read the list before every status reply. Avoid guessing IDs.
- Mark a task done at the moment it is genuinely done, not at the end of the turn.

---

## Cross-cutting · Asking vs Doing

### Don't

- **Acting before approval.** "I'll get started by drafting a SKILL.md" is fine; running `init_skill.py` is not.
- Treating "the user is busy, let me draft something for them to review later" as a shortcut. The cost of an unwanted file is bigger than the cost of waiting.

### Do

- When in doubt, ask. The default is read-only / observation / report status. The default is *not* "make something useful".

---

## Cross-cutting · Subagent delegation

### Don't

- Embedding the full creation transcript as context for a subagent. The subagent should see only what a real user would see: the skill and the trigger.
- Asking a subagent to "do forward-test of skill X" and giving it the skill's source code inline. Give a path; let the subagent read.
- Forward-testing multiple skills in the same subagent session. One skill per session or your failure attribution becomes meaningless.

### Do

- Use the `task` (default worker) agent for forward-tests unless you have a specific reason to use a specialist.
- Read the subagent's transcript before deciding pass/fail. Look for: did it read the skill, did it stop at approval points, did it respect boundaries, did it ask the things the default should handle.

---

## Final pass before declaring "done"

Run this list as a self-check before sending the "skill is done" message:

- [ ] I read `references/skill-standards.md` at least once this session.
- [ ] I confirmed install location with the user.
- [ ] The `description` field is under 1024 chars and contains only triggering conditions (no workflow summary).
- [ ] The `SKILL.md` defaults to English unless I confirmed otherwise.
- [ ] Every `references/` / `scripts/` / `assets/` path referenced in SKILL.md actually exists.
- [ ] All scripts are `chmod +x`.
- [ ] `quick_validate.py` returned `VALID`.
- [ ] I ran a forward-test with a clean subagent (no creation context) and it passed.
- [ ] I bumped `metadata.version` since any behavior change.

If any box is unchecked, the skill is not done.
