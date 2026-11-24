<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import { visibleSections } from './format';
  import SectionRenderer from './SectionRenderer.svelte';
  import ContactLine from './sections/ContactLine.svelte';

  let { data, settings }: { data: ResumeData; settings: TemplateSettings } = $props();

  const all = $derived(visibleSections(data, settings));
  const twoCol = $derived(settings.columns === 2);
  const sidebar = $derived(twoCol ? all.filter((k) => settings.sidebarSections.includes(k)) : []);
  const main = $derived(twoCol ? all.filter((k) => !settings.sidebarSections.includes(k)) : all);
</script>

<div class="tpl">
  <header class="band">
    {#if data.basics.photoDataUrl && settings.showPhoto}
      <img class="photo" src={data.basics.photoDataUrl} alt="" />
    {/if}
    <div>
      <h1 class="name">{data.basics.fullName || 'Your Name'}</h1>
      {#if data.basics.headline}<p class="headline">{data.basics.headline}</p>{/if}
      <ContactLine basics={data.basics} />
    </div>
  </header>

  <div class="body" class:two-col={twoCol}>
    <div class="main">
      <SectionRenderer {data} sections={main} />
    </div>
    {#if twoCol}
      <aside class="side">
        <SectionRenderer {data} sections={sidebar} />
      </aside>
    {/if}
  </div>
</div>

<style>
  .band {
    background: var(--accent);
    color: #fff;
    padding: calc(28px * var(--space)) calc(36px * var(--space));
    display: flex;
    align-items: center;
    gap: calc(20px * var(--space));
  }
  .photo {
    width: calc(80px * var(--space));
    height: calc(80px * var(--space));
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.55);
    flex-shrink: 0;
  }
  .name {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.4);
    font-weight: 700;
    line-height: 1.05;
    margin: 0;
    letter-spacing: -0.01em;
  }
  .headline {
    margin: calc(4px * var(--space)) 0 calc(6px * var(--space));
    font-size: calc(var(--fs-base) * 1.1);
    opacity: 0.92;
    font-weight: 500;
  }
  .band :global(.contact-line) {
    color: rgba(255, 255, 255, 0.88);
  }
  .band :global(.contact-sep) {
    color: rgba(255, 255, 255, 0.55);
  }
  .body {
    padding: calc(24px * var(--space)) calc(36px * var(--space)) calc(32px * var(--space));
  }
  .body.two-col {
    display: grid;
    grid-template-columns: 1fr 32%;
    gap: calc(28px * var(--space));
  }
  .tpl :global(.sec-title) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tpl :global(.sec-title)::before {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }
  .side :global(.sec) {
    background: color-mix(in srgb, var(--accent) 6%, #f8f8fa);
    border-radius: 8px;
    padding: calc(12px * var(--space)) calc(14px * var(--space));
  }
  .side :global(.sec-title)::before {
    display: none;
  }
  .tpl :global(.bullets li)::marker {
    color: var(--accent);
  }
</style>
