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
    <div class="head-left">
      {#if photo}<img class="photo" src={photo} alt="" />{/if}
      <div>
        <h1 class="name">{data.basics.fullName || 'Your Name'}</h1>
        {#if data.basics.headline}<p class="headline">{data.basics.headline}</p>{/if}
      </div>
    </div>
    <div class="head-contact">
      <ContactLine basics={data.basics} separator="  " />
    </div>
  </header>

  <SectionRenderer {data} {sections} />
</div>

<style>
  .tpl {
    padding: calc(40px * var(--space)) calc(44px * var(--space));
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    border-bottom: 2px solid #1a1d23;
    padding-bottom: calc(14px * var(--space));
  }
  .head-left {
    display: flex;
    align-items: flex-end;
    gap: calc(16px * var(--space));
  }
  .photo {
    width: calc(62px * var(--space));
    height: calc(62px * var(--space));
    border-radius: 2px;
    object-fit: cover;
    filter: grayscale(0.25);
    border: 1px solid #1a1d23;
    flex-shrink: 0;
  }
  .name {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.6);
    font-weight: 600;
    line-height: 1.05;
    margin: 0;
    letter-spacing: -0.01em;
  }
  .headline {
    margin: calc(4px * var(--space)) 0 0;
    font-style: italic;
    color: #434a56;
    font-size: calc(var(--fs-base) * 1.05);
  }
  .head-contact {
    text-align: right;
    max-width: 38%;
  }
  .head-contact :global(.contact-line) {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
  .head-contact :global(.contact-sep) {
    display: none;
  }
  .tpl :global(.sec-title) {
    font-family: var(--font-heading);
    font-variant: small-caps;
    text-transform: lowercase;
    letter-spacing: 0.22em;
    font-size: calc(var(--fs-base) * 1.02);
    color: #1a1d23;
    border-bottom: 1px solid #d6dae1;
    padding-bottom: calc(3px * var(--space));
  }
  .tpl :global(.entry-role) {
    font-family: var(--font-heading);
  }
  .tpl :global(.bullets li)::marker {
    color: var(--accent);
  }
</style>
