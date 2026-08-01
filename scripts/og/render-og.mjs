// Genera public/og-{en,es}.png a 1200×630.
//
// Se corre A MANO y el PNG resultante se commitea: la imagen es texto estático
// y no hay razón para regenerarla en cada build ni para que CI gane una
// dependencia. Playwright NO va en package.json.
//
//   npx playwright@latest install chromium   # solo la primera vez
//   node scripts/og/render-og.mjs
//
// No usar SVG como og:image: LinkedIn y Facebook no lo aceptan.

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const template = path.join(here, 'og.html');
const publicDir = path.join(here, '..', '..', 'public');

const browser = await chromium.launch();

for (const locale of ['en', 'es']) {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(`file://${template}?l=${locale}`);
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(publicDir, `og-${locale}.png`);
  await page.screenshot({ path: out });
  console.log(`og: ${out}`);
}

await browser.close();
