import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import DateRail from '../components/DateRail';
import { href } from '../lib/routes';

// El cargo en Uniandes. La traducción autorizada es "Teaching Fellow"; el
// término en español se conserva en cursiva junto a ella (§3.3).
const TITLE_ES = 'profesor complementario';

export default function TeachingView({ locale, routeKey, copy, appointments, history }) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <h1 className="text-h1 font-semibold">{copy.heading}</h1>

      {/* Glosa autorizada del §3.3. No usar Instructor, Lecturer ni Adjunct
          Professor: Adolfo no es instructor of record.
          El cargo en español va en cursiva y marcado con lang="es". */}
      <p className="mt-6 max-w-prose">
        {copy.intro.split(TITLE_ES).flatMap((part, i) => [
          i > 0 && (
            <em key={`t${i}`} lang="es">
              {TITLE_ES}
            </em>
          ),
          part,
        ])}
      </p>

      <div className="mt-10">
        {appointments.map((appointment) => (
          <section key={appointment.id} className="mt-8">
            <h2 className="text-h2 font-semibold">
              {appointment.role}{' '}
              <span className="font-normal text-muted tabular">({appointment.years})</span>
            </h2>

            <div className="mt-3 space-y-2">
              {appointment.groups.map((group) => (
                <p key={group.courses.slice(0, 40)}>
                  {group.label && <em className="text-muted">{group.label}: </em>}
                  {group.courses}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Los enlaces a los syllabi oficiales de Uniandes son el activo
          verificable de esta página: se conservan todos. */}
      <details className="mt-10 border-t border-rule pt-6">
        <summary className="text-h3 font-semibold">{copy.fullRecord}</summary>

        <div className="mt-4">
          {history.map((term) => (
            <DateRail key={term.period} dates={term.semester}>
              <ul className="space-y-1">
                {term.courses.map((course) => (
                  <li key={course.name}>
                    {course.name}
                    <span className="text-muted"> — {course.professor}</span>
                    {course.programUrl && (
                      <>
                        {' '}
                        <a href={course.programUrl} className="mark">
                          {copy.marks.syllabus}
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </DateRail>
          ))}
        </div>
      </details>

      <p className="mt-10 text-meta">
        <Link href={href('notes', locale)}>{copy.notesLink}</Link>
      </p>
    </>
  );
}
