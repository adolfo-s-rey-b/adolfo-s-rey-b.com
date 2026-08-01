import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';

export default function BlogIndexView({ locale, routeKey, copy, posts }) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <h1 className="text-h1">{copy.heading}</h1>
      <p className="prose-justify mt-6 max-w-prose">{copy.intro}</p>

      {posts.length > 0 && (
        <ul className="mt-10">
          {posts.map((post) => (
            <li key={post.slug} className="border-t border-rule py-6 first:border-t-0 first:pt-0">
              <p className="ui flex flex-wrap items-baseline gap-x-3 text-meta text-muted">
                <span className="uppercase tracking-wide">{copy.types[post.type]}</span>
                <span className="tabular">{post.date}</span>
                {post.lang !== locale && (
                  <span className="mark" title={copy.labels.spanishNotice}>
                    {copy.labels.spanishTag}
                  </span>
                )}
              </p>
              {/* Encabezado real por semántica; en serif porque es el título de
                  un texto, no un rótulo de estructura. */}
              <h2 className="mt-1 font-serif text-h3">
                <Link href={href('post', locale, { slug: post.slug })} lang={post.lang}>
                  {post.title}
                </Link>
              </h2>
              {post.summary && (
                <p className="prose-justify mt-2 max-w-prose" lang={post.lang}>
                  {post.summary}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
