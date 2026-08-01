import Link from 'next/link';
import { NAV, href } from '../lib/routes';
import LocaleSwitch from './LocaleSwitch';

// §6.4: nombre a la izquierda en 16px semibold, navegación a la derecha en
// 15px, selector de idioma al final, borde inferior de 1px. NO sticky.
// Sin hamburguesa ni estado: en móvil la lista simplemente se envuelve.
export default function Header({ locale, routeKey, params = {}, nav }) {
  const isActive = (key) =>
    key === routeKey ||
    // Las rutas de materia y lección viven bajo Notes.
    (key === 'notes' && (routeKey === 'subject' || routeKey === 'lesson'));

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-wide flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 py-5">
        <Link
          href={href('home', locale)}
          className="text-[16px] font-semibold text-text no-underline"
        >
          Adolfo S. Rey B.
        </Link>

        <nav aria-label={nav.label}>
          <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-nav">
            {NAV.map((key) => (
              <li key={key}>
                <Link
                  href={href(key, locale)}
                  aria-current={isActive(key) ? 'page' : undefined}
                  className={
                    isActive(key)
                      ? 'font-semibold text-text no-underline'
                      : 'text-text no-underline hover:underline hover:decoration-1 hover:underline-offset-[3px]'
                  }
                >
                  {nav[key]}
                </Link>
              </li>
            ))}
            <li>
              <LocaleSwitch routeKey={routeKey} params={params} locale={locale} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
