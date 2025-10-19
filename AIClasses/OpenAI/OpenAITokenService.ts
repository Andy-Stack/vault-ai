import type { ITokenService } from "AIClasses/ITokenService";
import { countTokens } from 'gpt-tokenizer'

export class OpenAITokenService implements ITokenService {
    
    public async countTokens(input: string): Promise<number> {
        if (input.trim() === "") {
            return 0;
        }

        return countTokens(input);
    }
    
}