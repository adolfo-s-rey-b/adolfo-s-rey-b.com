# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sitio académico personal de Adolfo S. Rey B. (economista y abogado, Universidad de los Andes). Se dirige a un lector concreto: un profesor de economía financiera de EE. UU. o un coordinador de contratación de un banco de la Reserva Federal verificando una candidatura a un puesto predoctoral. Es la **capa de verificación del expediente**: no genera admisiones, pero puede perderlas.

**Next.js 14 (Pages Router)** con export estático (`output: 'export'`, `trailingSlash: true`), en Cloudflare Pages — `https://adolfo-s-rey-b.com`. **Inglés por defecto** en la raíz; español bajo `/es/`.

Ver `README.md` para estructura de contenido, cómo añadir entradas y la lista de pendientes.

## Build & Deploy

Cualquier push a `main` dispara GitHub Actions → `npm run build` → Cloudflare Pages CDN.

```bash
npm run dev
npm run build      # prebuild genera el sitemap, luego next build → out/
npm run check      # invariantes de contenido; correr antes de cada commit

# Estado del deploy: https://github.com/adolfo-s-rey-b/adolfo-s-rey-b.com/actions
# Preview: https://adolfo-s-rey-b.pages.dev
```

Un cron (`~/server-stack/scripts/auto-sync.sh`, cada 5 min) sincroniza el vault de Obsidian y hace commit y push a `main`. **Pausarlo antes de cualquier trabajo en rama**: hace `git add -A` sobre la rama activa y corre `sync-notes.py`, que puede regenerar carpetas de contenido.

## Reglas duras

No son preferencias. Romper cualquiera rompe el build o publica algo falso.

1. **Ninguna vista de `src/views/` puede importar `fs`, `path` ni `lib/markdown`.** El transform SSG de Next solo elimina imports huérfanos bajo `pages/`; desde una vista, `fs` acaba en el bundle de cliente y el build falla con `Can't resolve 'fs'`. Los accesos a disco viven en `src/lib/props/`. `npm run check` lo verifica.
2. **`next/font` no puede importarse en `src/pages/_document.jsx`.** Next lanza `Cannot be used within pages/_document.js`. La fuente se carga en `_app.jsx`.
3. **Todo `href` sale de `href()` de `src/lib/routes.js`**, nunca escrito a mano. Las rutas llevan barra final; una sin ella provoca un 308 extra en Cloudflare, invisible en dev y penalizado en Lighthouse.
4. **No inventar ningún dato.** Ni una fecha, ni una cifra, ni un título, ni un coautor. Lo que falte queda como bloque comentado que no se renderiza. Los pendientes están en el README.

## Arquitectura i18n

Tres capas, sin duplicar lógica:

| Capa | Dónde | Qué |
|---|---|---|
| Hechos | `data/*.json` | campos traducibles como `{en, es}`; URLs y fechas como string plano |
| Copy de UI | `src/content/i18n/<locale>/*.json` | un archivo por página |
| Vista | `src/views/*.jsx` | JSX sin ninguna lógica de idioma |

Las 20 rutas de `src/pages/**` son shims de 4 líneas; el árbol `/es/` es espejo del de la raíz. `tDeep()` (`src/lib/i18n.js`) resuelve los nodos `{en, es}`. `alternates()` (`src/lib/routes.js`) es el **único** sitio donde se calcula el par EN/ES, y lo consumen el selector de idioma, los `hreflang` y el sitemap. El `lang` de `<html>` se deriva en `_document.jsx` de `ctx.pathname`.

## Rutas

| Ruta (y su espejo bajo `/es/`) | Vista | Datos |
|---|---|---|
| `/` | `HomeView` | `content/i18n/*/home.json` |
| `/research/` | `ResearchView` | `data/research.json` |
| `/teaching/` | `TeachingView` | `data/teaching.json` |
| `/notes/` | `NotesIndexView` | `content/notes/**` |
| `/notes/class/<materia>/` | `SubjectView` | `content/notes/class/<materia>/_meta.json` |
| `/notes/class/<materia>/<lección>/` | `LessonView` | `content/notes/class/<materia>/<lección>.md` |
| `/code/` | `CodeView` | `content/code.json` |
| `/cv/` | `CvView` | `data/cv.json` |
| `/contact/` | `ContactView` | `src/lib/site.js` |

Las notas de clase están en español en ambos árboles: bajo la interfaz en inglés se sirven con `noindex` y marca `ES`, y quedan fuera del sitemap. Solo se traducen sus títulos y bajadas.

## Sistema de notas

Cada materia es una carpeta bajo `content/notes/class/` con un `_meta.json` bilingüe (`title` y `description` como `{en, es}`, más `professor`, `semester`, `contentLang`) y archivos `.md` con frontmatter `title`, `description`, `order`.

`content/notes/reading/` y `content/notes/commentary/` solo renderizan entradas con `published: true` en el frontmatter; hoy ambas están vacías y sus bloques no aparecen en `/notes/`. Los archivos que empiezan por `_` se ignoran.

## Diseño

Cuatro colores más la regla, como custom properties en `src/styles/globals.css`, expuestos a Tailwind como `bg`, `text`, `muted`, `accent`, `rule`. Modo oscuro por `prefers-color-scheme`, sin toggle. Tipografía: Source Serif 4 variable, servida localmente y subseteada; mono del sistema solo para código y las marcas `[PDF]`.

Sin tarjetas, sin sombras, sin gradientes, sin animaciones, sin iconografía decorativa (solo marcas textuales `[PDF]`, `[Code]`, `[Slides]`). `boxShadow` y `borderRadius` están neutralizados en `tailwind.config.js` como red de seguridad.

**El sitio se parece a un documento, no a un producto.** Si una decisión de diseño lo acerca a un producto, esa decisión está mal.
