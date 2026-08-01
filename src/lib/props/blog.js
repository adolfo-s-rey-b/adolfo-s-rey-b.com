const { baseProps } = require('./index');
const { getBlogPosts, getBlogPostBySlug } = require('../markdown');

function blogIndexProps(locale) {
  return {
    ...baseProps(locale, 'blog', 'blog', { width: 'wide' }),
    posts: getBlogPosts(),
  };
}

function postPaths() {
  return getBlogPosts().map((post) => ({ params: { slug: post.slug } }));
}

async function postProps(locale, params) {
  const post = await getBlogPostBySlug(params.slug);

  return {
    ...baseProps(locale, 'post', 'blog', { params, width: 'wide' }),
    post,
    // Las entradas están escritas en un solo idioma. Servir el mismo cuerpo
    // bajo el otro locale duplicaría contenido y emitiría una señal de idioma
    // contradictoria, así que esa versión va con noindex. Es la misma regla
    // que ya se aplica a las notas de clase, invertida.
    noindex: post.lang !== locale,
  };
}

module.exports = { blogIndexProps, postPaths, postProps };
