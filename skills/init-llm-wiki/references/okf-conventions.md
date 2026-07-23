# OKF + Obsidian Conventions

This file collects the format rules every wiki page must follow. SKILL.md only summarizes; the full rules live here.

---

## OKF v0.1 Conventions

- Every concept `.md` file must contain parseable YAML frontmatter with at least one non-empty `type` field.
- Recommended frontmatter fields: `title`, `description`, `resource`, `tags`, `timestamp` (ISO 8601).
- Custom extension fields are allowed; consuming tools must preserve unrecognized keys.
- **Only the root `index.md`** may carry frontmatter, and only to declare `okf_version`. Subdirectory `index.md` and any `log.md` must **not** contain frontmatter.
- **Role of subdirectory `index.md`**: may exist as a navigation/overview page for that directory, but is not required. If it exists, it may contain only directory description and page links; it must not carry frontmatter and should not be treated as a concept page.
- Knowledge graphs prefer Obsidian bidirectional links (`[[text]]`). If exchange with strict OKF tools is needed, convert to standard Markdown links (`[text](path)`) at the lint/export stage.
- Concept identity equals the file's path within the package with `.md` removed.
- Broken links are allowed and must not be treated as formatting errors.

---

## Obsidian Format Preservation Rules

- **Prefer and preserve `[[wikilink]]`**: use `[[Knowledge Point Name]]` for new internal links; when editing existing pages, do **not** convert existing `[[...]]` to `[...](...)`.
- **External links use standard Markdown**: e.g., `[Source](https://example.com)`.
- **Preserve YAML frontmatter**: do not delete or modify `type`, `title`, `description`, `tags`, `aliases`, `cssclasses` unless the user explicitly requests it.
- **Preserve file naming**: keep Chinese knowledge point names as filenames (e.g., `二叉树.md`); do not rename to slugs.
- **Prevent double suffixes**: concept `.md` files must not end with `.md` followed by another `.md` (forbidden: `CLAUDE.md.md`, `index.md.md`, `log.md.md`). If the concept name itself contains `.md` (e.g., `CLAUDE.md`), name it `CLAUDE.md 配置文件.md` or `CLAUDE.md 项目规范.md`.
- **Only when explicitly exporting to OKF externally**: batch-convert `[[...]]` to standard Markdown links; inform the user and obtain consent before conversion.