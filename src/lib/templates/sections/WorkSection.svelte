<script lang="ts">
  import type { WorkEntry } from '../../types';
  import { formatRange } from '../format';
  import SectionHeading from './SectionHeading.svelte';
  import EditableText from '../EditableText.svelte';
  import EditableBullets from '../EditableBullets.svelte';

  let { entries, title = 'Experience', editable = false }: { entries: WorkEntry[]; title?: string; editable?: boolean } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  {#each entries as entry (entry.id)}
    <div class="entry">
      <div class="entry-head">
        <div>
          <EditableText as="span" class="entry-role" value={entry.role} onchange={(v) => (entry.role = v)} {editable} placeholder="Role" />
          {#if entry.company || editable}
            <span class="entry-at"> · </span>
            <EditableText as="span" class="entry-org" value={entry.company} onchange={(v) => (entry.company = v)} {editable} placeholder="Company" />
          {/if}
        </div>
        <div class="entry-meta">
          {#if editable}
            <EditableText as="span" value={entry.location} onchange={(v) => (entry.location = v)} editable placeholder="Location" />
            <span class="entry-dates">
              <EditableText as="span" value={entry.startDate} onchange={(v) => (entry.startDate = v)} editable placeholder="Start" />
              <span>—</span>
              <EditableText
                as="span"
                value={entry.current ? 'Present' : entry.endDate}
                onchange={(v) => (entry.endDate = v)}
                editable={!entry.current}
                placeholder="End"
              />
            </span>
          {:else}
            {#if entry.location}<span>{entry.location}</span>{/if}
            {#if formatRange(entry.startDate, entry.endDate, entry.current)}
              <span class="entry-dates">{formatRange(entry.startDate, entry.endDate, entry.current)}</span>
            {/if}
          {/if}
        </div>
      </div>
      <EditableBullets bullets={entry.bullets} {editable} />
    </div>
  {/each}
</section>
