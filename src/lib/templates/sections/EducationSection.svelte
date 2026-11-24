<script lang="ts">
  import type { EduEntry } from '../../types';
  import { formatRange } from '../format';
  import SectionHeading from './SectionHeading.svelte';

  let { entries, title = 'Education' }: { entries: EduEntry[]; title?: string } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  {#each entries as entry (entry.id)}
    <div class="entry">
      <div class="entry-head">
        <div>
          <span class="entry-role">{entry.degree}{entry.area ? `, ${entry.area}` : ''}</span>
          {#if entry.institution}<span class="entry-at"> · </span><span class="entry-org">{entry.institution}</span>{/if}
        </div>
        {#if formatRange(entry.startDate, entry.endDate, false)}
          <div class="entry-meta"><span class="entry-dates">{formatRange(entry.startDate, entry.endDate, false)}</span></div>
        {/if}
      </div>
      {#if entry.note.trim()}<p class="entry-body">{entry.note}</p>{/if}
    </div>
  {/each}
</section>
