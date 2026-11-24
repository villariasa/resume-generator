<script lang="ts">
  import { app, newResume, openResume } from './lib/state.svelte';
  import { decodeShareFragment } from './lib/share';
  import { getLastOpenId, loadResume } from './lib/storage';
  import GalleryView from './lib/gallery/GalleryView.svelte';
  import EditorView from './lib/editor/EditorView.svelte';
  import ViewerView from './lib/viewer/ViewerView.svelte';

  // Theme class on <html> — light is the default, dark is opt-in.
  $effect(() => {
    document.documentElement.classList.toggle('dark', app.theme === 'dark');
  });

  // Boot: share fragment → viewer; last-opened resume → editor; else gallery.
  const shared = decodeShareFragment(location.hash);
  if (shared) {
    app.shared = { data: shared.data, settings: shared.settings };
    app.view = 'viewer';
    history.replaceState(null, '', location.pathname + location.search);
  } else {
    const lastId = getLastOpenId();
    const last = lastId ? loadResume(lastId) : null;
    if (last) {
      app.current = last;
      app.view = 'editor';
    }
  }
</script>

{#if app.view === 'gallery'}
  <GalleryView />
{:else if app.view === 'editor' && app.current}
  <EditorView />
{:else if app.view === 'viewer' && app.shared}
  <ViewerView />
{:else}
  <GalleryView />
{/if}
