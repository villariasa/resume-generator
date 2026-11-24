<script lang="ts">
  import type { ResumeData, TemplateSettings } from '../types';
  import ResumePage from '../templates/ResumePage.svelte';

  let {
    name,
    description,
    badge = '',
    data,
    settings,
    onpick,
    ondelete,
  }: {
    name: string;
    description: string;
    badge?: string;
    data: ResumeData;
    settings: TemplateSettings;
    onpick: () => void;
    ondelete?: () => void;
  } = $props();
</script>

<div class="card group flex flex-col overflow-hidden transition-colors hover:border-indigo-500/60">
  <button type="button" class="relative block h-[248px] overflow-hidden bg-[var(--chrome-inset)] cursor-pointer" onclick={onpick} aria-label="Use template {name}">
    <div class="pointer-events-none origin-top-left scale-[0.22] absolute left-1/2 top-3 -translate-x-[88px]">
      <ResumePage {data} {settings} />
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-[var(--chrome-surface)] via-transparent to-transparent"></div>
    <span class="absolute inset-x-0 bottom-2 text-center text-xs font-medium text-[var(--chrome-accent)] opacity-0 transition-opacity group-hover:opacity-100">
      Use this template →
    </span>
  </button>
  <div class="flex items-start justify-between gap-2 p-3.5">
    <div class="min-w-0">
      <p class="text-sm font-semibold">
        {name}
        {#if badge}<span class="ml-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 px-1 py-px text-[10px] text-emerald-400">{badge}</span>{/if}
      </p>
      <p class="mt-0.5 text-xs leading-relaxed text-[var(--chrome-muted)]">{description}</p>
    </div>
    {#if ondelete}
      <button type="button" class="btn btn-ghost btn-sm shrink-0" aria-label="Delete template" onclick={ondelete}>🗑</button>
    {/if}
  </div>
</div>
