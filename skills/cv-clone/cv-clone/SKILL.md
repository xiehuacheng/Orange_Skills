---
name: cv-clone
description: Use when the user has a target resume or CV sample (PDF, screenshot, or visual reference) and wants to clone its visual layout and style into an editable LaTeX template. Triggers on phrases like "clone this resume layout", "match this CV design", "rebuild in this style", "reproduce this template", "make me a resume like this one". Pairs with the cv-builder skill — cv-builder fills the content, cv-clone supplies the style.
metadata:
  version: "0.1.0"
  stage: draft
  pairs_with: cv-builder
---

# cv-clone — Resume Visual Cloning

## Overview

Given a target resume or CV sample (image/PDF) plus fresh content, produce a compilable **LaTeX template** whose visual style matches the sample, and a rendered **PDF preview**. The current implementation focuses on stage 1 — producing the template — and defers content filling to a follow-up confirmation step or to the paired `cv-builder` skill.

> Stage v0.1.0 does **template cloning only**, not content filling.  
> Rationale: validate visual style before deciding whether to apply the user's real data, to keep any fabricated or sensitive information out of the template until the user opts in.

## When to Use

Use when:

- The user has a specific resume layout they admire (public templates / designer portfolio pieces / a colleague's CV) and wants the **same visual style** for their own resume
- The user wants a compilable, editable LaTeX template (not just a static PDF)
- The user is comfortable installing `tectonic` (recommended) or `MacTeX` to compile
- The user plans to either fill the template manually or hand off to `cv-builder` for content

Do NOT use when:

- The user has no sample (use `cv-builder` instead — it has built-in templates)
- The user only wants the **content** without caring about a specific external visual style
- The user wants non-LaTeX output — see **Optional alternative routes** in `references/alternative-routes.md`
- The target is a Word/PowerPoint/Canva file (the current pipeline only emits `.tex`)

## Can do / Cannot do / Default behavior

**Can do**

- Extract a target resume's layout, typography, spacing, and color palette from a PNG/PDF
- Generate a compilable LaTeX template (`.tex`) with `\newcommand` placeholders
- Compile the template with `tectonic` to produce a PDF preview
- Accept user content for each placeholder after showing the dry preview
- Ship A (HTML+CSS) and C (Markdown+HTML) reference implementations for users who cannot install tectonic

**Cannot do (without explicit approval)**

- Publish the cloned template to any public registry without user consent
- Fill user-provided personal data into the template without explicit per-field confirmation
- Bypass `tectonic` installation: do not silently fall back to non-LaTeX outputs when the user explicitly asked for LaTeX
- Reuse the source sample's actual content (names, phones, company claims) — only the **style** is cloned

**Default behavior**

- Read-only mode: the agent produces a template + dry-render preview. No user data is touched.
- **Photo slot mirrors the sample**: if the target sample has a photo slot, the cloned template includes an active `\cvphoto{path}` macro and the agent asks for the photo path. If the target has no photo, the template has no photo slot. The agent does NOT inject a photo just because "every resume should have one".
- The first deliverable is the **template + PDF preview**, never the filled resume. After preview, the agent asks: "Shall I fill this template with your content?" — affirmative answer unlocks the fill workflow.
- Sample inputs are referenced by path, not copied into the skill or user's repository.

## Required environment

| Tool | Purpose | Install |
|---|---|---|
| `tectonic` | LaTeX compiler (auto-fetches packages; xelatex-based for CJK) | macOS: `brew install tectonic` · Linux: `apt install tectonic` or download from [tectonic.dev](https://tectonic.dev) · Windows: `scoop install tectonic` |
| `pdftoppm` | Convert LaTeX PDF to PNG for visual review | macOS: preinstalled via `poppler` · Linux: `apt install poppler-utils` · Windows: bundled with MiKTeX/TeXLive |
| package manager | For tectonic install | macOS: `brew` (preinstalled) · Linux: `apt` · Windows: `scoop` |

Primary target is **macOS**; the install commands above cover Linux and Windows. If `tectonic` is missing, the agent MUST install it using the platform-appropriate command above and confirm before proceeding. The first compile downloads packages from the internet (~30 seconds, ~16 MB); subsequent compiles are offline.

## Workflow

### Step 1: Receive sample + intent

Ask the user once:

1. Path to the target sample (image or PDF)
2. Whether the clone should be 1:1 pixel-faithful, or "same vibe, lenient on exact spacing"
3. Whether the photo slot should be enabled (only relevant if the target has a photo)

Do not proceed until both are answered.

### Step 2: Extract style skeleton

From the sample image, write down (in chat, not to files):

```
Style Skeleton:
  Header:
    - name_position: [left-aligned / centered / right-aligned]
    - contact_layout: [single-line / multi-line / right-column / pipe-separated]
  Section titles:
    - decor: [underline / background block / none]
    - case: [UPPERCASE / Title / as-is]
    - weight: [bold / extra-bold / regular]
  Entries:
    - first-line layout: [title-left, date-right / single line / two lines]
    - bullet glyph: [• / - / numbered / none]
    - numeric emphasis: [bold / colored / none]
  Colors:
    - primary: [hex]
    - text: [hex]
  Photo: [present/absent; position]
  Fonts: [CJK / Latin]
```

### Step 3: Emit LaTeX template

Read `references/latex-template-skeleton.tex` (the canonical skeleton). For each style skeleton field above, override the relevant `\newcommand` / `\setCJKmainfont` / `\cvsection` / `\cventry` definitions to match the target. Save as `template.tex` in the user's chosen directory.

Constraints:

- File MUST be self-contained: no external `.sty` files beyond what `tectonic` can pull on demand
- All user-fillable slots exposed via `\newcommand` with sensible defaults
- Top of file MUST carry a comment block listing every `\newcommand` placeholder and its purpose

### Step 4: Compile dry preview

```bash
cd <user-dir> && tectonic template.tex
pdftoppm -r 150 template.pdf template_preview -png
```

If compilation fails: report the exact error, then choose ONE of (a) suggest a font fallback, (b) toggle `[AutoFakeBold=2]` off, (c) pin to `\setCJKmainfont{Noto Serif CJK SC}`. Do not silently swallow.

### Step 5: Show preview & ask if to fill

Open `template_preview-1.png` for the user (or render via the user's preferred viewer). Then ask:

> "Template generated. Preview at `<path>`. Shall I fill this template with your content?"

Possible answers:

- **No, just keep the template** → done; deliver `template.tex` + preview
- **Yes, fill these fields: …** → unlock Step 6
- **Yes, integrate with cv-builder** → hand off; see `references/cv-builder-integration.md`

### Step 6: Fill (only if Step 5 was "Yes")

For each `\newcommand` placeholder the user wants filled:

1. Confirm the exact value (do not guess from earlier conversation context)
2. Use `\renewcommand{\cvname}{...}` block at top of the file, OR replace the default placeholder inline
3. Recompile with `tectonic template.tex`
4. Show the new preview

## Style extraction prompt

When using a vision model, this prompt extracts the style skeleton:

```
You are extracting visual style from a resume image for LaTeX re-implementation.
Output strictly a YAML object with the fields:
  name_position, contact_layout, section_title_decor, section_title_weight,
  entry_firstline, bullet_style, emphasis_style, primary_color, text_color,
  photo_position, fonts_zh, fonts_en, page_size, special_features.
For each, give a 1-2 word description. Do not summarize content.
```

## Output examples

### Dry preview — `template_preview-1.png`

A single A4 page rendered from `template.tex` with default placeholder text. Visually mirrors the target sample's layout. Content is Lorem-ipsum-like.

### Filled resume — `<name>-<role>.pdf`

The user's actual data compiled into the same template. One pass; further iteration only if the user requests it.

## File outputs

| File | Purpose |
|---|---|
| `template.tex` | The LaTeX source with placeholders |
| `template.pdf` | Compiled dry preview |
| `template_preview-1.png` | PNG render for visual review |

The user may request a different filename in Step 1; honor it.

## Limits

- Optical recognition of exact font names/weights is approximate. The agent may need to ask the user "did you mean 'Source Han Sans' or 'PingFang SC'?" if the visual is ambiguous.
- Color extraction is approximate. ±5 hex units is expected.
- The `tectonic` first compile requires internet. Subsequent compiles are offline.
- Complex visual elements (2-column layouts, sidebar cards, icons) are supported but require more iteration rounds.

## References

- `references/latex-template-skeleton.tex` — canonical skeleton the agent extends
- `references/alternative-routes.md` — when to switch to A (HTML+CSS) or C (Markdown+HTML) instead
- `references/cv-builder-integration.md` — how `cv-clone` pairs with `cv-builder`
- `references/common-mistakes.md` — known failure modes & fixes (font, hyperref, photo)

## Common mistakes

1. **Forgetting `AutoFakeBold=2` on macOS** — `PingFang SC` has no Bold variant, so `\textbf` looks identical to regular weight. Always include this option.
2. **Using `pdflatex` instead of `xelatex`** — CJK fonts will not render. Always `tectonic` (xelatex-based).
3. **Skipping the dry preview step** — even if style extraction feels confident, always compile and visually compare before claiming success.
4. **Filling real data before preview approval** — violates the default behavior. Always show the dry preview first.
5. **Promising "exact pixel match" without checking the user's intent** — pixel-faithful is a higher bar; ask first.

---

## Remaining assumptions (verify with user before locking v1.0)

1. The "fill after preview" workflow is the right default. Alternatives: always ask the user upfront, always fully automate, or hand off to `cv-builder` end-to-end.
2. Cross-platform support: macOS is primary, but the skill now documents `apt`/`scoop` paths for Linux/Windows. Linux/Windows users should verify these work in their environment before locking.
3. `tectonic` first compile will fetch LaTeX packages from the internet; offline usage is not the default.
4. Photo slot mirrors the sample (active if sample has it, absent otherwise) — this is now the locked behavior.
5. Multi-page CV: out of scope for v0.1.0 (the template targets 1-page A4 by default).
