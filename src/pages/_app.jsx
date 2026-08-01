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

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ?? ((page, props) => <Layout {...props}>{page}</Layout>);

  return (
    <div className={serif.variable}>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </div>
  );
}
