import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';

export default function LessonView({
  locale,
  routeKey,
  params,
  copy,
  subject,
  lesson,
  prev,
  next,
  noindex,
}) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        params={params}
        locale={locale}
        title={`${lesson.title} — ${subject.title}`}
        description={lesson.description || subject.title}
        noindex={noindex}
      />

      <p className="text-meta">
        <Link href={href('notes', locale)}>{copy.labels.backToNotes}</Link>
        <span aria-hidden="true" className="text-muted"> / </span>
        <Link href={href('subject', locale, { subject: subject.id })}>{subject.title}</Link>
      </p>

      <h1 className="mt-4 text-h1" lang={subject.contentLang}>
        {lesson.title}
      </h1>
      {lesson.description && (
        <p className="mt-2 text-muted" lang={subject.contentLang}>
          {lesson.description}
        </p>
      )}

      {/* TOC estático: enlaces a los ids que emite rehype-slug. Sin
          IntersectionObserver ni scroll-spy — cero JavaScript. */}
      {lesson.toc.length > 0 && (
        <nav className="mt-8 border-y border-rule py-4" aria-labelledby="toc-heading">
          <p id="toc-heading" className="text-meta text-muted">
            {copy.tocHeading}
          </p>
          <ul className="mt-2 space-y-1 text-meta">
            {lesson.toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} lang={subject.contentLang}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <article
        className="prose prose-lg mt-8 max-w-none"
        lang={subject.contentLang}
        dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
      />

      {(prev || next) && (
        <nav className="mt-12 flex justify-between gap-6 border-t border-rule pt-6 text-meta">
          <span>
            {prev && (
              <Link
                href={href('lesson', locale, { subject: subject.id, lesson: prev.slug })}
              >
                ← {prev.title}
              </Link>
            )}
          </span>
          <span className="text-right">
            {next && (
              <Link
                href={href('lesson', locale, { subject: subject.id, lesson: next.slug })}
              >
                {next.title} →
              </Link>
            )}
          </span>
        </nav>
      )}
    </>
  );
}
