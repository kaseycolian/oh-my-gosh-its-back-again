/* Checks every colour pair this app creates against WCAG 2.2 AA, for all 16 themes.
   Run after changing anything colour-related:   node tools/check-contrast.mjs

   The theme-service already validates its own tokens. What this covers is the pairs
   the app invents on top of them — the severity scale, the color-mix tints, and any
   text placed on those tints. Exits non-zero on failure. */

import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'assets', 'theme', 'theme.css'), 'utf8');

const themes = {};
for (const m of css.matchAll(/\[data-theme="([^"]+)"\]\s*\{([^}]+)\}/g)) {
  const t = {};
  for (const d of m[2].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6});/g)) t[d[1]] = d[2];
  themes[m[1]] = t;
}

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = a => '#' + a.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, p) => toHex(hex(a).map((v, i) => v * p + hex(b)[i] * (1 - p)));   // color-mix(in srgb, a p%, b)
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = h => { const [r, g, b] = hex(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// min 4.5 = AA text (1.4.3); min 3.0 = AA non-text / UI component (1.4.11).
const checks = [
  ['severity text — mild (blue) on panel',      4.5, t => t['accent-blue'],   t => t['bg-panel']],
  ['severity text — moderate (purple) on panel',4.5, t => t['accent-purple'], t => t['bg-panel']],
  ['severity text — severe (pink) on panel',    4.5, t => t['accent-pink'],   t => t['bg-panel']],
  ['severity text — surgical (green) on panel', 4.5, t => t['accent-green'],  t => t['bg-panel']],
  ['severity text — none (muted) on panel',     4.5, t => t['text-muted'],    t => t['bg-panel']],
  ['bone outline on panel',                     3.0, t => t['border-strong'], t => t['bg-panel']],
  ['unimaged disc dashes on panel',             3.0, t => t['border-strong'], t => t['bg-panel']],
  ['spinal canal edge on panel',                3.0, t => mix(t['text-muted'], t['bg-panel'], 0.75), t => t['bg-panel']],
  ['text on selected-row tint',                 4.5, t => t['text'],       t => mix(t['text'], t['bg-panel'], 0.10)],
  ['muted text on selected-row tint',           4.5, t => t['text-muted'], t => mix(t['text'], t['bg-panel'], 0.10)],
  ['muted text on hover tint',                  4.5, t => t['text-muted'], t => mix(t['text'], t['bg-panel'], 0.06)],
  ['segmented "on" — panel text on text fill',  4.5, t => t['bg-panel'],   t => t['text']],
  ['rail label on panel',                       4.5, t => t['text'],       t => t['bg-panel']],
  ['region label on panel',                     4.5, t => t['text-muted'], t => t['bg-panel']],
  ['report text on page background',            4.5, t => t['text'],       t => t['bg']],
  ['muted text on page background',             4.5, t => t['text-muted'], t => t['bg']],
  ['focus ring on panel',                       3.0, t => t['focus-ring'], t => t['bg-panel']],
  ['focus ring on page background',             3.0, t => t['focus-ring'], t => t['bg']],
  ['mild hatch line on its own tint',           3.0, t => t['accent-blue'],   t => mix(t['accent-blue'], t['bg-panel'], 0.15)],
  ['moderate hatch line on its own tint',       3.0, t => t['accent-purple'], t => mix(t['accent-purple'], t['bg-panel'], 0.15)],
  ['severe hatch line on its own tint',         3.0, t => t['accent-pink'],   t => mix(t['accent-pink'], t['bg-panel'], 0.15)],

  // Theme picker — the panel sits on --bg-elevated, a surface nothing else uses.
  ['dropdown option text on panel',             4.5, t => t['text'],          t => t['bg-elevated']],
  ['dropdown secondary text on panel',          4.5, t => t['text-muted'],    t => t['bg-elevated']],
  ['dropdown group label on panel',             4.5, t => t['text-muted'],    t => t['bg-elevated']],
  ['dropdown option text on selected tint',     4.5, t => t['text'],          t => mix(t['text'], t['bg-elevated'], 0.07)],
  ['dropdown secondary on selected tint',       4.5, t => t['text-muted'],    t => mix(t['text'], t['bg-elevated'], 0.07)],
  ['dropdown option text on focus tint',        4.5, t => t['text'],          t => mix(t['focus-ring'], t['bg-elevated'], 0.14)],
  ['dropdown secondary on focus tint',          4.5, t => t['text-muted'],    t => mix(t['focus-ring'], t['bg-elevated'], 0.14)],
  ['dropdown focus border on panel',            3.0, t => t['focus-ring'],    t => t['bg-elevated']],
  ['dropdown panel border on page bg',          3.0, t => t['border-strong'], t => t['bg']],
  ['theme trigger border on panel',             3.0, t => t['border-strong'], t => t['bg-panel']],
  ['theme trigger caret (muted) on panel',      4.5, t => t['text-muted'],    t => t['bg-panel']],
  ['reduce-motion label on panel',              4.5, t => t['text-muted'],    t => t['bg-panel']]
];

const worst = new Map();
let failures = 0;

for (const [id, t] of Object.entries(themes)) {
  for (const [name, min, fg, bg] of checks) {
    const r = ratio(fg(t), bg(t));
    const w = worst.get(name);
    if (!w || r < w.r) worst.set(name, { r, id, min });
    if (r < min) failures++;
  }
}

console.log(`${Object.keys(themes).length} themes · ${checks.length} pairs · worst case each:\n`);
for (const [name, w] of worst) {
  console.log(`  ${w.r >= w.min ? 'PASS' : 'FAIL'}  ${w.r.toFixed(2)}:1  (min ${w.min.toFixed(1)})  ${name}  [${w.id}]`);
}
console.log(`\n${failures} failing theme/pair combination${failures === 1 ? '' : 's'}`);
process.exit(failures ? 1 : 0);
