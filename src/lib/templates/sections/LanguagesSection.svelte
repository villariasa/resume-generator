<script lang="ts">
  import type { LanguageEntry } from '../../types';
  import SectionHeading from './SectionHeading.svelte';

  let { entries, title = 'Languages' }: { entries: LanguageEntry[]; title?: string } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  <p class="lang-list">
    {#each entries as entry, i (entry.id)}
      {#if i > 0}<span class="skill-sep"> · </span>{/if}
      <span class="skill-item">{entry.name}{entry.level ? ` (${entry.level})` : ''}</span>
    {/each}
  </p>
</section>
