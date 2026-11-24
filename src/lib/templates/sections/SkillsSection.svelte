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
        <span class="skill-items">
          {#each group.items as item, i}
            {#if i > 0}<span class="skill-sep">, </span>{/if}<span class="skill-item">{item}</span>
          {/each}
        </span>
      </div>
    {/each}
  </div>
</section>
