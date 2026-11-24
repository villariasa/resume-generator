<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid, move } from '../../utils';
  import Icon from '../../ui/Icon.svelte';
  import DragList from '../DragList.svelte';
  import BulletList from '../BulletList.svelte';

  let { data }: { data: ResumeData } = $props();

  function add() {
    data.work.push({
      id: uid(), company: '', role: '', location: '',
      startDate: '', endDate: '', current: false,
      bullets: [{ id: uid(), text: '' }],
    });
  }
</script>

<DragList items={data.work} onreorder={(f, t) => move(data.work, f, t)}>
  {#snippet children(entry, i)}
    <div class="card !bg-[var(--chrome-surface2)] p-3 mb-3">
      <div class="grid grid-cols-2 gap-2">
        <input class="input" bind:value={entry.role} placeholder="Role — e.g. Full-Stack Developer" aria-label="Role" />
        <input class="input" bind:value={entry.company} placeholder="Company" aria-label="Company" />
        <input class="input" bind:value={entry.location} placeholder="Location" aria-label="Location" />
        <div class="flex gap-2 items-center">
          <input class="input" bind:value={entry.startDate} placeholder="2023" aria-label="Start date" />
          <input class="input" bind:value={entry.endDate} placeholder="2025" disabled={entry.current} aria-label="End date" />
        </div>
      </div>
      <label class="flex items-center gap-2 mt-2 text-xs text-[var(--chrome-muted)]">
        <input type="checkbox" bind:checked={entry.current} /> Current position
      </label>
      <div class="mt-2">
        <BulletList bullets={entry.bullets} />
      </div>
      <button type="button" class="btn btn-ghost btn-sm mt-1 !text-red-400/70 hover:!text-red-400" onclick={() => data.work.splice(i, 1)}>
        Remove entry
      </button>
    </div>
  {/snippet}
</DragList>
<button type="button" class="btn btn-sm" onclick={add}><Icon name="plus" size={13} /> Add experience</button>
