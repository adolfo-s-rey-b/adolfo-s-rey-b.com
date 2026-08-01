import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';

// Marca `ES` visible cuando el contenido está en español y la interfaz en
// inglés (§4.3).
function LangTag({ contentLang, locale, copy }) {
  if (contentLang === locale) return null;
  return (
    <span className="mark ml-2 text-muted" title={copy.labels.spanishNotice}>
      {copy.labels.spanishTag}
    </span>
  );
}

function Entry({ title, description, date, meta, tag }) {
  return (
    <li className="border-t border-rule py-4 first:border-t-0">
      <p className="text-h3 font-semibold">
        {title}
        {tag}
      </p>
      {description && <p className="mt-1 text-muted">{description}</p>}
      {(date || meta) && (
        <p className="tabular mt-1 text-meta text-muted">{date || meta}</p>
      )}
    </li>
  );
}

export default function NotesIndexView({
  locale,
  routeKey,
  copy,
  subjects,
  readingNotes,
  commentary,
}) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <h1 className="text-h1 font-semibold">{copy.heading}</h1>
      <p className="mt-6 max-w-prose">{copy.intro}</p>

      <section className="mt-10" aria-labelledby="class-notes">
        <h2 id="class-notes" className="text-h2 font-semibold">
          {copy.blocks.class}
        </h2>
        <ul className="mt-4">
          {subjects.map((subject) => (
            <li key={subject.id} className="border-t border-rule py-4 first:border-t-0">
              <p className="text-h3 font-semibold">
                <Link href={href('subject', locale, { subject: subject.id })}>
                  {subject.title}
                </Link>
                <LangTag contentLang={subject.contentLang} locale={locale} copy={copy} />
              </p>
              <p className="mt-1 text-muted">{subject.description}</p>
              <p className="mt-1 text-meta text-muted">{copy.classNotesSubtitle}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* §4.3: si no hay entradas, el bloque no se renderiza. Nada de
          "próximamente". */}
      {readingNotes.length > 0 && (
        <section className="mt-10" aria-labelledby="reading-notes">
          <h2 id="reading-notes" className="text-h2 font-semibold">
            {copy.blocks.reading}
          </h2>
          <ul className="mt-4">
            {readingNotes.map((note) => (
              <Entry
                key={note.slug}
                title={note.frontmatter.title}
                description={`${note.frontmatter.authors} (${note.frontmatter.year})`}
                date={note.frontmatter.date}
              />
            ))}
          </ul>
        </section>
      )}

      {commentary.length > 0 && (
        <section className="mt-10" aria-labelledby="commentary">
          <h2 id="commentary" className="text-h2 font-semibold">
            {copy.blocks.commentary}
          </h2>
          <ul className="mt-4">
            {commentary.map((post) => (
              <Entry
                key={post.slug}
                title={post.frontmatter.title}
                description={post.frontmatter.excerpt}
                date={post.frontmatter.date}
                tag={<LangTag contentLang="es" locale={locale} copy={copy} />}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
