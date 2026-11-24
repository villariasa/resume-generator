<script lang="ts">
  import { app, flushSave, scheduleSave } from '../state.svelte';
  import { encodeShareUrl } from '../share';
  import { exportJson } from '../export/json';
  import { exportDocx } from '../export/docx';
  import { toPlainText } from '../export/atstext';
  import FormPanel from './FormPanel.svelte';
  import PreviewPane from './PreviewPane.svelte';
  import CustomizerPanel from './CustomizerPanel.svelte';

  const resume = $derived(app.current!);

  // Debounced autosave on any change to the current resume.
  $effect(() => {
    void JSON.stringify(resume.data);
    void JSON.stringify(resume.settings);
    void resume.name;
    scheduleSave();
  });

  let exportOpen = $state(false);
  let atsOpen = $state(false);
  let atsText = $state('');
  let shareMsg = $state('');

  function printPdf() {
    exportOpen = false;
    flushSave();
    window.print();
  }

  async function copyShareLink() {
    exportOpen = false;
    flushSave();
    const url = encodeShareUrl($state.snapshot(resume.data), $state.snapshot(resume.settings), resume.name);
    if (url.length > 32_000) {
      shareMsg = 'Link is very large (embedded photo?) — consider removing the photo before sharing.';
    }
    await navigator.clipboard.writeText(url);
    shareMsg = shareMsg || 'Share link copied to clipboard ✓';
    setTimeout(() => (shareMsg = ''), 4000);
  }

  function openAts() {
    exportOpen = false;
    atsText = toPlainText($state.snapshot(resume.data), $state.snapshot(resume.settings));
    atsOpen = true;
  }

  function backToGallery() {
    flushSave();
    app.view = 'gallery';
  }
</script>

<div class="flex h-dvh flex-col">
  <!-- Toolbar -->
  <header class="no-print flex items-center gap-3 border-b border-[#262b36] bg-[#12151b] px-4 py-2.5">
    <button type="button" class="btn btn-ghost btn-sm" onclick={backToGallery}>← Gallery</button>
    <input
      class="input !w-56 !bg-transparent !border-transparent hover:!border-[#262b36] focus:!border-indigo-500 font-semibold"
      bind:value={resume.name}
      aria-label="Resume name"
    />
    <span class="text-xs text-[#525a68]">{app.saveState === 'saving' ? 'Saving…' : 'Saved ✓'}</span>

    <div class="ml-auto flex items-center gap-2">
      <!-- mobile tabs -->
      <div class="flex lg:hidden rounded-md border border-[#262b36] overflow-hidden">
        <button type="button" class="px-3 py-1 text-xs {app.mobileTab === 'form' ? 'bg-indigo-500 text-white' : ''}" onclick={() => (app.mobileTab = 'form')}>Edit</button>
        <button type="button" class="px-3 py-1 text-xs {app.mobileTab === 'preview' ? 'bg-indigo-500 text-white' : ''}" onclick={() => (app.mobileTab = 'preview')}>Preview</button>
      </div>

      <label class="hidden sm:flex items-center gap-1.5 text-xs text-[#8b93a3]">
        Zoom
        <input type="range" min="0.4" max="1.5" step="0.05" bind:value={app.zoom} class="w-24 accent-indigo-500" />
      </label>

      <button type="button" class="btn btn-sm {app.customizerOpen ? '!border-indigo-500' : ''}" onclick={() => (app.customizerOpen = !app.customizerOpen)}>
        🎨 Design
      </button>

      <div class="relative">
        <button type="button" class="btn btn-primary btn-sm" onclick={() => (exportOpen = !exportOpen)}>Export ▾</button>
        {#if exportOpen}
          <div class="absolute right-0 top-full z-50 mt-1 w-56 card p-1.5 shadow-xl">
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={printPdf}>📄 Download PDF (print)</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={() => { exportOpen = false; flushSave(); exportJson($state.snapshot(resume)); }}>💾 Export JSON</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={() => { exportOpen = false; flushSave(); exportDocx($state.snapshot(resume)); }}>📝 Export DOCX</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={copyShareLink}>🔗 Copy share link</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={openAts}>🤖 ATS plain text</button>
          </div>
        {/if}
      </div>
    </div>
  </header>

  {#if shareMsg}
    <div class="no-print bg-indigo-500/15 border-b border-indigo-500/30 px-4 py-1.5 text-xs text-indigo-300">{shareMsg}</div>
  {/if}

  <!-- Body -->
  <div class="flex min-h-0 flex-1">
    <aside class="no-print w-full lg:w-[440px] shrink-0 overflow-y-auto slim-scroll border-r border-[#262b36] bg-[#0f1115] p-4 {app.mobileTab === 'form' ? '' : 'hidden lg:block'}">
      <FormPanel {resume} />
    </aside>

    <main class="min-w-0 flex-1 {app.mobileTab === 'preview' ? '' : 'hidden lg:block'}">
      <PreviewPane {resume} />
    </main>

    {#if app.customizerOpen}
      <aside class="no-print w-[300px] shrink-0 overflow-y-auto slim-scroll border-l border-[#262b36] bg-[#0f1115]">
        <CustomizerPanel {resume} />
      </aside>
    {/if}
  </div>
</div>

{#if atsOpen}
  <div class="no-print fixed inset-0 z-[100] grid place-items-center bg-black/60 p-6" role="dialog" aria-modal="true">
    <div class="card w-full max-w-2xl p-5">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">ATS plain-text version</h2>
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => (atsOpen = false)}>✕</button>
      </div>
      <p class="mt-1 text-xs text-[#8b93a3]">Paste this into application forms that mangle formatting.</p>
      <textarea class="input mt-3 h-80 font-mono text-xs" readonly value={atsText}></textarea>
      <div class="mt-3 flex justify-end gap-2">
        <button type="button" class="btn btn-sm" onclick={() => navigator.clipboard.writeText(atsText)}>Copy to clipboard</button>
        <button type="button" class="btn btn-primary btn-sm" onclick={() => (atsOpen = false)}>Done</button>
      </div>
    </div>
  </div>
{/if}
