<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid, move } from '../../utils';
  import DragList from '../DragList.svelte';
  import BulletList from '../BulletList.svelte';

  let { data }: { data: ResumeData } = $props();

  function add() {
    data.projects.push({ id: uid(), name: '', url: '', description: '', bullets: [], tech: [] });
  }
</script>

<DragList items={data.projects} onreorder={(f, t) => move(data.projects, f, t)}>
  {#snippet children(entry, i)}
    <div class="card !bg-[#12151b] p-3 mb-3">
      <div class="grid grid-cols-2 gap-2">
        <input class="input" bind:value={entry.name} placeholder="Project name" aria-label="Project name" />
        <input class="input" bind:value={entry.url} placeholder="URL (optional)" aria-label="Project URL" />
      </div>
      <textarea class="input mt-2" bind:value={entry.description} placeholder="One or two lines on what it is and why it matters." aria-label="Project description"></textarea>
      <input
        class="input mt-2"
        value={entry.tech.join(', ')}
        oninput={(e) => (entry.tech = e.currentTarget.value.split(',').map((t) => t.trim()).filter(Boolean))}
        placeholder="Tech, comma separated — Svelte, FastAPI, SQLite"
        aria-label="Technologies"
      />
      <div class="mt-2">
        <BulletList bullets={entry.bullets} />
      </div>
      <button type="button" class="btn btn-ghost btn-sm mt-1 !text-red-400/70 hover:!text-red-400" onclick={() => data.projects.splice(i, 1)}>
        Remove project
      </button>
    </div>
  {/snippet}
</DragList>
<button type="button" class="btn btn-sm" onclick={add}>+ Add project</button>
