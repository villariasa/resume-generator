<script lang="ts">
  import { app, toggleTheme } from '../state.svelte';
  import Icon from './Icon.svelte';
</script>

<button
  type="button"
  class="btn btn-ghost btn-sm"
  title={app.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
  aria-label={app.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
  onclick={toggleTheme}
>
  <Icon name={app.theme === 'dark' ? 'sun' : 'moon'} />
</button>
