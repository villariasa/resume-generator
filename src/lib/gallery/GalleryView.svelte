<script lang="ts">
  import { app, newResume, openResume } from '../state.svelte';
  import { BUILTIN_TEMPLATES, getBuiltin } from '../templates/registry';
  import {
    deleteCustomTemplate,
    deleteResume,
    listCustomTemplates,
    listResumes,
    loadResume,
    saveResume,
  } from '../storage';
  import { exampleResume } from '../example';
  import { importJsonFile } from '../export/json';
  import TemplateCard from './TemplateCard.svelte';
  import ThemeToggle from '../ui/ThemeToggle.svelte';

  const previewData = exampleResume();

  let resumes = $state(listResumes());
  let customTemplates = $state(listCustomTemplates());
  let importError = $state('');

  function refresh() {
    resumes = listResumes();
    customTemplates = listCustomTemplates();
  }

  function startFromBuiltin(id: string, withExample: boolean) {
    const def = getBuiltin(id)!;
    const resume = newResume(id, withExample ? exampleResume() : undefined, structuredClone(def.defaults));
    saveResume(resume);
    openResume(resume);
  }

  function startFromCustom(tplId: string) {
    const tpl = customTemplates.find((t) => t.id === tplId)!;
    const resume = newResume(`custom:${tpl.id}`, undefined, {
      ...structuredClone(tpl.settings),
      templateId: `custom:${tpl.id}`,
    });
    saveResume(resume);
    openResume(resume);
  }

  function open(id: string) {
    const resume = loadResume(id);
    if (resume) openResume(resume);
    else refresh();
  }

  async function onImport(e: Event) {
    importError = '';
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    const resume = await importJsonFile(file);
    if (!resume) {
      importError = "Couldn't read that file — is it a .resume.json exported from here?";
      return;
    }
    saveResume(resume);
    openResume(resume);
  }

  function removeResume(id: string, name: string) {
    if (confirm(`Delete "${name}"? This can't be undone.`)) {
      deleteResume(id);
      refresh();
    }
  }

  function removeTemplate(id: string, name: string) {
    if (confirm(`Delete template "${name}"?`)) {
      deleteCustomTemplate(id);
      refresh();
    }
  }

  function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<div class="min-h-dvh overflow-y-auto">
  <div class="mx-auto w-full max-w-6xl px-6 py-10">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Resume Generator</h1>
        <p class="mt-1 text-sm text-[var(--chrome-muted)]">
          Pick a template, fill in your story, export a print-perfect PDF. Everything stays in your browser.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <label class="btn btn-sm cursor-pointer">
          ⬆ Import JSON
          <input type="file" accept=".json,application/json" class="hidden" onchange={onImport} />
        </label>
        <button type="button" class="btn btn-primary btn-sm" onclick={() => startFromBuiltin('classic', true)}>
          ✦ Start from example
        </button>
      </div>
    </header>
    {#if importError}<p class="mt-2 text-xs text-red-400">{importError}</p>{/if}

    {#if resumes.length > 0}
      <section class="mt-10">
        <h2 class="label !text-[13px]">My resumes</h2>
        <div class="flex flex-col gap-1.5">
          {#each resumes as entry (entry.id)}
            <div class="card flex items-center gap-3 px-4 py-2.5 hover:border-indigo-500/50 transition-colors">
              <button type="button" class="flex-1 text-left min-w-0 cursor-pointer" onclick={() => open(entry.id)}>
                <span class="text-sm font-medium">{entry.name}</span>
                <span class="ml-3 text-xs text-[var(--chrome-faint)]">{entry.templateId.startsWith('custom:') ? 'Custom' : (getBuiltin(entry.templateId)?.name ?? entry.templateId)} · updated {fmtDate(entry.updatedAt)}</span>
              </button>
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                onclick={() => {
                  const r = loadResume(entry.id);
                  if (r) {
                    const copy = { ...structuredClone(r), id: crypto.randomUUID(), name: `${r.name} (copy)` };
                    saveResume(copy);
                    refresh();
                  }
                }}
              >
                Duplicate
              </button>
              <button type="button" class="btn btn-ghost btn-sm !text-red-400/70 hover:!text-red-400" onclick={() => removeResume(entry.id, entry.name)}>
                Delete
              </button>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if customTemplates.length > 0}
      <section class="mt-10">
        <h2 class="label !text-[13px]">My templates</h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {#each customTemplates as tpl (tpl.id)}
            <TemplateCard
              name={tpl.name}
              description={`Based on ${getBuiltin(tpl.baseTemplateId)?.name ?? tpl.baseTemplateId}`}
              badge="yours"
              data={previewData}
              settings={{ ...tpl.settings, templateId: tpl.baseTemplateId }}
              onpick={() => startFromCustom(tpl.id)}
              ondelete={() => removeTemplate(tpl.id, tpl.name)}
            />
          {/each}
        </div>
      </section>
    {/if}

    <section class="mt-10">
      <h2 class="label !text-[13px]">Templates</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {#each BUILTIN_TEMPLATES as tpl (tpl.id)}
          <TemplateCard
            name={tpl.name}
            description={tpl.description}
            badge={tpl.atsSafe ? 'ATS-safe' : ''}
            data={previewData}
            settings={tpl.defaults}
            onpick={() => startFromBuiltin(tpl.id, false)}
          />
        {/each}
      </div>
    </section>

    <footer class="mt-14 border-t border-[var(--chrome-border)] pt-5 text-xs text-[var(--chrome-faint)]">
      100% client-side — your resume never leaves this browser. Autosaves locally; use Export → JSON for a backup file.
    </footer>
  </div>
</div>
