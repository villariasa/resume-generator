<script lang="ts">
  import type { CertEntry } from '../../types';
  import SectionHeading from './SectionHeading.svelte';

  let { entries, title = 'Certifications' }: { entries: CertEntry[]; title?: string } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  <ul class="cert-list">
    {#each entries as entry (entry.id)}
      <li>
        <span class="entry-role">{entry.name}</span>
        {#if entry.issuer}<span class="entry-at"> · </span><span class="entry-org">{entry.issuer}</span>{/if}
        {#if entry.date}<span class="entry-dates"> ({entry.date})</span>{/if}
      </li>
    {/each}
  </ul>
</section>
