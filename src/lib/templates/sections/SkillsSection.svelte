<script lang="ts">
  import type { SkillGroup } from '../../types';
  import SectionHeading from './SectionHeading.svelte';

  let { groups, title = 'Skills' }: { groups: SkillGroup[]; title?: string } = $props();
</script>

<section class="sec">
  <SectionHeading {title} />
  <div class="skill-groups">
    {#each groups as group (group.id)}
      <div class="skill-group">
        {#if group.label}<span class="skill-label">{group.label}</span>{/if}
        <ul class="skill-items">
          {#each group.items as item}
            <li class="skill-item">{item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>
