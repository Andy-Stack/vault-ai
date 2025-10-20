import type { StreamChunk } from "Services/StreamingService";
import type { Conversation } from "Conversations/Conversation";

export interface IAIClass {
    readonly apiError429UserInfo: string;
    streamRequest(conversation: Conversation, allowDestructiveActions: boolean, abortSignal?: AbortSignal): AsyncGenerator<StreamChunk, void, unknown>;
}