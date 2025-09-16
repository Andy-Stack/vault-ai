<script lang="ts">
  import { Resolve } from "Services/DependencyService";
  import { MarkdownService } from "Services/MarkdownService";
  import { Services } from "Services/Services";

  export let messages: Array<{id: string, content: string, isUser: boolean}> = [];
  
  let chatContainer: HTMLDivElement;
  let markdownService: MarkdownService;
  
  // Initialize service once
  try {
    markdownService = Resolve(Services.MarkdownService);
  } catch (error) {
    console.error('Failed to initialize MarkdownService:', error);
  }
  
  // Process each message content with markdown
  $: processedMessages = messages.map((message) => {
    if (message.isUser) {
      return {
        ...message,
        htmlContent: `<p>${message.content}</p>`
      };
    } else {
      let htmlContent;
      try {
        htmlContent = markdownService?.formatToHTML(message.content) || `<p>${message.content}</p>`;
      } catch (err) {
        console.error('HTML processing failed:', err);
        htmlContent = `<p>${message.content}</p>`;
      }
      return {
        ...message,
        htmlContent
      };
    }
  });
</script>

<div class="chat-area" bind:this={chatContainer}>
  {#each processedMessages as message (message.id)}
    <div class="message-container" class:user={message.isUser} class:assistant={!message.isUser}>
      <div class="message-bubble" class:user={message.isUser} class:assistant={!message.isUser}>
        {#if message.isUser}
          <p>{message.content}</p>
        {:else}
          <div class="markdown-content">
            {@html message.htmlContent}
          </div>
        {/if}
      </div>
    </div>
  {/each}
  
  {#if messages.length === 0}
    <div class="empty-state">
      <p>Start a conversation by typing a message below.</p>
    </div>
  {/if}
</div>

<!-- Keep your existing styles -->
<style>
  .chat-area {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding: var(--size-4-3);
    gap: var(--p-spacing);
  }
  
  .message-container {
    display: flex;
  }
  
  .message-container.user {
    justify-content: flex-end;
  }
  
  .message-container.assistant {
    justify-content: flex-start;
  }
  
  .message-bubble {
    word-wrap: break-word;
  }

  .message-bubble.user {
    word-wrap: break-word;
    max-width: 70%;
    border: var(--border-width) solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    padding: 0px var(--size-4-2);
  }

  .message-bubble.assistant {
    word-wrap: break-word;
    max-width: 100%;
  }
  
  .empty-state {
    justify-content: center;
    align-items: center;
    font-style: italic;
    color: var(--text-muted);
    pointer-events: none;
  }
  
  .markdown-content {
    line-height: 1.6;
  }
  
  /* Keep all your existing markdown styles */
  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3),
  .markdown-content :global(h4),
  .markdown-content :global(h5),
  .markdown-content :global(h6) {
    margin: 1rem 0 0.5rem 0;
    color: var(--text-normal);
  }
  
  .markdown-content :global(h1) { font-size: 1.5em; }
  .markdown-content :global(h2) { font-size: 1.3em; }
  .markdown-content :global(h3) { font-size: 1.1em; }
  
  .markdown-content :global(p) {
    margin: 0.5rem 0;
  }
  
  .markdown-content :global(pre) {
    background-color: var(--background-modifier-border);
    padding: 1rem;
    border-radius: var(--radius-s);
    overflow-x: auto;
    margin: 0.5rem 0;
  }
  
  .markdown-content :global(code) {
    background-color: var(--background-modifier-border);
    padding: 2px 4px;
    border-radius: var(--radius-s);
    font-family: var(--font-monospace, 'Courier New', monospace);
    font-size: 0.9em;
  }
  
  .markdown-content :global(pre code) {
    background-color: transparent;
    padding: 0;
  }
  
  .markdown-content :global(blockquote) {
    border-left: 4px solid var(--background-modifier-border);
    margin: 1rem 0;
    padding-left: 1rem;
    color: var(--text-muted);
  }
  
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }
  
  .markdown-content :global(li) {
    margin: 0.25rem 0;
  }
  
  .markdown-content :global(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
    border: 1px solid var(--background-modifier-border);
  }
  
  .markdown-content :global(th),
  .markdown-content :global(td) {
    border: 1px solid var(--background-modifier-border);
    padding: 8px 12px;
    text-align: left;
  }
  
  .markdown-content :global(th) {
    background-color: var(--background-modifier-border);
    font-weight: bold;
  }
  
  .markdown-content :global(a) {
    color: var(--text-accent);
    text-decoration: none;
  }
  
  .markdown-content :global(a:hover) {
    text-decoration: underline;
  }
</style>