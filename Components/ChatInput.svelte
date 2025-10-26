<script lang="ts">
  import { tick } from "svelte";
  import { setIcon } from "obsidian";

  export let hasNoApiKey: boolean;
  export let isSubmitting: boolean;
  export let editModeActive: boolean;
  export let onsubmit: (userRequest: string) => void;
  export let ontoggleeditmode: () => void;
  export let onstop: () => void;

  let textareaElement: HTMLDivElement;
  let submitButton: HTMLButtonElement;
  let editModeButton: HTMLButtonElement;
  let userRequest = "";

  export function focusInput() {
    tick().then(() => {
      textareaElement?.focus();
    });
  }

  function handleStop() {
    onstop();
  }

  function handleSubmit() {
    if (userRequest.trim() === "" || isSubmitting) {
      return;
    }

    const currentRequest = userRequest;
    textareaElement.textContent = "";
    userRequest = "";

    onsubmit(currentRequest);
  }

  function toggleEditMode() {
    ontoggleeditmode();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSubmit();
      }
    }
  }

  function handleInput() {
    if (textareaElement) {
      userRequest = textareaElement.textContent || "";
      if (userRequest.trim() === "") {
        textareaElement.textContent = "";
      }
    }
  }

  $: if (submitButton) {
    setIcon(submitButton, isSubmitting ? "square" : "send-horizontal");
  }

  $: if (editModeButton) {
    setIcon(editModeButton, editModeActive ? "pencil" : "pencil-off");
  }
</script>

<div id="input-container" class:edit-mode={editModeActive}>
  <div
    id="input-field"
    class:error={hasNoApiKey}
    class:edit-mode={editModeActive && !hasNoApiKey}
    bind:this={textareaElement}
    contenteditable="true"
    on:keydown={handleKeydown}
    on:input={handleInput}
    data-placeholder="Type a message..."
    role="textbox"
    aria-multiline="true"
    tabindex="0">
  </div>

  <button
    id="edit-mode-button"
    class:edit-mode={editModeActive}
    bind:this={editModeButton}
    on:click={() => { toggleEditMode() }}
    disabled={isSubmitting}
    aria-label={editModeActive ? "Turn off Agent Mode" : "Turn on Agent Mode"}>
  </button>

  <button
    id="submit-button"
    class:edit-mode={editModeActive}
    bind:this={submitButton}
    on:click={() => { isSubmitting ? handleStop() : handleSubmit() }}
    disabled={!isSubmitting && userRequest.trim() === ""}
    aria-label={isSubmitting ? "Cancel" : "Send Message"}>
  </button>
</div>

<style>
  #input-container {
    grid-row: 2;
    grid-column: 1;
    display: grid;
    grid-template-rows: var(--size-4-3) 1fr var(--size-4-3);
    grid-template-columns: var(--size-4-3) 1fr var(--size-4-2) auto var(--size-4-2) auto var(--size-4-3);
    border-radius: var(--modal-radius);
    background-color: var(--background-primary);
  }

  #input-container.edit-mode {
    border-color: var(--alt-interactive-accent);
    transition: border-color 0.5s ease-out;
  }

  #input-field {
    grid-row: 2;
    grid-column: 2;
    height: 100%;
    max-height: 30vh;
    border-radius: var(--input-radius);
    font-weight: var(--input-font-weight);
    border-width: var(--input-border-width);
    border-style: solid;
    border-color: var(--background-modifier-border);
    padding: var(--size-2-2) var(--size-2-3);
    background-color: var(--background-primary);
    font-family: var(--font-interface-theme);
    resize: none;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    color: var(--font-interface-theme);
    transition: border-color 0.5s ease-out;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  #input-field:focus {
    border-color: var(--color-accent);
    box-shadow: 0px 0px 4px 1px var(--color-accent);
    transition: border-color 0.5s ease-out;
  }

  #input-field.edit-mode:focus {
    border-color: var(--alt-interactive-accent);
    box-shadow: 0px 0px 3px 1px var(--alt-interactive-accent);
    transition: border-color 0.5s ease-out;
  }

  #input-field.error,
  #input-field.error:focus {
    border-color: var(--color-red);
    box-shadow: 0px 0px 4px 1px var(--color-red);
    transition: border-color 0.5s ease-out;
  }

  #input-field::-webkit-scrollbar {
    display: none;
  }

  #input-field:empty::before {
    content: attr(data-placeholder);
    color: var(--text-muted);
    opacity: 0.75;
    pointer-events: none;
  }

  #input-field[contenteditable]:focus {
    outline: none;
  }

  #edit-mode-button {
    grid-row: 2;
    grid-column: 4;
    border-radius: var(--button-radius);
    align-self: end;
    transition-duration: 0.5s;
  }

  #submit-button {
    grid-row: 2;
    grid-column: 6;
    border-radius: var(--button-radius);
    padding-left: var(--size-4-5);
    padding-right: var(--size-4-5);
    align-self: end;
    transition-duration: 0.5s;
    background-color: var(--interactive-accent);
  }

  #submit-button:not(:disabled):hover {
    cursor: pointer;
    background-color: var(--interactive-accent-hover);
  }

  #submit-button.edit-mode {
    background-color: var(--alt-interactive-accent);
  }

  #submit-button.edit-mode:not(:disabled):hover {
    cursor: pointer;
    background-color: var(--alt-interactive-accent-hover);
  }
</style>
