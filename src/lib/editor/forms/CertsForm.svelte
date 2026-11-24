<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid, move } from '../../utils';
  import DragList from '../DragList.svelte';

  let { data }: { data: ResumeData } = $props();
</script>

<DragList items={data.certifications} onreorder={(f, t) => move(data.certifications, f, t)}>
  {#snippet children(entry, i)}
    <div class="flex gap-2 mb-2">
      <input class="input" bind:value={entry.name} placeholder="Certification name" aria-label="Certification" />
      <input class="input !w-40" bind:value={entry.issuer} placeholder="Issuer" aria-label="Issuer" />
      <input class="input !w-20" bind:value={entry.date} placeholder="2024" aria-label="Date" />
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Remove" onclick={() => data.certifications.splice(i, 1)}>✕</button>
    </div>
  {/snippet}
</DragList>
<button type="button" class="btn btn-sm" onclick={() => data.certifications.push({ id: uid(), name: '', issuer: '', date: '' })}>
  + Add certification
</button>
