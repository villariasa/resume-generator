<script lang="ts" generics="T extends { id: string }">
  import type { Snippet } from 'svelte';

  let {
    items,
    onreorder,
    children,
  }: {
    items: T[];
    onreorder: (from: number, to: number) => void;
    children: Snippet<[T, number]>;
  } = $props();

  let dragIndex = $state(-1);
  let insertIndex = $state(-1);
  let container: HTMLDivElement;

  function startDrag(e: PointerEvent, index: number) {
    e.preventDefault();
    dragIndex = index;
    insertIndex = index;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  }

  function onMove(e: PointerEvent) {
    const rows = Array.from(container.querySelectorAll<HTMLElement>(':scope > [data-dragrow]'));
    let target = rows.length;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) {
        target = i;
        break;
      }
    }
    insertIndex = target;
  }

  function onUp() {
    window.removeEventListener('pointermove', onMove);
    if (dragIndex >= 0 && insertIndex >= 0) {
      // insertIndex is a gap position; convert to destination index
      const to = insertIndex > dragIndex ? insertIndex - 1 : insertIndex;
      if (to !== dragIndex) onreorder(dragIndex, to);
    }
    dragIndex = -1;
    insertIndex = -1;
  }

  function nudge(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    onreorder(index, to);
  }
</script>

<div bind:this={container} class="flex flex-col">
  {#each items as item, i (item.id)}
    {#if dragIndex >= 0 && insertIndex === i}
      <div class="h-0.5 rounded bg-indigo-500 my-0.5"></div>
    {/if}
    <div
      data-dragrow
      class="group/drag flex items-start gap-1.5 {dragIndex === i ? 'opacity-40' : ''}"
    >
      <div class="flex flex-col items-center pt-2 shrink-0">
        <button
          type="button"
          class="cursor-grab touch-none text-[var(--chrome-faint)] hover:text-[var(--chrome-muted)] px-0.5"
          aria-label="Drag to reorder"
          onpointerdown={(e) => startDrag(e, i)}
          onkeydown={(e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); nudge(i, -1); }
            if (e.key === 'ArrowDown') { e.preventDefault(); nudge(i, 1); }
          }}
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden="true">
            <circle cx="2.5" cy="2.5" r="1.3" /><circle cx="7.5" cy="2.5" r="1.3" />
            <circle cx="2.5" cy="7" r="1.3" /><circle cx="7.5" cy="7" r="1.3" />
            <circle cx="2.5" cy="11.5" r="1.3" /><circle cx="7.5" cy="11.5" r="1.3" />
          </svg>
        </button>
      </div>
      <div class="min-w-0 flex-1">
        {@render children(item, i)}
      </div>
    </div>
  {/each}
  {#if dragIndex >= 0 && insertIndex === items.length}
    <div class="h-0.5 rounded bg-indigo-500 my-0.5"></div>
  {/if}
</div>
