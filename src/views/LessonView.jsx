import { useEffect, useRef, useState } from 'react';
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
  lessons,
  index,
  prev,
  next,
  noindex,
}) {
  const [activeId, setActiveId] = useState(null);
  const articleRef = useRef(null);

  // Scroll-spy: marca en la barra lateral la sección que se está leyendo.
  // Los ids salen de rehype-slug y coinciden con los del TOC por construcción.
  useEffect(() => {
    const root = articleRef.current;
    if (!root || lesson.toc.length === 0) return undefined;

    const headings = root.querySelectorAll('h2[id]');
    if (headings.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [lesson.toc]);

  const lessonHref = (slug) => href('lesson', locale, { subject: subject.id, lesson: slug });

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

      {/* Migas de pan: dónde estoy y cómo vuelvo. */}
      <nav className="ui text-meta text-muted" aria-label={copy.labels.backToNotes}>
        <Link href={href('notes', locale)}>{copy.heading}</Link>
        <span aria-hidden="true"> / </span>
        <Link href={href('subject', locale, { subject: subject.id })}>{subject.title}</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-text">{lesson.title}</span>
      </nav>

      <div className="mt-8 gap-10 lg:flex">
        {/* Barra lateral pegajosa: lista de lecciones para saltar entre ellas
            sin volver al índice, más el TOC de la lección actual. */}
        {/* lg:self-start es imprescindible: sin él, el aside se estira a la
            altura de la fila flex y `sticky` no tiene recorrido donde fijarse. */}
        {/* Los guiones bajos son obligatorios: en un valor arbitrario de
            Tailwind, `calc(100vh-4rem)` se emite tal cual y es CSS inválido
            —calc exige espacios alrededor del signo—, así que la altura máxima
            no se aplicaba y el aside crecía hasta romper el sticky. */}
        <aside className="ui shrink-0 lg:sticky lg:top-8 lg:max-h-[calc(100vh_-_4rem)] lg:w-60 lg:self-start lg:overflow-y-auto">
          {/* El TOC va primero: es lo que se necesita mientras se lee. Con 32
              lecciones, ponerlo debajo de la lista lo dejaba fuera de vista. */}
          {lesson.toc.length > 0 && (
            <nav aria-label={copy.labels.onThisPage}>
              <p className="text-meta text-muted">{copy.labels.onThisPage}</p>
              <ol className="mt-2 space-y-1 text-meta">
                {lesson.toc.map((item, i) => (
                  <li key={item.id} className="flex gap-2">
                    <span className="tabular shrink-0 text-muted">{i + 1}.</span>
                    <a
                      href={`#${item.id}`}
                      lang={subject.contentLang}
                      aria-current={activeId === item.id ? 'true' : undefined}
                      className={activeId === item.id ? 'font-semibold' : undefined}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {lessons.length > 1 && (
            <nav
              className={lesson.toc.length > 0 ? 'mt-8 border-t border-rule pt-6' : ''}
              aria-label={copy.labels.lessons}
            >
              <p className="text-meta text-muted">{copy.labels.lessons}</p>
              <ol className="mt-2 space-y-1 text-meta">
                {lessons.map((item, i) => (
                  <li key={item.slug} className="flex gap-2">
                    <span className="tabular shrink-0 text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.slug === lesson.slug ? (
                      <span aria-current="page" className="font-semibold text-text">
                        {item.title}
                      </span>
                    ) : (
                      <Link href={lessonHref(item.slug)} lang={subject.contentLang}>
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </aside>

        <div className="mt-10 min-w-0 flex-1 lg:mt-0">
          <p className="ui tabular text-meta text-muted">
            {String(index + 1).padStart(2, '0')} / {String(lessons.length).padStart(2, '0')}
          </p>
          <h1 className="mt-1 font-serif text-h1" lang={subject.contentLang}>
            {lesson.title}
          </h1>
          {lesson.description && (
            <p className="mt-2 text-muted" lang={subject.contentLang}>
              {lesson.description}
            </p>
          )}

          <article
            ref={articleRef}
            className="prose prose-justify mt-8 max-w-[46rem]"
            lang={subject.contentLang}
            dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
          />

          {(prev || next) && (
            <nav className="ui mt-14 flex justify-between gap-6 border-t border-rule pt-6 text-meta">
              <span className="max-w-[45%]">
                {prev && (
                  <Link href={lessonHref(prev.slug)} lang={subject.contentLang}>
                    ← {prev.title}
                  </Link>
                )}
              </span>
              <span className="max-w-[45%] text-right">
                {next && (
                  <Link href={lessonHref(next.slug)} lang={subject.contentLang}>
                    {next.title} →
                  </Link>
                )}
              </span>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
