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
    <div class="min-w-0">
      <EditableText as="h1" class="name" value={data.basics.fullName} onchange={(v) => (data.basics.fullName = v)} {editable} placeholder="Your Name" />
      {#if data.basics.headline || guide || editable}<EditableText as="p" class="headline" value={data.basics.headline} onchange={(v) => (data.basics.headline = v)} {editable} placeholder={guide?.basics.headline ?? 'Headline'} />{/if}
    </div>
  </header>

  <ContactLine basics={data.basics} guide={guide?.basics} {editable} />

  <SectionRenderer {data} {sections} {guide} {editable} />
</div>

<style>
  .tpl {
    padding: calc(32px * var(--space)) calc(40px * var(--space));
  }
  .head {
    display: flex;
    align-items: center;
    gap: calc(14px * var(--space));
  }
  .photo {
    width: calc(60px * var(--space));
    height: calc(60px * var(--space));
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .tpl :global(.name) {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.2);
    font-weight: 700;
    margin: 0;
  }
  .tpl :global(.headline) {
    margin: calc(2px * var(--space)) 0 0;
    color: var(--accent);
    font-weight: 600;
  }
  .tpl :global(.sec-title) {
    letter-spacing: 0.14em;
  }
  /* The skills-first hybrid: a tinted band right under the header/contact so
     the stack reads in two seconds, before a recruiter scrolls to history. */
  .tpl :global(.skill-groups) {
    background: color-mix(in srgb, var(--accent) 7%, #f7f8fa);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, #e4e7ec);
    border-radius: 8px;
    padding: calc(10px * var(--space)) calc(14px * var(--space));
    gap: calc(6px * var(--space));
  }
  .tpl :global(.skill-group) {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 0;
  }
</style>
