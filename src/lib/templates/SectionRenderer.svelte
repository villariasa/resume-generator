<script lang="ts">
  import type { ResumeData, SectionKey } from '../types';
  import { sectionLabel, sectionHasContent } from './format';
  import WorkSection from './sections/WorkSection.svelte';
  import ProjectsSection from './sections/ProjectsSection.svelte';
  import EducationSection from './sections/EducationSection.svelte';
  import SkillsSection from './sections/SkillsSection.svelte';
  import CertsSection from './sections/CertsSection.svelte';
  import LanguagesSection from './sections/LanguagesSection.svelte';
  import CustomSectionCmp from './sections/CustomSection.svelte';
  import SectionHeading from './sections/SectionHeading.svelte';

  let {
    data,
    sections,
    guide = null,
  }: {
    data: ResumeData;
    sections: SectionKey[];
    // Example data rendered as greyed-out guide content in sections the user
    // hasn't filled in yet. Guides never print/export (.ph is print-hidden).
    guide?: ResumeData | null;
  } = $props();
</script>

{#each sections as key (key)}
  {@const isGuide = !!guide && !key.startsWith('custom:') && !sectionHasContent(key, data)}
  {@const d = isGuide && guide ? guide : data}
  <div class={isGuide ? 'ph ph-block' : 'contents'}>
    {#if key === 'summary'}
      <section class="sec">
        <SectionHeading title={sectionLabel(key, data)} />
        <p class="entry-body summary">{d.summary}</p>
      </section>
    {:else if key === 'work'}
      <WorkSection entries={d.work} />
    {:else if key === 'projects'}
      <ProjectsSection entries={d.projects} />
    {:else if key === 'education'}
      <EducationSection entries={d.education} />
    {:else if key === 'skills'}
      <SkillsSection groups={d.skills} />
    {:else if key === 'certifications'}
      <CertsSection entries={d.certifications} />
    {:else if key === 'languages'}
      <LanguagesSection entries={d.languages} />
    {:else}
      {@const custom = data.customSections.find((s) => `custom:${s.id}` === key)}
      {#if custom}
        <CustomSectionCmp section={custom} />
      {/if}
    {/if}
  </div>
{/each}
