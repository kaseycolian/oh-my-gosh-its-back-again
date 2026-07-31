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
  `components.css` was deliberately **not** vendored.
- `dropdown.css` + `dropdown.js` **are** vendored, for the theme picker only. The behaviour is used
  as shipped; only the skin is overridden in `assets/app.css` (square corners, hairline borders, no
  glow). The file's stated accessibility invariants are preserved on purpose — focused option keeps
  a solid border rather than a wash, selection keeps its tick, coarse pointers keep 44px rows — and
  because the app's overrides load after `dropdown.css`, its `forced-colors` cues are re-asserted at
  the end of `app.css`. `--dur` is defined in `app.css` since it normally comes from
  `components.css`, which is not vendored.
- Effects: `effects.css` is linked for its `--motion` gate and token definitions, but **no `.fx-*`
  class is applied anywhere** — no glow, no grid backdrop, no gradient scrollbar. The neon identity
  is intentionally unused; this is a clinical-record UI.
- Fonts: `kept app fonts` — a system UI stack (`--font-app` in `assets/app.css`). The theme display
  fonts are not used.
- Selector: `theme-service selector`, upgraded to the accessible listbox via `data-dropdown` —
  placement: masthead, far right — the only control there since the diagram's view toggle moved
  down into the spine section. Deliberately low
  emphasis: the trigger is a 60×30 swatch-and-caret button whose value text is visually hidden but
  still in the accessibility tree, so the button announces as "Theme, &lt;current theme&gt;". A small
  uppercase "Theme" caption sits to its left — a `<span>` named via `aria-labelledby` rather than a
  `<label for>`, because the native `<select>` is `display: none` and a real label would be an inert
  click target. The panel anchors to `.controls` (`data-dropdown-anchor`) so it stays readable
  despite the small trigger.
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
- `2026-07-30` — Replaced the native `<select>` with the vendored accessible listbox
  (`dropdown.css` + `dropdown.js`, `data-dropdown`) and demoted the picker to a small swatch trigger,
  so theming reads as a convenience rather than a feature. Skin overridden to the app's crisp look;
  behaviour, keyboard model and `forced-colors` cues left intact. `assets/js/theme-trigger.js` paints
  the current theme's accents onto the trigger. All 33 app-created colour pairs re-checked at AA
  across all 16 themes via `tools/check-contrast.mjs`.
- `2026-07-31` — Moved the Side/Front diagram toggle out of the masthead into the spine section, so
  the picker is now the only header control; dropped the hairline divider that had separated the two
  clusters. Added a `forced-colors` rule for `.segmented button.is-on`, whose inverted fill was being
  flattened to Canvas, leaving bold weight as the only cue for the active view.
- `2026-07-31` — Gave the picker a visible "Theme" caption, using a shared `.field` / `.field-label`
  pair also used by the diagram's view toggle. The class names follow the convention `dropdown.css`
  documents for `components.css`, which is not vendored; the type is the app's existing `.eyebrow`
  step, so no new scale was introduced.
