<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from '../ui/Icon.svelte';

  let {
    title,
    subtitle = '',
    open = $bindable(false),
    children,
  }: {
    title: string;
    subtitle?: string;
    open?: boolean;
    children: Snippet;
  } = $props();
</script>

<div class="card overflow-hidden">
  <button
    type="button"
    class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--chrome-hover)] transition-colors"
    onclick={() => (open = !open)}
    aria-expanded={open}
  >
    <span>
      <span class="text-sm font-semibold">{title}</span>
      {#if subtitle}<span class="ml-2 text-xs text-[var(--chrome-muted)]">{subtitle}</span>{/if}
    </span>
    <span class="text-[var(--chrome-muted)] transition-transform {open ? 'rotate-90' : ''}"><Icon name="chevron-right" size={14} /></span>
  </button>
  {#if open}
    <div class="px-4 pb-4 pt-1 border-t border-[var(--chrome-border)]">
      {@render children()}
    </div>
  {/if}
</div>
