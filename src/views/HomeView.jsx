import SeoHead from '../components/SeoHead';
import { href } from '../lib/routes';
import { LINKS } from '../lib/site';

export default function HomeView({ locale, routeKey, copy, jsonLd }) {
  const links = [
    { label: copy.links.cv, href: href('cv', locale) },
    { label: copy.links.research, href: href('research', locale) },
    { label: copy.links.teaching, href: href('teaching', locale) },
    { label: copy.links.email, href: `mailto:${LINKS.email}` },
    { label: copy.links.linkedin, href: LINKS.linkedin },
    { label: copy.links.github, href: LINKS.github },
    LINKS.scholar ? { label: copy.links.scholar, href: LINKS.scholar } : null,
  ].filter(Boolean);

  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
        jsonLd={jsonLd}
      />

      {/* §6.1: la foto es como máximo 140px, alineada arriba junto al primer
          párrafo. No es un hero. En móvil va encima del nombre. */}
      <div className="flex flex-col gap-6 sm:flex-row-reverse sm:items-start sm:gap-8">
        <picture className="shrink-0">
          <source srcSet="/headshot.webp" type="image/webp" />
          <img
            src="/headshot.jpg"
            alt={copy.photoAlt}
            width="140"
            height="140"
            className="h-[140px] w-[140px] object-cover"
          />
        </picture>

        <div className="min-w-0">
          <h1 className="text-name font-semibold">{copy.heading}</h1>
          <p className="mt-1 text-muted">{copy.tagline}</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {copy.body.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-12" aria-labelledby="research-interests">
        <h2 id="research-interests" className="text-h2 font-semibold">
          {copy.interestsHeading}
        </h2>
        <ul className="mt-4 space-y-2">
          {copy.interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </section>

      <p className="mt-12 border-t border-rule pt-6 text-meta">
        {links.map((link, i) => (
          <span key={link.label}>
            {i > 0 && <span aria-hidden="true" className="text-muted"> · </span>}
            <a href={link.href}>{link.label}</a>
          </span>
        ))}
      </p>
    </>
  );
}
