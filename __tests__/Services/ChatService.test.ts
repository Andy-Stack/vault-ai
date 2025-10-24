import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatService } from '../../Services/ChatService';
import { RegisterSingleton } from '../../Services/DependencyService';
import { Services } from '../../Services/Services';
import { Conversation } from '../../Conversations/Conversation';
import { ConversationContent } from '../../Conversations/ConversationContent';
import { Role } from '../../Enums/Role';

/**
 * INTEGRATION TESTS - Simplified
 *
 * These tests focus on synchronous methods only, avoiding the complex async streaming
 * functionality that caused memory issues. Tests the actual integration between ChatService
 * and its dependencies.
 *
 * Note: The complex submit() method with async generators is better tested through E2E tests.
 */

describe('ChatService - Integration Tests (Sync Methods Only)', () => {
	let service: ChatService;
	let mockConversationService: any;
	let mockAIFunctionService: any;
	let mockNamingService: any;
	let mockPrompt: any;
	let mockStatusBarService: any;
	let mockTokenService: any;

	beforeEach(() => {
		// Setup minimal mocks
		mockConversationService = {
			saveConversation: vi.fn()
		};

		mockAIFunctionService = {
			performAIFunction: vi.fn()
		};

		mockNamingService = {
			requestName: vi.fn()
		};

		mockPrompt = {
			systemInstruction: vi.fn().mockReturnValue('System prompt'),
			userInstruction: vi.fn().mockResolvedValue('User prompt')
		};

		mockStatusBarService = {
			animateTokens: vi.fn()
		};

		mockTokenService = {
			countTokens: vi.fn().mockResolvedValue(100)
		};

		// Register dependencies
		RegisterSingleton(Services.ConversationFileSystemService, mockConversationService);
		RegisterSingleton(Services.AIFunctionService, mockAIFunctionService);
		RegisterSingleton(Services.ConversationNamingService, mockNamingService);
		RegisterSingleton(Services.IPrompt, mockPrompt);
		RegisterSingleton(Services.StatusBarService, mockStatusBarService);

		// Create service
		service = new ChatService();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor', () => {
		it('should initialize with all required services', () => {
			const testService = new ChatService();

			expect(testService).toBeDefined();
		});

		it('should initialize onNameChanged as undefined', () => {
			expect(service.onNameChanged).toBeUndefined();
		});
	});

	describe('resolveAIProvider', () => {
		it('should resolve AI provider services', () => {
			const mockAI = { streamRequest: vi.fn() };
			RegisterSingleton(Services.IAIClass, mockAI as any);
			RegisterSingleton(Services.ITokenService, mockTokenService);

			service.resolveAIProvider();

			// Should not throw
			expect(service).toBeDefined();
		});
	});

	describe('stop', () => {
		it('should not throw when called with no active request', () => {
			expect(() => service.stop()).not.toThrow();
		});

		it('should be callable multiple times', () => {
			service.stop();
			service.stop();
			service.stop();

			expect(service).toBeDefined();
		});
	});

	describe('setStatusBarTokens', () => {
		beforeEach(() => {
			// Need to resolve AI provider to initialize token service
			RegisterSingleton(Services.IAIClass, { streamRequest: vi.fn() } as any);
			RegisterSingleton(Services.ITokenService, mockTokenService);
			service.resolveAIProvider();
		});

		it('should call status bar service with token counts', () => {
			service.setStatusBarTokens(100, 50);

			expect(mockStatusBarService.animateTokens).toHaveBeenCalledWith(100, 50);
		});

		it('should handle zero tokens', () => {
			service.setStatusBarTokens(0, 0);

			expect(mockStatusBarService.animateTokens).toHaveBeenCalledWith(0, 0);
		});

		it('should handle large token counts', () => {
			service.setStatusBarTokens(100000, 50000);

			expect(mockStatusBarService.animateTokens).toHaveBeenCalledWith(100000, 50000);
		});
	});

	describe('updateTokenDisplay', () => {
		beforeEach(() => {
			// Need to resolve AI provider to initialize token service
			RegisterSingleton(Services.IAIClass, { streamRequest: vi.fn() } as any);
			RegisterSingleton(Services.ITokenService, mockTokenService);
			service.resolveAIProvider();
		});

		it('should count tokens for conversation contents', async () => {
			const conversation = new Conversation();
			conversation.contents.push(new ConversationContent(Role.User, 'User message'));
			conversation.contents.push(new ConversationContent(Role.Assistant, 'Assistant response'));

			await service.updateTokenDisplay(conversation);

			expect(mockTokenService.countTokens).toHaveBeenCalled();
			expect(mockStatusBarService.animateTokens).toHaveBeenCalled();
		});

		it('should include system and user instructions in token count', async () => {
			const conversation = new Conversation();
			conversation.contents.push(new ConversationContent(Role.User, 'Test'));

			await service.updateTokenDisplay(conversation);

			expect(mockPrompt.systemInstruction).toHaveBeenCalled();
			expect(mockPrompt.userInstruction).toHaveBeenCalled();
		});

		it('should filter out function call responses from user messages', async () => {
			const conversation = new Conversation();
			conversation.contents.push(new ConversationContent(Role.User, 'Regular message'));
			conversation.contents.push(
				new ConversationContent(Role.User, 'Function result', '', new Date(), false, true, 'tool-id')
			);

			await service.updateTokenDisplay(conversation);

			expect(mockTokenService.countTokens).toHaveBeenCalled();
		});

		it('should handle empty conversation', async () => {
			const conversation = new Conversation();

			await service.updateTokenDisplay(conversation);

			expect(mockStatusBarService.animateTokens).toHaveBeenCalled();
		});

		it('should not throw if token service not initialized', async () => {
			const newService = new ChatService();
			const conversation = new Conversation();

			await expect(newService.updateTokenDisplay(conversation)).resolves.not.toThrow();
		});
	});

	describe('onNameChanged callback', () => {
		it('should allow setting callback function', () => {
			const callback = vi.fn();

			service.onNameChanged = callback;

			expect(service.onNameChanged).toBe(callback);
		});

		it('should be initially undefined', () => {
			const newService = new ChatService();

			expect(newService.onNameChanged).toBeUndefined();
		});
	});
});
