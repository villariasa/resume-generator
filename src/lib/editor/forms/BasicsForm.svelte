<script lang="ts">
  import type { ResumeData } from '../../types';
  import { uid } from '../../utils';

  let { data }: { data: ResumeData } = $props();

  function addLink() {
    data.basics.links.push({ id: uid(), label: '', url: '' });
  }

  function onPhoto(e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (data.basics.photoDataUrl = reader.result as string);
    reader.readAsDataURL(file);
  }
</script>

<!-- A real <form> with name/autocomplete attributes so browser autofill
     offers suggestions for every contact field, not just the email input. -->
<form autocomplete="on" onsubmit={(e) => e.preventDefault()}>
  <div class="grid grid-cols-2 gap-3">
    <div class="col-span-2">
      <label class="label" for="f-name">Full name</label>
      <input id="f-name" name="name" autocomplete="name" class="input" bind:value={data.basics.fullName} placeholder="Jordan Reyes" />
    </div>
    <div class="col-span-2">
      <label class="label" for="f-headline">Headline</label>
      <input id="f-headline" name="job-title" autocomplete="organization-title" class="input" bind:value={data.basics.headline} placeholder="Full-Stack Web Developer" />
    </div>
    <div>
      <label class="label" for="f-email">Email</label>
      <input id="f-email" name="email" autocomplete="email" class="input" type="email" bind:value={data.basics.email} placeholder="you@example.com" />
    </div>
    <div>
      <label class="label" for="f-phone">Phone</label>
      <input id="f-phone" name="tel" autocomplete="tel" class="input" type="tel" bind:value={data.basics.phone} placeholder="+63 912 345 6789" />
    </div>
    <div>
      <label class="label" for="f-location">Location</label>
      <input id="f-location" name="city" autocomplete="address-level2" class="input" bind:value={data.basics.location} placeholder="Cebu City, PH" />
    </div>
    <div>
      <label class="label" for="f-website">Website</label>
      <input id="f-website" name="url" autocomplete="url" class="input" bind:value={data.basics.website} placeholder="yoursite.com" />
    </div>
  </div>
</form>

<div class="mt-3">
  <span class="label">Links (GitHub, LinkedIn…)</span>
  {#each data.basics.links as link, i (link.id)}
    <div class="flex gap-2 mb-2">
      <input class="input !w-32" bind:value={link.label} placeholder="GitHub" aria-label="Link label" />
      <input class="input" bind:value={link.url} placeholder="github.com/you" aria-label="Link URL" />
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Remove link" onclick={() => data.basics.links.splice(i, 1)}>✕</button>
    </div>
  {/each}
  <button type="button" class="btn btn-ghost btn-sm" onclick={addLink}>+ Add link</button>
</div>

<div class="mt-3 flex items-center gap-3">
  <div class="min-w-0">
    <span class="label">Photo (used by templates that support it)</span>
    <input class="text-xs text-[var(--chrome-muted)]" type="file" accept="image/*" onchange={onPhoto} />
  </div>
  {#if data.basics.photoDataUrl}
    <img src={data.basics.photoDataUrl} alt="" class="w-10 h-10 rounded-full object-cover border border-[var(--chrome-border)]" />
    <button type="button" class="btn btn-ghost btn-sm" onclick={() => (data.basics.photoDataUrl = undefined)}>Remove</button>
  {/if}
</div>
