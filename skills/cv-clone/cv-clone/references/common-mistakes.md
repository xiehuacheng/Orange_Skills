# Common Mistakes

A field guide to failure modes the agent hits repeatedly when running cv-clone. Every entry includes the symptom, the cause, and the fix.

## 1. Forgetting `AutoFakeBold=2` on macOS

**Symptom**: `\textbf{...}` text looks identical to regular weight in the compiled PDF.

**Cause**: `PingFang SC` ships only as `Regular` weight on macOS. There is no bold variant on disk. `fontspec` would error or fall back to a synthetic fake-bold that looks uneven unless `AutoFakeBold=2` is enabled.

**Fix**: Always include:

```latex
\setCJKmainfont{PingFang SC}[AutoFakeBold=2, ItalicFont={Kaiti SC}, Scale=0.95]
```

If `AutoFakeBold=2` produces visibly too-bold output on a different CJK font (e.g., `Noto Serif CJK SC`), drop the value to `AutoFakeBold=1` for a milder synthetic bold. Do not delete the option entirely.

## 2. Using `pdflatex` instead of `xelatex`

**Symptom**: CJK characters render as boxes, missing-glyph rectangles, or "???" in the compiled PDF.

**Cause**: `pdflatex` only knows ASCII and a small set of European accents via OT1 font encoding. It cannot render CJK without `CJKutf8` or `xeCJK` packages — and `xeCJK` requires `xelatex`.

**Fix**: Always invoke `tectonic` (which is `xelatex`-based). If a user only has `pdflatex` installed, tell them `brew install tectonic` is the right path (~16 MB, ~30 seconds first-run with package downloads).

## 3. Skipping the dry preview step

**Symptom**: The agent fills the template with real user data immediately, then realizes after the user opens the PDF that the layout looks nothing like the sample.

**Cause**: Style extraction via vision model is approximate. Pixel-faithful cloning without a preview check is a misnamed bet.

**Fix**: After Step 3 (emit template), always run Step 4 (compile + render PNG) before Step 5 (ask user about fill). The dry preview is the cheapest place to catch mistakes. The user pays nothing; you fix it in 30 seconds; the user never sees a bad preview.

## 4. Filling real data before preview approval

**Symptom**: User opens the "filled resume" PDF and finds their phone number in the wrong column, or their name overlapping a section title.

**Cause**: The agent skipped the explicit per-field confirmation in Step 6.

**Fix**: For each `\renewcommand{\cvsomething}{...}` block, ask the user to confirm the exact value, even if it appears earlier in conversation context. "From earlier you said `XXX`, is that still right?" — wait for "yes".

Worse variant: if the user provides a single paragraph of personal info, do NOT parse it silently. Echo back the parsed fields first ("I'll fill: name=X, phone=Y, email=Z"). If anything looks off, the user can correct before the compile.

## 5. Promising "exact pixel match" without checking intent

**Symptom**: Agent says "I'll match this pixel-perfectly" then ships a template that's off by ~5% in width because `geometry` margin was 0.2 cm off.

**Cause**: CV samples are PDF-rasterized at different DPI; "exact pixel match" is a different delivery bar from "visually equivalent". The user often means the latter.

**Fix**: In Step 1, ask explicitly:

> "Should this clone match the sample **pixel-perfectly** (slower, may take 2-3 iteration rounds to nail spacing), or **the same vibe** (one pass, may differ on font weight & exact kerning)?"

Default to "same vibe". Switch to pixel-perfect only on explicit user request.

## 6. Forgetting `\usepackage{xcolor}` before `\definecolor`

**Symptom**: `Undefined control sequence \definecolor` at compile.

**Cause**: `\definecolor` and `\color{cvtext}` both require the `xcolor` package. If the agent copies only `\usepackage{enumitem}` and forgets `xcolor`, the build fails.

**Fix**: The skeleton (`references/latex-template-skeleton.tex`) already lists every required package. Diff against it before writing custom templates.

## 7. Long CJK strings refusing to break across lines

**Symptom**: A project title like "大模型 KVCache 压缩高效推理方法" overflows the page width.

**Cause**: `xeCJK` does not auto-break CJK strings unless `\xeCJKsetup{CJKecglue=\hskip 0.15em plus 0.05em minus 0.05em}` is included. Even with it, very long strings with no Latin punctuation can resist breaking.

**Fix**: Either shorten the string in the source (preferred), or insert a soft break via `\\` or `\allowbreak` in the middle. Do not monkey-patch `\XeTeXlinebreaklocale` mid-template — it is global.

## 8. Photo overwriting without permission

**Symptom**: The agent silently resolves `photo.jpg` from `/Users/<current>/Pictures/` because `hyperref` or `tikz` rendered an empty image macro.

**Cause**: The agent placed `\includegraphics{photo.jpg}` with no fallback when the file is missing.

**Fix**: Wrap the photo block in `\IfFileExists{photo.jpg}{...}{}` or, in the visible CV builder stage, **always ask the user for the photo path explicitly** before rendering. If the sample has no photo, the macro should not exist at all (set per Sample Step 1 confirmation).

## 9. `tectonic` compile failure from missing package in offline mode

**Symptom**: Second compile (no internet) errors with `Package not found: titlesec.sty`.

**Cause**: `tectonic` caches packages from the first compile. If the cache is cleared (e.g., user ran `tectonic --clean`), subsequent offline compiles fail.

**Fix**: Detect the missing package, re-run online for that one package. Or warn the user that the first compile after any cache clear needs internet.

## 10. Mismatched `geometry` margins vs sample

**Symptom**: Cloned template uses 1.6 cm margins but the sample uses 1.0 cm. Even with otherwise perfect style, the page looks "loose" compared to the sample.

**Cause**: The agent copied default margin from the skeleton, never measured the source PDF.

**Fix**: Use `pdfinfo` to extract the source's page geometry, then set `\usepackage[margin=<measured>]{geometry}`. The visual fidelity hinges on margins as much as font choice.
