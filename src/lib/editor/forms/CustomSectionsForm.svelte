<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid, move } from '../../utils';
  import DragList from '../DragList.svelte';
  import BulletList from '../BulletList.svelte';

  let { data }: { data: ResumeData } = $props();

  function addSection() {
    data.customSections.push({
      id: uid(),
      title: 'New section',
      entries: [{ id: uid(), heading: '', sub: '', body: '', bullets: [] }],
    });
  }
</script>

{#each data.customSections as section, si (section.id)}
  <div class="card !bg-[var(--chrome-surface2)] p-3 mb-3">
    <div class="flex gap-2 items-center">
      <input class="input font-semibold" bind:value={section.title} placeholder="Section title — Awards, Volunteering…" aria-label="Section title" />
      <button type="button" class="btn btn-ghost btn-sm !text-red-400/70 hover:!text-red-400" onclick={() => data.customSections.splice(si, 1)}>
        Remove
      </button>
    </div>
    <div class="mt-2">
      <DragList items={section.entries} onreorder={(f, t) => move(section.entries, f, t)}>
        {#snippet children(entry, ei)}
          <div class="border border-[var(--chrome-border)] rounded-lg p-2.5 mb-2">
            <div class="grid grid-cols-2 gap-2">
              <input class="input" bind:value={entry.heading} placeholder="Heading" aria-label="Entry heading" />
              <input class="input" bind:value={entry.sub} placeholder="Subheading / date" aria-label="Entry subheading" />
            </div>
            <textarea class="input mt-2" bind:value={entry.body} placeholder="Body text (optional)" aria-label="Entry body"></textarea>
            <div class="mt-2"><BulletList bullets={entry.bullets} /></div>
            <button type="button" class="btn btn-ghost btn-sm mt-1" onclick={() => section.entries.splice(ei, 1)}>Remove entry</button>
          </div>
        {/snippet}
      </DragList>
      <button type="button" class="btn btn-ghost btn-sm" onclick={() => section.entries.push({ id: uid(), heading: '', sub: '', body: '', bullets: [] })}>
        + Add entry
      </button>
    </div>
  </div>
{/each}
<button type="button" class="btn btn-sm" onclick={addSection}>+ Add custom section</button>
