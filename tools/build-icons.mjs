/* Renders the PNG favicon fallbacks from assets/favicon.svg.

   Modern browsers use the SVG (and assets/js/favicon.js re-tints it to the active
   theme). These are for the ones that will not: older Safari, and iOS home-screen
   bookmarks, which need a real bitmap. They are baked in the default dark theme.

   Run after editing the icon:   node tools/build-icons.mjs
   Needs playwright, which is not a project dependency — install it in a scratch
   directory if it is not already available. */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'assets', 'favicon.svg'), 'utf8');

const OUT = [
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 }
];

const browser = await chromium.launch();

for (const { file, size } of OUT) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    colorScheme: 'dark'          // the fallbacks ship in the default dark theme
  });
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    { waitUntil: 'load' }
  );
  const buf = await page.locator('svg').screenshot({ omitBackground: true });
  writeFileSync(join(root, 'assets', file), buf);
  console.log(`wrote assets/${file} (${size}x${size}, ${buf.length} bytes)`);
  await page.close();
}

await browser.close();
