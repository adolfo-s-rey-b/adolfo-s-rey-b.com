// Los paquetes remark/rehype/unified son ESM-only. Se usan con import()
// dinámico dentro de funciones async para que webpack no intente resolverlos
// como require() de CJS. fs, path y gray-matter sí son CJS.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// OJO: apunta a content/notes/class, NO a content/notes. Si apuntara al padre,
// getSubjects() trataría reading/ y commentary/ como materias y generaría
// rutas rotas sin _meta.json.
const NOTES_DIR = path.join(process.cwd(), 'content', 'notes', 'class');
const READING_DIR = path.join(process.cwd(), 'content', 'notes', 'reading');
const COMMENTARY_DIR = path.join(process.cwd(), 'content', 'notes', 'commentary');

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  // Se excluyen los archivos que empiezan por "_" (p. ej. _TEMPLATE.md).
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => f.replace(/\.md$/, ''));
}

async function processMarkdown(content) {
  const { unified } = await import('unified');
  const { default: remarkParse } = await import('remark-parse');
  const { default: remarkMath } = await import('remark-math');
  const { default: remarkRehype } = await import('remark-rehype');
  const { default: rehypeKatex } = await import('rehype-katex');
  const { default: rehypeSlug } = await import('rehype-slug');
  const { default: rehypeStringify } = await import('rehype-stringify');

  const file = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);

  return String(file);
}

// El TOC se extrae del HTML YA GENERADO, no del markdown crudo. Así los ids
// coinciden por construcción con los que emite rehype-slug.
// La implementación anterior reimplementaba el slugify y borraba las tildes
// (\w sin flag u es [A-Za-z0-9_]), de modo que "## Metodología" producía el
// ancla #metodologa mientras el heading llevaba id="metodología": 8 de 13
// anclas del sitio no navegaban.
function extractTocFromHtml(html) {
  const toc = [];
  for (const match of html.matchAll(/<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)) {
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) toc.push({ id: match[1], text });
  }
  return toc;
}

// --- Notas de clase (content/notes/class/<subject>/) ---

function getSubjects() {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const metaPath = path.join(NOTES_DIR, d.name, '_meta.json');
      const meta = fs.existsSync(metaPath)
        ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
        : { title: { en: d.name, es: d.name }, description: { en: '', es: '' } };
      return { id: d.name, contentLang: 'es', ...meta };
    });
}

function getLessonsForSubject(subject) {
  const subjectDir = path.join(NOTES_DIR, subject);
  if (!fs.existsSync(subjectDir)) return [];

  return listMarkdown(subjectDir)
    .map((slug) => {
      const raw = fs.readFileSync(path.join(subjectDir, `${slug}.md`), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        order: data.order || 0,
        // Las lecciones sin cuerpo se marcan para excluirlas del sitemap y
        // servirlas con noindex: son thin content.
        empty: content.trim().length === 0,
      };
    })
    .sort((a, b) => a.order - b.order);
}

async function getLessonBySlug(subject, lessonSlug) {
  const filePath = path.join(NOTES_DIR, subject, `${lessonSlug}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(raw);
  const contentHtml = await processMarkdown(content);

  return {
    slug: lessonSlug,
    subject,
    frontmatter,
    contentHtml,
    toc: extractTocFromHtml(contentHtml),
    empty: content.trim().length === 0,
  };
}

// --- Reading notes y commentary ---
// Ambas devuelven SOLO las entradas con `published: true` en el frontmatter.
// Hoy las dos listas están vacías, así que sus bloques no se renderizan (§4.3).

function getPublishedMeta(dir) {
  return listMarkdown(dir)
    .map((slug) => {
      const raw = fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8');
      const { data } = matter(raw);
      return { slug, frontmatter: data };
    })
    .filter((entry) => entry.frontmatter.published === true)
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}

module.exports = {
  getSubjects,
  getLessonsForSubject,
  getLessonBySlug,
  getReadingNotes: () => getPublishedMeta(READING_DIR),
  getCommentary: () => getPublishedMeta(COMMENTARY_DIR),
};
