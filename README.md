# Spine imaging record

An interactive visualisation of 23 radiology reports — MRI, CT and x-ray of the brain, neck and
spine — spanning August 2014 to July 2026. The spine diagram is the interface: every level from the
skull base to the sacrum is clickable and shows what is going on there now plus the dated chain of
reports describing how it got there.

Published at **https://kaseycolian.github.io/oh-my-gosh-its-back-again/**, and it also runs by
opening `index.html` straight from disk. No build step, no server, no dependencies.

## What is deliberately not in this repo

This repo is public, so two things stay local-only and are gitignored:

- `data/scans-txt/` — the original radiology reports
- `assets/js/reports.js` — the generated bundle of that text

They carry physician names, accession numbers, ICD codes and ages. The curated findings in
`assets/js/data.js` describe the same clinical picture without any of that. The app loads the report
bundle opportunistically: where it exists you get a **Full report** expander on every finding; where
it does not, the finding just names its source file. Nothing else changes, and no error surfaces.

To get the expanders working on your own machine: put the `.txt` files back in `data/scans-txt/` and
run `node tools/build-reports.mjs`.

## What it shows

- **Side view** — the spine in profile with a spinal-canal band that narrows where a report measured
  it narrow.
- **Front view** — the measured scoliosis, with Cobb angles (20° left lumbar, 10° right thoracic,
  9° left cervicothoracic) drawn as construction lines.
- **15 selectable levels** plus two whole-spine views (alignment, imaging coverage).
- **Per level**: current status, the concrete measurements, and every dated finding in
  report-faithful wording, each expandable to the full original report text.

Severity is carried by colour *and* by hatch pattern *and* by a three-tick meter, so the diagram
reads without colour perception. Operated levels carry a green outline and a cross independently of
how severe they currently are.

## Layout

```
index.html                    page shell, header controls, legend
.nojekyll                     tells GitHub Pages to serve the files as-is
assets/app.css                all styling; consumes theme tokens, defines no literal colours
assets/js/data.js             the structured dataset — scans, surgeries, levels, spine geometry
assets/js/spine.js            builds the diagram SVG from the geometry tables
assets/js/app.js              selection, the tab keyboard model, detail-panel rendering
assets/theme/                 vendored theme-service v1.0.0 (see THEME-SERVICE.md)
tools/build-reports.mjs       regenerates assets/js/reports.js from data/scans-txt/
tools/check-contrast.mjs      WCAG AA audit of every colour pair, across all 16 themes

data/scans-txt/               LOCAL ONLY (gitignored) — the source reports
assets/js/reports.js          LOCAL ONLY (gitignored) — GENERATED from the above
```

## Adding or changing a report

1. Drop the `.txt` file into `data/scans-txt/` (local only — it will not be committed).
2. `node tools/build-reports.mjs`
3. Add the study to `SCANS` in `assets/js/data.js`, then reference its `id` from the `findings` of
   whichever levels it describes. Update that level's `severity`, `status`, `summary` and `metrics`
   if the picture changed.

Only step 3 produces a committable change. Keep the findings paraphrased — no physician names,
accession numbers, ICD codes or ages — since `data.js` is what goes public.

## After any colour change

`node tools/check-contrast.mjs` — exits non-zero if any pair drops below AA in any theme.

## Dates

Every study is dated from its own report. One exception is flagged in the UI rather than papered
over: **two surgeries were never imaged directly**, so they show as ranges pinned to their bracketing
scans — "Between April 2015 and May 2016" — and carry a *date inferred* tag. Replace `date` and drop
`dateLabel` / `dateUncertain` in `SURGERIES` (`assets/js/data.js`) once the operative dates are known.

Surgeries are their own events on each level's timeline, not properties of whichever scan caught
them, so an operation is never shown on the date of the film that followed it.

## Accessibility

Targets WCAG 2.2 AA. The spine is an ARIA tablist with a roving tabindex — one tab stop, arrow keys
move between levels, Home/End jump to the ends, Escape returns to the overview. Verified at 320px
width and 200% zoom with no horizontal scrolling, and against `prefers-reduced-motion` plus the
in-app motion toggle. Contrast is machine-checked by `tools/check-contrast.mjs`.

## Caveats

This page reorganises what the radiology reports already say. It adds no interpretation of its own
and is not medical advice. The thoracic spine has never had a dedicated study — levels drawn with a
dotted outline are unexamined, not known to be healthy.
