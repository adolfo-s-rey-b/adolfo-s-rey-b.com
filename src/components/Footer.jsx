import { LINKS } from '../lib/site';

// §6.4: una sola línea en --muted, 14px. Sin el "© 2026 | Economista y Abogado".
export default function Footer({ locale }) {
  const items = [
    { label: 'Adolfo S. Rey B.', href: null },
    { label: LINKS.email, href: `mailto:${LINKS.email}` },
    { label: 'LinkedIn', href: LINKS.linkedin },
    { label: 'GitHub', href: LINKS.github },
    LINKS.scholar ? { label: 'Google Scholar', href: LINKS.scholar } : null,
  ].filter(Boolean);

  return (
    <footer className="mt-20 border-t border-rule">
      <p className="mx-auto max-w-wide px-6 py-6 text-meta text-muted">
        {items.map((item, i) => (
          <span key={item.label}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            {item.href ? (
              <a href={item.href} className="text-muted">
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </span>
        ))}
      </p>
    </footer>
  );
}
