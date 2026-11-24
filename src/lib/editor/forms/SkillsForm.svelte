<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid, move } from '../../utils';
  import Icon from '../../ui/Icon.svelte';
  import DragList from '../DragList.svelte';

  let { data }: { data: ResumeData } = $props();

  function add() {
    data.skills.push({ id: uid(), label: '', items: [] });
  }
</script>

<DragList items={data.skills} onreorder={(f, t) => move(data.skills, f, t)}>
  {#snippet children(group, i)}
    <div class="flex gap-2 mb-2 items-start">
      <input class="input !w-36 shrink-0" bind:value={group.label} placeholder="Group — Languages" aria-label="Skill group label" />
      <input
        class="input"
        value={group.items.join(', ')}
        oninput={(e) => (group.items = e.currentTarget.value.split(',').map((t) => t.trim()).filter(Boolean))}
        placeholder="TypeScript, PHP, SQL…"
        aria-label="Skills, comma separated"
      />
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Remove group" onclick={() => data.skills.splice(i, 1)}><Icon name="x-mark" size={14} /></button>
    </div>
  {/snippet}
</DragList>
<button type="button" class="btn btn-sm" onclick={add}><Icon name="plus" size={13} /> Add skill group</button>
