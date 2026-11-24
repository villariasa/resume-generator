<script lang="ts">
  import type { EduEntry } from '../../types';
  import { formatRange } from '../format';
  import SectionHeading from './SectionHeading.svelte';
  import EditableText from '../EditableText.svelte';

  let { entries, title = 'Education', editable = false }: { entries: EduEntry[]; title?: string; editable?: boolean } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  {#each entries as entry (entry.id)}
    <div class="entry">
      <div class="entry-head">
        <div>
          <EditableText as="span" class="entry-role" value={entry.degree} onchange={(v) => (entry.degree = v)} {editable} placeholder="Degree" />
          {#if entry.area || editable}
            <EditableText as="span" value={entry.area} onchange={(v) => (entry.area = v)} {editable} placeholder=", area" />
          {/if}
          {#if entry.institution || editable}
            <span class="entry-at"> · </span>
            <EditableText as="span" class="entry-org" value={entry.institution} onchange={(v) => (entry.institution = v)} {editable} placeholder="Institution" />
          {/if}
        </div>
        <div class="entry-meta">
          {#if editable}
            <span class="entry-dates">
              <EditableText as="span" value={entry.startDate} onchange={(v) => (entry.startDate = v)} editable placeholder="Start" />
              <span>—</span>
              <EditableText as="span" value={entry.endDate} onchange={(v) => (entry.endDate = v)} editable placeholder="End" />
            </span>
          {:else if formatRange(entry.startDate, entry.endDate, false)}
            <span class="entry-dates">{formatRange(entry.startDate, entry.endDate, false)}</span>
          {/if}
        </div>
      </div>
      {#if entry.note.trim() || editable}
        <EditableText as="p" class="entry-body" value={entry.note} onchange={(v) => (entry.note = v)} {editable} placeholder="Note (honors, relevant coursework…)" />
      {/if}
    </div>
  {/each}
</section>
