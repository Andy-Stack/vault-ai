import { dateToString } from "Helpers/Helpers";
import { ConversationContent } from "./ConversationContent";

export class Conversation {

    title: string;
    created: Date;
    path: string;

    contents: ConversationContent[] = [];

    constructor() {
        this.created = new Date();
        this.title = `${dateToString(this.created)}`;
    }
    
    public static isConversationData(data: unknown): data is { title: string; created: string; contents: ConversationContent[] } {
        return (
            typeof data === 'object' &&
            data !== null &&
            'title' in data &&
            'created' in data &&
            'contents' in data &&
            typeof data.title === 'string' &&
            typeof data.created === 'string' &&
            Array.isArray(data.contents) &&
            data.contents.every(ConversationContent.isConversationContentData)
        );
    }

    public setMostRecentContent(content: string) {
        const conversationContent: ConversationContent | undefined = this.contents.last();
        if (conversationContent) {
            conversationContent.content = content;
        }
    }

    public setMostRecentFunctionCall(functionCall: string) {
        const conversationContent: ConversationContent | undefined = this.contents.last();
        if (conversationContent) {
            conversationContent.functionCall = functionCall;
            conversationContent.isFunctionCall = true;
        }
    }
}