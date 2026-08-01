import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import DateRail from '../components/DateRail';
import { href } from '../lib/routes';

function Section({ id, title, children }) {
  return (
    <section className="mt-10" aria-labelledby={id}>
      <h2 id={id} className="border-b border-rule pb-1 text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CvView({
  locale,
  routeKey,
  copy,
  education,
  employment,
  skills,
  honors,
  additionalCoursework,
  hasEnglishCv,
}) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="text-h1">{copy.heading}</h1>
        <p className="mark no-print">
          {/* §7.6: el enlace al CV en inglés solo aparece si el PDF existe. */}
          {hasEnglishCv && (
            <a href="/Rey_CV_EN.pdf" className="mr-3">
              {copy.downloads.en}
            </a>
          )}
          <a href="/Rey_HV_ES.pdf">{copy.downloads.es}</a>
        </p>
      </div>

      {/* Los enlaces y el correo viven en /contact/ y en el footer; repetirlos
          aquí era ruido. Queda solo lo que un comité no puede deducir de otra
          parte: dónde está y qué autorización de trabajo tiene. La ciudadanía
          no es un dato biográfico sino una barrera de contratación que
          desaparece, y por eso va arriba. */}
      <p className="ui mt-3 text-meta text-muted">{copy.identityLine}</p>

      <Section id="education" title={copy.sections.education}>
        {education.map((item) => (
          <DateRail key={item.id} dates={item.dates}>
            <h3 className="text-h3">{item.degree}</h3>
            <p className="text-muted">{item.institution}</p>
            {item.detail.map((line) => (
              <p key={line.slice(0, 40)} className="mt-1">
                {line}
              </p>
            ))}
          </DateRail>
        ))}
      </Section>

      <Section id="employment" title={copy.sections.employment}>
        {employment.map((job) => (
          <DateRail key={job.id} dates={job.dates}>
            <h3 className="text-h3">{job.role}</h3>
            <p className="text-muted">{job.organization}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {job.items.map((bullet) => (
                <li key={bullet.slice(0, 40)}>{bullet}</li>
              ))}
            </ul>
          </DateRail>
        ))}
      </Section>

      {/* §7.6(4): esta sección no existía en el CV y es obligatoria. */}
      <Section id="teaching" title={copy.sections.teaching}>
        <div className="mt-4 space-y-2">
          {copy.teachingSummary.map((line) => (
            <p key={line.slice(0, 40)}>{line}</p>
          ))}
          <p>
            <Link href={href('teaching', locale)}>{copy.teachingLink}</Link>
          </p>
        </div>
      </Section>

      <Section id="research" title={copy.sections.research}>
        <div className="mt-4 space-y-2">
          <p>{copy.researchSummary}</p>
          <p>
            <Link href={href('research', locale)}>{copy.researchLink}</Link>
          </p>
        </div>
      </Section>

      <Section id="skills" title={copy.sections.skills}>
        <dl className="mt-4 space-y-2">
          {skills.map((skill) => (
            <div key={skill.label}>
              <dt className="inline font-semibold">{skill.label}:</dt>{' '}
              <dd className="inline">{skill.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="honors" title={copy.sections.honors}>
        <ul className="mt-4 list-disc space-y-1 pl-5">
          {honors.map((honor) => (
            <li key={honor.slice(0, 40)}>{honor}</li>
          ))}
        </ul>
      </Section>

      {/* §7.6(9): una sola línea, al final, en --muted, 14px. Lo que queda de
          la galería de 47 certificados de Coursera. */}
      <p className="mt-10 border-t border-rule pt-4 text-meta text-muted">
        {additionalCoursework}
      </p>
    </>
  );
}
