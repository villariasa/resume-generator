<script lang="ts">
  import { app, flushSave, scheduleSave } from '../state.svelte';
  import { encodeShareUrl } from '../share';
  import { exportJson } from '../export/json';
  import { exportDocx } from '../export/docx';
  import { toPlainText } from '../export/atstext';
  import FormPanel from './FormPanel.svelte';
  import PreviewPane from './PreviewPane.svelte';
  import CustomizerPanel from './CustomizerPanel.svelte';
  import ThemeToggle from '../ui/ThemeToggle.svelte';
  import Icon from '../ui/Icon.svelte';
  import AiAssistModal from '../ai/AiAssistModal.svelte';
  import Dialog from '../ui/Dialog.svelte';

  const resume = $derived(app.current!);

  // Debounced autosave on any change to the current resume.
  $effect(() => {
    void JSON.stringify(resume.data);
    void JSON.stringify(resume.settings);
    void resume.name;
    scheduleSave();
  });

  let aiOpen = $state(false);
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
    // The photo is never included in share links (see share.ts) — keeps the
    // link short and doesn't hand out a personal photo via a URL.
    const url = encodeShareUrl($state.snapshot(resume.data), $state.snapshot(resume.settings), resume.name);
    await navigator.clipboard.writeText(url);
    shareMsg = resume.data.basics.photoDataUrl
      ? 'Link copied — photo excluded from share links.'
      : 'Share link copied to clipboard.';
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
  <header class="no-print flex items-center gap-3 border-b border-[var(--chrome-border)] bg-[var(--chrome-surface2)] px-4 py-2.5">
    <button type="button" class="btn btn-ghost btn-sm" onclick={backToGallery}><Icon name="arrow-left" size={14} /> Gallery</button>
    <input
      class="input !w-56 !bg-transparent !border-transparent hover:!border-[var(--chrome-border)] focus:!border-indigo-500 font-semibold"
      bind:value={resume.name}
      aria-label="Resume name"
    />
    <span class="text-xs {app.saveError ? 'text-red-400' : 'text-[var(--chrome-faint)]'}">
      {app.saveError || (app.saveState === 'saving' ? 'Saving…' : 'Saved')}
    </span>

    <div class="ml-auto flex items-center gap-2">
      <!-- mobile tabs -->
      <div class="flex lg:hidden rounded-md border border-[var(--chrome-border)] overflow-hidden">
        <button type="button" class="px-3 py-1 text-xs {app.mobileTab === 'form' ? 'bg-indigo-500 text-white' : ''}" onclick={() => (app.mobileTab = 'form')}>Edit</button>
        <button type="button" class="px-3 py-1 text-xs {app.mobileTab === 'preview' ? 'bg-indigo-500 text-white' : ''}" onclick={() => (app.mobileTab = 'preview')}>Preview</button>
      </div>

      <label class="hidden sm:flex items-center gap-1.5 text-xs text-[var(--chrome-muted)]">
        Zoom
        <input type="range" min="0.4" max="1.5" step="0.05" bind:value={app.zoom} class="w-24 accent-indigo-500" />
      </label>

      <ThemeToggle />

      <button type="button" class="btn btn-sm" onclick={() => (aiOpen = true)}>
        <Icon name="sparkles" size={14} /> AI Assist
      </button>

      <button type="button" class="btn btn-sm {app.customizerOpen ? '!border-indigo-500' : ''}" onclick={() => (app.customizerOpen = !app.customizerOpen)}>
        <Icon name="swatch" size={14} /> Design
      </button>

      <div class="relative">
        <button type="button" class="btn btn-primary btn-sm" onclick={() => (exportOpen = !exportOpen)}>Export <Icon name="chevron-down" size={13} /></button>
        {#if exportOpen}
          <div class="absolute right-0 top-full z-50 mt-1 w-56 card p-1.5 shadow-xl">
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={printPdf}><Icon name="document-arrow-down" size={15} /> Download PDF (print)</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={() => { exportOpen = false; flushSave(); exportJson($state.snapshot(resume)); }}><Icon name="arrow-down-tray" size={15} /> Export JSON</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={() => { exportOpen = false; flushSave(); exportDocx($state.snapshot(resume)); }}><Icon name="document-text" size={15} /> Export DOCX</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={copyShareLink}><Icon name="link" size={15} /> Copy share link</button>
            <button type="button" class="btn btn-ghost w-full justify-start" onclick={openAts}><Icon name="clipboard" size={15} /> ATS plain text</button>
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
    <aside class="no-print w-full lg:w-[440px] shrink-0 overflow-y-auto slim-scroll border-r border-[var(--chrome-border)] bg-[var(--chrome-bg)] p-4 {app.mobileTab === 'form' ? '' : 'hidden lg:block'}">
      <FormPanel {resume} />
    </aside>

    <main class="min-w-0 flex-1 {app.mobileTab === 'preview' ? '' : 'hidden lg:block'}">
      <PreviewPane {resume} />
    </main>

    {#if app.customizerOpen}
      <aside class="no-print w-[300px] shrink-0 overflow-y-auto slim-scroll border-l border-[var(--chrome-border)] bg-[var(--chrome-bg)]">
        <CustomizerPanel {resume} />
      </aside>
    {/if}
  </div>
</div>

<Dialog bind:open={atsOpen} title="ATS plain-text version" description="Paste this into application forms that mangle formatting.">
  <textarea class="input h-80 font-mono text-xs" readonly value={atsText}></textarea>
  {#snippet footer()}
    <button type="button" class="btn btn-sm" onclick={() => navigator.clipboard.writeText(atsText)}>Copy to clipboard</button>
    <button type="button" class="btn btn-primary btn-sm" onclick={() => (atsOpen = false)}>Done</button>
  {/snippet}
</Dialog>

<AiAssistModal bind:open={aiOpen} {resume} />
