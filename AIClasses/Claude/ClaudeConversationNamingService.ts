import type { IConversationNamingService } from "AIClasses/IConversationNamingService";

export class ClaudeConversationNamingService implements IConversationNamingService {
    
    public async generateName(userPrompt: string, abortSignal?: AbortSignal): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
}