<script lang="ts">
  import type { ResumeData, SectionKey } from '../types';
  import { sectionLabel } from './format';
  import WorkSection from './sections/WorkSection.svelte';
  import ProjectsSection from './sections/ProjectsSection.svelte';
  import EducationSection from './sections/EducationSection.svelte';
  import SkillsSection from './sections/SkillsSection.svelte';
  import CertsSection from './sections/CertsSection.svelte';
  import LanguagesSection from './sections/LanguagesSection.svelte';
  import CustomSectionCmp from './sections/CustomSection.svelte';
  import SectionHeading from './sections/SectionHeading.svelte';

  let { data, sections }: { data: ResumeData; sections: SectionKey[] } = $props();
</script>

{#each sections as key (key)}
  {#if key === 'summary'}
    <section class="sec">
      <SectionHeading title={sectionLabel(key, data)} />
      <p class="entry-body summary">{data.summary}</p>
    </section>
  {:else if key === 'work'}
    <WorkSection entries={data.work} />
  {:else if key === 'projects'}
    <ProjectsSection entries={data.projects} />
  {:else if key === 'education'}
    <EducationSection entries={data.education} />
  {:else if key === 'skills'}
    <SkillsSection groups={data.skills} />
  {:else if key === 'certifications'}
    <CertsSection entries={data.certifications} />
  {:else if key === 'languages'}
    <LanguagesSection entries={data.languages} />
  {:else}
    {@const custom = data.customSections.find((s) => `custom:${s.id}` === key)}
    {#if custom}
      <CustomSectionCmp section={custom} />
    {/if}
  {/if}
{/each}
