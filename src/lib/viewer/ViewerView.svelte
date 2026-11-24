<script lang="ts">
  import { app, newResume, openResume } from '../state.svelte';
  import { saveResume } from '../storage';
  import { exportJson } from '../export/json';
  import ResumePage from '../templates/ResumePage.svelte';
  import ThemeToggle from '../ui/ThemeToggle.svelte';

  const shared = $derived(app.shared!);

  function openInEditor() {
    const resume = newResume(
      shared.settings.templateId,
      structuredClone($state.snapshot(shared.data)),
      structuredClone($state.snapshot(shared.settings)),
      `${shared.data.basics.fullName || 'Shared'} — imported`,
    );
    saveResume(resume);
    app.shared = null;
    openResume(resume);
  }
</script>

<div class="min-h-dvh overflow-y-auto">
  <header class="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--chrome-border)] bg-[var(--chrome-surface)] px-5 py-3 backdrop-blur">
    <p class="text-sm">
      <span class="font-semibold">{shared.data.basics.fullName || 'Shared resume'}</span>
      <span class="ml-2 text-xs text-[var(--chrome-muted)]">shared with you — view only</span>
    </p>
    <div class="flex gap-2">
      <ThemeToggle />
      <button type="button" class="btn btn-sm" onclick={() => window.print()}>📄 Download PDF</button>
      <button
        type="button"
        class="btn btn-sm"
        onclick={() => exportJson({ ...newResume(shared.settings.templateId, $state.snapshot(shared.data), $state.snapshot(shared.settings)), name: shared.data.basics.fullName || 'shared-resume' })}
      >
        💾 JSON
      </button>
      <button type="button" class="btn btn-primary btn-sm" onclick={openInEditor}>✎ Open in editor</button>
    </div>
  </header>

  <div class="p-6">
    <div class="zoom-wrap mx-auto w-fit origin-top" style="transform: scale({Math.min(1, (typeof window !== 'undefined' ? window.innerWidth - 48 : 800) / 794)});">
      <ResumePage data={shared.data} settings={shared.settings} />
    </div>
  </div>
</div>
