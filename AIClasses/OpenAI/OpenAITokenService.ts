import type { ITokenService } from "AIClasses/ITokenService";
import { countTokens } from 'gpt-tokenizer'

export class OpenAITokenService implements ITokenService {
    
    public countTokens(input: string): Promise<number> {
        if (input.trim() === "") {
            return Promise.resolve(0);
        }

        return Promise.resolve(countTokens(input));
    }
    
}