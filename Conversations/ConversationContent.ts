export class ConversationContent {
    role: string;
    content: string
    timestamp: Date;
    isFunctionCall: boolean;
    isFunctionCallResponse: boolean;
    toolId?: string;

    public static isConversationContentData(data: unknown): data is {
        role: string; content: string; timestamp: string, isFunctionCall: boolean, isFunctionCallResponse: boolean, toolId?: string
    } {
        return (
            typeof data === "object" &&
            data !== null &&
            "role" in data &&
            "content" in data &&
            "timestamp" in data &&
            "isFunctionCall" in data &&
            "isFunctionCallResponse" in data &&
            typeof data.role === "string" &&
            typeof data.content === "string" &&
            typeof data.timestamp === "string" &&
            typeof data.isFunctionCall == "boolean" &&
            typeof data.isFunctionCallResponse == "boolean"
        );
    }

    constructor(role: string, content: string, timestamp: Date = new Date(), isFunctionCall = false, isFunctionCallResponse = false, toolId?: string) {
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
        this.isFunctionCall = isFunctionCall;
        this.isFunctionCallResponse = isFunctionCallResponse;
        this.toolId = toolId;
    }
}