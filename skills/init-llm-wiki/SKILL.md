---
name: init-llm-wiki
description: Initialize and maintain an Obsidian-first, Google Cloud OKF 0.1–compatible Karpathy-style LLM Wiki for a given domain. Use when the user wants to build or maintain a Karpathy-style LLM wiki for a new domain.
metadata:
  author: xiehuacheng
  version: "1.0.0"
---

# Building an LLM Wiki

Help the user build a Karpathy-style LLM wiki that follows the Google Cloud Open Knowledge Format (OKF) v0.1 specification.

## Introduction

This is a general-purpose agent skill for quickly bootstrapping an LLM-maintained, human-curated wiki for a new domain (such as a technology stack, research direction, or product area).

It helps you:

- Automatically generate the directory structure
- Generate `CLAUDE.md` / `AGENTS.md` schema documents
- Create `index.md`, `log.md`
- Standardize frontmatter and linking conventions

## Usage

After installation, enter the following in a supported agent environment (e.g., Claude Code):

```text
/init-llm-wiki
```

The agent will ask which domain you want to build the wiki for, then complete the initialization automatically.

## Generated Wiki Directory Structure

```text
wiki/
├── 00-Raw/                 # Raw materials (Markdown + type: source)
├── 01-Wiki/                # Knowledge cards
├── 02-Areas/ or 02-Module/ # Second-level classification
│   └── <domain>/
│       ├── index.md        # Domain landing page
│       └── subtopic.md     # Subtopics split out in the mature stage
├── index.md                # Root; frontmatter declares okf_version: "0.1"
└── log.md                  # Append-only update log
```

## Core Conventions

1. **Obsidian-first**: Use `[[Knowledge Point Name]]` uniformly for internal links; do not convert existing `[[...]]` links to standard Markdown links when editing pages.
2. **OKF-compatible**: Every concept `.md` file must include YAML frontmatter with at least a `type` field; the root `index.md` declares `okf_version`.
3. **Preserve frontmatter**: Do not delete or modify fields such as `type`, `title`, `description`, `tags`, or `aliases` unless the user explicitly requests it.
4. **Only when exporting to OKF externally**: Batch-convert `[[...]]` to `[Text](path.md)`, and obtain user consent first.

## Dependencies (Optional)

- [obsidian-skills](https://github.com/kepano/obsidian-skills): Kepano's Obsidian editing skill; editing works better after installation, but the wiki functions normally without it.

## Related Resources

- Karpathy LLM Wiki original: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- OKF specification: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md

## Execution Flow

During execution, time-consuming independent tasks (such as batch creating/updating cards) can be delegated to sub agents for parallel processing; however, **discussing Ingest takeaways and confirming page plans must be completed by the main session**, which is responsible for task decomposition, result integration, and quality assurance. If a sub agent fails or times out, the main session should take over promptly to avoid blocking the overall process.

1. If the user has not yet stated a domain or topic, ask first: **“Which domain do you want to build the wiki about?”**
2. Refer to Karpathy's LLM Wiki pattern (https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) and the OKF specification (https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).
3. **Do not pre-fill initial knowledge**; wait for the user to provide sources or explicit instructions.
4. If the project does not yet have a git repository, initialize one first.
5. During initialization, create the following three base directories:
   - `00-Raw/` — Storage for raw source materials; must contain two empty subdirectories: `classified/` and `uncategorized/`. **Raw materials are read-only and should not be modified**; the agent must not make any changes to the original files after reading them. These two subdirectories do not need an `index.md`.
   - `01-Wiki/` — Topic cards.
   - `02-Areas/` or `02-Module/` — Second-level classification directories; create only this empty layer. Do not create specific domain subfolders beneath it.

   Do not create specific subdirectories under `02-*/` (such as `02-Module/数据结构/`, `02-Areas/AI工具/`) during initialization. Wait until the user provides materials and clarifies classification needs, then ask whether to create them, what naming to use, and create them only after user confirmation.

   **Note**: This skill currently does not define `03-Projects/` or similar top-level application directories. How to organize applied content such as projects, experiments, exam questions, and case studies is intentionally left open and will be defined in future versions based on real-world usage.

## Directory Structure Evolution

This skill's directory hierarchy is not designed all at once, but grows gradually with the wiki's scale. The agent managing the wiki must understand the target forms of `02-Areas/` (or `02-Module/`) at different stages, avoiding premature classification (creating empty folders) or excessive flattening (cramming pages that should not be together into a single file).

The core criterion is not the number of cards, but **whether the content has naturally differentiated into independent organizational units**: if a domain's cards can be explained clearly with one paragraph plus a list of links, it should not be split into subfolders; if a domain's cards already require layered guidance, learning paths, or subtopics to be understood, the structure should be upgraded.

### Three-Stage Evolution of 02-Areas / 02-Module

`02-Areas/` (or `02-Module/`) is the **browsing and learning view layer**, responsible for aggregating scattered concept cards from `01-Wiki/` into an understandable domain map.

#### Stage One: Flat Index (Early)

When the wiki is small and each domain's introduction and links can be clearly expressed in a single page, `02-Areas/` should remain flat:

```
02-Areas/
└── index.md
```

`02-Areas/index.md` contains domain-grouped navigation and guidance; a 100–300 word introduction plus relevant card links for each domain is sufficient. At this stage, **do not create subfolders for each domain**.

Typical characteristics of Stage One:
- A single `index.md` can overview all domains.
- Each domain's introduction and link list are not visually crowded.
- Domain boundaries are clear, with no subtopics requiring separate elaboration.

#### Stage Two: Domain Landing Page (Growth)

Create a subfolder for a domain only when it has grown too large to explain with one introduction in `02-Areas/index.md`, or when it needs independent learning paths, pattern summaries, or decision tables to aid understanding:

```
02-Areas/
├── index.md
└── Agent 与 Claude Code/
    └── index.md
```

At this point, `02-Areas/Agent 与 Claude Code/index.md` is no longer just a list of links, but should be upgraded to a **domain landing page**:
- What problem this domain solves
- Recommended learning/reading path
- Core patterns or decision tables
- Relationship to neighboring domains
- Finally, attach relevant card links

Signals for entering Stage Two (consider when any one is met):
- The domain's related cards occupy too much space in `02-Areas/index.md`, affecting overall readability.
- 2–3 nameable subtopics have naturally formed within the domain.
- The domain needs an "entry path" to help readers decide reading order.
- The domain intersects with multiple other domains and needs a standalone page to explain boundaries.

Note: **Do not create a subfolder just for one index.md**. Creating a subfolder implies that the domain is expected to continue growing into Stage Three, or that it already needs the additional structure of a standalone landing page.

#### Stage Three: Subdomain Aggregation (Mature)

When a domain's knowledge continues to grow and a single landing page can no longer contain it, requiring split into subtopic pages, the subfolder should be further divided:

```
02-Areas/
├── index.md
└── Agent 与 Claude Code/
    ├── index.md              # Domain guide
    ├── 模式与架构.md          # Subtopic
    └── 工具与生态.md          # Subtopic
```

Signals for entering Stage Three (consider when any one is met):
- The domain landing page is too long and requires significant scrolling to read.
- Clear, stable subtopics have formed within the domain, and each subtopic merits its own page.

### Structures to Avoid

The following structures are over-engineering or premature classification; the agent should avoid them and recommend fixes during lint:

- Each subfolder under `02-Areas/` contains only one `index.md`, and that `index.md` is just a list of links.
- Creating standalone subfolders for domains that can be explained with just a few cards and one introduction.
- Creating empty folders "reserved for future use".

### Decision Self-Check Questions

Before creating a `02-Areas/<domain>/` subfolder, the agent should answer:

1. Does this domain already take up too much space in `02-Areas/index.md`, or is it mixed with other domains and hard to read?
2. Does this domain need structure beyond "introduction + link list" (such as learning paths, pattern comparisons, decision tables) to be understood?
3. After creating the subfolder, does this domain have a clear next growth direction (subtopics), rather than just being a place to put the link list separately?

If the answer to all three questions is "yes", create the subfolder; otherwise, continue expressing it as a paragraph in `02-Areas/index.md`.

### About Applied Content

Applied content such as projects, experiments, exam questions, and case studies is currently outside the scope of this skill. Future versions will decide whether to introduce `03-Projects/` or sink applied content under `02-Areas/<domain>/` based on real-world usage. The current agent should not proactively create any application directories.

6. Create the first version of the agent schema document (e.g., `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex / OpenCode), and simultaneously create `WORKFLOWS.md` as a workflow manual. You can refer to the `templates/WORKFLOWS.md` template in this skill's directory. It should include:
   - Wiki content types mentioned in the original Karpathy article
   - The `type` field required by OKF and its value conventions
   - The roles and formats of the root `index.md` and `log.md`
   - Rules for file naming, links, and frontmatter usage
   - Core workflows: clear responsibility boundaries, trigger conditions, and execution steps for Ingest, Query, and Lint
   - Handling of scanned/non-text materials (if any)
7. Create the **root** `index.md`, with `okf_version: "0.1"` in the frontmatter, and list wiki directory entries in the body. Note: `00-Raw/` should not be the target of a `[[00-Raw]]` wikilink, because the raw directory does not need an `index.md`; write it as plain text instead. Links to other directories should use Obsidian-style `[[Title]]` or OKF-style `[Title](relative-path)`.
8. Create `log.md`, using ISO 8601 `YYYY-MM-DD` format for date headings, and write the initialization record.
9. Optional: If the user wants, ask whether to create an HTML dashboard to display the wiki status.

## Mandatory Ingest Flow (Discuss First, Write After)

To stay close to the spirit of Karpathy's original LLM Wiki, Ingest is not a batch task that "throws materials in and automatically generates cards", but a **human-machine collaborative curation process**. When executing Ingest, the main session must first complete the following two phases before deciding whether to use sub agents to create cards in parallel:

### Phase One: Discuss Key Takeaways

This step must be done first and cannot be skipped. The focus is **content-level conversation**, not directly planning which pages to write.

1. **Read all raw materials awaiting processing**.
2. **Extract key takeaways by source**: Summarize each source in 1–2 sentences, then list core arguments, key concepts, important data, conflicts with or additions to existing wiki content, author limitations/assumptions, etc. Do not preset quantities; list according to actual content.
3. **Present the key takeaways to the user and discuss them**:
   - What do these materials mainly say?
   - Which points are most valuable?
   - Which conflict with existing knowledge or need updating?
   - Does the user have anything to add, question, or especially emphasize?
4. **Adjust takeaway priorities based on user feedback**.

### Phase Two: Plan Page Schemes Based on Takeaways

Only after confirming the key takeaways should the discussion results be translated into a concrete wiki writing plan.

1. **Based on the confirmed key takeaways, propose a "Processing List for This Round"**:
   - New concept/entity cards
   - Existing pages that need updating
   - Comparison/algorithm pages that may be worth creating
   - Overlapping topics suggested for merging or boundary clarification
   - Content not yet worth a standalone card but mentionable in existing pages
2. **Show the processing list to the user and wait for confirmation**: Let the user see what will be written, changed, or merged, and ask whether any items need adjustment, addition, skipping, or merging.
3. **Only after user confirmation should sub agents be used to create/update specific cards in parallel**.
4. **After sub agents complete, the main session performs deduplication and boundary clarification**, updating `index.md`, relevant overviews, and `log.md`.

If a sub agent fails or times out, the main session should take over and manually complete the corresponding cards to avoid blocking the process. See the Ingest flow in `WORKFLOWS.md` for details.

## Upgrades and Migration

When the `init-llm-wiki` skill itself has a major update (such as Ingest flow adjustments or directory convention changes), wiki projects initialized with the old version will not update automatically. The main session should:

1. **Sync `WORKFLOWS.md`**: Align the project's root `WORKFLOWS.md` with the current skill template. This is a project-level file and is not automatically overwritten by skill updates.
2. **Sync `CLAUDE.md` / `AGENTS.md`**: Update outdated conventions in the schema documents (such as directory structure, frontmatter rules, and workflows) to the latest version.
3. **Clean up outdated structures**: For example, the old version may have created `00-Raw/index.md`, `00-Raw/classified/index.md`, `00-Raw/uncategorized/index.md`, etc. The new version clarifies that these directories do not need `index.md` and they should be deleted.
4. **Update the root `index.md`**: If the old version linked to pages or directories that should no longer exist (such as `[[00-Raw]]`), remove or change them to plain text descriptions.
5. **Record the migration in `log.md`**: Explain the reasons for this migration and what changed.

After completing the migration, continue Ingest / Query / Lint according to the new process.

## OKF Conventions That Must Be Followed

- Every concept `.md` file must contain parseable YAML frontmatter with at least one non-empty `type` field.
- Recommended frontmatter fields include: `title`, `description`, `resource`, `tags`, `timestamp` (ISO 8601).
- Custom extension fields are allowed; consuming tools should preserve unrecognized keys and must not reject documents because of them.
- **Only the root `index.md`** may contain frontmatter, and only to declare `okf_version`; `index.md` files in subdirectories and any `log.md` must not contain frontmatter.
- **Role of subdirectory `index.md`**: It may exist as a navigation/overview page for that directory, but is not required; if it exists, it can only contain directory description and page links, must not contain frontmatter, and should not be treated as a concept page.
- Knowledge graphs should prefer Obsidian bidirectional links (`[[text]]`). If exchange with strict OKF tools is needed, convert to standard Markdown links (`[text](path)`) at the lint/export stage.
- Concept identity equals the file's path within the package with the `.md` extension removed.
- Broken links are allowed and should not be treated as formatting errors.

## Obsidian Format Preservation Rules

- **Prefer and preserve `[[wikilink]]`**: Use `[[Knowledge Point Name]]` for new internal links; when editing existing pages, do not convert existing `[[...]]` to `[...](...)`.
- **External links use standard Markdown**: e.g., `[Source](https://example.com)`.
- **Preserve YAML frontmatter**: Do not delete or modify fields such as `type`, `title`, `description`, `tags`, `aliases`, `cssclasses`, unless the user explicitly requests it.
- **Preserve file naming conventions**: Continue using Chinese knowledge point names as filenames, e.g., `二叉树.md`; do not change them to slugs.
- **Prevent double suffixes**: Concept `.md` files must not end with `.md` followed by another `.md` (forbidden: `CLAUDE.md.md`, `index.md.md`, `log.md.md`). If the concept name itself contains `.md` (e.g., `CLAUDE.md`), name it `CLAUDE.md 配置文件.md` or `CLAUDE.md 项目规范.md`.
- **Only when explicitly exporting to OKF externally**: Batch-convert `[[...]]` to standard Markdown links; inform the user and obtain consent before conversion.

## Other Notes

- Ask the user when unsure.
- If better Obsidian editing support is needed, install kepano's `obsidian-skills` at the project level; after installation, ask the user to restart the agent before continuing; it works normally without installation.
