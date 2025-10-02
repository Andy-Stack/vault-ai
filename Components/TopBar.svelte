<script lang="ts">
  import { Resolve } from '../Services/DependencyService';
  import { Services } from '../Services/Services';
  import type AIAgentPlugin from '../main';
  import { setIcon } from 'obsidian';

  const plugin = Resolve<AIAgentPlugin>(Services.AIAgentPlugin);

  function openSettings() {
    // @ts-ignore - accessing internal API
    plugin.app.setting.open();
    // @ts-ignore - accessing internal API
    plugin.app.setting.openTabById(plugin.manifest.id);
  }

  let settingsButton: HTMLButtonElement;

  $: if (settingsButton) {
    setIcon(settingsButton, 'settings');
  }
</script>

<main class="top-bar">
  <div class="top-bar-content">
    <button
      bind:this={settingsButton}
      class="settings-button clickable-icon"
      on:click={openSettings}
      aria-label="Open plugin settings"
    ></button>
  </div>
</main>

<style>
  .top-bar {
    display: grid;
    background-color: transparent;
    grid-template-rows: var(--size-4-3) 1fr var(--size-4-3);
    grid-template-columns: var(--size-4-3) 1fr var(--size-4-3);
    height: var(--size-4-16);
    margin-left: calc(var(--size-4-3) * -1);
    margin-right: calc(var(--size-4-3) * -1);
  }

  .top-bar-content {
    grid-row: 2;
    grid-column: 2;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: var(--size-4-2) auto 1fr var(--size-4-2);
    background-color: var(--color-base-30);
    border-radius: var(--radius-m);
  }

  .settings-button {
    grid-row: 1;
    grid-column: 2;
    background: none;
    border: none;
    margin: var(--size-4-2) 0px var(--size-4-2) 0px;
    padding: var(--size-4-1) var(--size-4-2) var(--size-4-1) var(--size-4-2);
    color: var(--text-muted);
  }

  .settings-button:hover {
    background-color: var(--color-base-35);
  }
</style>
