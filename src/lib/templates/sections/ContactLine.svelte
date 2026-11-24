<script lang="ts">
  import type { ResumeData } from '../../types';

  let { basics, separator = ' · ' }: { basics: ResumeData['basics']; separator?: string } = $props();

  const parts = $derived(
    [
      basics.email,
      basics.phone,
      basics.location,
      basics.website,
      ...basics.links.map((l) => l.url || l.label),
    ].filter((p) => p && p.trim()),
  );
</script>

{#if parts.length > 0}
  <p class="contact-line">
    {#each parts as part, i}
      {#if i > 0}<span class="contact-sep">{separator}</span>{/if}<span>{part}</span>
    {/each}
  </p>
{/if}
