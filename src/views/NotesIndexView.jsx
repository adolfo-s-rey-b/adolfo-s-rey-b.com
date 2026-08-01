import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';

// Solo notas de clase. Las fichas de papers, los comentarios y los policy
// briefs viven en /blog/: son otra cosa y tienen su propio índice.
export default function NotesIndexView({ locale, routeKey, copy, subjects }) {
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

      <ul className="mt-10">
        {subjects.map((subject) => (
          <li key={subject.id} className="border-t border-rule py-5 first:border-t-0 first:pt-0">
            <p className="text-h3">
              <Link href={href('subject', locale, { subject: subject.id })}>
                {subject.title}
              </Link>
              {/* Marca ES cuando el contenido está en español y la interfaz en
                  inglés. */}
              {subject.contentLang !== locale && (
                <span className="mark ml-2 text-muted" title={copy.labels.spanishNotice}>
                  {copy.labels.spanishTag}
                </span>
              )}
            </p>
            <p className="mt-1">{subject.description}</p>
            <p className="ui mt-1 text-meta text-muted">
              {copy.classNotesSubtitle}
              <span aria-hidden="true"> · </span>
              {subject.lessonCount}{' '}
              {subject.lessonCount === 1 ? copy.lessonLabel : copy.lessonsLabel}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
