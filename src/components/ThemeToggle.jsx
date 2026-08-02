import { useEffect, useState } from 'react';

// El claro es el default y no se consulta prefers-color-scheme: el oscuro solo
// aparece si el usuario lo pide. La elección se guarda en localStorage y la
// aplica el script en línea de _document.jsx antes del primer pintado.
export default function ThemeToggle({ label }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    if (next) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* modo privado: el cambio vale para esta sesión y no se guarda */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={ready ? dark : undefined}
      aria-label={label}
      title={label}
      className="ui text-nav text-text transition-colors duration-150 hover:text-accent"
    >
      {/* Sol y luna como una sola marca textual, coherente con [PDF]/[Code] */}
      <span aria-hidden="true">{ready && dark ? '☾' : '☀'}</span>
    </button>
  );
}
