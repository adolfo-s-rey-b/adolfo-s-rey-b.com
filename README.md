# adolfo-s-rey-b.com

Sitio académico personal de Adolfo S. Rey B. — economista y abogado, Universidad de los Andes.

**Inglés por defecto** en la raíz, español bajo `/es/`. Next.js 14 (Pages Router) con export estático, desplegado en Cloudflare Pages.

- Producción: <https://adolfo-s-rey-b.com>
- Preview: <https://adolfo-s-rey-b.pages.dev>

---

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # prebuild genera el sitemap, luego next build → out/
npm run check        # invariantes de contenido (ver scripts/check.sh)
```

Cualquier push a `main` dispara GitHub Actions → `npm run build` → Cloudflare Pages.

> **`prebuild`, no `postbuild`.** Con `output: 'export'`, `next build` copia `public/` a `out/` *durante* el build. Un sitemap escrito después nunca llega al sitio publicado.

---

## Estructura

```
src/
  pages/            shims de 4 líneas; el árbol /es/ es espejo del de la raíz
  views/            todo el JSX, una sola vez, sin lógica de idioma
  lib/
    routes.js       fuente única de rutas y del par EN/ES
    i18n.js         resuelve los nodos {en, es} al locale pedido
    site.js         identidad canónica: correos, enlaces, JSON-LD
    markdown.js     pipeline unified/remark/rehype
    props/          constructores de props (los únicos que pueden tocar fs)
  content/i18n/     copy de UI por locale
  fonts/            Source Serif 4 variable, subseteada
data/               hechos estructurados, con los campos traducibles como {en, es}
content/
  notes/class/      notas de clase por materia
  notes/reading/    fichas de lectura (vacío; ver _TEMPLATE.md)
  notes/commentary/ comentarios
  code.json         listado de /code/
public/
  _redirects        301 de Cloudflare Pages
  _headers          cache y cabeceras de seguridad
```

### Dos reglas que rompen el build si se ignoran

1. **Ninguna vista de `src/views/` puede importar `fs`, `path` ni `lib/markdown`.** El transform SSG de Next solo elimina imports huérfanos en archivos bajo `pages/`; desde una vista, `fs` acabaría en el bundle de cliente. Por eso existe `lib/props/`. `npm run check` lo verifica.
2. **`next/font` no puede importarse en `src/pages/_document.jsx`.** Next lanza `Cannot be used within pages/_document.js`. La fuente se carga en `_app.jsx`.

---

## Cómo añadir contenido

### Una lección de clase

Crea `content/notes/class/<materia>/<slug>.md` con frontmatter `title`, `description`, `order`. Aparece sola en `/notes/class/<materia>/`. Las notas se sincronizan desde Obsidian con `scripts/sync-notes.py` (config en `data/obsidian-sync.json`).

### Una materia nueva

Carpeta bajo `content/notes/class/` con un `_meta.json`:

```json
{
  "title":       { "en": "…", "es": "…" },
  "description": { "en": "…", "es": "…" },
  "professor": "…", "semester": "2026-1", "contentLang": "es"
}
```

Y añade el mapeo en `data/obsidian-sync.json`.

### Una ficha de lectura o un comentario

Copia `content/notes/reading/_TEMPLATE.md`. **Nada se renderiza hasta que el frontmatter diga `published: true`** — así ninguna nota importada desde Obsidian se publica sin revisión.

### Un repositorio en `/code/`

Un objeto en `repos` de `content/code.json`. Deliberadamente **no** se consulta la API de GitHub: añadiría una dependencia de red a un sitio estático.

### Un semestre de docencia

`data/teaching.json` → `history`. El enlace `[Syllabus]` solo se renderiza si `programUrl` no es `null`.

Los programas académicos se publican en [esta página de la Facultad](https://economia.uniandes.edu.co/es/estudiantes/pregrado-en-economia/programas-academicos-de-los-cursos-de-pregrado), bajo `/sites/economia/files/media/pregrado/pracademicos/<periodo>/`. **Uniandes migró su sitio y la ruta anterior (`/sites/default/files/…`) devuelve 404**, así que los 10 enlaces existentes se reconstruyeron y se verificaron uno a uno. Al añadir un semestre, comprobar que los enlaces nuevos respondan `application/pdf` antes de publicar — un enlace roto a un syllabus resta credibilidad en vez de darla, que es justo lo contrario de para qué está esa página.

### Coursework del CV

`data/cv.json` → `education` → ítem `ma-economics` → `detail`. Actualízalo **al final de cada semestre**: es la señal de coursework que revisa un comité de predoc.

### Regenerar la imagen Open Graph

Solo si cambia el nombre o el descriptor:

```bash
npx playwright install chromium     # una vez
node scripts/og/render-og.mjs       # escribe public/og-{en,es}.png
```

---

## Pendientes que bloquean publicación

Los bloques que dependen de estos datos están **comentados y no se renderizan**.

| # | Dato | Bloquea |
|---|---|---|
| 1 | Cita completa de la publicación de derecho del [repositorio Uniandes](https://repositorio.uniandes.edu.co/entities/publication/eaaaf733-0804-47c7-849c-36354ce2ce32): título, coautores en orden, año, tipo, revista o serie, y resumen de 2–3 frases en inglés | Bloque *Legal scholarship* en `/research/` y `/cv/` |
| 2 | Capítulo de libro: título, libro, editores, editorial, año, coautores, **y confirmación de que está aceptado o contratado**. Si no está aceptado formalmente, no se publica: *forthcoming* sobre algo no aceptado es una afirmación falsa | Bloque *Legal scholarship* |
| 3 | Archivo `public/Rey_CV_EN.pdf` | Enlace de descarga del CV en inglés (no se renderiza si el archivo no existe) |
| 4 | iD de ORCID | `sameAs` del JSON-LD y footer |

Como 1 y 2 son los dos únicos ítems de *Legal scholarship*, la sección entera se omite: no se deja un encabezado vacío.

### Tareas manuales

- **Registrar `sitemap.xml` en Google Search Console.** El sitio no aparecía en búsquedas; es una falla funcional, no cosmética.
- **Arreglar propietarios en el servidor.** `node_modules/`, `out/`, `.next/` y `package-lock.json` pertenecen a `root` por un build antiguo corrido con sudo, así que `npm install` falla. Tras `sudo chown -R $USER:$USER node_modules out .next package-lock.json`, correr `npm install` para que el lockfile suelte la entrada obsoleta de `lucide-react` (hoy `npm ci` la ignora sin error, así que no rompe el deploy).

---

## Backlog

1. Poblar `/code/` con el repositorio de la data task resuelta.
2. Primeras *reading notes*, una por paper, en inglés, con la plantilla de cuatro encabezados.
3. Sustituir el enlace del CV inglés cuando exista `Rey_CV_EN.pdf`.
4. Añadir *Working papers* a `/research/` cuando haya documento circulable.
5. Añadir el extracto de la tesis como *writing sample* descargable (previsto para mediados de 2028).
6. Crear y enlazar el perfil de ORCID.
7. Los 31 `capitulo-*.md` de macroeconomía solo tienen frontmatter: el sync desde Obsidian no trajo el cuerpo. Se listan y generan, pero salen con `noindex` y fuera del sitemap por ser thin content.

---

## Diseño

Cuatro colores más la regla, definidos como custom properties en `src/styles/globals.css` y expuestos a Tailwind como `bg`, `text`, `muted`, `accent`, `rule`. Modo oscuro por `prefers-color-scheme`, sin toggle.

Sin tarjetas, sin sombras, sin gradientes, sin animaciones, sin iconografía decorativa. `boxShadow` y `borderRadius` están neutralizados en `tailwind.config.js` para que cualquier `shadow-*` o `rounded-*` residual sea un no-op.

El sitio se parece a un documento, no a un producto. Si una decisión de diseño lo acerca a un producto, esa decisión está mal.
