<script lang="ts">
  import type { SkillGroup } from '../../types';
  import SectionHeading from './SectionHeading.svelte';
  import EditableText from '../EditableText.svelte';

  let { groups, title = 'Skills', editable = false }: { groups: SkillGroup[]; title?: string; editable?: boolean } = $props();

  function onItemsChange(group: SkillGroup, v: string) {
    group.items = v.split(',').map((t) => t.trim()).filter(Boolean);
  }
</script>

<section class="sec">
  <SectionHeading {title} />
  <div class="skill-groups">
    {#each groups as group (group.id)}
      <div class="skill-group">
        {#if group.label || editable}
          <EditableText as="span" class="skill-label" value={group.label} onchange={(v) => (group.label = v)} {editable} placeholder="Group" />
        {/if}
        {#if editable}
          <EditableText
            as="span"
            class="skill-items-edit"
            value={group.items.join(', ')}
            onchange={(v) => onItemsChange(group, v)}
            editable
            placeholder="TypeScript, PHP, SQL…"
          />
        {:else}
          <ul class="skill-items">
            {#each group.items as item}
              <li class="skill-item">{item}</li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </div>
</section>
