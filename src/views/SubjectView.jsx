import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';

export default function SubjectView({
  locale,
  routeKey,
  params,
  copy,
  subject,
  lessons,
  noindex,
}) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        params={params}
        locale={locale}
        title={`${subject.title} — ${copy.heading}`}
        description={subject.description}
        noindex={noindex}
      />

      <p className="text-meta">
        <Link href={href('notes', locale)}>{copy.labels.backToNotes}</Link>
      </p>

      <h1 className="mt-4 text-h1 font-semibold">{subject.title}</h1>
      <p className="mt-2 text-muted">{subject.description}</p>
      <p className="mt-1 text-meta text-muted">
        {[subject.professor, subject.semester].filter(Boolean).join(' · ')}
      </p>

      {subject.contentLang !== locale && (
        <p className="mt-4 text-meta text-muted">{copy.labels.spanishNotice}</p>
      )}

      <ol className="mt-8">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug} className="border-t border-rule py-3 first:border-t-0">
            <span className="tabular mr-3 text-meta text-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <Link
              href={href('lesson', locale, { subject: subject.id, lesson: lesson.slug })}
              lang={subject.contentLang}
            >
              {lesson.title}
            </Link>
            {lesson.description && (
              <span className="text-muted"> — {lesson.description}</span>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
