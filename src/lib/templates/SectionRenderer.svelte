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
  import EditableText from './EditableText.svelte';

  let {
    data,
    sections,
    guide = null,
    editable = false,
  }: {
    data: ResumeData;
    sections: SectionKey[];
    // Example data rendered as greyed-out guide content in sections the user
    // hasn't filled in yet. Guides never print/export (.ph is print-hidden).
    guide?: ResumeData | null;
    // Click-to-edit directly on the page. Never applied to guide content —
    // guide sections stay a read-only preview until a real entry exists.
    editable?: boolean;
  } = $props();
</script>

{#each sections as key (key)}
  {@const isGuide = !!guide && !key.startsWith('custom:') && !sectionHasContent(key, data)}
  {@const d = isGuide && guide ? guide : data}
  {@const sectionEditable = editable && !isGuide}
  <div class={isGuide ? 'ph ph-block' : 'contents'}>
    {#if key === 'summary'}
      <section class="sec">
        <SectionHeading title={sectionLabel(key, data)} />
        <EditableText
          as="p"
          class="entry-body summary"
          value={d.summary}
          onchange={(v) => (data.summary = v)}
          editable={sectionEditable}
          placeholder="2–3 sentences: who you are, what you ship, what you're looking for."
        />
      </section>
    {:else if key === 'work'}
      <WorkSection entries={d.work} editable={sectionEditable} />
    {:else if key === 'projects'}
      <ProjectsSection entries={d.projects} editable={sectionEditable} />
    {:else if key === 'education'}
      <EducationSection entries={d.education} editable={sectionEditable} />
    {:else if key === 'skills'}
      <SkillsSection groups={d.skills} editable={sectionEditable} />
    {:else if key === 'certifications'}
      <CertsSection entries={d.certifications} editable={sectionEditable} />
    {:else if key === 'languages'}
      <LanguagesSection entries={d.languages} editable={sectionEditable} />
    {:else}
      {@const custom = data.customSections.find((s) => `custom:${s.id}` === key)}
      {#if custom}
        <CustomSectionCmp section={custom} editable={sectionEditable} />
      {/if}
    {/if}
  </div>
{/each}
