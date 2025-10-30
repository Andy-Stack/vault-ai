/**
 * Test setup file - runs before all tests
 */

import { afterEach, vi } from 'vitest';

// Mock global window if needed
if (typeof global.window === 'undefined') {
	global.window = {} as any;
}

// Clean up after each test
afterEach(() => {
	vi.clearAllMocks();
});
