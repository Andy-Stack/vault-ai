import { describe, it, expect, beforeEach } from 'vitest';
import { InputService } from '../../Services/InputService';

/**
 * UNIT TESTS
 *
 * These tests cover the straightforward methods of InputService that don't
 * require complex DOM/Selection API mocking. Methods involving cursor manipulation
 * and Selection/Range APIs are not covered here due to testing complexity.
 */

describe('InputService', () => {
	let service: InputService;

	beforeEach(() => {
		service = new InputService();
	});

	describe('isPrintableKey', () => {
		it('should return true for single character keys', () => {
			expect(service.isPrintableKey('a')).toBe(true);
			expect(service.isPrintableKey('Z')).toBe(true);
			expect(service.isPrintableKey('5')).toBe(true);
			expect(service.isPrintableKey('!')).toBe(true);
			expect(service.isPrintableKey(' ')).toBe(true);
			expect(service.isPrintableKey('@')).toBe(true);
			expect(service.isPrintableKey('#')).toBe(true);
			expect(service.isPrintableKey('/')).toBe(true);
		});

		it('should return false for multi-character keys', () => {
			expect(service.isPrintableKey('Shift')).toBe(false);
			expect(service.isPrintableKey('Control')).toBe(false);
			expect(service.isPrintableKey('Alt')).toBe(false);
			expect(service.isPrintableKey('Escape')).toBe(false);
			expect(service.isPrintableKey('ArrowUp')).toBe(false);
			expect(service.isPrintableKey('ArrowDown')).toBe(false);
			expect(service.isPrintableKey('ArrowLeft')).toBe(false);
			expect(service.isPrintableKey('ArrowRight')).toBe(false);
			expect(service.isPrintableKey('Backspace')).toBe(false);
			expect(service.isPrintableKey('Delete')).toBe(false);
		});

		it('should return true for Enter key', () => {
			expect(service.isPrintableKey('Enter')).toBe(true);
		});

		it('should return true for Tab key', () => {
			expect(service.isPrintableKey('Tab')).toBe(true);
		});

		it('should return false when ctrl key is pressed', () => {
			expect(service.isPrintableKey('a', true, false)).toBe(false);
			expect(service.isPrintableKey('c', true, false)).toBe(false);
			expect(service.isPrintableKey('v', true, false)).toBe(false);
			expect(service.isPrintableKey('Enter', true, false)).toBe(false);
		});

		it('should return false when meta key is pressed', () => {
			expect(service.isPrintableKey('a', false, true)).toBe(false);
			expect(service.isPrintableKey('c', false, true)).toBe(false);
			expect(service.isPrintableKey('v', false, true)).toBe(false);
			expect(service.isPrintableKey('Enter', false, true)).toBe(false);
		});

		it('should return false when both ctrl and meta keys are pressed', () => {
			expect(service.isPrintableKey('a', true, true)).toBe(false);
			expect(service.isPrintableKey('Enter', true, true)).toBe(false);
		});

		it('should handle empty string', () => {
			expect(service.isPrintableKey('')).toBe(false);
		});

		it('should handle unicode characters', () => {
			expect(service.isPrintableKey('é')).toBe(true);
			expect(service.isPrintableKey('ñ')).toBe(true);
			// Emoji are typically 2+ characters (surrogate pairs), so they're not printable keys
			expect(service.isPrintableKey('🎉')).toBe(false);
		});

		it('should handle special function keys', () => {
			expect(service.isPrintableKey('F1')).toBe(false);
			expect(service.isPrintableKey('F12')).toBe(false);
		});

		it('should handle meta/control keys themselves', () => {
			expect(service.isPrintableKey('Meta')).toBe(false);
			expect(service.isPrintableKey('Control')).toBe(false);
		});
	});

	describe('isInSearchZone', () => {
		it('should return true when current position is greater than trigger position', () => {
			expect(service.isInSearchZone(5, 3)).toBe(true);
			expect(service.isInSearchZone(10, 0)).toBe(true);
			expect(service.isInSearchZone(100, 50)).toBe(true);
		});

		it('should return false when current position equals trigger position', () => {
			expect(service.isInSearchZone(5, 5)).toBe(false);
			expect(service.isInSearchZone(0, 0)).toBe(false);
			expect(service.isInSearchZone(100, 100)).toBe(false);
		});

		it('should return false when current position is less than trigger position', () => {
			expect(service.isInSearchZone(3, 5)).toBe(false);
			expect(service.isInSearchZone(0, 10)).toBe(false);
			expect(service.isInSearchZone(50, 100)).toBe(false);
		});

		it('should handle position 0', () => {
			expect(service.isInSearchZone(0, 0)).toBe(false);
			expect(service.isInSearchZone(1, 0)).toBe(true);
			expect(service.isInSearchZone(0, 1)).toBe(false);
		});

		it('should handle negative positions', () => {
			expect(service.isInSearchZone(-1, -2)).toBe(true);
			expect(service.isInSearchZone(-2, -1)).toBe(false);
			expect(service.isInSearchZone(0, -1)).toBe(true);
		});

		it('should handle large position values', () => {
			expect(service.isInSearchZone(1000000, 999999)).toBe(true);
			expect(service.isInSearchZone(999999, 1000000)).toBe(false);
		});

		it('should handle boundary case: consecutive positions', () => {
			expect(service.isInSearchZone(6, 5)).toBe(true);
			expect(service.isInSearchZone(5, 6)).toBe(false);
		});
	});

	describe('getCharacterAtPosition', () => {
		let element: HTMLDivElement;

		beforeEach(() => {
			element = document.createElement('div');
		});

		it('should return character at valid position', () => {
			element.textContent = 'Hello World';

			expect(service.getCharacterAtPosition(0, element)).toBe('H');
			expect(service.getCharacterAtPosition(1, element)).toBe('e');
			expect(service.getCharacterAtPosition(6, element)).toBe('W');
			expect(service.getCharacterAtPosition(10, element)).toBe('d');
		});

		it('should return empty string for position beyond text length', () => {
			element.textContent = 'Hello';

			expect(service.getCharacterAtPosition(5, element)).toBe('');
			expect(service.getCharacterAtPosition(10, element)).toBe('');
			expect(service.getCharacterAtPosition(100, element)).toBe('');
		});

		it('should return empty string for negative position', () => {
			element.textContent = 'Hello';

			expect(service.getCharacterAtPosition(-1, element)).toBe('');
			expect(service.getCharacterAtPosition(-10, element)).toBe('');
		});

		it('should return empty string for empty element', () => {
			element.textContent = '';

			expect(service.getCharacterAtPosition(0, element)).toBe('');
			expect(service.getCharacterAtPosition(1, element)).toBe('');
		});

		it('should handle element with null textContent', () => {
			// Explicitly set to null (though DOM usually gives empty string)
			Object.defineProperty(element, 'textContent', { value: null, writable: true });

			expect(service.getCharacterAtPosition(0, element)).toBe('');
		});

		it('should handle single character text', () => {
			element.textContent = 'A';

			expect(service.getCharacterAtPosition(0, element)).toBe('A');
			expect(service.getCharacterAtPosition(1, element)).toBe('');
		});

		it('should handle spaces and special characters', () => {
			element.textContent = '  @#$  ';

			expect(service.getCharacterAtPosition(0, element)).toBe(' ');
			expect(service.getCharacterAtPosition(2, element)).toBe('@');
			expect(service.getCharacterAtPosition(3, element)).toBe('#');
			expect(service.getCharacterAtPosition(4, element)).toBe('$');
		});

		it('should handle unicode characters', () => {
			element.textContent = 'café';

			expect(service.getCharacterAtPosition(0, element)).toBe('c');
			expect(service.getCharacterAtPosition(3, element)).toBe('é');
			// Note: Emoji like 🎉 are surrogate pairs (2 JS characters), so we test simpler unicode
		});

		it('should handle newlines', () => {
			element.textContent = 'line1\nline2';

			expect(service.getCharacterAtPosition(5, element)).toBe('\n');
			expect(service.getCharacterAtPosition(6, element)).toBe('l');
		});

		it('should handle tabs', () => {
			element.textContent = 'before\tafter';

			expect(service.getCharacterAtPosition(6, element)).toBe('\t');
		});

		it('should work with nested elements', () => {
			// Even with nested elements, textContent flattens to a single string
			const span = document.createElement('span');
			span.textContent = 'World';
			element.textContent = 'Hello ';
			element.appendChild(span);

			// textContent should now be "Hello World"
			expect(service.getCharacterAtPosition(0, element)).toBe('H');
			expect(service.getCharacterAtPosition(6, element)).toBe('W');
		});
	});

	describe('stripHtml', () => {
		it('should remove simple HTML tags', () => {
			expect(service.stripHtml('<p>Hello</p>')).toBe('Hello');
			expect(service.stripHtml('<div>World</div>')).toBe('World');
			expect(service.stripHtml('<span>Test</span>')).toBe('Test');
		});

		it('should remove nested HTML tags', () => {
			expect(service.stripHtml('<div><p>Hello</p></div>')).toBe('Hello');
			expect(service.stripHtml('<div><span><b>Bold</b></span></div>')).toBe('Bold');
		});

		it('should preserve text content', () => {
			expect(service.stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
			expect(service.stripHtml('<div>Line 1<br>Line 2</div>')).toBe('Line 1Line 2');
		});

		it('should handle empty string', () => {
			expect(service.stripHtml('')).toBe('');
		});

		it('should handle plain text without HTML', () => {
			expect(service.stripHtml('Plain text')).toBe('Plain text');
			expect(service.stripHtml('No tags here!')).toBe('No tags here!');
		});

		it('should handle HTML with attributes', () => {
			expect(service.stripHtml('<p class="test" id="para">Content</p>')).toBe('Content');
			expect(service.stripHtml('<a href="http://example.com">Link</a>')).toBe('Link');
		});

		it('should handle self-closing tags', () => {
			expect(service.stripHtml('Before<br/>After')).toBe('BeforeAfter');
			expect(service.stripHtml('Text<img src="image.png"/>More')).toBe('TextMore');
		});

		it('should handle multiple paragraphs', () => {
			const html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>';
			expect(service.stripHtml(html)).toBe('Paragraph 1Paragraph 2Paragraph 3');
		});

		it('should handle HTML entities', () => {
			// Note: innerHTML parsing automatically converts entities
			expect(service.stripHtml('&lt;div&gt;')).toBe('<div>');
			expect(service.stripHtml('&amp;')).toBe('&');
			expect(service.stripHtml('&quot;')).toBe('"');
		});

		it('should handle special characters', () => {
			expect(service.stripHtml('<p>Special: @#$%</p>')).toBe('Special: @#$%');
			expect(service.stripHtml('<div>Math: 1 + 1 = 2</div>')).toBe('Math: 1 + 1 = 2');
		});

		it('should handle unicode characters', () => {
			expect(service.stripHtml('<p>café</p>')).toBe('café');
			expect(service.stripHtml('<div>🎉 Party!</div>')).toBe('🎉 Party!');
		});

		it('should handle malformed HTML gracefully', () => {
			expect(service.stripHtml('<p>Unclosed tag')).toBe('Unclosed tag');
			expect(service.stripHtml('<div><p>Nested unclosed')).toBe('Nested unclosed');
		});

		it('should handle script and style tags', () => {
			// Browser behavior: script/style content is typically included in textContent
			const withScript = '<div>Text<script>alert("test")</script>More</div>';
			const result = service.stripHtml(withScript);
			// Script content might be included depending on browser implementation
			expect(result).toContain('Text');
			expect(result).toContain('More');
		});

		it('should handle whitespace preservation', () => {
			expect(service.stripHtml('<p>  Spaces  </p>')).toBe('  Spaces  ');
			expect(service.stripHtml('<div>\n\tTabs\n</div>')).toContain('Tabs');
		});

		it('should handle complex nested structures', () => {
			const html = `
				<div class="container">
					<header>
						<h1>Title</h1>
					</header>
					<main>
						<p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
					</main>
				</div>
			`;
			const result = service.stripHtml(html);
			expect(result).toContain('Title');
			expect(result).toContain('Paragraph with bold and italic text.');
		});

		it('should handle empty tags', () => {
			expect(service.stripHtml('<p></p>')).toBe('');
			expect(service.stripHtml('<div><span></span></div>')).toBe('');
		});

		it('should handle mixed content', () => {
			const html = 'Text before<p>Inside tag</p>Text after';
			expect(service.stripHtml(html)).toBe('Text beforeInside tagText after');
		});
	});
});
