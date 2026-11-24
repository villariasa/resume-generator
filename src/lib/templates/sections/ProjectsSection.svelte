<script lang="ts">
  import type { ProjectEntry } from '../../types';
  import SectionHeading from './SectionHeading.svelte';
  import EditableText from '../EditableText.svelte';
  import EditableBullets from '../EditableBullets.svelte';

  let { entries, title = 'Projects', editable = false }: { entries: ProjectEntry[]; title?: string; editable?: boolean } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  {#each entries as entry (entry.id)}
    <div class="entry">
      <div class="entry-head">
        <div>
          <EditableText as="span" class="entry-role" value={entry.name} onchange={(v) => (entry.name = v)} {editable} placeholder="Project name" />
          {#if entry.tech.length > 0}<span class="entry-tech"> — {entry.tech.join(', ')}</span>{/if}
        </div>
        {#if entry.url || editable}
          <div class="entry-meta">
            <EditableText as="span" value={entry.url} onchange={(v) => (entry.url = v)} {editable} placeholder="URL" />
          </div>
        {/if}
      </div>
      {#if entry.description.trim() || editable}
        <EditableText as="p" class="entry-body" value={entry.description} onchange={(v) => (entry.description = v)} {editable} placeholder="One or two lines on what it is and why it matters." />
      {/if}
      <EditableBullets bullets={entry.bullets} {editable} />
    </div>
  {/each}
</section>
