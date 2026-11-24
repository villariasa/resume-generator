<script lang="ts">
  import type { SavedResume, SectionKey } from '../types';
  import { SECTION_LABELS } from '../templates/format';
  import { exampleResume } from '../example';
  import FormSection from './FormSection.svelte';
  import BasicsForm from './forms/BasicsForm.svelte';
  import WorkForm from './forms/WorkForm.svelte';
  import ProjectsForm from './forms/ProjectsForm.svelte';
  import EducationForm from './forms/EducationForm.svelte';
  import SkillsForm from './forms/SkillsForm.svelte';
  import CertsForm from './forms/CertsForm.svelte';
  import LanguagesForm from './forms/LanguagesForm.svelte';
  import CustomSectionsForm from './forms/CustomSectionsForm.svelte';

  let { resume }: { resume: SavedResume } = $props();

  let openStates = $state<Record<string, boolean>>({ basics: true });

  const isEmpty = $derived(
    !resume.data.basics.fullName &&
      resume.data.work.length === 0 &&
      resume.data.projects.length === 0 &&
      resume.data.summary === '',
  );

  function loadExample() {
    resume.data = exampleResume();
  }

  const orderedKeys = $derived(
    resume.settings.sectionOrder.filter((k): k is Exclude<SectionKey, `custom:${string}`> => !k.startsWith('custom:')),
  );

  function counts(key: string): string {
    const d = resume.data;
    switch (key) {
      case 'work': return d.work.length ? `${d.work.length}` : '';
      case 'projects': return d.projects.length ? `${d.projects.length}` : '';
      case 'education': return d.education.length ? `${d.education.length}` : '';
      case 'skills': return d.skills.length ? `${d.skills.length} groups` : '';
      case 'certifications': return d.certifications.length ? `${d.certifications.length}` : '';
      case 'languages': return d.languages.length ? `${d.languages.length}` : '';
      default: return '';
    }
  }
</script>

<div class="flex flex-col gap-3">
  {#if isEmpty}
    <div class="card p-4 border-dashed !border-[#3a4150] text-center">
      <p class="text-sm text-[#8b93a3]">Starting from scratch?</p>
      <button type="button" class="btn btn-primary btn-sm mt-2" onclick={loadExample}>Load example resume</button>
    </div>
  {/if}

  <FormSection title="Basics" subtitle={resume.data.basics.fullName} bind:open={openStates.basics}>
    <BasicsForm data={resume.data} />
  </FormSection>

  {#each orderedKeys as key (key)}
    {#if key === 'summary'}
      <FormSection title={SECTION_LABELS.summary} bind:open={openStates.summary}>
        <textarea
          class="input"
          rows="4"
          bind:value={resume.data.summary}
          placeholder="2–3 sentences: who you are, what you ship, what you're looking for."
          aria-label="Summary"
        ></textarea>
      </FormSection>
    {:else if key === 'work'}
      <FormSection title={SECTION_LABELS.work} subtitle={counts('work')} bind:open={openStates.work}>
        <WorkForm data={resume.data} />
      </FormSection>
    {:else if key === 'projects'}
      <FormSection title={SECTION_LABELS.projects} subtitle={counts('projects')} bind:open={openStates.projects}>
        <ProjectsForm data={resume.data} />
      </FormSection>
    {:else if key === 'education'}
      <FormSection title={SECTION_LABELS.education} subtitle={counts('education')} bind:open={openStates.education}>
        <EducationForm data={resume.data} />
      </FormSection>
    {:else if key === 'skills'}
      <FormSection title={SECTION_LABELS.skills} subtitle={counts('skills')} bind:open={openStates.skills}>
        <SkillsForm data={resume.data} />
      </FormSection>
    {:else if key === 'certifications'}
      <FormSection title={SECTION_LABELS.certifications} subtitle={counts('certifications')} bind:open={openStates.certifications}>
        <CertsForm data={resume.data} />
      </FormSection>
    {:else if key === 'languages'}
      <FormSection title={SECTION_LABELS.languages} subtitle={counts('languages')} bind:open={openStates.languages}>
        <LanguagesForm data={resume.data} />
      </FormSection>
    {/if}
  {/each}

  <FormSection
    title="Custom sections"
    subtitle={resume.data.customSections.length ? `${resume.data.customSections.length}` : ''}
    bind:open={openStates.custom}
  >
    <CustomSectionsForm data={resume.data} />
  </FormSection>
</div>
