# Initialization Steps — Detail

Complements the workflow in `SKILL.md`. These are the specific files and content to create during init, after Step 1-5 approval.

---

## Step 6 — Create the Wiki Skeleton

Create three base directories plus root files. Note that subdirectories under `02-*/` (like `02-Module/数据结构/`) are **not** created at init; that decision waits for Ingest.

- `00-Raw/` — raw source materials. Must contain two empty subdirs: `classified/`, `uncategorized/`. **Read-only**: agent must not modify any files inside. Neither this directory nor its subdirs need `index.md`.
- `01-Wiki/` — topic cards.
- `02-Areas/` *or* `02-Module/` — second-level classification; create only this empty layer. The choice of `02-Areas` vs `02-Module` is made at init and stays fixed. See `references/structure-evolution.md` for when to add subfolders later.

This skill currently does **not** define `03-Projects/` or similar. How applied content (projects, experiments, exam questions, case studies) is organized is intentionally left open for future versions based on real-world usage.

---

## Step 7 — Agent Schema Documents

Create the agent schema doc + workflow manual:

- `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex / OpenCode (per platform conventions).
- `WORKFLOWS.md` as the workflow manual. Use `templates/WORKFLOWS.md` from this skill as the starting template. It should include:
  - Wiki content types (from Karpathy's original article)
  - The `type` field required by OKF and its value conventions
  - Roles and formats of root `index.md` and `log.md`
  - Rules for file naming, links, frontmatter
  - Core workflows: clear responsibility boundaries, trigger conditions, execution steps for **Ingest**, **Query**, and **Lint**
  - Handling of scanned / non-text materials, if any

---

## Step 8 — Root `index.md`

Create the **root** `index.md` with `okf_version: "0.1"` in frontmatter and directory entries in the body.

Linking rules:

- `00-Raw/` should **not** be a `[[00-Raw]]` wikilink target (no `index.md` there). Write it as plain text.
- Links to other directories use Obsidian-style `[[Title]]` or OKF-style `[Title](relative-path)`.

---

## Step 9 — log.md

Create `log.md` using ISO 8601 `YYYY-MM-DD` format for date headings; write the initialization record.

---

## Optional — HTML Dashboard

If the user wants an HTML dashboard to display wiki status, ask first; do not auto-create.

---

## Git Repository

If the project has no git repo yet, initialize one before Step 6.

---

## Upgrades and Migration

When `init-llm-wiki` itself has a major update (Ingest flow changes, directory convention changes), wiki projects initialized with the old version do **not** update automatically. The main session should:

1. **Sync `WORKFLOWS.md`** — align the project's root `WORKFLOWS.md` with the current skill template. Project-level files are not auto-overwritten.
2. **Sync `CLAUDE.md` / `AGENTS.md`** — update outdated conventions.
3. **Clean up outdated structures** — e.g., older versions may have created `00-Raw/index.md`, `00-Raw/classified/index.md`, `00-Raw/uncategorized/index.md`. The current version clarifies none of these need `index.md`; delete them.
4. **Update root `index.md`** — remove or convert links to no-longer-existing pages/dirs (e.g., `[[00-Raw]]` → plain text).
5. **Record migration in `log.md`** — explain what changed and why.

After migration, continue Ingest / Query / Lint per the new process.