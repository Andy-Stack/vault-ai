import type { ITokenService } from "AIClasses/ITokenService";
import { CountTokensResponse, GoogleGenAI } from '@google/genai'
import type AIAgentPlugin from "main";
import { Resolve } from "Services/DependencyService";
import { Services } from "Services/Services";

export class GeminiTokenService implements ITokenService {

    private readonly ai: GoogleGenAI;
    private model: string;

    public constructor() {
        const plugin: AIAgentPlugin = Resolve<AIAgentPlugin>(Services.AIAgentPlugin);
        this.ai = new GoogleGenAI({
            apiKey: plugin.settings.apiKey
        });
        this.model = plugin.settings.model;
    }

    public async countTokens(input: string): Promise<number> {
        if (input.trim() === "") {
            return 0;
        }

        const result: CountTokensResponse = await this.ai.models.countTokens({
            model: this.model,
            contents: input
        });
        return result.totalTokens ?? -1;
    }

}