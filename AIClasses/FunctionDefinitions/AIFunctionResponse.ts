// Platform agnostic class for function responses
// Used by AI providers to format function execution results for API calls
export class AIFunctionResponse {
    public readonly name: string;
    public readonly response: object;
    public readonly toolId?: string;

    constructor(name: string, response: object, toolId?: string) {
        this.name = name;
        this.response = response;
        this.toolId = toolId;
    }

    public toConversationString(): string {
        return JSON.stringify({
            id: this.toolId,
            functionResponse: {
                name: this.name,
                response: { result: this.response }
            }
        });
    }
}