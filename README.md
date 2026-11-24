# Resume Generator

A free, 100% client-side resume builder. Pick a template, fill in your story, export a print-perfect PDF — your data never leaves the browser.

## Features

- **9 built-in templates** — Classic, Executive, Atlas, Dossier, Compact (all ATS-safe single-column formats), plus Meridian, Vivid, Onyx, and Keystone (a skills-first hybrid for ATS keyword-matching and career changers)
- **Your own templates** — customize accent color, font pairing, density, page size, section order/visibility, column layout, and photo display, then save the look as a named template
- **Edit directly on the page** — click any text on the resume preview itself (name, headline, bullets, dates…) to edit it in place, not just in the side form. Enter adds a new bullet, Backspace on an empty bullet removes it.
- **Live preview** — side-by-side editing with instant updates, zoom, page-break indicators, and an overflow warning. Empty sections show greyed-out example content as a guide — nothing ever looks blank, and guides never print or export.
- **AI Assist (optional, bring your own API key)** — generate a summary, suggest skills, or turn rough notes into polished bullet points for a specific role. Works with Anthropic (Claude), OpenAI (GPT), Google (Gemini), or any OpenAI-compatible endpoint (Groq, OpenRouter, Together, a local Ollama/LM Studio server, etc). See [AI Assist](#ai-assist) below.
- **Exports** — print-accurate PDF (A4 / US Letter, selectable text), JSON save/load, DOCX (recruiter-editable), ATS plain text
- **Share links** — the whole resume compressed into a URL fragment; recipients can view, download, or clone it into their own editor. The photo is always excluded from share links.
- **Photos just work** — any size/format you upload is automatically resized and re-encoded in your browser before it's stored, so a multi-MB phone photo prints fine and never risks hitting localStorage's size limit.
- **Autosave + multi-resume** — everything persists to localStorage; manage, duplicate, and delete resumes from the gallery
- **Light/dark theme** — toggle in the top bar; light is the default. The resume page itself always stays print-colored (white), only the app chrome themes.

## AI Assist

AI Assist is entirely optional and entirely client-side: you paste in your own API key, and every request goes **directly from your browser to the provider you choose** — there is no backend of ours in between (this app doesn't have one).

1. Click **AI Assist** in the editor toolbar.
2. Pick a provider and paste your API key. The key is saved only in this browser's `localStorage` (key `rg:ai-settings`) — it is never included in JSON exports, share links, or saved custom templates.
3. Use one of three focused actions:
   - **Summary** — describe yourself in a sentence or two, get a polished 2–3 sentence resume summary.
   - **Skills** — describe what you work with, get a suggested skill list you can drop straight into a skills group.
   - **Bullets** — pick a role from your work history, dump rough notes on what you actually did, get 3–5 achievement-focused bullets back (add to the role or replace its bullets).

**Supported providers:**

| Provider | Notes |
|---|---|
| Anthropic (Claude) | Officially supports direct browser requests — this is the most reliable option. |
| Google (Gemini) | Also used by Google AI Studio's own web UI, so browser calls are supported. |
| OpenAI (GPT) | Some accounts/networks block direct browser requests (CORS). If generation fails immediately with a network error, try Anthropic or Google. |
| Custom (OpenAI-compatible) | Point it at any server exposing an OpenAI-style `/chat/completions` endpoint — Groq, OpenRouter, Together, Mistral, a local Ollama/LM Studio server, etc. The endpoint must itself allow cross-origin requests from this page. |

Your API key is yours to manage — this app doesn't validate billing, rate limits, or provider-side costs. Click **Forget API key** in the AI Assist dialog to remove it from local storage at any time.

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
