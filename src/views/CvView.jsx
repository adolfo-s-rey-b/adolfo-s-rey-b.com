import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import DateRail from '../components/DateRail';
import { href, SITE_URL } from '../lib/routes';
import { LINKS, IDENTITY } from '../lib/site';

function Section({ id, title, children }) {
  return (
    <section className="mt-10" aria-labelledby={id}>
      <h2 id={id} className="border-b border-rule pb-1 text-h2 font-semibold">
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
        <h1 className="text-h1 font-semibold">{copy.heading}</h1>
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

      <Section id="personal" title={copy.personalHeading}>
        <div className="mt-4 space-y-1">
          <p className="font-semibold">{IDENTITY.alternateName}</p>
          <p className="text-muted">{IDENTITY.location}</p>
          <p>
            <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            {LINKS.emailSecondary && (
              <>
                <span aria-hidden="true" className="text-muted"> · </span>
                <a href={`mailto:${LINKS.emailSecondary}`}>{LINKS.emailSecondary}</a>
              </>
            )}
          </p>
          <p>
            <a href={SITE_URL}>adolfo-s-rey-b.com</a>
            <span aria-hidden="true" className="text-muted"> · </span>
            <a href={LINKS.linkedin}>LinkedIn</a>
            <span aria-hidden="true" className="text-muted"> · </span>
            <a href={LINKS.github}>GitHub</a>
            {LINKS.scholar && (
              <>
                <span aria-hidden="true" className="text-muted"> · </span>
                <a href={LINKS.scholar}>Google Scholar</a>
              </>
            )}
          </p>
          {/* §3.7: la línea de ciudadanía va explícita aquí y en ninguna otra página. */}
          <p className="pt-1">{copy.citizenship}</p>
        </div>
      </Section>

      <Section id="education" title={copy.sections.education}>
        {education.map((item) => (
          <DateRail key={item.id} dates={item.dates}>
            <h3 className="text-h3 font-semibold">{item.degree}</h3>
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
            <h3 className="text-h3 font-semibold">{job.role}</h3>
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
