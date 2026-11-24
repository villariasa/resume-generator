<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid, move } from '../../utils';
  import DragList from '../DragList.svelte';

  let { data }: { data: ResumeData } = $props();

  function add() {
    data.education.push({ id: uid(), institution: '', degree: '', area: '', startDate: '', endDate: '', note: '' });
  }
</script>

<DragList items={data.education} onreorder={(f, t) => move(data.education, f, t)}>
  {#snippet children(entry, i)}
    <div class="card !bg-[#12151b] p-3 mb-3">
      <div class="grid grid-cols-2 gap-2">
        <input class="input" bind:value={entry.degree} placeholder="Degree — B.S. Information Systems" aria-label="Degree" />
        <input class="input" bind:value={entry.institution} placeholder="Institution" aria-label="Institution" />
        <input class="input" bind:value={entry.area} placeholder="Area / major (optional)" aria-label="Area" />
        <div class="flex gap-2">
          <input class="input" bind:value={entry.startDate} placeholder="2022" aria-label="Start date" />
          <input class="input" bind:value={entry.endDate} placeholder="2026" aria-label="End date" />
        </div>
      </div>
      <input class="input mt-2" bind:value={entry.note} placeholder="Note (honors, relevant coursework…)" aria-label="Note" />
      <button type="button" class="btn btn-ghost btn-sm mt-1 !text-red-400/70 hover:!text-red-400" onclick={() => data.education.splice(i, 1)}>
        Remove entry
      </button>
    </div>
  {/snippet}
</DragList>
<button type="button" class="btn btn-sm" onclick={add}>+ Add education</button>
