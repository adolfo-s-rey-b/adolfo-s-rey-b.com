// Fuente única de verdad de las rutas del sitio y del emparejamiento EN/ES.
//
// CommonJS a propósito: lo consumen tanto los shims JSX bajo src/pages/ (webpack
// resuelve named imports de CJS) como scripts/generate-sitemap.js en Node puro.
// Una sola definición para navegación, selector de idioma, hreflang y sitemap.

const SITE_URL = 'https://adolfo-s-rey-b.com';
const LOCALES = ['en', 'es'];
const DEFAULT_LOCALE = 'en';

// Sin prefijo de locale y SIEMPRE con barra final, en línea con
// `trailingSlash: true` de next.config.js. Un href sin barra final provoca
// un 308 extra en Cloudflare, invisible en dev y penalizado en Lighthouse.
const ROUTES = {
  home: '/',
  research: '/research/',
  teaching: '/teaching/',
  notes: '/notes/',
  blog: '/blog/',
  code: '/code/',
  cv: '/cv/',
  contact: '/contact/',
  subject: '/notes/class/[subject]/',
  lesson: '/notes/class/[subject]/[lesson]/',
  post: '/blog/[slug]/',
};

// El nombre del header enlaza a la home y deliberadamente NO cuenta como ítem
// de navegación.
// /notes/ son apuntes de los cursos que enseña; /blog/ son fichas de papers,
// comentarios y policy briefs. Son cosas distintas y van separadas.
const NAV = ['research', 'teaching', 'notes', 'blog', 'code', 'cv', 'contact'];

function localize(path, locale) {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? '/es/' : `/es${path}`;
}

function fill(template, params) {
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(`[${key}]`, params[key]),
    template
  );
}

function href(key, locale, params = {}) {
  const template = ROUTES[key];
  if (!template) throw new Error(`routes: clave desconocida "${key}"`);
  return localize(fill(template, params), locale);
}

// El ÚNICO sitio donde se calcula el par EN/ES. Lo consumen el selector de
// idioma, los hreflang de SeoHead y el generador de sitemap.
function alternates(key, params = {}) {
  return LOCALES.map((locale) => ({
    locale,
    path: href(key, locale, params),
    url: SITE_URL + href(key, locale, params),
  }));
}

function otherLocale(locale) {
  return locale === 'en' ? 'es' : 'en';
}

module.exports = {
  SITE_URL,
  LOCALES,
  DEFAULT_LOCALE,
  ROUTES,
  NAV,
  href,
  alternates,
  otherLocale,
};
