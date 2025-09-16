import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkEmoji from 'remark-emoji';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

export class MarkdownService {
  private static processor: Processor<any, any, any, any, any> | null = null;

  constructor() {
    if (!MarkdownService.processor) {
      MarkdownService.processor = this.createProcessor();
    }
  }

  private createProcessor() {
    return unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkToc)
      .use(remarkEmoji)
      .use(remarkRehype, { allowDangerousHtml: false })
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeStringify);
  }

  /**
   * Formats LLM response text into HTML-friendly format
   * Handles output from Claude, ChatGPT, and Gemini
   * @param content - The raw LLM response text
   * @returns HTML string
   */
  formatToHTML(content: string): string {
    try {
      const preprocessedContent = this.preprocessContent(content);
      const result = MarkdownService.processor!.processSync(preprocessedContent);
      return String(result);
    } catch (error) {
      console.error('Markdown processing failed:', error);
      return `<p>${this.escapeHtml(content)}</p>`;
    }
  }

  private preprocessContent(content: string): string {
    return content
      // 1. LaTeX Math Notation (normalize different formats)
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$${equation}$$`)  // block math
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, equation) => `$${equation}$`)    // inline math
      
      // 2. Handle Code Block Language Tags (normalize variations)
      .replace(/```(\w+)\s*\n/g, '```$1\n')
      
      // 3. Fix Common Escape Issues (AI models sometimes over-escape)
      .replace(/\\`/g, '`')
      .replace(/\\\*/g, '*')
      .replace(/\\_/g, '_')
      
      // 4. Normalize Line Endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      
      // 5. Handle Triple Quotes (some models use these for code)
      .replace(/"""\s*(\w+)?\s*\n([\s\S]*?)\n"""/g, (match, lang, code) => {
        return lang ? `\`\`\`${lang}\n${code}\n\`\`\`` : `\`\`\`\n${code}\n\`\`\``;
      })
      
      // 6. Clean up Multiple Consecutive Newlines
      .replace(/\n{4,}/g, '\n\n\n')
      
      // 7. Handle Gemini's math-in-code-blocks tendency
      .replace(/```math\n([\s\S]*?)\n```/g, (_, equation) => {
        if (equation.includes('\\') || equation.includes('{') || equation.includes('^') || equation.includes('_')) {
          return `$$${equation}$$`;
        }
        return `\`\`\`\n${equation}\n\`\`\``;
      })
      
      // 8. Fix Bold/Italic Formatting Issues
      .replace(/\*\*\s+([^*]+)\s+\*\*/g, '**$1**')  // Remove extra spaces in bold
      .replace(/\*\s+([^*]+)\s+\*/g, '*$1*')        // Remove extra spaces in italic
      
      // 9. Fix Table Formatting Issues
      .replace(/^\|\s+/gm, '| ')    // Clean up table cell spacing
      .replace(/\s+\|$/gm, ' |')    // Clean up table cell spacing
      
      // 10. Handle Alternative List Markers
      .replace(/^•\s/gm, '- ')      // Convert bullet points to markdown
      .replace(/^→\s/gm, '- ')      // Convert arrows to markdown
      
      // 11. Fix Link Formatting Issues  
      .replace(/\[\s+([^\]]+)\s+\]/g, '[$1]')  // Remove spaces in link text
      
      // 12. Handle Footnote Variations
      .replace(/\[\^(\w+)\]:/g, '[^$1]:')  // Normalize footnote definitions
      
      // 13. Clean up Heading Formatting
      .replace(/^#+\s+/gm, (match) => match.replace(/\s+/g, ' ')); // Single space after #
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}