<script lang="ts">
  import type { ResumeData } from '../../types';

  let {
    basics,
    guide = null,
    separator = ' · ',
  }: {
    basics: ResumeData['basics'];
    // Example basics shown greyed-out when the user's contact info is empty.
    guide?: ResumeData['basics'] | null;
    separator?: string;
  } = $props();

  const collect = (b: ResumeData['basics']) =>
    [b.email, b.phone, b.location, b.website, ...b.links.map((l) => l.url || l.label)].filter(
      (p) => p && p.trim(),
    );

  const realParts = $derived(collect(basics));
  const isPh = $derived(realParts.length === 0 && !!guide);
  const parts = $derived(isPh && guide ? collect(guide) : realParts);
</script>

{#if parts.length > 0}
  <p class="contact-line" class:ph={isPh}>
    {#each parts as part, i}
      {#if i > 0}<span class="contact-sep">{separator}</span>{/if}<span>{part}</span>
    {/each}
  </p>
{/if}
