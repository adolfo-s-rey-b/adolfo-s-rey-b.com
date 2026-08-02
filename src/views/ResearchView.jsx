import SeoHead from '../components/SeoHead';

// Cada bloque abre con una regla y un encabezado en sans, contra el cuerpo en
// serif. El contraste entre familias es lo que da la jerarquía: se distingue de
// un vistazo qué es estructura y qué es contenido.
function Section({ id, title, children }) {
  return (
    <section className="mt-12 border-t border-rule pt-8" aria-labelledby={id}>
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

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
        <h3 className="text-h3">{item.title}</h3>
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

      {item.authors && <p className="ui mt-1 text-meta text-muted">{item.authors}</p>}
      {item.venue && <p className="ui text-meta text-muted">{item.venue}</p>}

      {item.abstract && (
        <details className="mt-3">
          <summary className="ui text-meta">{copy.labels.abstract}</summary>
          <p className="prose-justify prose-dense mt-2 max-w-prose">{item.abstract}</p>
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

      <h1 className="text-h1">{copy.heading}</h1>

      <Section id="agenda" title={copy.agendaHeading}>
        <div className="max-w-prose space-y-5">
          {copy.agenda.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="prose-justify prose-dense">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* §7.2(2): una sola línea. Sin título, sin directores, sin tema.
          No ampliar este bloque hasta nueva instrucción explícita de Adolfo. */}
      <Section id="work-in-progress" title={copy.workInProgressHeading}>
        <p className="max-w-prose">{copy.workInProgress}</p>
      </Section>

      <Section id="applied" title={copy.appliedHeading}>
        {applied.map((item) => (
          <article key={item.id}>
            <h3 className="text-h3">{item.title}</h3>
            <p className="ui mt-1 text-meta text-muted">{item.meta}</p>
            <div className="mt-4 max-w-prose space-y-4">
              {item.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="prose-justify prose-dense">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="ui mt-4 text-meta italic text-muted">{item.note}</p>
          </article>
        ))}
      </Section>

      {/* §7.2(4): bloqueado por los pendientes del §3.5(b) y §3.5(c). Si no hay
          datos, se omite la sección entera — nunca un encabezado vacío. */}
      {legalScholarship.length > 0 && (
        <Section id="legal-scholarship" title={copy.legalScholarshipHeading}>
          {legalScholarship.map((item) => (
            <PaperItem key={item.id} item={item} copy={copy} />
          ))}
        </Section>
      )}
    </>
  );
}
