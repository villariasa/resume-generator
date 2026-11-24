<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import { visibleSections } from './format';
  import SectionRenderer from './SectionRenderer.svelte';
  import ContactLine from './sections/ContactLine.svelte';

  let { data, settings }: { data: ResumeData; settings: TemplateSettings } = $props();
  const sections = $derived(visibleSections(data, settings));
  const photo = $derived(settings.showPhoto ? data.basics.photoDataUrl : undefined);
</script>

<div class="tpl">
  <header class="head">
    {#if photo}<img class="photo" src={photo} alt="" />{/if}
    <h1 class="name">{data.basics.fullName || 'Your Name'}</h1>
    {#if data.basics.headline}<p class="headline">{data.basics.headline}</p>{/if}
    <ContactLine basics={data.basics} />
  </header>

  <SectionRenderer {data} {sections} />
</div>

<style>
  .tpl {
    padding: calc(34px * var(--space)) calc(40px * var(--space));
  }
  .head {
    text-align: center;
    border-bottom: 1px solid #d6dae1;
    padding-bottom: calc(12px * var(--space));
  }
  .photo {
    width: calc(64px * var(--space));
    height: calc(64px * var(--space));
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto calc(8px * var(--space));
    display: block;
    border: 1px solid #d6dae1;
  }
  .name {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.3);
    font-weight: 700;
    letter-spacing: 0.01em;
    margin: 0;
  }
  .headline {
    margin: calc(3px * var(--space)) 0 calc(6px * var(--space));
    font-size: calc(var(--fs-base) * 1.08);
    color: var(--accent);
    font-weight: 500;
  }
  .tpl :global(.sec) {
    border-bottom: 1px solid #eceef2;
    padding-bottom: calc(12px * var(--space));
  }
  .tpl :global(.sec:last-child) {
    border-bottom: none;
  }
</style>
