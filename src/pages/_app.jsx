import localFont from 'next/font/local';
import '../styles/globals.css';
import Layout from '../components/Layout';

// Source Serif 4 variable (SIL OFL 1.1), subseteada a Latin-1 + puntuación
// tipográfica. Un solo archivo cubre todos los pesos de 200 a 900.
// Va aquí y no en _document.jsx, donde next/font es un error de build.
const serif = localFont({
  src: [
    { path: '../fonts/source-serif-4/roman.woff2', weight: '200 900', style: 'normal' },
    { path: '../fonts/source-serif-4/italic.woff2', weight: '200 900', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  fallback: ['Charter', 'Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

// Source Sans 3 pertenece a la misma superfamilia que Source Serif 4: están
// diseñadas para emparejar. Solo la variante recta — la sans se usa en
// encabezados, navegación y metadatos, nunca en cursiva.
const sans = localFont({
  src: [{ path: '../fonts/source-sans-3/upright.woff2', weight: '200 900', style: 'normal' }],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ?? ((page, props) => <Layout {...props}>{page}</Layout>);

  return (
    <div className={`${serif.variable} ${sans.variable} site-root`}>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </div>
  );
}
