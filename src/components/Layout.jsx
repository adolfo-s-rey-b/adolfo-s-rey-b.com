import Navbar from './Navbar';

// Standard layout: used by all pages except /blog/[slug] and /notes/[slug]
export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-700 font-sans selection:bg-[#5e026e] selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
        {children}
      </main>
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 mt-auto">
        <p>© {new Date().getFullYear()} Adolfo S. Rey B. | Economista y Abogado</p>
      </footer>
    </div>
  );
}

// Full-screen layout: no footer, no max-width constraint
// Used by /blog/[slug] and /notes/[slug]
export function LayoutFullScreen({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-700 font-sans selection:bg-[#5e026e] selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}
