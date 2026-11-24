<script lang="ts">
  import type { LanguageEntry } from '../../types';
  import SectionHeading from './SectionHeading.svelte';
  import EditableText from '../EditableText.svelte';

  let { entries, title = 'Languages', editable = false }: { entries: LanguageEntry[]; title?: string; editable?: boolean } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  <p class="lang-list">
    {#each entries as entry, i (entry.id)}
      {#if i > 0}<span class="skill-sep"> · </span>{/if}
      <EditableText as="span" class="skill-item" value={entry.name} onchange={(v) => (entry.name = v)} {editable} placeholder="Language" />{#if entry.level || editable}
        (<EditableText as="span" value={entry.level} onchange={(v) => (entry.level = v)} {editable} placeholder="Level" />)
      {/if}
    {/each}
  </p>
</section>
