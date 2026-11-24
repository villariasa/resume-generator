<script lang="ts">
  import type { Bullet } from '../types';
  import { uid, move } from '../utils';
  import DragList from './DragList.svelte';
  import Icon from '../ui/Icon.svelte';

  let { bullets }: { bullets: Bullet[] } = $props();

  function addAfter(index: number) {
    bullets.splice(index + 1, 0, { id: uid(), text: '' });
    focusBullet(index + 1);
  }

  function remove(index: number) {
    bullets.splice(index, 1);
    if (index > 0) focusBullet(index - 1);
  }

  let rootEl: HTMLDivElement;
  function focusBullet(index: number) {
    requestAnimationFrame(() => {
      rootEl.querySelectorAll<HTMLInputElement>('input[data-bullet]')[index]?.focus();
    });
  }
</script>

<div bind:this={rootEl}>
  <DragList items={bullets} onreorder={(from, to) => move(bullets, from, to)}>
    {#snippet children(bullet, i)}
      <div class="flex items-center gap-1.5 mb-1.5">
        <input
          data-bullet
          class="input"
          placeholder="Shipped X, which led to Y…"
          bind:value={bullet.text}
          onkeydown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addAfter(i); }
            if (e.key === 'Backspace' && bullet.text === '' && bullets.length > 1) { e.preventDefault(); remove(i); }
          }}
        />
        <button type="button" class="btn btn-ghost btn-sm" aria-label="Remove bullet" onclick={() => remove(i)}><Icon name="x-mark" size={14} /></button>
      </div>
    {/snippet}
  </DragList>
  <button type="button" class="btn btn-ghost btn-sm" onclick={() => { bullets.push({ id: uid(), text: '' }); focusBullet(bullets.length - 1); }}>
    <Icon name="plus" size={13} /> Add bullet
  </button>
</div>
