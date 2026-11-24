<script lang="ts">
  import type { SavedResume } from '../types';
  import { app } from '../state.svelte';
  import ResumePage from '../templates/ResumePage.svelte';

  let { resume }: { resume: SavedResume } = $props();

  let pageEl = $state<HTMLElement | null>(null);
  let pageCount = $state(1);
  let overflows = $state(false);

  const MM_TO_PX = 96 / 25.4;
  const pageHeightPx = $derived(
    resume.settings.pageSize === 'a4' ? 297 * MM_TO_PX : 11 * 96,
  );

  // Preflight: measure real rendered height vs page height whenever content changes.
  $effect(() => {
    // touch reactive deps so the effect re-runs on edits
    void JSON.stringify(resume.data);
    void JSON.stringify(resume.settings);
    const el = pageEl?.querySelector('#live-print-root') as HTMLElement | null;
    if (!el) return;
    requestAnimationFrame(() => {
      const h = el.scrollHeight;
      const pages = Math.max(1, Math.ceil(h / pageHeightPx - 0.02));
      pageCount = pages;
      overflows = pages > 1;
    });
  });

  const breakOffsets = $derived(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => (i + 1) * pageHeightPx),
  );
</script>

<div class="relative h-full overflow-auto slim-scroll bg-[var(--chrome-inset)] p-6">
  {#if overflows}
    <div class="no-print sticky top-0 z-20 mb-3 mx-auto w-fit rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
      Content flows onto {pageCount} pages — tighten density or hide a section if you want one page.
    </div>
  {/if}

  <div class="zoom-wrap mx-auto w-fit origin-top" style="transform: scale({app.zoom});" bind:this={pageEl}>
    <div class="relative">
      <!-- Live, interactive preview: guides + click-to-edit. Its own id so
           printing never targets this one directly (see below + print.ts). -->
      <ResumePage data={resume.data} settings={resume.settings} guides editable rootId="live-print-root" />
      {#each breakOffsets as offset}
        <div
          class="no-print pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-rose-400/60"
          style="top: {offset}px;"
        >
          <span class="absolute right-1 -top-5 rounded bg-rose-400/20 px-1.5 text-[10px] text-rose-300">page break</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Hidden clean copy, decoupled from the live editable/zoomed preview —
     no guides, no contenteditable, no "always show in edit mode" fields.
     This is what printResume() clones; keeps exported output identical
     regardless of zoom level, edit mode, or in-progress guide state. -->
<div class="print-source-wrap" aria-hidden="true">
  <ResumePage data={resume.data} settings={resume.settings} />
</div>

<style>
  .print-source-wrap {
    position: fixed;
    top: 0;
    left: -99999px;
  }
</style>
