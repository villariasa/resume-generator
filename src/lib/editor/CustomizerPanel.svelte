<script lang="ts">
  import type { SavedResume, SectionKey } from '../types';
  import { SCHEMA_VERSION } from '../types';
  import { FONT_PAIRINGS } from '../templates/theme';
  import { sectionLabel } from '../templates/format';
  import { BUILTIN_TEMPLATES, resolveTemplate } from '../templates/registry';
  import { saveCustomTemplate } from '../storage';
  import { uid, move } from '../utils';

  let { resume }: { resume: SavedResume } = $props();

  const SWATCHES = ['#1f2937', '#1d4ed8', '#7c3aed', '#0f766e', '#db2777', '#b45309', '#dc2626', '#065f46'];

  const def = $derived(resolveTemplate(resume.settings).def);

  // Section order list including any custom sections
  const orderKeys = $derived.by(() => {
    const known = new Set(resume.settings.sectionOrder);
    const extras = resume.data.customSections
      .map((s) => `custom:${s.id}` as SectionKey)
      .filter((k) => !known.has(k));
    if (extras.length) resume.settings.sectionOrder.push(...extras);
    return resume.settings.sectionOrder;
  });

  function toggleHidden(key: SectionKey) {
    const i = resume.settings.hiddenSections.indexOf(key);
    if (i >= 0) resume.settings.hiddenSections.splice(i, 1);
    else resume.settings.hiddenSections.push(key);
  }

  function toggleSidebar(key: SectionKey) {
    const i = resume.settings.sidebarSections.indexOf(key);
    if (i >= 0) resume.settings.sidebarSections.splice(i, 1);
    else resume.settings.sidebarSections.push(key);
  }

  let savedTplMsg = $state('');
  function saveAsTemplate() {
    const name = prompt('Name your template:', 'My template');
    if (!name) return;
    const { templateId, ...rest } = $state.snapshot(resume.settings);
    saveCustomTemplate({
      id: uid(),
      schemaVersion: SCHEMA_VERSION,
      name,
      baseTemplateId: templateId.startsWith('custom:') ? def.id : templateId,
      settings: rest,
      createdAt: new Date().toISOString(),
    });
    savedTplMsg = `Saved "${name}" — find it in the gallery.`;
    setTimeout(() => (savedTplMsg = ''), 4000);
  }
</script>

<div class="flex flex-col gap-5 p-4 text-sm">
  <div>
    <span class="label">Template</span>
    <div class="grid grid-cols-2 gap-2">
      {#each BUILTIN_TEMPLATES as tpl (tpl.id)}
        <button
          type="button"
          class="btn btn-sm justify-center {resume.settings.templateId === tpl.id ? '!border-indigo-500 !bg-indigo-500/15' : ''}"
          onclick={() => {
            resume.settings.templateId = tpl.id;
            resume.settings.columns = tpl.defaults.columns;
          }}
        >
          {tpl.name}{tpl.atsSafe ? ' ✓ATS' : ''}
        </button>
      {/each}
    </div>
  </div>

  <div>
    <span class="label">Accent color</span>
    <div class="flex flex-wrap items-center gap-2">
      {#each SWATCHES as color}
        <button
          type="button"
          aria-label="Accent {color}"
          class="h-6 w-6 rounded-full border-2 {resume.settings.accentColor === color ? 'border-white' : 'border-transparent'}"
          style="background: {color};"
          onclick={() => (resume.settings.accentColor = color)}
        ></button>
      {/each}
      <input
        type="color"
        bind:value={resume.settings.accentColor}
        class="h-6 w-8 cursor-pointer rounded border border-[#262b36] bg-transparent"
        aria-label="Custom accent color"
      />
    </div>
  </div>

  <div>
    <label class="label" for="cz-font">Font pairing</label>
    <select id="cz-font" class="input" bind:value={resume.settings.fontPairing}>
      {#each Object.entries(FONT_PAIRINGS) as [id, fp]}
        <option value={id}>{fp.label}</option>
      {/each}
    </select>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <div>
      <label class="label" for="cz-density">Density</label>
      <select id="cz-density" class="input" bind:value={resume.settings.density}>
        <option value="compact">Compact</option>
        <option value="normal">Normal</option>
        <option value="relaxed">Relaxed</option>
      </select>
    </div>
    <div>
      <label class="label" for="cz-page">Page size</label>
      <select id="cz-page" class="input" bind:value={resume.settings.pageSize}>
        <option value="a4">A4</option>
        <option value="letter">US Letter</option>
      </select>
    </div>
  </div>

  <div>
    <label class="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" bind:checked={resume.settings.showPhoto} class="accent-indigo-500" />
      Show photo on the resume
    </label>
    {#if resume.settings.showPhoto && !resume.data.basics.photoDataUrl}
      <p class="mt-1 text-xs text-[#8b93a3]">No photo uploaded yet — add one under Basics.</p>
    {:else if !resume.settings.showPhoto}
      <p class="mt-1 text-xs text-[#8b93a3]">Tip: photo-free is the ATS-safe convention for US applications.</p>
    {/if}
  </div>

  {#if def.supportsColumns}
    <div>
      <span class="label">Layout</span>
      <div class="flex gap-2">
        <button type="button" class="btn btn-sm {resume.settings.columns === 1 ? '!border-indigo-500 !bg-indigo-500/15' : ''}" onclick={() => (resume.settings.columns = 1)}>1 column</button>
        <button type="button" class="btn btn-sm {resume.settings.columns === 2 ? '!border-indigo-500 !bg-indigo-500/15' : ''}" onclick={() => (resume.settings.columns = 2)}>2 columns</button>
      </div>
    </div>
  {/if}

  <div>
    <span class="label">Sections — drag order · show/hide{def.supportsColumns && resume.settings.columns === 2 ? ' · sidebar' : ''}</span>
    <div class="flex flex-col gap-1">
      {#each orderKeys as key, i (key)}
        {@const hidden = resume.settings.hiddenSections.includes(key)}
        <div class="flex items-center gap-2 rounded-md border border-[#262b36] bg-[#12151b] px-2 py-1.5">
          <div class="flex flex-col">
            <button type="button" class="text-[10px] leading-none text-[#525a68] hover:text-white" aria-label="Move up" onclick={() => move(resume.settings.sectionOrder, i, i - 1)}>▲</button>
            <button type="button" class="text-[10px] leading-none text-[#525a68] hover:text-white" aria-label="Move down" onclick={() => move(resume.settings.sectionOrder, i, i + 1)}>▼</button>
          </div>
          <span class="flex-1 text-xs {hidden ? 'line-through text-[#525a68]' : ''}">{sectionLabel(key, resume.data)}</span>
          {#if def.supportsColumns && resume.settings.columns === 2}
            <button
              type="button"
              class="btn btn-ghost btn-sm !px-1.5 !text-[10px] {resume.settings.sidebarSections.includes(key) ? '!text-indigo-400' : ''}"
              title="Toggle sidebar placement"
              onclick={() => toggleSidebar(key)}
            >
              ◧
            </button>
          {/if}
          <button type="button" class="btn btn-ghost btn-sm !px-1.5 !text-[10px]" title={hidden ? 'Show section' : 'Hide section'} onclick={() => toggleHidden(key)}>
            {hidden ? '🚫' : '👁'}
          </button>
        </div>
      {/each}
    </div>
  </div>

  <div class="border-t border-[#262b36] pt-4">
    <button type="button" class="btn w-full justify-center" onclick={saveAsTemplate}>★ Save current look as my template</button>
    {#if savedTplMsg}<p class="mt-2 text-xs text-emerald-400">{savedTplMsg}</p>{/if}
  </div>
</div>
