# Limits — What cv-clone Approximates vs Guarantees

Honest calibration of what this skill can and cannot promise.

## Approximate, not exact

- **Font identification.** Vision models guess font families from glyph shape. If the sample uses a custom or paid typeface, ask the user to confirm ("Did you mean Source Han Sans or PingFang SC?"). Visual similarity is the bar, not font-name equality.
- **Color extraction.** Hex values from image sampling carry ±5 unit noise. The user's monitor calibration also shifts perceived color. Treat sampled colors as a starting point, not a contract.
- **Spacing / margins.** Pixel-faithful margins require measuring the source PDF via `pdfinfo` and overriding the skeleton's `\usepackage[margin=...]{geometry}`. The skeleton ships with `1.6cm` as a sane default but is not matched to any specific sample.
- **Weight rendering on macOS CJK fonts.** `PingFang SC` ships only as `Regular`. `AutoFakeBold=2` synthesizes bold; it is recognizable as bold but not bit-identical to a true bold cut.

## Supported with iteration

- **Two-column layouts.** The skeleton is single-column. Add a `multicol` or `paracol` block; expect 1-2 extra compile cycles.
- **Sidebar cards.** Achieved with `tikz` overlay or `paracol`. Plan 2-3 iteration rounds.
- **Icon rows (phone / mail / GitHub glyphs).** Replace text labels with `fontawesome5` icons; verify CJK fallback inside the icon row.

## Out of scope for v0.1.0

- **Multi-page CVs.** The skeleton targets 1-page A4. For 2+ pages, extend `\cvsection` with manual `\newpage` controls and tune item spacing.
- **Word / PowerPoint / Canva output.** The pipeline emits `.tex` only. For non-LaTeX routes, see `references/alternative-routes.md`.
- **Auto-filling content from arbitrary input.** Content filling is gated behind the Step 5 user confirmation; no silent fabrication.
- **Pixel-perfect clone by default.** Default bar is "same vibe". Pixel-faithful requires the user to opt in at Step 1.

## Known platform gaps

- **Windows without admin rights.** `scoop` may be unavailable. Fall back to `references/alternative-routes.md` Route A (HTML+CSS via Chrome headless).
- **Linux distros without `apt`.** Use the upstream installer from <https://tectonic.dev>.
- **Offline-only environments.** First `tectonic` compile needs internet to fetch LaTeX packages. After caching, offline compiles work — until the cache is cleared.