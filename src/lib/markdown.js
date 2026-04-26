// All remark/rehype/unified packages are ESM-only.
// We use dynamic import() inside async functions so webpack does not try to
// statically resolve them as CJS require() calls.
// gray-matter, fs, and path are CJS-compatible and safe to require() at top level.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');

function getSlugs(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

function getAllBlogMeta() {
  return getSlugs(BLOG_DIR)
    .map((slug) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
      const { data } = matter(raw);
      return { slug, frontmatter: data };
    })
    .sort(
      (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );
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

async function getPostBySlug(dir, slug) {
  const raw = fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8');
  const { data: frontmatter, content } = matter(raw);

  const contentHtml = await processMarkdown(content);

  return {
    slug,
    frontmatter,
    contentHtml,
    toc: extractToc(content),
  };
}

function extractToc(markdownContent) {
  const toc = [];
  for (const m of markdownContent.matchAll(/^## (.+)$/gm)) {
    const text = m[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    toc.push({ id, text });
  }
  return toc;
}

// --- Notes multi-file system ---

function getSubjects() {
  return fs
    .readdirSync(NOTES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const metaPath = path.join(NOTES_DIR, d.name, '_meta.json');
      let meta = { title: d.name, professor: '', semester: '', description: '' };
      if (fs.existsSync(metaPath)) {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      }
      return { id: d.name, ...meta };
    });
}

function getLessonsForSubject(subject) {
  const subjectDir = path.join(NOTES_DIR, subject);
  if (!fs.existsSync(subjectDir)) return [];

  return fs
    .readdirSync(subjectDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(subjectDir, f), 'utf8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        order: data.order || 0,
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
    toc: extractToc(content),
  };
}

module.exports = {
  getBlogSlugs: () => getSlugs(BLOG_DIR),
  getAllBlogMeta,
  getBlogPostBySlug: (slug) => getPostBySlug(BLOG_DIR, slug),
  // Notes multi-file
  getSubjects,
  getLessonsForSubject,
  getLessonBySlug,
};
