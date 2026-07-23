# Integration with `cv-builder`

The `cv-builder` skill collects content (projects, experience, education) and emits a Markdown draft. `cv-clone` produces the visual template. Together they make up a full resume pipeline.

```
content source ──> cv-builder ──> draft.md ──> cv-clone ──> template.tex + filled.pdf
                                    │                │
                                    │                └── style from user's sample
                                    └── content from projects/GitHub/notes
```

## Why pair them

- `cv-builder` knows how to *interview* a user about their projects and turn vague memory into structured resume bullets.
- `cv-clone` knows how to *visually* match an arbitrary sample's layout.
- Each on its own leaves a gap: cv-builder ships a built-in template (modern/classic/minimal); cv-clone without content is just an empty shell.

## Step-by-step pipeline

### 1. Run cv-builder first

Ask the user for project sources, then let cv-builder draft `resume.md`:

```
"Generate a tech resume from my projects in /Users/me/projects"
```

cv-builder produces `resume.md` (or HTML/PDF via its own templates).

### 2. Hand off to cv-clone

Now ask:

```
"I have this draft from cv-builder. Clone the visual style of this sample <path>"
                └─── draft.md          └─── sample image/PDF
```

### 3. Style extraction

cv-clone reads the sample and emits `template.tex`. Content slots are filled by mapping cv-builder's parsed sections into the LaTeX placeholders:

| LaTeX placeholder | cv-builder source |
|---|---|
| `\cvname`           | draft frontmatter — `name` |
| `\cvlocation`       | draft frontmatter — `city` |
| `\cvemail`          | draft frontmatter — `email` |
| `\cvphone`          | draft frontmatter — `phone` |
| `\cvwebsite`        | draft frontmatter — `links` |
| `\cvobjective`      | draft section — "Career Objective" |
| `\cvskillrows`      | draft section — "Skills" (mapped to `\cvskill{label}{items}`) |
| `\cvexperience`     | draft section — "Work Experience" |
| `\cvprojects`       | draft section — "Projects" |
| `\cveducation`      | draft section — "Education" |
| `\cvothers`         | draft section — "Other" |

### 4. Compile and verify

```
cd <user-dir>
tectonic template.tex
pdftoppm -r 150 template.pdf out -png
```

Show `out-1.png` to the user. The visual style mirrors the sample; the content comes from cv-builder.

## When NOT to chain them

- If the user has the content already (an existing markdown CV), use `cv-clone` alone — skip cv-builder.
- If the user has no sample visual reference and just wants a polished resume from project files, use `cv-builder` alone — skip cv-clone.
- If the user wants both, run cv-builder first to lock down content, then cv-clone to pin the visual.

## Known frictions

- **Section name mismatch**: cv-builder emits section titles like "工作经历", "项目经历", "教育背景", "专业技能". cv-clone's default skeleton uses English: "Objective", "Skills", "Experience", "Projects", "Education", "Other". The mapping table above is the agent's job to translate. If the cv-builder draft is in Chinese, the agent should also localize the section titles in the LaTeX output.
- **Date format**: cv-builder uses `2024.04 - 2024.12`. cv-clone's `YYYY.MM` placeholder accepts any format the user prefers — match whatever cv-builder emitted.
- **Photo placement**: cv-clone's photo slot is macro-based (`\cvphoto{path}`). If cv-builder's draft includes a photo path (e.g., `--photo` flag), the cv-clone agent must ask for the path before rendering.

## Fallback

If the cv-builder draft is incomplete (missing sections, optional fields blank), cv-clone should still clone the visual template but flag those fields as "leave default placeholder" for the user to fill later.
