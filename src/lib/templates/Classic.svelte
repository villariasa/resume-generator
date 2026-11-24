<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import { visibleSections } from './format';
  import SectionRenderer from './SectionRenderer.svelte';
  import EditableText from './EditableText.svelte';
  import ContactLine from './sections/ContactLine.svelte';

  let { data, settings, guide = null, editable = false }: { data: ResumeData; settings: TemplateSettings; guide?: ResumeData | null; editable?: boolean } = $props();
  const sections = $derived(visibleSections(data, settings, !!guide));
  const photo = $derived(settings.showPhoto ? data.basics.photoDataUrl : undefined);
</script>

<div class="tpl">
  <header class="head">
    {#if photo}<img class="photo" src={photo} alt="" />{/if}
    <EditableText as="h1" class="name" value={data.basics.fullName} onchange={(v) => (data.basics.fullName = v)} {editable} placeholder="Your Name" />
    {#if data.basics.headline || guide || editable}<EditableText as="p" class="headline" value={data.basics.headline} onchange={(v) => (data.basics.headline = v)} {editable} placeholder={guide?.basics.headline ?? 'Headline'} />{/if}
    <ContactLine basics={data.basics} guide={guide?.basics} {editable} />
  </header>

  <SectionRenderer {data} {sections} {guide} {editable} />
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
  .tpl :global(.name) {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.3);
    font-weight: 700;
    letter-spacing: 0.01em;
    margin: 0;
  }
  .tpl :global(.headline) {
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
