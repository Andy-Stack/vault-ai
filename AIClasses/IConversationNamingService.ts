export interface IConversationNamingService {
    generateName(userPrompt: string, abortSignal?: AbortSignal): Promise<string>;
}
