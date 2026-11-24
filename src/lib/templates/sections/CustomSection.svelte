<script lang="ts">
  import type { CustomSection } from '../../types';
  import SectionHeading from './SectionHeading.svelte';

  let { section }: { section: CustomSection } = $props();
</script>

<section class="sec">
  <SectionHeading title={section.title || 'Section'} />
  {#each section.entries as entry (entry.id)}
    <div class="entry">
      {#if entry.heading || entry.sub}
        <div class="entry-head">
          <div><span class="entry-role">{entry.heading}</span></div>
          {#if entry.sub}<div class="entry-meta"><span>{entry.sub}</span></div>{/if}
        </div>
      {/if}
      {#if entry.body.trim()}<p class="entry-body">{entry.body}</p>{/if}
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
