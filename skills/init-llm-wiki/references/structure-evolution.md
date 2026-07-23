# 02-Areas / 02-Module — Three-Stage Evolution

The `02-Areas/` (or `02-Module/`) layer is the **browsing and learning view layer**: it aggregates scattered concept cards from `01-Wiki/` into a domain map.

The hierarchy is not designed all at once. It grows with the wiki's scale. Premature classification (empty folders) and excessive flattening (cramming related pages into one file) are both anti-patterns. The core criterion: has the content naturally differentiated into independent organizational units?

---

## Stage One — Flat Index (Early)

When the wiki is small and each domain's introduction and links fit clearly on one page, `02-Areas/` stays flat:

```
02-Areas/
└── index.md
```

`index.md` contains domain-grouped navigation and guidance. A 100–300 word introduction plus relevant card links per domain is sufficient. **Do not create subfolders per domain at this stage.**

Typical characteristics:

- A single `index.md` overviews all domains.
- Each domain's intro + link list is not visually crowded.
- Domain boundaries are clear; no subtopics need separate elaboration.

---

## Stage Two — Domain Landing Page (Growth)

Create a domain subfolder only when the domain has outgrown a single intro in `index.md`, or needs independent learning paths / pattern summaries / decision tables:

```
02-Areas/
├── index.md
└── Agent 与 Claude Code/
    └── index.md
```

The subfolder's `index.md` becomes a **landing page** with:

- What problem this domain solves
- Recommended learning/reading path
- Core patterns or decision tables
- Relationship to neighboring domains
- Relevant card links

**Enter Stage Two when any of these is true:**

- The domain's cards take too much space in `02-Areas/index.md`, hurting readability.
- 2–3 nameable subtopics have naturally formed.
- The domain needs an "entry path" to help readers decide order.
- The domain intersects multiple others and needs a standalone page to explain boundaries.

**Do not create a subfolder just to host one `index.md`.** A subfolder implies continued growth into Stage Three, or already needing a standalone landing page.

---

## Stage Three — Subdomain Aggregation (Mature)

When a domain keeps growing and its single landing page can no longer contain it, split into subtopic pages:

```
02-Areas/
└── Agent 与 Claude Code/
    ├── index.md          # Domain guide
    ├── 模式与架构.md      # Subtopic
    └── 工具与生态.md      # Subtopic
```

**Enter Stage Three when any of these is true:**

- The landing page is too long; readers must scroll significantly.
- Clear, stable subtopics have formed; each merits its own page.

---

## Structures to Avoid

These are over-engineering or premature classification. Recommend fixes during lint:

- Subfolders that contain only one `index.md` and that `index.md` is just a link list.
- Standalone subfolders for domains that can be explained with a few cards and one intro.
- Empty folders "reserved for future use."

---

## Decision Self-Check

Before creating a `02-Areas/<domain>/` subfolder, answer:

1. Does this domain already take up too much space in `02-Areas/index.md`, or is it mixed with other domains and hard to read?
2. Does this domain need structure beyond "intro + link list" (learning paths, pattern comparisons, decision tables)?
3. After creating the subfolder, does this domain have a clear next growth direction (subtopics), or is it just a separate place for a link list?

**Yes × 3** → create the subfolder. Otherwise keep expressing it as a paragraph in `02-Areas/index.md`.

---

## About Applied Content

Applied content (projects, experiments, exam questions, case studies) is currently outside this skill's scope. Future versions will decide whether to introduce `03-Projects/` or sink applied content under `02-Areas/<domain>/` based on real-world usage. The current agent should not proactively create any application directories.