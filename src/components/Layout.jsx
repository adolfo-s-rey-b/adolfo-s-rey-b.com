import Header from './Header';
import Footer from './Footer';

// §6.1: una sola columna. 42rem para prosa, 52rem para /cv/, /research/ y
// /notes/. Sin tarjetas, sin sombras, sin fondos alternos.
// LayoutFullScreen se eliminó: el diseño nuevo es una columna en todas partes.
const WIDTHS = { prose: 'max-w-prose', wide: 'max-w-wide' };

export default function Layout({
  children,
  locale = 'en',
  routeKey = 'home',
  params = {},
  copy,
  width = 'prose',
}) {
  const nav = copy?.nav ?? {};

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#content" className="skip-link">
        {nav.skipToContent ?? 'Skip to content'}
      </a>

      <Header locale={locale} routeKey={routeKey} params={params} nav={nav} />

      <main id="content" className={`mx-auto w-full flex-1 px-6 py-12 ${WIDTHS[width]}`}>
        {children}
      </main>

      <Footer locale={locale} />
    </div>
  );
}
