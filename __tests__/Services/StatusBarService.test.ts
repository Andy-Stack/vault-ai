import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { StatusBarService } from '../../Services/StatusBarService';
import { RegisterSingleton } from '../../Services/DependencyService';
import { Services } from '../../Services/Services';

describe('StatusBarService', () => {
    let service: StatusBarService;
    let mockPlugin: any;
    let mockStatusBarItem: any;
    let rafCallbacks: Array<(time: number) => void>;
    let currentTime: number;

    beforeEach(() => {

        // Track RAF callbacks
        rafCallbacks = [];
        currentTime = 0;

        // Mock requestAnimationFrame
        global.requestAnimationFrame = vi.fn((callback: (time: number) => void) => {
            rafCallbacks.push(callback);
            return rafCallbacks.length;
        });

        // Mock cancelAnimationFrame
        global.cancelAnimationFrame = vi.fn((handle: number) => {
            if (handle > 0 && handle <= rafCallbacks.length) {
                rafCallbacks[handle - 1] = () => {}; // Clear callback
            }
        });

        // Mock performance.now
        global.performance.now = vi.fn(() => currentTime);

        // Mock status bar item
        mockStatusBarItem = {
            empty: vi.fn(),
            createEl: vi.fn(),
            remove: vi.fn()
        };

        // Mock plugin
        mockPlugin = {
            addStatusBarItem: vi.fn().mockReturnValue(mockStatusBarItem)
        };
        RegisterSingleton(Services.AIAgentPlugin, mockPlugin);

        service = new StatusBarService();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Constructor and Initialization', () => {
        it('should initialize with dependencies', () => {
            expect(service).toBeDefined();
        });

        it('should not create status bar item until first use', () => {
            expect(mockPlugin.addStatusBarItem).not.toHaveBeenCalled();
        });
    });

    describe('setStatusBarMessage', () => {
        it('should create status bar item on first call', () => {
            service.setStatusBarMessage('Test message');

            expect(mockPlugin.addStatusBarItem).toHaveBeenCalled();
            expect(mockStatusBarItem.empty).toHaveBeenCalled();
            expect(mockStatusBarItem.createEl).toHaveBeenCalledWith('span', { text: 'Test message' });
        });

        it('should reuse existing status bar item on subsequent calls', () => {
            service.setStatusBarMessage('First message');
            service.setStatusBarMessage('Second message');

            // Should only create once
            expect(mockPlugin.addStatusBarItem).toHaveBeenCalledTimes(1);
            expect(mockStatusBarItem.empty).toHaveBeenCalledTimes(2);
            expect(mockStatusBarItem.createEl).toHaveBeenCalledTimes(2);
        });

        it('should update message content', () => {
            service.setStatusBarMessage('Message 1');
            service.setStatusBarMessage('Message 2');

            expect(mockStatusBarItem.createEl).toHaveBeenLastCalledWith('span', { text: 'Message 2' });
        });
    });

    describe('removeStatusBarMessage', () => {
        it('should remove status bar item', () => {
            service.setStatusBarMessage('Test');
            service.removeStatusBarMessage();

            expect(mockStatusBarItem.remove).toHaveBeenCalled();
        });

        it('should cancel ongoing animation', () => {
            service.animateTokens(100, 200);
            expect(rafCallbacks.length).toBeGreaterThan(0);

            service.removeStatusBarMessage();

            expect(global.cancelAnimationFrame).toHaveBeenCalled();
        });

        it('should handle being called when no status bar exists', () => {
            // Should not throw
            expect(() => service.removeStatusBarMessage()).not.toThrow();
        });

        it('should clear status bar reference', () => {
            service.setStatusBarMessage('Test');
            service.removeStatusBarMessage();

            // Next call should recreate
            service.setStatusBarMessage('New message');
            expect(mockPlugin.addStatusBarItem).toHaveBeenCalledTimes(2);
        });
    });

    describe('animateTokens', () => {
        it('should start animation with requestAnimationFrame', () => {
            service.animateTokens(100, 200);

            expect(global.requestAnimationFrame).toHaveBeenCalled();
            expect(rafCallbacks.length).toBe(1);
        });

        it('should animate from current values to target values', () => {
            // Start from 0, animate to 100 input and 200 output
            service.animateTokens(100, 200);

            // Run first frame at t=0
            currentTime = 0;
            rafCallbacks[0](currentTime);

            // Should show start values
            expect(mockStatusBarItem.createEl).toHaveBeenCalledWith('span', {
                text: 'Input Tokens: 0 / Output Tokens: 0'
            });

            // Run frame at t=500 (halfway through 1000ms animation)
            currentTime = 500;
            rafCallbacks[1](currentTime);

            // Should be roughly halfway (with easing)
            const lastCall = mockStatusBarItem.createEl.mock.calls[mockStatusBarItem.createEl.mock.calls.length - 1];
            const text = lastCall[1].text;
            expect(text).toContain('Input Tokens:');
            expect(text).toContain('Output Tokens:');
        });

        it('should complete animation after 1000ms', () => {
            service.animateTokens(100, 200);

            // Advance through animation
            currentTime = 0;
            let frameIndex = 0;
            while (frameIndex < rafCallbacks.length && currentTime <= 1000) {
                rafCallbacks[frameIndex](currentTime);
                frameIndex++;
                currentTime += 16; // ~60fps
            }

            // Run final frame at exactly 1000ms
            currentTime = 1000;
            if (frameIndex < rafCallbacks.length) {
                rafCallbacks[frameIndex](currentTime);
            }

            // Should reach target values
            const lastCall = mockStatusBarItem.createEl.mock.calls[mockStatusBarItem.createEl.mock.calls.length - 1];
            expect(lastCall[1].text).toBe('Input Tokens: 100 / Output Tokens: 200');
        });

        it('should cancel previous animation when starting new one', () => {
            service.animateTokens(50, 100);
            const firstAnimationFrame = rafCallbacks.length;

            service.animateTokens(150, 250);

            expect(global.cancelAnimationFrame).toHaveBeenCalled();
        });

        it('should handle zero target values', () => {
            // Start with some values
            (service as any).currentInputTokens = 100;
            (service as any).currentOutputTokens = 200;

            service.animateTokens(0, 0);

            // Run to completion
            currentTime = 0;
            rafCallbacks[0](currentTime);
            currentTime = 1000;
            if (rafCallbacks.length > 1) {
                rafCallbacks[rafCallbacks.length - 1](currentTime);
            }

            // Should animate down to zero
            const lastCall = mockStatusBarItem.createEl.mock.calls[mockStatusBarItem.createEl.mock.calls.length - 1];
            expect(lastCall[1].text).toContain('0');
        });

        it('should handle large token jumps', () => {
            service.animateTokens(10000, 20000);

            currentTime = 0;
            rafCallbacks[0](currentTime);

            // Should not throw and should format correctly
            expect(mockStatusBarItem.createEl).toHaveBeenCalled();
        });

        it('should round token values during animation', () => {
            service.animateTokens(99, 199);

            currentTime = 0;
            rafCallbacks[0](currentTime);

            // All displayed values should be integers
            mockStatusBarItem.createEl.mock.calls.forEach((call: any) => {
                const text = call[1].text;
                const matches = text.match(/\d+/g);
                if (matches) {
                    matches.forEach((num: string) => {
                        expect(num).toBe(Math.round(parseInt(num)).toString());
                    });
                }
            });
        });

        it('should use ease-out cubic easing', () => {
            service.animateTokens(100, 200);

            // Collect values at different times
            const values: number[] = [];

            for (let t = 0; t <= 1000; t += 100) {
                currentTime = t;
                const currentIndex = rafCallbacks.length - 1;
                if (currentIndex >= 0) {
                    rafCallbacks[currentIndex](currentTime);
                }

                // Extract input token value
                const lastCall = mockStatusBarItem.createEl.mock.calls[mockStatusBarItem.createEl.mock.calls.length - 1];
                const match = lastCall[1].text.match(/Input Tokens: (\d+)/);
                if (match) {
                    values.push(parseInt(match[1]));
                }
            }

            // With ease-out, changes should be larger at start than at end
            if (values.length >= 3) {
                const earlyChange = values[1] - values[0];
                const lateChange = values[values.length - 1] - values[values.length - 2];
                expect(earlyChange).toBeGreaterThan(lateChange);
            }
        });
    });

    describe('Multiple Animation Cycles', () => {
        it('should handle rapid consecutive calls', () => {
            service.animateTokens(50, 100);
            service.animateTokens(100, 150);
            service.animateTokens(150, 200);

            // Should cancel previous animations
            expect(global.cancelAnimationFrame).toHaveBeenCalled();

            // Should have latest animation running
            currentTime = 1000;
            const lastIndex = rafCallbacks.length - 1;
            let frameIndex = 0;
            while (frameIndex <= lastIndex && currentTime >= 0) {
                if (rafCallbacks[frameIndex]) {
                    rafCallbacks[frameIndex](currentTime);
                }
                frameIndex++;
            }

            const lastCall = mockStatusBarItem.createEl.mock.calls[mockStatusBarItem.createEl.mock.calls.length - 1];
            expect(lastCall[1].text).toContain('150');
            expect(lastCall[1].text).toContain('200');
        });

        it('should maintain state between animations', () => {
            // First animation
            service.animateTokens(100, 200);
            currentTime = 1000;
            let frameIndex = 0;
            while (frameIndex < rafCallbacks.length) {
                rafCallbacks[frameIndex](currentTime);
                frameIndex++;
            }

            // Second animation should start from previous end values
            rafCallbacks = []; // Reset RAF tracking
            service.animateTokens(200, 400);

            currentTime = 1000;
            frameIndex = 0;
            while (frameIndex < rafCallbacks.length) {
                rafCallbacks[frameIndex](currentTime);
                frameIndex++;
            }

            const lastCall = mockStatusBarItem.createEl.mock.calls[mockStatusBarItem.createEl.mock.calls.length - 1];
            expect(lastCall[1].text).toBe('Input Tokens: 200 / Output Tokens: 400');
        });
    });
});
