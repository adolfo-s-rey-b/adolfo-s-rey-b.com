import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

const navItems = [
  { id: 'home',     label: 'Inicio',       href: '/' },
  { id: 'research', label: 'Investigación', href: '/research' },
  { id: 'teaching', label: 'Docencia',      href: '/teaching' },
  { id: 'cv',       label: 'CV',            href: '/cv' },
  { id: 'github',   label: 'GitHub',        href: '/github' },
  { id: 'blog',     label: 'Blog',          href: '/blog' },
  { id: 'contact',  label: 'Contacto',      href: '/contact' },
];

function isActive(item, pathname) {
  if (item.href === '/') return pathname === '/';
  if (item.id === 'teaching' && pathname.startsWith('/notes')) return true;
  return pathname.startsWith(item.href);
}

export default function Navbar() {
  const { pathname } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-serif font-bold text-gray-900 hover:text-[#5e026e] transition-colors"
        >
          Adolfo S. Rey B.
        </Link>
        <ul className="hidden md:flex flex-wrap justify-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const active = isActive(item, pathname);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`transition-colors duration-300 hover:text-[#5e026e] ${
                    active
                      ? 'text-[#5e026e] border-b-2 border-[#5e026e] pb-1'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-600 hover:text-[#5e026e] transition-colors"
          aria-label="Menú"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul className="px-6 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item, pathname);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                      active
                        ? 'text-[#5e026e] bg-[#5e026e]/5'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#5e026e]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
