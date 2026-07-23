---
name: cv-clone
description: Use when the user has a target resume or CV sample (PDF, screenshot, or visual reference) and wants to clone its visual layout and style into an editable LaTeX template. Triggers on phrases like "clone this resume layout", "match this CV design", "rebuild in this style", "reproduce this template", "make me a resume like this one". Pairs with the cv-builder skill — cv-builder fills the content, cv-clone supplies the style.
metadata:
  version: "0.2.0"
  stage: draft
  pairs_with: cv-builder
---

# cv-clone — Resume Visual Cloning

## Overview

Given a target resume sample (image/PDF) plus fresh content, produce a compilable **LaTeX template** matching the sample's visual style plus a rendered **PDF preview**. v0.2.0 ships **template cloning only** — content filling is gated behind user confirmation, or delegated to the paired `cv-builder` skill.

> Style is cloned, not content. Never copy names, phones, or company claims from the source sample.

## When to Use

Use when:

- User has a target resume sample (image/PDF) and wants its **visual style** cloned for their own CV
- User wants a compilable, editable LaTeX template (not just a static PDF)
- User can install `tectonic`, or accept Route A (HTML+CSS) instead

Do NOT use when:

- User has no sample — use `cv-builder` (built-in templates)
- User only wants content, no specific external visual style
- Target is Word / PowerPoint / Canva — see `references/alternative-routes.md`

## Defaults

- **Read-only mode.** First deliverable is template + dry-render preview; no user data touched.
- **Photo mirrors the sample.** Has a slot → template defines `\cvphoto{path}`. None → no macro.
- **Step 5 gate.** After preview, ask: *"Shall I fill this template with your content?"* Affirmative unlocks Step 6. Silence = dry template.
- **Sample by path.** Sources referenced by path, never copied.

## Required environment

`tectonic` (xelatex-based LaTeX compiler) + `pdftoppm` (PDF→PNG). See `references/install.md` for cross-platform install and verification. If `tectonic` is missing, install before Step 4 and confirm with the user.

## Workflow

### Step 1 — Receive sample + intent

Ask once, in one message:

1. Path to the target sample (image or PDF)
2. Fidelity bar: pixel-faithful (slower, 2-3 iteration rounds) or same vibe (one pass, default)?
3. Whether the photo slot should be enabled (only if the sample has one)

Do not start until all three are answered.

### Step 2 — Extract style skeleton

Use the prompt in `references/style-extraction-prompt.md` with a vision model. Get back a YAML object covering name alignment, section decor, entry layout, colors, fonts, photo position, page size. Write it into the chat for the user to confirm before Step 3.

### Step 3 — Emit LaTeX template

Read `references/latex-template-skeleton.tex`. For each YAML field, override the relevant `\newcommand` / `\setCJKmainfont` / `\cvsection` / `\cventry` / `\definecolor`. Save as `template.tex` in the user's chosen directory.

Constraints:

- Self-contained: no external `.sty` beyond what `tectonic` pulls on demand
- Every fillable slot exposed via `\newcommand` with a default
- Top of file carries a comment block listing every placeholder (see skeleton's header)

### Step 4 — Compile dry preview

```bash
cd <user-dir> && tectonic template.tex
pdftoppm -r 150 template.pdf template_preview -png
```

If compile fails, read the error and pick one fix: (a) suggest a font fallback, (b) toggle `AutoFakeBold=2` to `=1`, (c) pin `\setCJKmainfont{Noto Serif CJK SC}`. Never swallow silently. See `references/common-mistakes.md` for the full failure-mode catalogue.

### Step 5 — Show preview & ask to fill

Open `template_preview-1.png` for the user. Ask:

> Template generated. Preview at `<path>`. Shall I fill this template with your content?

Branches: **No** → done. **Yes, fill these fields: …** → Step 6. **Yes, integrate with cv-builder** → `references/cv-builder-integration.md`.

### Step 6 — Fill (only after explicit "Yes")

For each `\newcommand` the user wants filled: confirm the exact value (echo back if parsed from earlier context), add a `\renewcommand{\cvX}{...}` block near the top, recompile with `tectonic template.tex`, show the new preview.

## Common mistakes

Full list in `references/common-mistakes.md`. The five that bite most:

1. **Missing `AutoFakeBold=2`** on macOS — `\textbf` looks identical to regular weight on `PingFang SC`. Always include it.
2. **`pdflatex` instead of `xelatex`** — CJK renders as boxes. Always `tectonic`.
3. **Skipping the dry preview** — style extraction is approximate. Compile before claiming success.
4. **Filling real data before preview approval** — violates Step 5 gate. Dry preview first, always.
5. **Forgetting `\usepackage{xcolor}`** before `\definecolor` — build fails. Diff against the skeleton.

## References

- `references/latex-template-skeleton.tex` — canonical skeleton the agent extends
- `references/install.md` — `tectonic` + `pdftoppm` install per platform
- `references/style-extraction-prompt.md` — vision-model prompt + YAML→LaTeX mapping
- `references/alternative-routes.md` — Routes A (HTML+CSS) and C (Markdown+HTML)
- `references/cv-builder-integration.md` — pairing cv-clone with cv-builder
- `references/common-mistakes.md` — full failure-mode catalogue (10 entries)
- `references/limits.md` — what is approximate vs guaranteed