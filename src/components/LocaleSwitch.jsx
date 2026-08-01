import Link from 'next/link';
import { alternates, otherLocale } from '../lib/routes';

// Texto plano `EN / ES` con el activo en negrita (§5). Sin banderas, sin
// dropdown, sin icono de globo. Los dos destinos se resuelven en build a partir
// de routeKey + params, así que el enlace lleva a la página equivalente y no a
// la home. Cero JavaScript de cliente.
export default function LocaleSwitch({ routeKey, params = {}, locale }) {
  const target = alternates(routeKey, params).find(
    (alt) => alt.locale === otherLocale(locale)
  );

  return (
    <span className="text-nav">
      <span className="font-semibold text-text" aria-current="true">
        {locale.toUpperCase()}
      </span>
      <span className="text-muted" aria-hidden="true">
        {' / '}
      </span>
      <Link href={target.path} hrefLang={target.locale} lang={target.locale}>
        {target.locale.toUpperCase()}
      </Link>
    </span>
  );
}
