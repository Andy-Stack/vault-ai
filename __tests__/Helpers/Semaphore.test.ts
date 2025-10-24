import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Semaphore } from '../../Helpers/Semaphore';

describe('Semaphore', () => {
	describe('constructor', () => {
		it('should create semaphore with specified max count', () => {
			const semaphore = new Semaphore(3, true);
			expect(semaphore).toBeDefined();
		});

		it('should allow wait to succeed initially up to max times', async () => {
			const semaphore = new Semaphore(2, true);

			const result1 = await semaphore.wait();
			const result2 = await semaphore.wait();

			expect(result1).toBe(true);
			expect(result2).toBe(true);
		});
	});

	describe('wait - async mode (waitAsync = true)', () => {
		it('should return true immediately when count is available', async () => {
			const semaphore = new Semaphore(1, true);

			const result = await semaphore.wait();

			expect(result).toBe(true);
		});

		it('should decrement count when wait succeeds', async () => {
			const semaphore = new Semaphore(2, true);

			await semaphore.wait();
			const result = await semaphore.wait();

			expect(result).toBe(true);
		});

		it('should queue wait when no count available', async () => {
			const semaphore = new Semaphore(1, true);

			// First wait should succeed
			await semaphore.wait();

			// Second wait should be queued (doesn't resolve immediately)
			const waitPromise = semaphore.wait();

			// Promise should be pending
			let resolved = false;
			waitPromise.then(() => { resolved = true; });

			// Give it a moment to resolve if it was going to
			await new Promise(resolve => setTimeout(resolve, 10));

			expect(resolved).toBe(false);
		});

		it('should resolve queued waits when release is called', async () => {
			const semaphore = new Semaphore(1, true);

			// Acquire the semaphore
			await semaphore.wait();

			// Queue a wait
			const waitPromise = semaphore.wait();

			// Release the semaphore
			semaphore.release();

			// The queued wait should now resolve
			const result = await waitPromise;
			expect(result).toBe(true);
		});

		it('should process queue in FIFO order', async () => {
			const semaphore = new Semaphore(1, true);

			// Acquire the semaphore
			await semaphore.wait();

			// Queue multiple waits
			const order: number[] = [];
			const wait1 = semaphore.wait().then(() => { order.push(1); return 1; });
			const wait2 = semaphore.wait().then(() => { order.push(2); return 2; });
			const wait3 = semaphore.wait().then(() => { order.push(3); return 3; });

			// Release three times
			semaphore.release();
			await wait1;

			semaphore.release();
			await wait2;

			semaphore.release();
			await wait3;

			expect(order).toEqual([1, 2, 3]);
		});

		it('should handle multiple concurrent waits', async () => {
			const semaphore = new Semaphore(3, true);

			const results = await Promise.all([
				semaphore.wait(),
				semaphore.wait(),
				semaphore.wait()
			]);

			expect(results).toEqual([true, true, true]);
		});
	});

	describe('wait - sync mode (waitAsync = false)', () => {
		it('should return true when count is available', async () => {
			const semaphore = new Semaphore(1, false);

			const result = await semaphore.wait();

			expect(result).toBe(true);
		});

		it('should return false immediately when no count available', async () => {
			const semaphore = new Semaphore(1, false);

			// First wait succeeds
			await semaphore.wait();

			// Second wait should fail immediately
			const result = await semaphore.wait();

			expect(result).toBe(false);
		});

		it('should not queue waits in sync mode', async () => {
			const semaphore = new Semaphore(1, false);

			await semaphore.wait();

			// These should all return false immediately
			const result1 = await semaphore.wait();
			const result2 = await semaphore.wait();

			expect(result1).toBe(false);
			expect(result2).toBe(false);
		});

		it('should allow wait to succeed again after release', async () => {
			const semaphore = new Semaphore(1, false);

			// Acquire
			await semaphore.wait();

			// Try to acquire again (should fail)
			let result = await semaphore.wait();
			expect(result).toBe(false);

			// Release
			semaphore.release();

			// Try to acquire again (should succeed)
			result = await semaphore.wait();
			expect(result).toBe(true);
		});
	});

	describe('release', () => {
		it('should increment count when no queue exists', async () => {
			const semaphore = new Semaphore(2, false);

			// Use one slot
			semaphore.wait();

			// Release should increment count back
			semaphore.release();

			// Should be able to wait twice now
			await expect(semaphore.wait()).resolves.toBe(true);
			await expect(semaphore.wait()).resolves.toBe(true);
		});

		it('should not increment count beyond max', async () => {
			const semaphore = new Semaphore(2, false);

			// Release multiple times without wait
			semaphore.release();
			semaphore.release();
			semaphore.release();

			// Should still only be able to wait max times
			await semaphore.wait(); // 1
			await semaphore.wait(); // 2
			const result = await semaphore.wait(); // 3 - should fail

			expect(result).toBe(false);
		});

		it('should resolve the next queued wait if queue is not empty', async () => {
			const semaphore = new Semaphore(1, true);

			// Acquire
			await semaphore.wait();

			// Queue two waits
			const wait1 = semaphore.wait();
			const wait2 = semaphore.wait();

			// Release once - should resolve wait1
			semaphore.release();
			const result1 = await wait1;
			expect(result1).toBe(true);

			// wait2 should still be pending
			let wait2Resolved = false;
			wait2.then(() => { wait2Resolved = true; });
			await new Promise(resolve => setTimeout(resolve, 10));
			expect(wait2Resolved).toBe(false);

			// Release again - should resolve wait2
			semaphore.release();
			const result2 = await wait2;
			expect(result2).toBe(true);
		});

		it('should prioritize queue over incrementing count', async () => {
			const semaphore = new Semaphore(1, true);

			// Acquire
			await semaphore.wait();

			// Queue a wait
			const queuedWait = semaphore.wait();

			// Release
			semaphore.release();

			// The queued wait should resolve
			await queuedWait;

			// Count should be 0 now, not 1
			// Because release gave the slot to the queued wait instead of incrementing count
			const nextWait = semaphore.wait();

			let resolved = false;
			nextWait.then(() => { resolved = true; });
			await new Promise(resolve => setTimeout(resolve, 10));

			expect(resolved).toBe(false);
		});
	});

	describe('concurrency control scenarios', () => {
		it('should limit concurrent operations to max', async () => {
			const semaphore = new Semaphore(2, true);
			const concurrentOps: number[] = [];
			let currentlyRunning = 0;
			let maxConcurrent = 0;

			const operation = async (id: number) => {
				await semaphore.wait();
				currentlyRunning++;
				maxConcurrent = Math.max(maxConcurrent, currentlyRunning);
				concurrentOps.push(id);

				// Simulate some work
				await new Promise(resolve => setTimeout(resolve, 10));

				currentlyRunning--;
				semaphore.release();
			};

			// Start 5 operations
			await Promise.all([
				operation(1),
				operation(2),
				operation(3),
				operation(4),
				operation(5)
			]);

			expect(concurrentOps).toHaveLength(5);
			expect(maxConcurrent).toBeLessThanOrEqual(2);
		});

		it('should work as a mutex when max is 1', async () => {
			const semaphore = new Semaphore(1, true);
			const results: number[] = [];

			const criticalSection = async (id: number) => {
				await semaphore.wait();

				// Critical section
				results.push(id);
				await new Promise(resolve => setTimeout(resolve, 5));

				semaphore.release();
			};

			// Run multiple operations concurrently
			await Promise.all([
				criticalSection(1),
				criticalSection(2),
				criticalSection(3)
			]);

			// All should complete
			expect(results).toHaveLength(3);
			// Order might vary, but all should be present
			expect(results.sort()).toEqual([1, 2, 3]);
		});

		it('should handle acquire-release cycles correctly', async () => {
			const semaphore = new Semaphore(1, false);

			for (let i = 0; i < 10; i++) {
				const acquired = await semaphore.wait();
				expect(acquired).toBe(true);

				semaphore.release();
			}
		});

		it('should handle rapid acquire-release-acquire pattern', async () => {
			const semaphore = new Semaphore(1, true);

			for (let i = 0; i < 100; i++) {
				await semaphore.wait();
				semaphore.release();
			}

			// Should still work correctly
			const result = await semaphore.wait();
			expect(result).toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should handle max = 0', async () => {
			const semaphore = new Semaphore(0, false);

			const result = await semaphore.wait();

			expect(result).toBe(false);
		});

		it('should handle max = 0 in async mode', async () => {
			const semaphore = new Semaphore(0, true);

			const waitPromise = semaphore.wait();

			// Should be queued immediately since max is 0
			let resolved = false;
			waitPromise.then(() => { resolved = true; });
			await new Promise(resolve => setTimeout(resolve, 10));

			expect(resolved).toBe(false);

			// Release should allow it to proceed
			semaphore.release();
			await waitPromise;
		});

		it('should handle multiple releases without waits', () => {
			const semaphore = new Semaphore(3, false);

			// Release multiple times
			semaphore.release();
			semaphore.release();
			semaphore.release();

			// Should not crash or behave incorrectly
			expect(() => semaphore.release()).not.toThrow();
		});

		it('should handle alternating wait and release', async () => {
			const semaphore = new Semaphore(1, true);

			await semaphore.wait();
			semaphore.release();
			await semaphore.wait();
			semaphore.release();
			await semaphore.wait();
			semaphore.release();

			// Should still be in a valid state
			const result = await semaphore.wait();
			expect(result).toBe(true);
		});
	});

	describe('stress tests', () => {
		it('should handle many queued operations', async () => {
			const semaphore = new Semaphore(1, true);

			// Acquire the semaphore
			await semaphore.wait();

			// Queue many waits
			const waits = Array.from({ length: 50 }, () => semaphore.wait());

			// Release 50 times
			for (let i = 0; i < 50; i++) {
				semaphore.release();
			}

			// All should resolve
			const results = await Promise.all(waits);
			expect(results.every(r => r === true)).toBe(true);
		});

		it('should maintain consistency under concurrent load', async () => {
			const semaphore = new Semaphore(5, true);
			let activeCount = 0;
			let maxActive = 0;

			const worker = async () => {
				await semaphore.wait();

				activeCount++;
				maxActive = Math.max(maxActive, activeCount);

				await new Promise(resolve => setTimeout(resolve, 1));

				activeCount--;
				semaphore.release();
			};

			// Run 100 workers
			await Promise.all(Array.from({ length: 100 }, () => worker()));

			expect(maxActive).toBeLessThanOrEqual(5);
			expect(activeCount).toBe(0); // All should have completed
		});
	});
});
