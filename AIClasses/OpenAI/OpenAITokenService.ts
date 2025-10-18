import type { ITokenService } from "AIClasses/ITokenService";
import { countTokens } from 'gpt-tokenizer'

export class OpenAITokenService implements ITokenService {
    
    public async countTokens(input: string): Promise<number> {
        return countTokens(input);
    }
    
}