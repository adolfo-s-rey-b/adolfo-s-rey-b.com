#!/usr/bin/env node
/**
 * generate-sitemap.js — genera public/sitemap.xml antes del build.
 *
 * Corre como `prebuild`, NO como postbuild: con output:'export', next build
 * copia public/ a out/ durante el build, así que un sitemap escrito después
 * nunca llega al sitio publicado. (Ese era el bug: lo que se estaba
 * publicando era el public/sitemap.xml commiteado, con lastmod de abril.)
 *
 * Las rutas salen de src/lib/routes.js, la misma fuente que usan las páginas,
 * así que el sitemap no puede desincronizarse del árbol de rutas real.
 */

const fs = require('fs');
const path = require('path');

const { SITE_URL, LOCALES, NAV, href, alternates } = require('../src/lib/routes');
const { getSubjects, getLessonsForSubject } = require('../src/lib/markdown');

const entries = [];

// Páginas de chrome: indexables en ambos locales, con hreflang recíproco.
entries.push({ key: 'home', params: {}, bilingual: true });
for (const key of NAV) entries.push({ key, params: {}, bilingual: true });

// Notas de clase: el contenido está en español, así que solo se indexa el árbol
// /es/. La versión en inglés se sirve con noindex (ver lib/props/notes.js), y
// una URL con noindex no debe aparecer en el sitemap.
for (const subject of getSubjects()) {
  entries.push({ key: 'subject', params: { subject: subject.id }, bilingual: false });

  for (const lesson of getLessonsForSubject(subject.id)) {
    // Las lecciones sin cuerpo son thin content: noindex en ambos locales.
    if (lesson.empty) continue;
    entries.push({
      key: 'lesson',
      params: { subject: subject.id, lesson: lesson.slug },
      bilingual: false,
    });
  }
}

const today = new Date().toISOString().slice(0, 10);

const urls = [];
for (const entry of entries) {
  const locales = entry.bilingual ? LOCALES : ['es'];
  const alts = alternates(entry.key, entry.params);

  for (const locale of locales) {
    const loc = SITE_URL + href(entry.key, locale, entry.params);
    const links = entry.bilingual
      ? alts
          .map(
            (alt) =>
              `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${alt.url}"/>\n`
          )
          .join('') +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${
          alts.find((a) => a.locale === 'en').url
        }"/>\n`
      : '';

    urls.push(`  <url>\n    <loc>${loc}</loc>\n${links}    <lastmod>${today}</lastmod>\n  </url>`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap: ${urls.length} URLs → public/sitemap.xml`);
