import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';

// El cargo en Uniandes. La traducción autorizada es "Teaching Fellow"; el
// término en español se conserva en cursiva junto a ella (§3.3).
const TITLE_ES = 'profesor complementario';

export default function TeachingView({ locale, routeKey, copy, history }) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <h1 className="text-h1">{copy.heading}</h1>

      {/* Glosa autorizada del §3.3. No usar Instructor, Lecturer ni Adjunct
          Professor: Adolfo no es instructor of record.
          El cargo en español va en cursiva y marcado con lang="es". */}
      <p className="prose-justify mt-6 max-w-prose">
        {copy.intro.split(TITLE_ES).flatMap((part, i) => [
          i > 0 && (
            <em key={`t${i}`} lang="es">
              {TITLE_ES}
            </em>
          ),
          part,
        ])}
      </p>

      {/* Los enlaces a los syllabi oficiales de Uniandes son el activo
          verificable de esta página: van visibles, no escondidos tras un clic. */}
      <div className="mt-12">
        {history.map((term) => (
          <section
            key={term.period}
            className="border-t border-rule py-7 first:border-t-0 first:pt-0"
          >
            <div className="ui tabular flex flex-wrap items-baseline gap-x-3 text-meta text-muted">
              <span className="font-semibold text-text">{term.semester}</span>
              <span>{term.role}</span>
            </div>

            <ul className="mt-3 space-y-3">
              {term.courses.map((course) => (
                <li
                  key={course.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                >
                  <span className="min-w-0">
                    {course.name}
                    <span className="ui text-meta text-muted"> — {course.professor}</span>
                  </span>
                  {course.programUrl && (
                    <a href={course.programUrl} className="ui shrink-0 text-meta">
                      {copy.syllabus}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="ui mt-10 text-meta">
        <Link href={href('notes', locale)}>{copy.notesLink}</Link>
      </p>
    </>
  );
}
