import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative base — works on GitHub Pages' /resume-generator/ subpath AND a
  // root domain (Cloudflare Pages) without rebuilding. Safe because the app
  // is a single page with no client-side routing.
  base: './',
  plugins: [svelte(), tailwindcss()],
})
