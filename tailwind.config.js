/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/views/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // Los colores apuntan a las custom properties de globals.css, así que el
      // modo oscuro funciona sin variantes `dark:` en el marcado.
      // Nota: esto desactiva los modificadores de opacidad (`text-accent/50`),
      // lo cual es deseado — el acento nunca se usa con alpha ni como fondo.
      colors: {
        bg: 'var(--bg)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        rule: 'var(--rule)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Charter', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      // Medida de 68–72 caracteres
      maxWidth: {
        prose: '42rem',
        wide: '52rem',
      },
      // Escala restringida. Nada más grande que `name`.
      fontSize: {
        meta: ['14px', { lineHeight: '1.5' }],
        nav: ['15px', { lineHeight: '1.4' }],
        h3: ['18px', { lineHeight: '1.4' }],
        body: ['19px', { lineHeight: '1.65' }],
        h2: ['22px', { lineHeight: '1.3' }],
        h1: ['30px', { lineHeight: '1.2' }],
        name: ['34px', { lineHeight: '1.15' }],
      },
    },
    // Sobrescriben (no extienden) para que cualquier `shadow-*` o `rounded-*`
    // residual sea un no-op. Red de seguridad barata contra el §6.1.
    boxShadow: {
      none: 'none',
      DEFAULT: 'none',
      sm: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      inner: 'none',
    },
    borderRadius: {
      none: '0',
      sm: '1px',
      DEFAULT: '2px',
      md: '2px',
      lg: '2px',
      xl: '2px',
      '2xl': '2px',
      '3xl': '2px',
      full: '2px',
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
