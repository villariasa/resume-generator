<script lang="ts">
  import type { CertEntry } from '../../types';
  import SectionHeading from './SectionHeading.svelte';
  import EditableText from '../EditableText.svelte';

  let { entries, title = 'Certifications', editable = false }: { entries: CertEntry[]; title?: string; editable?: boolean } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  <ul class="cert-list">
    {#each entries as entry (entry.id)}
      <li>
        <EditableText as="span" class="entry-role" value={entry.name} onchange={(v) => (entry.name = v)} {editable} placeholder="Certification name" />
        {#if entry.issuer || editable}
          <span class="entry-at"> · </span>
          <EditableText as="span" class="entry-org" value={entry.issuer} onchange={(v) => (entry.issuer = v)} {editable} placeholder="Issuer" />
        {/if}
        {#if entry.date || editable}
          <span class="entry-dates"> (<EditableText as="span" value={entry.date} onchange={(v) => (entry.date = v)} {editable} placeholder="Year" />)</span>
        {/if}
      </li>
    {/each}
  </ul>
</section>
