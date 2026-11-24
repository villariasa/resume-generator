<script lang="ts">
  import type { ProjectEntry } from '../../types';
  import SectionHeading from './SectionHeading.svelte';

  let { entries, title = 'Projects' }: { entries: ProjectEntry[]; title?: string } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  {#each entries as entry (entry.id)}
    <div class="entry">
      <div class="entry-head">
        <div>
          <span class="entry-role">{entry.name}</span>
          {#if entry.tech.length > 0}<span class="entry-tech"> — {entry.tech.join(', ')}</span>{/if}
        </div>
        {#if entry.url}<div class="entry-meta"><span>{entry.url}</span></div>{/if}
      </div>
      {#if entry.description.trim()}<p class="entry-body">{entry.description}</p>{/if}
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
