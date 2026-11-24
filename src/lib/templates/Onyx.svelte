<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import { visibleSections } from './format';
  import SectionRenderer from './SectionRenderer.svelte';
  import EditableText from './EditableText.svelte';
  import ContactLine from './sections/ContactLine.svelte';

  let { data, settings, guide = null, editable = false }: { data: ResumeData; settings: TemplateSettings; guide?: ResumeData | null; editable?: boolean } = $props();
  const sections = $derived(visibleSections(data, settings, !!guide));
</script>

<div class="tpl">
  <header class="band">
    <div class="band-inner">
      <div>
        <EditableText as="h1" class="name" value={data.basics.fullName} onchange={(v) => (data.basics.fullName = v)} {editable} placeholder="Your Name" />
        {#if data.basics.headline || guide || editable}<EditableText as="p" class="headline" value={data.basics.headline} onchange={(v) => (data.basics.headline = v)} {editable} placeholder={guide?.basics.headline ?? 'Headline'} />{/if}
      </div>
      {#if data.basics.photoDataUrl && settings.showPhoto}
        <img class="photo" src={data.basics.photoDataUrl} alt="" />
      {/if}
    </div>
    <div class="band-contact">
      <ContactLine basics={data.basics} guide={guide?.basics} {editable} separator="    " />
    </div>
  </header>

  <div class="body">
    <SectionRenderer {data} {sections} {guide} {editable} />
  </div>
</div>

<style>
  .band {
    background: #1b1f26;
    color: #fff;
    padding: calc(30px * var(--space)) calc(44px * var(--space)) calc(18px * var(--space));
  }
  .band-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .tpl :global(.name) {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.4);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0;
    line-height: 1.1;
  }
  .tpl :global(.headline) {
    margin: calc(5px * var(--space)) 0 0;
    color: color-mix(in srgb, var(--accent) 60%, #ffffff);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-size: calc(var(--fs-base) * 0.95);
  }
  .photo {
    width: calc(70px * var(--space));
    height: calc(70px * var(--space));
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.35);
    flex-shrink: 0;
  }
  .band-contact {
    margin-top: calc(14px * var(--space));
    border-top: 1px solid rgba(255, 255, 255, 0.22);
    padding-top: calc(9px * var(--space));
  }
  .band :global(.contact-line) {
    color: rgba(255, 255, 255, 0.85);
    display: flex;
    flex-wrap: wrap;
    gap: 4px 22px;
  }
  .band :global(.contact-sep) {
    display: none;
  }

  .body {
    padding: calc(22px * var(--space)) calc(44px * var(--space)) calc(34px * var(--space));
  }
  .tpl :global(.sec-title) {
    color: #1a1d23;
    border-left: 3px solid var(--accent);
    padding-left: 10px;
    letter-spacing: 0.18em;
  }
  .tpl :global(.entry-role) {
    font-family: var(--font-heading);
  }
  .tpl :global(.entry-dates) {
    font-weight: 600;
  }
</style>
