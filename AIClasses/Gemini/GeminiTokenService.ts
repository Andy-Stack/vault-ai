import type { ITokenService } from "AIClasses/ITokenService";
import { CountTokensResponse, GoogleGenAI } from '@google/genai'
import type AIAgentPlugin from "main";
import { Resolve } from "Services/DependencyService";
import { Services } from "Services/Services";
import { AIProviderModel } from "Enums/ApiProvider";

export class GeminiTokenService implements ITokenService {

    private readonly ai: GoogleGenAI;

    public constructor() {
        this.ai = new GoogleGenAI({ 
            apiKey: Resolve<AIAgentPlugin>(Services.AIAgentPlugin).settings.apiKey
        });
    }

    public async countTokens(input: string): Promise<number> {
        if (input.trim() === "") {
            return 0;
        }

        const result: CountTokensResponse = await this.ai.models.countTokens({
            model: AIProviderModel.Gemini,
            contents: input
        });
        return result.totalTokens ?? -1;
    }

}