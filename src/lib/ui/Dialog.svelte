<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  // shadcn/ui-style dialog: dimmed overlay, centered panel, title/description
  // header, right-aligned footer actions. Esc or overlay click closes.
  let {
    open = $bindable(false),
    title,
    description = '',
    onclose,
    children,
    footer,
  }: {
    open?: boolean;
    title: string;
    description?: string;
    // Called on overlay click / Esc / X — lets parents using a plain (non-bound)
    // `open` expression reset their own state.
    onclose?: () => void;
    children?: Snippet;
    footer?: Snippet;
  } = $props();

  function close() {
    open = false;
    onclose?.();
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) close();
  }

  let panel = $state<HTMLElement | null>(null);
  $effect(() => {
    if (open && panel) {
      const el = panel.querySelector<HTMLElement>('input, textarea, button');
      el?.focus();
    }
  });
</script>

<svelte:window {onkeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    class="no-print fixed inset-0 z-[100] bg-black/80"
    onclick={close}
  ></div>
  <div
    bind:this={panel}
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="no-print fixed left-1/2 top-1/2 z-[101] grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-[var(--chrome-border)] bg-[var(--chrome-surface)] p-6 shadow-2xl"
  >
    <button
      type="button"
      class="absolute right-3.5 top-3.5 text-[var(--chrome-muted)] transition-colors hover:text-[var(--chrome-text)]"
      aria-label="Close"
      onclick={close}
    >
      <Icon name="x-mark" size={16} />
    </button>

    <div class="flex flex-col gap-1.5 pr-6">
      <h2 class="text-base font-semibold leading-none tracking-tight">{title}</h2>
      {#if description}<p class="text-sm text-[var(--chrome-muted)]">{description}</p>{/if}
    </div>

    {#if children}
      <div>{@render children()}</div>
    {/if}

    {#if footer}
      <div class="flex justify-end gap-2">{@render footer()}</div>
    {/if}
  </div>
{/if}
