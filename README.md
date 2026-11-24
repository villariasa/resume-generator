# Resume Generator

A free, 100% client-side resume builder. Pick a template, fill in your story, export a print-perfect PDF — your data never leaves the browser.

## Features

- **5 built-in templates** — Classic (ATS-safe), Meridian (two-column sidebar), Dossier (editorial serif), Compact (dense one-pager), Vivid (accent band + photo)
- **Your own templates** — customize accent color, font pairing, density, page size, section order/visibility, and column layout, then save the look as a named template
- **Live preview** — side-by-side editing with instant updates, zoom, page-break indicators, and an overflow warning
- **Exports** — print-accurate PDF (A4 / US Letter, selectable text), JSON save/load, DOCX (recruiter-editable), ATS plain text
- **Share links** — the whole resume compressed into a URL fragment; recipients can view, download, or clone it into their own editor
- **Autosave + multi-resume** — everything persists to localStorage; manage, duplicate, and delete resumes from the gallery

## Stack

Svelte 5 (runes) · Vite · Tailwind CSS v4 · TypeScript · lz-string · docx

No backend, no accounts, no tracking. Deploys as a static site to GitHub Pages: [https://villariasa.github.io/resume-generator/](https://villariasa.github.io/resume-generator/).

## Development

```bash
npm install
npm run dev     # local dev server
npm run check   # svelte-check + TypeScript
npm run build   # production build to dist/
```

Note: scripts invoke binaries via `node node_modules/...` because this workspace's filesystem doesn't support symlinks (`.npmrc` sets `bin-links=false`). On a normal filesystem, plain `vite`/`svelte-check` work too.
