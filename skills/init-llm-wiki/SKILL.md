---
name: init-llm-wiki
description: Initialize and maintain an Obsidian-first, Google Cloud OKF 0.1–compatible Karpathy-style LLM Wiki for a given domain. Use when the user wants to build or maintain a Karpathy-style LLM wiki for a new domain.
metadata:
  author: xiehuacheng
  version: "1.1.0"
---

# Building an LLM Wiki

Help the user build a Karpathy-style LLM wiki that follows the Google Cloud Open Knowledge Format (OKF) v0.1 specification.

## When to Use

Use when the user wants to:

- Bootstrap an LLM-maintained, human-curated wiki for a new domain (tech stack, research direction, product area)
- Standardize an existing wiki to OKF + Obsidian conventions
- Migrate a wiki from an older version of this skill

Do NOT use when the user wants:

- A static documentation site or README — use a docs generator instead
- A personal Zettelkasten without OKF compliance — use Obsidian alone
- A blog or content site — this skill is for reference knowledge, not publishing

## Invocation

After installation, in a supported agent environment:

```text
/init-llm-wiki
```

The agent will ask which domain you want to build the wiki for, then complete initialization.

## Generated Directory Structure

```text
wiki/
├── 00-Raw/                 # Raw materials (Markdown + type: source). Read-only.
├── 01-Wiki/                # Knowledge cards
├── 02-Areas/ or 02-Module/ # Second-level classification (only the empty top dir at init)
├── index.md                # Root; frontmatter declares okf_version: "0.1"
└── log.md                  # Append-only update log
```

Pick `02-Areas` or `02-Module` at init; don't switch later. Subdirectories under `02-*/` are **not** created at init — that decision waits for Ingest and user confirmation.

## Core Conventions

1. **Obsidian-first** — use `[[Knowledge Point Name]]` uniformly for internal links; do not convert existing `[[...]]` to standard Markdown links when editing.
2. **OKF-compatible** — every concept `.md` must include YAML frontmatter with at least a `type` field; root `index.md` declares `okf_version`.
3. **Preserve frontmatter** — do not delete or modify `type`, `title`, `description`, `tags`, `aliases`, `cssclasses` unless the user explicitly requests it.
4. **External OKF export only** — batch-convert `[[...]]` to `[Text](path.md)`, with user consent first.
5. **`00-Raw/` is read-only** — the agent must never modify files inside it after reading.
6. **Subdirectory `index.md`** — may exist as navigation/overview; must not contain frontmatter; not treated as a concept page.

Full format rules (frontmatter, naming, wikilink preservation, OKF details): `references/okf-conventions.md`.

## Execution Flow

The agent must follow this order. Do not skip the brainstorming phase.

1. If the user has not yet stated a domain, ask: **"Which domain do you want to build the wiki about?"**
2. Refer to Karpathy's LLM Wiki pattern (<https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f>) and the OKF spec (<https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md>).
3. **Do not pre-fill initial knowledge** — wait for the user to provide sources or explicit instructions.
4. If the project has no git repo yet, initialize one first.

Steps 5–9 (creating the skeleton, schema docs, root `index.md`, `log.md`, optional HTML dashboard): see `references/initialization.md`.

## Ingest — Discuss First, Write After

Ingest is **not** a batch task. Before dispatching sub-agents to write cards in parallel:

1. **Read raw materials and extract key takeaways by source** (1–2 sentences each, plus core arguments / conflicts with existing content / author assumptions).
2. **Discuss with the user** — what's most valuable, what conflicts, what to add or emphasize.
3. **Propose a "Processing List for This Round"** (new cards, updates, comparisons, merges, mentions).
4. **Wait for user confirmation** before dispatching sub-agents.
5. **After sub-agents complete**, the main session deduplicates, clarifies boundaries, updates `index.md` and `log.md`.

If a sub-agent fails or times out, the main session takes over to avoid blocking. Full Ingest protocol: `references/ingest-flow.md`.

## 02-Areas / 02-Module — Three-Stage Evolution

This layer is the **browsing and learning view**. It evolves with the wiki's scale:

- **Stage One (flat):** `02-Areas/index.md` lists all domains; no subfolders.
- **Stage Two (landing page):** a domain gets a subfolder with its own `index.md` only when it needs learning paths, decision tables, or a standalone intro.
- **Stage Three (subtopics):** subfolder splits into `<subtopic>.md` files when even the landing page is too long.

Full signals, decision self-checks, and structures to avoid: `references/structure-evolution.md`.

## Upgrades and Migration

When `init-llm-wiki` itself has a major update, wiki projects initialized with the old version do not update automatically. Main session steps: sync `WORKFLOWS.md` and schema docs, delete now-obsolete `index.md` files in `00-Raw/` subdirs, fix root `index.md` links, record migration in `log.md`. Detail: `references/initialization.md` (Upgrades section).

## Dependencies (Optional)

- [obsidian-skills](https://github.com/kepano/obsidian-skills): Kepano's Obsidian editing skill. Wiki works without it; install at project level if better Obsidian editing support is needed. Restart the agent after install.

## Other Notes

- Ask the user when unsure.
- Applied content (projects, experiments, exam questions, case studies) is currently **outside this skill's scope**. Do not proactively create `03-Projects/` or similar.

## References

- `references/initialization.md` — Steps 5-9 detail + migration playbook
- `references/ingest-flow.md` — Phase One / Phase Two Ingest protocol
- `references/structure-evolution.md` — three-stage evolution of `02-Areas` / `02-Module`
- `references/okf-conventions.md` — OKF v0.1 + Obsidian preservation rules