<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import { DENSITY_FACTOR, DENSITY_FONT_SIZE, FONT_PAIRINGS, PAGE_DIMENSIONS } from './theme';
  import { resolveTemplate } from './registry';
  import { exampleResume } from '../example';

  let {
    data,
    settings,
    guides = false,
    editable = false,
    rootId = 'print-root',
  }: {
    data: ResumeData;
    settings: TemplateSettings;
    // Editor-only: show greyed example content in empty fields/sections.
    guides?: boolean;
    // Editor-only: click-to-edit text directly on the page.
    editable?: boolean;
    // The live, editable preview and the hidden clean copy used for
    // print/export both render a ResumePage — give them different ids so
    // printResume() targets only the clean one (see print.ts).
    rootId?: string;
  } = $props();

  // Created once so guide entry ids stay stable across re-renders.
  const guideData = exampleResume();
  const guide = $derived(guides ? guideData : null);

  const resolved = $derived(resolveTemplate(settings));
  const dims = $derived(PAGE_DIMENSIONS[resolved.settings.pageSize]);
  const fonts = $derived(FONT_PAIRINGS[resolved.settings.fontPairing]);

  const styleVars = $derived(
    [
      `--accent: ${resolved.settings.accentColor}`,
      `--font-heading: ${fonts.heading}`,
      `--font-body: ${fonts.body}`,
      `--space: ${DENSITY_FACTOR[resolved.settings.density]}`,
      `--fs-base: ${DENSITY_FONT_SIZE[resolved.settings.density]}`,
      `width: ${dims.width}`,
      `min-height: ${dims.height}`,
    ].join('; '),
  );

  const pageStyle = $derived(`<${'style'}>@page { size: ${dims.css}; margin: 0; }</${'style'}>`);
  const Template = $derived(resolved.def.component);
</script>

<svelte:head>
  {@html pageStyle}
</svelte:head>

<div id={rootId} class="resume-page" style={styleVars}>
  <Template {data} settings={resolved.settings} {guide} {editable} />
</div>

<style>
  .resume-page {
    background: #fff;
    color: #1a1d23;
    font-family: var(--font-body);
    font-size: var(--fs-base);
    line-height: 1.45;
    box-shadow: 0 10px 40px -12px rgba(0, 0, 0, 0.55);
    box-sizing: border-box;
    /* Long tokens (URLs, emails, dense skill lists) must never escape the
       page box or a sidebar column — inherited by every template. */
    overflow-wrap: break-word;
    /* Buttons default to text-align:center — the gallery renders this page
       inside one, so pin the baseline alignment here. Templates that center
       (Classic/Executive headers) still override explicitly. */
    text-align: left;
  }

  /* ── Baseline resume typography every template inherits ───────────── */
  .resume-page :global(.sec) {
    margin-top: calc(14px * var(--space));
    break-inside: auto;
  }
  .resume-page :global(.sec-title) {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 1.05);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin: 0 0 calc(6px * var(--space));
    break-after: avoid;
  }
  .resume-page :global(.entry) {
    margin-bottom: calc(10px * var(--space));
    break-inside: avoid;
  }
  .resume-page :global(.entry:last-child) {
    margin-bottom: 0;
  }
  .resume-page :global(.entry-head) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }
  .resume-page :global(.entry-role) {
    font-weight: 600;
  }
  .resume-page :global(.entry-org) {
    font-weight: 500;
  }
  .resume-page :global(.entry-meta) {
    font-size: calc(var(--fs-base) * 0.88);
    color: #5b6472;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 2px 10px;
    text-align: right;
  }
  .resume-page :global(.entry-meta .entry-dates) {
    white-space: nowrap;
  }
  .resume-page :global(.entry-tech) {
    color: #5b6472;
    font-size: calc(var(--fs-base) * 0.9);
  }
  .resume-page :global(.entry-body) {
    margin: calc(3px * var(--space)) 0 0;
  }
  .resume-page :global(.bullets) {
    margin: calc(4px * var(--space)) 0 0;
    padding-left: 1.15em;
  }
  .resume-page :global(.bullets li) {
    margin-bottom: calc(2.5px * var(--space));
  }
  .resume-page :global(.contact-line) {
    margin: 0;
    font-size: calc(var(--fs-base) * 0.92);
  }
  .resume-page :global(.contact-sep) {
    color: var(--accent);
    opacity: 0.7;
    margin: 0 2px;
  }
  .resume-page :global(.skill-groups) {
    display: flex;
    flex-direction: column;
    gap: calc(4px * var(--space));
  }
  .resume-page :global(.skill-group) {
    min-width: 0;
  }
  .resume-page :global(.skill-label) {
    font-weight: 600;
    margin-right: 6px;
  }
  .resume-page :global(.skill-label)::after {
    content: ':';
  }
  /* Semantic wrapped list: reads as a clean separated run of items on screen
     and in PDF, parses as a real list for ATS. Never overflows its column. */
  .resume-page :global(.skill-items) {
    display: inline;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .resume-page :global(.skill-item) {
    display: inline;
  }
  .resume-page :global(.skill-items .skill-item:not(:last-child))::after {
    content: ' · ';
    color: #8a93a2;
  }
  .resume-page :global(.cert-list) {
    margin: 0;
    padding-left: 1.15em;
  }
  .resume-page :global(.cert-list li) {
    margin-bottom: calc(2.5px * var(--space));
  }
  .resume-page :global(.lang-list) {
    margin: 0;
  }
  .resume-page :global(.summary) {
    margin: 0;
  }
  .resume-page :global(.entry-dates) {
    font-variant-numeric: tabular-nums;
  }
</style>
