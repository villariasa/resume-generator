<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import { visibleSections } from './format';
  import SectionRenderer from './SectionRenderer.svelte';

  let { data, settings }: { data: ResumeData; settings: TemplateSettings } = $props();

  const all = $derived(visibleSections(data, settings));
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
      <h1 class="name">{data.basics.fullName || 'Your Name'}</h1>
      {#if data.basics.headline}<p class="headline">{data.basics.headline}</p>{/if}

      <div class="side-contact">
        {#each [data.basics.email, data.basics.phone, data.basics.location, data.basics.website, ...data.basics.links.map((l) => l.url || l.label)].filter((p) => p && p.trim()) as part}
          <p class="side-contact-line">{part}</p>
        {/each}
      </div>

      <SectionRenderer {data} sections={sidebar} />
    </aside>
    <div class="main">
      <SectionRenderer {data} sections={main} />
    </div>
  {:else}
    <div class="single">
      <header class="single-head">
        <h1 class="name">{data.basics.fullName || 'Your Name'}</h1>
        {#if data.basics.headline}<p class="headline">{data.basics.headline}</p>{/if}
        <div class="side-contact single-contact">
          {#each [data.basics.email, data.basics.phone, data.basics.location, data.basics.website].filter((p) => p && p.trim()) as part}
            <span class="side-contact-line">{part}</span>
          {/each}
        </div>
      </header>
      <SectionRenderer {data} sections={main} />
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
  .name {
    font-family: var(--font-heading);
    font-size: calc(var(--fs-base) * 2);
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }
  .headline {
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
  .side-contact-line {
    margin: 0 0 3px;
    overflow-wrap: anywhere;
  }
  .single-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
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
