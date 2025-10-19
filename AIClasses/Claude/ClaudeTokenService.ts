import type { ITokenService } from "AIClasses/ITokenService";
import Anthropic from '@anthropic-ai/sdk'
import type AIAgentPlugin from "main";
import { Resolve } from "Services/DependencyService";
import { Services } from "Services/Services";
import { AIProviderModel } from "Enums/ApiProvider";
import { Role } from "Enums/Role";

export class ClaudeTokenService implements ITokenService {

    private ai: Anthropic;

    public constructor() {
        this.ai = new Anthropic({
            apiKey: Resolve<AIAgentPlugin>(Services.AIAgentPlugin).settings.apiKey,
            dangerouslyAllowBrowser: true
        })
    }

    public async countTokens(input: string): Promise<number> {
        if (input.trim() === "") {
            return 0;
        }

        // to maintain the convenience of the interface we just submit the entire input as one message
        const result = await this.ai.messages.countTokens({
            model: AIProviderModel.Claude,
            messages: [
                { role: Role.User, content: input }
            ]
        })
        return result.input_tokens;
    }

}