import Head from 'next/head';
import Link from 'next/link';
import { href } from '../lib/routes';

// Una sola página para ambos locales: Cloudflare Pages sirve /404.html para
// cualquier ruta no encontrada, sin saber el idioma. Por eso muestra los dos.
export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found — Adolfo S. Rey B.</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mx-auto max-w-prose px-6 py-20">
        <h1 className="text-h1 font-semibold">404</h1>
        <p className="mt-6">
          This page does not exist.{' '}
          <Link href={href('home', 'en')}>Go to the homepage</Link>.
        </p>
        <p className="mt-2" lang="es">
          Esta página no existe. <Link href={href('home', 'es')}>Ir al inicio</Link>.
        </p>
      </div>
    </>
  );
}

// Sin Layout: no debe pintar navegación con un routeKey inválido.
NotFound.getLayout = (page) => page;
