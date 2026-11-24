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
      <div>
        <EditableText as="h1" class="name" value={data.basics.fullName} onchange={(v) => (data.basics.fullName = v)} {editable} placeholder="Your Name" />
        {#if data.basics.headline || guide || editable}<EditableText as="p" class="headline" value={data.basics.headline} onchange={(v) => (data.basics.headline = v)} {editable} placeholder={guide?.basics.headline ?? 'Headline'} />{/if}
      </div>
    </div>
    <ContactLine basics={data.basics} guide={guide?.basics} {editable} separator=" · " />
  </header>

  <SectionRenderer {data} {sections} {guide} {editable} />
</div>

<style>
  .tpl {
    padding: calc(36px * var(--space)) calc(42px * var(--space));
  }
  .head {
    border-bottom: 1.5px solid #1a1d23;
    padding-bottom: calc(12px * var(--space));
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 18px;
    flex-wrap: wrap;
  }
  .head-left {
    display: flex;
    align-items: center;
    gap: calc(14px * var(--space));
  }
  .photo {
    width: calc(58px * var(--space));
    height: calc(58px * var(--space));
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid #c9ced6;
    flex-shrink: 0;
  }
  .tpl :global(.name) {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2.2);
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.01em;
  }
  .tpl :global(.headline) {
    margin: calc(2px * var(--space)) 0 0;
    color: var(--accent);
    font-weight: 600;
  }
  .head :global(.contact-line) {
    text-align: right;
    max-width: 40%;
    color: #434a56;
  }

  /* Consulting/banking CV layout: dates & location in a left gutter,
     content to the right. Pure CSS re-ordering of the shared markup. */
  .tpl :global(.sec-title) {
    color: #1a1d23;
    border-bottom: 1px solid #c9ced6;
    padding-bottom: calc(3px * var(--space));
    letter-spacing: 0.16em;
  }
  .tpl :global(.entry-head) {
    display: grid;
    grid-template-columns: calc(108px * var(--space)) 1fr;
    gap: 2px 16px;
    align-items: baseline;
  }
  .tpl :global(.entry-head > div:first-child) {
    grid-column: 2;
    grid-row: 1;
  }
  .tpl :global(.entry-meta) {
    grid-column: 1;
    grid-row: 1;
    flex-direction: column;
    gap: 1px;
    white-space: normal;
    font-size: calc(var(--fs-base) * 0.84);
  }
  .tpl :global(.entry-body),
  .tpl :global(.bullets) {
    margin-left: calc(108px * var(--space) + 16px);
  }
  .tpl :global(.entry-dates) {
    font-weight: 600;
    color: #1a1d23;
  }

  /* Non-entry sections (skills, languages, certs) also respect the gutter */
  .tpl :global(.skill-groups),
  .tpl :global(.lang-list),
  .tpl :global(.cert-list),
  .tpl :global(.summary) {
    margin-left: calc(108px * var(--space) + 16px);
  }
</style>
