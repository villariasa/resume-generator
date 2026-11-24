<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid, move } from '../../utils';
  import Icon from '../../ui/Icon.svelte';
  import DragList from '../DragList.svelte';

  let { data }: { data: ResumeData } = $props();
</script>

<DragList items={data.languages} onreorder={(f, t) => move(data.languages, f, t)}>
  {#snippet children(entry, i)}
    <div class="flex gap-2 mb-2">
      <input class="input" bind:value={entry.name} placeholder="Language — English" aria-label="Language" />
      <input class="input !w-36" bind:value={entry.level} placeholder="Fluent / Native / B2" aria-label="Level" />
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Remove" onclick={() => data.languages.splice(i, 1)}><Icon name="x-mark" size={14} /></button>
    </div>
  {/snippet}
</DragList>
<button type="button" class="btn btn-sm" onclick={() => data.languages.push({ id: uid(), name: '', level: '' })}>
  <Icon name="plus" size={13} /> Add language
</button>
