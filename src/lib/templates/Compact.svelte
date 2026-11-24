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
    <div class="head-left">
      {#if photo}<img class="photo" src={photo} alt="" />{/if}
      <EditableText as="h1" class="name" value={data.basics.fullName} onchange={(v) => (data.basics.fullName = v)} {editable} placeholder="Your Name" />
    </div>
    <div class="head-right">
      {#if data.basics.headline || guide || editable}<EditableText as="p" class="headline" value={data.basics.headline} onchange={(v) => (data.basics.headline = v)} {editable} placeholder={guide?.basics.headline ?? 'Headline'} />{/if}
      <ContactLine basics={data.basics} guide={guide?.basics} {editable} separator=" | " />
    </div>
  </header>

  <SectionRenderer {data} {sections} {guide} {editable} />
</div>

<style>
  .tpl {
    padding: calc(26px * var(--space)) calc(30px * var(--space));
    line-height: 1.32;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    border-bottom: 2.5px solid var(--accent);
    padding-bottom: calc(8px * var(--space));
    flex-wrap: wrap;
  }
  .head-left {
    display: flex;
    align-items: center;
    gap: calc(10px * var(--space));
  }
  .photo {
    width: calc(44px * var(--space));
    height: calc(44px * var(--space));
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid var(--accent);
    flex-shrink: 0;
  }
  .tpl :global(.name) {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 1.9);
    font-weight: 700;
    margin: 0;
    white-space: nowrap;
  }
  .head-right {
    text-align: right;
  }
  .tpl :global(.headline) {
    margin: 0 0 2px;
    font-weight: 600;
    color: var(--accent);
  }
  .tpl :global(.sec) {
    margin-top: calc(10px * var(--space));
  }
  .tpl :global(.sec-title) {
    font-size: calc(var(--fs-base) * 0.95);
    margin-bottom: calc(4px * var(--space));
  }
  .tpl :global(.entry) {
    margin-bottom: calc(7px * var(--space));
  }
  .tpl :global(.bullets) {
    margin-top: calc(2px * var(--space));
  }
  .tpl :global(.skill-groups) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(3px * var(--space)) 18px;
  }
</style>
