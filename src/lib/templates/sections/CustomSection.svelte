<script lang="ts">
  import type { CustomSection } from '../../types';
  import SectionHeading from './SectionHeading.svelte';
  import EditableText from '../EditableText.svelte';
  import EditableBullets from '../EditableBullets.svelte';

  let { section, editable = false }: { section: CustomSection; editable?: boolean } = $props();
</script>

<section class="sec">
  <SectionHeading title={section.title || 'Section'} />
  {#each section.entries as entry (entry.id)}
    <div class="entry">
      {#if entry.heading || entry.sub || editable}
        <div class="entry-head">
          <div><EditableText as="span" class="entry-role" value={entry.heading} onchange={(v) => (entry.heading = v)} {editable} placeholder="Heading" /></div>
          {#if entry.sub || editable}
            <div class="entry-meta"><EditableText as="span" value={entry.sub} onchange={(v) => (entry.sub = v)} {editable} placeholder="Subheading / date" /></div>
          {/if}
        </div>
      {/if}
      {#if entry.body.trim() || editable}
        <EditableText as="p" class="entry-body" value={entry.body} onchange={(v) => (entry.body = v)} {editable} placeholder="Body text" />
      {/if}
      <EditableBullets bullets={entry.bullets} {editable} />
    </div>
  {/each}
</section>
