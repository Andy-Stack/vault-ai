import { Resolve } from "Services/DependencyService";
import { Services } from "Services/Services";
import type { IActioner } from "Actioner/IActioner";
import type { GeminiActionDefinitions } from "Actioner/Gemini/GeminiActionDefinitions";
import type { IAIClass } from "AIClasses/IAIClass";
import type { IPrompt } from "AIClasses/IPrompt";
import { StreamingService, type StreamChunk } from "Services/StreamingService";
import type { Conversation } from "Conversations/Conversation";
import { Role } from "Enums/Role";

export class Gemini implements IAIClass {
  private readonly apiKey: string;
  private readonly aiPrompt: IPrompt;
  private readonly actionDefinitions: GeminiActionDefinitions;
  private readonly streamingService: StreamingService;

  public constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.aiPrompt = Resolve(Services.IPrompt);
    this.actionDefinitions = Resolve(Services.IActionDefinitions);
    this.streamingService = new StreamingService();
  }

  /**
   * Stream response from Gemini API
   */
  public async* streamRequest(
    conversation: Conversation,
    actioner: IActioner
  ): AsyncGenerator<StreamChunk, void, unknown> {
    
    const contents = conversation.contents.map(content => ({
      role: content.role === Role.User ? "user" : "model",
      parts: [
        {
          text: content.content
        }
      ]
    }));

    const requestBody = {
      system_instruction: {
        parts: [
          {
            text: this.aiPrompt.systemInstruction()
          },
          {
            text: await this.aiPrompt.userInstruction()
          }
        ]
      },
      contents: contents,
      tools: [
        {
          google_search: {},
          //TODO: functionDeclarations: [this.actionDefinitions[create_file]],
        },
      ]
    };

    yield* this.streamingService.streamGeminiRequest(this.apiKey, requestBody);
  }
}