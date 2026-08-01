import Head from 'next/head';
import { SITE_URL, alternates, href } from '../lib/routes';

// Metadatos por página (§8). El hreflang recíproco y el canonical salen de
// routes.js, así que no pueden desincronizarse del árbol de rutas real.
//
// `noindex` se usa en las notas de clase servidas bajo la interfaz en inglés:
// su contenido está en español y publicarlo con <html lang="en"> sería señal
// contradictoria y contenido duplicado frente a la versión /es/.
export default function SeoHead({
  routeKey,
  params = {},
  locale,
  title,
  description,
  noindex = false,
  jsonLd = null,
}) {
  const canonical = SITE_URL + href(routeKey, locale, params);
  const alts = alternates(routeKey, params);
  const ogImage = `${SITE_URL}/og-${locale}.png`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <>
          {alts.map((alt) => (
            <link
              key={alt.locale}
              rel="alternate"
              hrefLang={alt.locale}
              href={alt.url}
            />
          ))}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={alts.find((alt) => alt.locale === 'en').url}
          />
        </>
      )}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale === 'es' ? 'es_CO' : 'en_US'} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
