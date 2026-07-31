# Theme Service

This app's theming comes from the shared **theme-service** — currently on version `1.0.0`.
The files in this folder are vendored copies of the source of truth; do not hand-edit generated
token files, and do not hardcode colors — consume the theme tokens (`var(--…)`).

## For agents working in this repo
This repo **already uses the theme-service** (see History below). Use the **theme-service skill**
(or its `AGENTS.md`) for any theme work here — don't improvise, and don't re-apply from scratch.
- Update to latest:  "Update this repo to the latest theme-service version."
- Add/change themes:  see the theme-service repo's `CREATING-THEMES.md`.
Rules: keep WCAG AA 2.2 · default theme is Rink Classic · the selector uses the **external**
`theme-init.js` / `theme-select.js` (never inline scripts — MV3/strict CSP blocks them).

## Applied configuration (current decisions on record)
- Component styling: `colors-only` — the app defines its own crisp components (square corners,
  hairline rules, no cards or shadows) and pulls every colour from the theme tokens.
  `components.css` and `dropdown.css` were deliberately **not** vendored.
- Effects: `effects.css` is linked for its `--motion` gate and token definitions, but **no `.fx-*`
  class is applied anywhere** — no glow, no grid backdrop, no gradient scrollbar. The neon identity
  is intentionally unused; this is a clinical-record UI.
- Fonts: `kept app fonts` — a system UI stack (`--font-app` in `assets/app.css`). The theme display
  fonts are not used.
- Selector: `theme-service selector` (`<select data-theme-select>`, native control) — placement:
  masthead, beside the view toggle and the reduce-motion checkbox.
- Existing themes: `none` — greenfield project.

## App-specific token mapping
The app defines one semantic layer on top of the tokens, in `assets/app.css`:

```css
--sev-normal:   var(--border-strong);
--sev-mild:     var(--accent-blue);
--sev-moderate: var(--accent-purple);
--sev-severe:   var(--accent-pink);
--sev-surgical: var(--accent-green);
```

Severity is never carried by colour alone — each level also has a distinct SVG hatch pattern and a
three-tick meter, so the diagram reads without colour perception.

Rule observed throughout: accent colours are only ever used as text on `--bg-panel` or `--bg`,
never on a `color-mix` tint. `color-mix` tints are used for fills that sit **behind** an accent
stroke, so the stroke carries the required non-text contrast.

## History
<!-- Append one entry per apply/update. Most recent last. Never edit past entries. -->
- `2026-07-30` — Applied theme-service `v1.0.0` to a new static site (spine imaging visualizer).
  Colors-only integration: vendored `theme.css`, `effects.css`, `theme-init.js`, `theme-select.js`,
  `themes.index.json`. Theme selector + reduce-motion toggle in the masthead. Severity scale mapped
  onto the four accents. No `.fx-*` effects, no `components.css`, system fonts kept.
