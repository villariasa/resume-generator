<script lang="ts">
  // Click-to-edit text directly on the resume page itself (not just the side
  // form). Plain contenteditable — commits on blur, Enter blurs (single-line),
  // Escape reverts. Inert (renders as plain text) when `editable` is false,
  // so gallery previews, the shared viewer, and print never show it.
  let {
    value,
    onchange,
    as = 'span',
    class: cls = '',
    editable = false,
    placeholder = '',
    multiline = false,
  }: {
    value: string;
    onchange: (v: string) => void;
    as?: string;
    class?: string;
    editable?: boolean;
    placeholder?: string;
    multiline?: boolean;
  } = $props();

  let el: HTMLElement | undefined = $state();

  function commit() {
    if (!el) return;
    // innerText mirrors CSS rendering (text-transform: uppercase/small-caps
    // included), which would silently upper-case stored data on templates
    // like Executive/Onyx. textContent is the raw typed text and is safe for
    // every single-line field; only multiline fields (which need the
    // rendering-aware line breaks innerText provides, and carry no
    // text-transform in any template) use innerText.
    const text = multiline ? el.innerText.replace(/\r/g, '') : (el.textContent ?? '');
    if (text !== value) onchange(text);
  }

  function onkeydown(e: KeyboardEvent) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      el?.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (el) el.textContent = value;
      el?.blur();
    }
  }
</script>

{#if editable}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <svelte:element
    this={as}
    bind:this={el}
    class="{cls} rg-editable"
    contenteditable="true"
    spellcheck="false"
    data-placeholder={placeholder}
    tabindex="0"
    aria-label={placeholder || 'Editable text'}
    onblur={commit}
    {onkeydown}
  >{value}</svelte:element>
{:else}
  <svelte:element this={as} class={cls}>{value}</svelte:element>
{/if}
