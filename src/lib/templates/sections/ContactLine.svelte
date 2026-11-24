<script lang="ts">
  import type { ResumeData } from '../../types';
  import EditableText from '../EditableText.svelte';

  let {
    basics,
    guide = null,
    separator = ' · ',
    editable = false,
  }: {
    basics: ResumeData['basics'];
    // Example basics shown greyed-out when the user's contact info is empty.
    guide?: ResumeData['basics'] | null;
    separator?: string;
    editable?: boolean;
  } = $props();

  const collect = (b: ResumeData['basics']) =>
    [b.email, b.phone, b.location, b.website, ...b.links.map((l) => l.url || l.label)].filter(
      (p) => p && p.trim(),
    );

  const realParts = $derived(collect(basics));
  const isPh = $derived(realParts.length === 0 && !!guide && !editable);
  const parts = $derived(isPh && guide ? collect(guide) : realParts);
</script>

{#if editable}
  <p class="contact-line">
    <EditableText as="span" value={basics.email} onchange={(v) => (basics.email = v)} editable placeholder="email@example.com" />
    <span class="contact-sep">{separator}</span>
    <EditableText as="span" value={basics.phone} onchange={(v) => (basics.phone = v)} editable placeholder="phone" />
    <span class="contact-sep">{separator}</span>
    <EditableText as="span" value={basics.location} onchange={(v) => (basics.location = v)} editable placeholder="location" />
    <span class="contact-sep">{separator}</span>
    <EditableText as="span" value={basics.website} onchange={(v) => (basics.website = v)} editable placeholder="website" />
  </p>
{:else if parts.length > 0}
  <p class="contact-line" class:ph={isPh}>
    {#each parts as part, i}
      {#if i > 0}<span class="contact-sep">{separator}</span>{/if}<span>{part}</span>
    {/each}
  </p>
{/if}
