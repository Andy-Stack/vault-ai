import type { IActioner } from "Actioner/IActioner";
import type { StreamChunk } from "Services/StreamingService";
import type { Conversation } from "Conversations/Conversation";

export interface IAIClass {
    streamRequest(conversation: Conversation, actioner: IActioner): AsyncGenerator<StreamChunk, void, unknown>;
}