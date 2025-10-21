import type { ITokenService } from "AIClasses/ITokenService";
import Anthropic from '@anthropic-ai/sdk'
import type AIAgentPlugin from "main";
import { Resolve } from "Services/DependencyService";
import { Services } from "Services/Services";
import { Role } from "Enums/Role";

export class ClaudeTokenService implements ITokenService {

    private ai: Anthropic;
    private model: string;

    public constructor() {
        const plugin: AIAgentPlugin = Resolve<AIAgentPlugin>(Services.AIAgentPlugin);
        this.ai = new Anthropic({
            apiKey: plugin.settings.apiKey,
            dangerouslyAllowBrowser: true
        });
        this.model = plugin.settings.model;
    }

    public async countTokens(input: string): Promise<number> {
        if (input.trim() === "") {
            return 0;
        }

        // to maintain the convenience of the interface we just submit the entire input as one message
        const result = await this.ai.messages.countTokens({
            model: this.model,
            messages: [
                { role: Role.User, content: input }
            ]
        })
        return result.input_tokens;
    }

}