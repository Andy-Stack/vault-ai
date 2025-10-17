export interface ITokenService {
    countTokens(input: string): Promise<number>;
}