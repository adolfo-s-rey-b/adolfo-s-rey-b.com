import SeoHead from '../components/SeoHead';

// §6.5: formato por ítem sin tarjeta. Título, marcas a la derecha, coautores,
// venue y año, y el abstract dentro de un <details> nativo cerrado por defecto.
function PaperItem({ item, copy }) {
  const marks = [
    item.pdf ? { label: copy.marks.pdf, href: item.pdf } : null,
    item.code ? { label: copy.marks.code, href: item.code } : null,
    item.slides ? { label: copy.marks.slides, href: item.slides } : null,
  ].filter(Boolean);

  return (
    <article className="border-t border-rule py-6 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-h3 font-semibold">{item.title}</h3>
        {marks.length > 0 && (
          <span className="mark shrink-0">
            {marks.map((mark) => (
              <a key={mark.label} href={mark.href} className="ml-2 first:ml-0">
                {mark.label}
              </a>
            ))}
          </span>
        )}
      </div>

      {item.authors && <p className="mt-1 text-muted">{item.authors}</p>}
      {item.venue && <p className="text-muted">{item.venue}</p>}

      {item.abstract && (
        <details className="mt-2">
          <summary className="text-meta">{copy.labels.abstract}</summary>
          <p className="mt-2">{item.abstract}</p>
        </details>
      )}
    </article>
  );
}

export default function ResearchView({ locale, routeKey, copy, applied, legalScholarship }) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <h1 className="text-h1 font-semibold">{copy.heading}</h1>

      <section className="mt-8" aria-labelledby="agenda">
        <h2 id="agenda" className="text-h2 font-semibold">
          {copy.agendaHeading}
        </h2>
        <div className="mt-4 max-w-prose space-y-5">
          {copy.agenda.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* §7.2(2): una sola línea. Sin título, sin directores, sin tema.
          No ampliar este bloque hasta nueva instrucción explícita de Adolfo. */}
      <section className="mt-12" aria-labelledby="work-in-progress">
        <h2 id="work-in-progress" className="text-h2 font-semibold">
          {copy.workInProgressHeading}
        </h2>
        <p className="mt-4">{copy.workInProgress}</p>
      </section>

      <section className="mt-12" aria-labelledby="applied">
        <h2 id="applied" className="text-h2 font-semibold">
          {copy.appliedHeading}
        </h2>
        {applied.map((item) => (
          <article key={item.id} className="mt-4">
            <h3 className="text-h3 font-semibold">{item.title}</h3>
            <p className="mt-1 text-muted">{item.meta}</p>
            <p className="mt-3 max-w-prose">{item.body}</p>
            <p className="mt-3 italic text-muted">{item.note}</p>
          </article>
        ))}
      </section>

      {/* §7.2(4): bloqueado por los pendientes del §3.5(b) y §3.5(c). Si no hay
          datos, se omite la sección entera — nunca un encabezado vacío. */}
      {legalScholarship.length > 0 && (
        <section className="mt-12" aria-labelledby="legal-scholarship">
          <h2 id="legal-scholarship" className="text-h2 font-semibold">
            {copy.legalScholarshipHeading}
          </h2>
          <div className="mt-4">
            {legalScholarship.map((item) => (
              <PaperItem key={item.id} item={item} copy={copy} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
