<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import { visibleSections } from './format';
  import SectionRenderer from './SectionRenderer.svelte';
  import ContactLine from './sections/ContactLine.svelte';
  import EditableText from './EditableText.svelte';

  let { data, settings, guide = null, editable = false }: { data: ResumeData; settings: TemplateSettings; guide?: ResumeData | null; editable?: boolean } = $props();

  const all = $derived(visibleSections(data, settings, !!guide));
  const twoCol = $derived(settings.columns === 2);
  const sidebar = $derived(twoCol ? all.filter((k) => settings.sidebarSections.includes(k)) : []);
  const main = $derived(twoCol ? all.filter((k) => !settings.sidebarSections.includes(k)) : all);
</script>

<div class="tpl" class:two-col={twoCol}>
  {#if twoCol}
    <aside class="side">
      {#if data.basics.photoDataUrl && settings.showPhoto}
        <img class="photo" src={data.basics.photoDataUrl} alt="" />
      {/if}
      <EditableText as="h1" class="name" value={data.basics.fullName} onchange={(v) => (data.basics.fullName = v)} {editable} placeholder="Your Name" />
      {#if data.basics.headline || guide || editable}
        <EditableText as="p" class="headline" value={data.basics.headline} onchange={(v) => (data.basics.headline = v)} {editable} placeholder={guide?.basics.headline ?? 'Headline'} />
      {/if}

      <div class="side-contact">
        <ContactLine basics={data.basics} guide={guide?.basics} {editable} separator=" " />
      </div>

      <SectionRenderer {data} sections={sidebar} {guide} {editable} />
    </aside>
    <div class="main">
      <SectionRenderer {data} sections={main} {guide} {editable} />
    </div>
  {:else}
    <div class="single">
      <header class="single-head">
        <EditableText as="h1" class="name" value={data.basics.fullName} onchange={(v) => (data.basics.fullName = v)} {editable} placeholder="Your Name" />
        {#if data.basics.headline || guide || editable}
          <EditableText as="p" class="headline" value={data.basics.headline} onchange={(v) => (data.basics.headline = v)} {editable} placeholder={guide?.basics.headline ?? 'Headline'} />
        {/if}
        <div class="single-contact">
          <ContactLine basics={data.basics} guide={guide?.basics} {editable} separator="   " />
        </div>
      </header>
      <SectionRenderer {data} sections={main} {guide} {editable} />
    </div>
  {/if}
</div>

<style>
  .tpl.two-col {
    display: grid;
    grid-template-columns: 33% 1fr;
    min-height: inherit;
  }
  .side {
    background: color-mix(in srgb, var(--accent) 8%, #f6f7f9);
    border-right: 1px solid color-mix(in srgb, var(--accent) 18%, #e4e7ec);
    padding: calc(32px * var(--space)) calc(22px * var(--space));
  }
  .main {
    padding: calc(32px * var(--space)) calc(30px * var(--space));
  }
  .single {
    padding: calc(32px * var(--space)) calc(38px * var(--space));
  }
  .single-head {
    border-bottom: 2px solid var(--accent);
    padding-bottom: calc(10px * var(--space));
  }
  .photo {
    width: calc(74px * var(--space));
    height: calc(74px * var(--space));
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: calc(10px * var(--space));
    border: 2px solid var(--accent);
  }
  .tpl :global(.name) {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2);
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }
  .tpl :global(.headline) {
    margin: calc(4px * var(--space)) 0 0;
    color: var(--accent);
    font-weight: 600;
    font-size: calc(var(--fs-base) * 1.02);
  }
  .side-contact {
    margin-top: calc(10px * var(--space));
    font-size: calc(var(--fs-base) * 0.88);
    color: #434a56;
  }
  .side-contact :global(.contact-line) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
  .side-contact :global(.contact-sep) {
    display: none;
  }
  .single-contact :global(.contact-line) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
  }
  .single-contact :global(.contact-sep) {
    display: none;
  }
  .side :global(.sec-title) {
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 30%, #d8dce3);
    padding-bottom: 3px;
  }
  .side :global(.skill-groups) {
    flex-direction: column;
  }
  .side :global(.skill-label) {
    display: block;
    margin-bottom: 1px;
  }
</style>
