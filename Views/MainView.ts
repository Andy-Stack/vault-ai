import { ItemView, WorkspaceLeaf } from 'obsidian';
import { mount, unmount } from 'svelte';
import ChatWindow from 'Components/ChatWindow.svelte';

export const VIEW_TYPE_MAIN = 'main-view';

export class MainView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  input: ReturnType<typeof ChatWindow> | undefined;

  getViewType() {
    return VIEW_TYPE_MAIN;
  }

  getDisplayText() {
    return 'Main View';
  }

  async onOpen() {
    const container = this.contentEl;
    container.empty();
    
    this.input = mount(ChatWindow, {
      target: container,
      props: {}
    });
  }

  async onClose() {
    if (this.input) {
      unmount(this.input);
    }
  }
}