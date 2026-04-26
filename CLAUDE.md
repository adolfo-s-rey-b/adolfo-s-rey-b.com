# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic website for Adolfo S. Rey B. (Economist & Lawyer / Colombia Fintech). Built with **Next.js 14 (Pages Router)** and **static export** (`output: 'export'`, `trailingSlash: true`). Served via nginx inside the Docker stack defined in `~/server-stack/`.

Full technical documentation is in `configuracion.md`.

## Build & Deploy

```bash
# From ~/server-stack/ — rebuild and deploy
docker compose restart nextjs_compiler

# Watch build logs
docker logs nextjs_daemon -f

# Verify build
docker logs nextjs_daemon --tail 30
```

The `nginx_core` container serves `website-public/` on port 80. Nginx config is at `~/server-stack/website/nginx.conf`.

## Architecture

- **Framework:** Next.js 14 (Pages Router) with static export
- **Styles:** Tailwind CSS + `@tailwindcss/typography`
- **Icons:** `lucide-react`
- **Markdown:** `gray-matter` + `unified` + `remark-*` + `rehype-*` pipeline (ESM-only, uses `await import()`)
- **LaTeX:** `remark-math` + `rehype-katex`
- **Data:** Structured content in `data/*.json` files (editable without touching code)
- **Content:** Blog posts in `content/blog/*.md`, notes in `content/notes/<subject>/<lesson>.md`

## Data System (JSON files in `data/`)

| File | Used by | Content |
|------|---------|---------|
| `profile.json` | `index.jsx` | Name, bio, quote, links, photo |
| `papers.json` | `research.jsx` | Research papers array |
| `teaching.json` | `teaching.jsx` | Teaching history + notes index |
| `cv.json` | `cv.jsx` | Experience, education, skills, languages, seminars |
| `contact.json` | `contact.jsx` | Emails, social links, webhook URL |
| `github-fallback.json` | `github.jsx` | Fallback repos if GitHub API fails |

## Notes System (Multi-file)

Each subject is a folder: `content/notes/<subject>/` with:
- `_meta.json` — subject metadata (title, professor, semester, description)
- `*.md` files — lessons with frontmatter: `title`, `description`, `order`

Routes:
- `/notes/<subject>` — lesson index page
- `/notes/<subject>/<lesson>` — individual lesson with sidebar TOC + prev/next navigation

## Page Routes

| Route | Source | Data |
|---|---|---|
| `/` | `pages/index.jsx` | `data/profile.json` |
| `/research` | `pages/research.jsx` | `data/papers.json` |
| `/teaching` | `pages/teaching.jsx` | `data/teaching.json` |
| `/cv` | `pages/cv.jsx` | `data/cv.json` |
| `/github` | `pages/github.jsx` | GitHub API + fallback |
| `/contact` | `pages/contact.jsx` | `data/contact.json` |
| `/blog` | `pages/blog/index.jsx` | `content/blog/*.md` |
| `/blog/<slug>` | `pages/blog/[slug].jsx` | `content/blog/<slug>.md` |
| `/notes/<subject>` | `pages/notes/[subject]/index.jsx` | `content/notes/<subject>/_meta.json` |
| `/notes/<subject>/<lesson>` | `pages/notes/[subject]/[lesson].jsx` | `content/notes/<subject>/<lesson>.md` |

## Brand

- Primary color: `#5e026e` (purple)
- Hover variant: `#7b0391`
- Font: serif for headings (Georgia), sans for body (Inter)
- Selection highlight: `bg-[#5e026e] text-white`
