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
    <div class="rule-double"></div>
    <ContactLine basics={data.basics} separator="   |   " />
  </header>

  <SectionRenderer {data} {sections} />
</div>

<style>
  .tpl {
    padding: calc(38px * var(--space)) calc(46px * var(--space));
  }
  .head {
    text-align: center;
  }
  .photo {
    width: calc(66px * var(--space));
    height: calc(66px * var(--space));
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto calc(10px * var(--space));
    display: block;
    border: 1px solid #1a1d23;
    padding: 2px;
  }
  .name {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.5);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0;
  }
  .headline {
    margin: calc(5px * var(--space)) 0 0;
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 1.05);
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #434a56;
  }
  .rule-double {
    border-top: 1px solid #1a1d23;
    border-bottom: 1px solid #1a1d23;
    height: 4px;
    margin: calc(12px * var(--space)) auto calc(10px * var(--space));
  }
  .head :global(.contact-line) {
    color: #434a56;
  }
  .head :global(.contact-sep) {
    color: #9aa1ad;
  }

  /* Centered section titles flanked by hairlines — classic executive style */
  .tpl :global(.sec-title) {
    display: flex;
    align-items: center;
    gap: 14px;
    justify-content: center;
    text-align: center;
    color: #1a1d23;
    letter-spacing: 0.24em;
    font-weight: 600;
  }
  .tpl :global(.sec-title)::before,
  .tpl :global(.sec-title)::after {
    content: '';
    flex: 1;
    border-top: 1px solid #c9ced6;
  }
  .tpl :global(.entry-role) {
    font-family: var(--font-heading);
  }
  .tpl :global(.bullets li)::marker {
    content: '—  ';
    color: #6b7280;
  }
  .tpl :global(.summary) {
    text-align: center;
    max-width: 92%;
    margin: 0 auto;
  }
</style>
