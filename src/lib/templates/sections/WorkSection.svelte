<script lang="ts">
  import type { WorkEntry } from '../../types';
  import { formatRange } from '../format';
  import SectionHeading from './SectionHeading.svelte';

  let { entries, title = 'Experience' }: { entries: WorkEntry[]; title?: string } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  {#each entries as entry (entry.id)}
    <div class="entry">
      <div class="entry-head">
        <div>
          <span class="entry-role">{entry.role}</span>
          {#if entry.company}<span class="entry-at"> · </span><span class="entry-org">{entry.company}</span>{/if}
        </div>
        <div class="entry-meta">
          {#if entry.location}<span>{entry.location}</span>{/if}
          {#if formatRange(entry.startDate, entry.endDate, entry.current)}
            <span class="entry-dates">{formatRange(entry.startDate, entry.endDate, entry.current)}</span>
          {/if}
        </div>
      </div>
      {#if entry.bullets.length > 0}
        <ul class="bullets">
          {#each entry.bullets as bullet (bullet.id)}
            {#if bullet.text.trim()}<li>{bullet.text}</li>{/if}
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
</section>
