import Head from 'next/head';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Página no encontrada — Adolfo S. Rey B.</title>
      </Head>
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-8xl font-serif font-bold text-gray-100 select-none mb-2">404</p>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mb-10 max-w-md">
          La página que buscas no existe o fue movida a otra dirección.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#5e026e] hover:bg-[#7b0391] text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md shadow-[#5e026e]/25"
          >
            <Home size={18} />
            Ir al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>
      </div>
    </>
  );
}
