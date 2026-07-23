# Alternative Routes — When LaTeX is Not the Right Choice

The default cv-clone pipeline emits a LaTeX template, because LaTeX delivers the strongest typography control. But some users cannot or do not want to install `tectonic`. This reference describes two working alternates (A: HTML+CSS, C: Markdown+HTML) that ship with cv-clone.

## Decision table

| Condition | Recommended route | Reason |
|---|---|---|
| User wants pixel-faithful print output, will not edit often | LaTeX (default) | Best typography control |
| User wants to edit content frequently in a familiar tool | A · HTML+CSS | Open `.html` in any editor, edit, hit Cmd+P |
| User writes Markdown natively (e.g. devblog author) | C · Markdown+HTML | MD is the lowest-friction source format |
| User is on Windows without `scoop` and has no admin rights | A · HTML+CSS | Only needs a browser + Chrome headless for PDF |
| User wants to programmatically inject data | A · HTML+CSS | Templates use plain `{{placeholders}}` strings, easy to substitute via any scripting language |
| User wants source-controlled diffs readable on GitHub | C · Markdown+HTML | MD diffs render natively; LaTeX diffs are noisy |

## Route A — HTML+CSS

This was the first route explored for cv-clone. It relies on browser print-to-PDF for the final output, sidestepping any LaTeX dependency.

**Files**

```
cv-clone/
├── route-a/
│   ├── template.html        # {{name}}, {{#items}}{{label}}{{/items}} placeholders
│   ├── styles.css           # A4 page, print media query
│   └── preview.html         # example fill-in
```

**Compile path**

```
Chrome headless: --headless --disable-gpu --no-sandbox --print-to-pdf=output.pdf preview.html
```

**Tradeoffs**

- Pros: zero install beyond a browser; editable like any HTML file; print color and font fidelity depend only on the browser
- Cons: typography control is coarser than LaTeX; long CJK strings can break page-break heuristics; no automatic hyphenation in some browsers

## Route C — Markdown+HTML

Suited to users comfortable with Markdown. Renders to HTML+CSS same as Route A, but the source is plain Markdown.

**Files**

```
cv-clone/
├── route-c/
│   ├── template.md
│   ├── styles.css
│   └── preview.html
```

**Tradeoffs**

- Pros: most readable source format; GitHub renders MD diffs natively; easy to draft on a phone
- Cons: complex layout (multi-column, sidebar) requires raw HTML inside the MD; less powerful than LaTeX's `\rule`-driven dividers

## Switching mid-stream

If the user accepts the dry preview but then balks at installing `tectonic`, the agent can convert the LaTeX template to HTML+CSS by:

1. Reading `references/latex-template-skeleton.tex`
2. Asking the user for content (using the same `\newcommand` slot names translated to `{{slot}}`)
3. Substituting into `route-a/template.html`
4. Compiling via Chrome headless

This avoids the user having to re-author from scratch. The LaTeX skeleton and HTML template are *not* auto-generated from each other; the conversion is manual by the agent.
