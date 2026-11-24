<script lang="ts">
  import type { SavedResume } from '../types';
  import { getAiSettings, saveAiSettings, clearAiSettings } from '../storage';
  import { PROVIDER_LIST, PROVIDERS } from './providers';
  import { aiSummary, aiSkills, aiBullets } from './assist';
  import type { AiSettings, ProviderId } from './types';
  import { uid } from '../utils';
  import Dialog from '../ui/Dialog.svelte';
  import Icon from '../ui/Icon.svelte';

  let { open = $bindable(false), resume }: { open?: boolean; resume: SavedResume } = $props();

  // Providers periodically retire model ids (e.g. Google removed
  // gemini-2.0-flash). If a saved setting points at a model the provider's
  // current list no longer recognizes, silently fall forward to today's
  // default instead of letting the same request fail again.
  function withFreshModel(s: AiSettings): AiSettings {
    const def = PROVIDERS[s.provider];
    if (def.needsBaseUrl || def.models.includes(s.model)) return s;
    return { ...s, model: def.defaultModel };
  }

  const loaded = getAiSettings();
  const migrated = withFreshModel(loaded ?? { provider: 'anthropic', apiKey: '', model: PROVIDERS.anthropic.defaultModel });
  if (loaded && migrated.model !== loaded.model) saveAiSettings(migrated);
  let settings = $state<AiSettings>(migrated);
  let showKey = $state(false);
  let configuring = $state(!getAiSettings());

  const provider = $derived(PROVIDERS[settings.provider]);

  function onProviderChange(id: ProviderId) {
    settings.provider = id;
    settings.model = PROVIDERS[id].defaultModel;
  }

  function saveSettings() {
    saveAiSettings($state.snapshot(settings));
    configuring = false;
  }

  function forget() {
    clearAiSettings();
    settings = { provider: 'anthropic', apiKey: '', model: PROVIDERS.anthropic.defaultModel };
    configuring = true;
  }

  // ── Three focused actions, not a do-everything generator ──
  type Mode = 'summary' | 'skills' | 'bullets';
  let mode = $state<Mode>('summary');
  let about = $state('');
  let targetWorkId = $state('');
  $effect(() => {
    if (!targetWorkId && resume.data.work[0]) targetWorkId = resume.data.work[0].id;
  });
  let bulletNotes = $state('');
  let busy = $state(false);
  let error = $state('');
  let resultText = $state('');
  let resultSkills = $state<string[]>([]);
  let resultBullets = $state<string[]>([]);

  async function generate() {
    error = '';
    resultText = '';
    resultSkills = [];
    resultBullets = [];
    busy = true;
    try {
      if (mode === 'summary') {
        resultText = await aiSummary(settings, about);
      } else if (mode === 'skills') {
        resultSkills = await aiSkills(settings, about);
      } else {
        const entry = resume.data.work.find((w) => w.id === targetWorkId);
        const context = entry ? `${entry.role} at ${entry.company}` : 'this role';
        resultBullets = await aiBullets(settings, context, bulletNotes);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Something went wrong.';
    } finally {
      busy = false;
    }
  }

  function insertSummary() {
    resume.data.summary = resultText;
    open = false;
  }

  function insertSkills() {
    resume.data.skills.push({ id: uid(), label: 'Skills', items: resultSkills });
    open = false;
  }

  function insertBullets(mode_: 'replace' | 'append') {
    const entry = resume.data.work.find((w) => w.id === targetWorkId);
    if (!entry) return;
    const bullets = resultBullets.map((text) => ({ id: uid(), text }));
    entry.bullets = mode_ === 'replace' ? bullets : [...entry.bullets, ...bullets];
    open = false;
  }
</script>

<Dialog bind:open title="AI Assist" description="Uses your own API key, sent directly from your browser to the provider — never through us (we have no server).">
  {#if configuring || !settings.apiKey && settings.provider !== 'custom'}
    <div class="flex flex-col gap-3">
      <div>
        <span class="label">Provider</span>
        <div class="grid grid-cols-2 gap-2">
          {#each PROVIDER_LIST as p (p.id)}
            <button
              type="button"
              class="btn btn-sm justify-center {settings.provider === p.id ? '!border-indigo-500 !bg-indigo-500/15' : ''}"
              onclick={() => onProviderChange(p.id)}
            >
              {p.name}
            </button>
          {/each}
        </div>
      </div>

      {#if provider.needsBaseUrl}
        <div>
          <label class="label" for="ai-base">API base URL</label>
          <input id="ai-base" class="input" bind:value={settings.baseUrl} placeholder="https://api.example.com/v1" />
        </div>
        <div>
          <label class="label" for="ai-model">Model name</label>
          <input id="ai-model" class="input" bind:value={settings.model} placeholder="llama-3.3-70b-versatile" />
        </div>
      {:else}
        <div>
          <label class="label" for="ai-model">Model</label>
          <select id="ai-model" class="input" bind:value={settings.model}>
            {#each provider.models as m}<option value={m}>{m}</option>{/each}
          </select>
        </div>
      {/if}

      <div>
        <label class="label" for="ai-key">API key</label>
        <div class="flex gap-2">
          {#if showKey}
            <input id="ai-key" class="input" bind:value={settings.apiKey} placeholder={provider.keyPlaceholder} autocomplete="off" />
          {:else}
            <input id="ai-key" class="input" type="password" bind:value={settings.apiKey} placeholder={provider.keyPlaceholder} autocomplete="off" />
          {/if}
          <button type="button" class="btn btn-sm" onclick={() => (showKey = !showKey)} aria-label={showKey ? 'Hide key' : 'Show key'}>
            <Icon name={showKey ? 'eye-slash' : 'eye'} size={14} />
          </button>
        </div>
        <p class="mt-1 text-xs text-[var(--chrome-faint)]">{provider.keyHelp} Stored only in this browser's local storage.</p>
      </div>

      <p class="text-xs text-[var(--chrome-muted)]">{provider.corsNote}</p>

      <button
        type="button"
        class="btn btn-primary btn-sm justify-center"
        disabled={!settings.model || (settings.provider !== 'custom' && !settings.apiKey)}
        onclick={saveSettings}
      >
        Save and continue
      </button>
    </div>
  {:else}
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="flex gap-1.5">
          <button type="button" class="btn btn-sm {mode === 'summary' ? '!border-indigo-500 !bg-indigo-500/15' : ''}" onclick={() => (mode = 'summary')}>Summary</button>
          <button type="button" class="btn btn-sm {mode === 'skills' ? '!border-indigo-500 !bg-indigo-500/15' : ''}" onclick={() => (mode = 'skills')}>Skills</button>
          <button type="button" class="btn btn-sm {mode === 'bullets' ? '!border-indigo-500 !bg-indigo-500/15' : ''}" onclick={() => (mode = 'bullets')}>Bullets</button>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => (configuring = true)}>{provider.name}</button>
      </div>

      {#if mode === 'bullets'}
        <div>
          <label class="label" for="ai-target">For which role?</label>
          <select id="ai-target" class="input" bind:value={targetWorkId}>
            {#each resume.data.work as w (w.id)}
              <option value={w.id}>{w.role || 'Untitled role'} — {w.company || 'Untitled company'}</option>
            {/each}
          </select>
        </div>
        <textarea class="input" rows="3" bind:value={bulletNotes} placeholder="Rough notes: what did you actually do in this role? Dump anything — I'll turn it into bullets."></textarea>
      {:else}
        <textarea
          class="input"
          rows="4"
          bind:value={about}
          placeholder={mode === 'summary'
            ? "Tell me about yourself: what you do, your experience, what you're looking for."
            : 'What do you work with? Languages, frameworks, tools, domains…'}
        ></textarea>
      {/if}

      <button type="button" class="btn btn-primary btn-sm justify-center" disabled={busy} onclick={generate}>
        {#if busy}Generating…{:else}<Icon name="sparkles" size={14} /> Generate{/if}
      </button>

      {#if error}<p class="text-xs text-red-400">{error}</p>{/if}

      {#if resultText}
        <div class="rounded-md border border-[var(--chrome-border)] bg-[var(--chrome-surface2)] p-3 text-sm">{resultText}</div>
        <button type="button" class="btn btn-sm justify-center" onclick={insertSummary}>Use this summary</button>
      {/if}

      {#if resultSkills.length > 0}
        <div class="flex flex-wrap gap-1.5">
          {#each resultSkills as s}<span class="rounded-full border border-[var(--chrome-border)] px-2 py-0.5 text-xs">{s}</span>{/each}
        </div>
        <button type="button" class="btn btn-sm justify-center" onclick={insertSkills}>Add as a skill group</button>
      {/if}

      {#if resultBullets.length > 0}
        <ul class="list-disc space-y-1 pl-5 text-sm">
          {#each resultBullets as b}<li>{b}</li>{/each}
        </ul>
        <div class="flex gap-2">
          <button type="button" class="btn btn-sm flex-1 justify-center" onclick={() => insertBullets('append')}>Add to role</button>
          <button type="button" class="btn btn-sm flex-1 justify-center" onclick={() => insertBullets('replace')}>Replace role's bullets</button>
        </div>
      {/if}
    </div>
  {/if}

  {#snippet footer()}
    {#if !configuring}
      <button type="button" class="btn btn-ghost btn-sm !text-red-400/70 hover:!text-red-400" onclick={forget}>Forget API key</button>
    {/if}
  {/snippet}
</Dialog>
