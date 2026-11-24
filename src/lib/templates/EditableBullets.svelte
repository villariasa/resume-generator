<script lang="ts">
  import type { Bullet } from '../types';
  import { uid } from '../utils';

  let { bullets, editable = false }: { bullets: Bullet[]; editable?: boolean } = $props();

  function commit(i: number, el: HTMLElement) {
    // textContent, not innerText — immune to any CSS text-transform a
    // template might apply, and bullets are single-line so no rendering-
    // aware line breaks are needed.
    bullets[i].text = el.textContent ?? '';
  }

  function focusBullet(root: HTMLElement, i: number) {
    requestAnimationFrame(() => {
      const items = root.querySelectorAll<HTMLElement>('[data-bullet]');
      items[Math.max(0, Math.min(items.length - 1, i))]?.focus();
    });
  }

  function onkeydown(e: KeyboardEvent, i: number) {
    const el = e.currentTarget as HTMLElement;
    const root = el.closest('ul') as HTMLElement;
    if (e.key === 'Enter') {
      e.preventDefault();
      commit(i, el);
      bullets.splice(i + 1, 0, { id: uid(), text: '' });
      focusBullet(root, i + 1);
    } else if (e.key === 'Backspace' && (el.textContent ?? '').trim() === '' && bullets.length > 1) {
      e.preventDefault();
      bullets.splice(i, 1);
      focusBullet(root, i - 1);
    }
  }
</script>

{#if editable}
  <ul class="bullets">
    {#each bullets as bullet, i (bullet.id)}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <li
        data-bullet
        class="rg-editable"
        contenteditable="true"
        spellcheck="false"
        data-placeholder="Shipped X, which led to Y…"
        tabindex="0"
        aria-label="Bullet point"
        onblur={(e) => commit(i, e.currentTarget as HTMLElement)}
        onkeydown={(e) => onkeydown(e, i)}
      >{bullet.text}</li>
    {/each}
  </ul>
{:else if bullets.some((b) => b.text.trim())}
  <ul class="bullets">
    {#each bullets as bullet (bullet.id)}
      {#if bullet.text.trim()}<li>{bullet.text}</li>{/if}
    {/each}
  </ul>
{/if}
