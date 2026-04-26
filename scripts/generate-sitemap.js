#!/usr/bin/env node
/**
 * generate-sitemap.js — Genera sitemap.xml en build time
 * Se ejecuta como script postbuild. Lee los directorios de content/
 * para incluir rutas dinámicas (blog, notes).
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://adolfo-s-rey-b.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CONTENT_DIR = path.join(__dirname, '..', 'content');

function getNoteSlugs() {
  const notesDir = path.join(CONTENT_DIR, 'notes');
  if (!fs.existsSync(notesDir)) return [];
  const subjects = fs.readdirSync(notesDir).filter((f) =>
    fs.statSync(path.join(notesDir, f)).isDirectory()
  );
  const routes = [];
  for (const subject of subjects) {
    routes.push(`/notes/${subject}`);
    const subjectDir = path.join(notesDir, subject);
    const files = fs.readdirSync(subjectDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      routes.push(`/notes/${subject}/${slug}`);
    }
  }
  return routes;
}

function getBlogSlugs() {
  const blogDir = path.join(CONTENT_DIR, 'blog');
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => `/blog/${f.replace(/\.md$/, '')}`);
}

const staticRoutes = ['/', '/research', '/teaching', '/cv', '/github', '/blog', '/contact'];
const noteRoutes = getNoteSlugs();
const blogRoutes = getBlogSlugs();

const allRoutes = [...staticRoutes, ...noteRoutes, ...blogRoutes];
const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Sitemap generado: ${allRoutes.length} URLs → public/sitemap.xml`);
