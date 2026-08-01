import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';

export default function BlogPostView({
  locale,
  routeKey,
  params,
  copy,
  post,
  noindex,
}) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        params={params}
        locale={locale}
        title={`${post.title} — Adolfo S. Rey B.`}
        description={post.summary}
        noindex={noindex}
      />

      <p className="ui text-meta">
        <Link href={href('blog', locale)}>{copy.heading}</Link>
      </p>

      <article lang={post.lang}>
        <p className="ui mt-6 flex flex-wrap items-baseline gap-x-3 text-meta text-muted">
          <span className="uppercase tracking-wide">{copy.types[post.type]}</span>
          <span className="tabular">{post.date}</span>
        </p>

        <h1 className="mt-1 font-serif text-h1">{post.title}</h1>
        {post.summary && (
          <p className="prose-justify mt-4 max-w-prose text-muted">{post.summary}</p>
        )}

        {post.toc.length > 0 && (
          <nav className="mt-8 border-y border-rule py-4" aria-labelledby="toc-heading">
            <p id="toc-heading" className="ui text-meta text-muted">
              {copy.tocHeading}
            </p>
            <ul className="ui mt-2 space-y-1 text-meta">
              {post.toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div
          className="prose prose-justify mt-8 max-w-prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </>
  );
}
