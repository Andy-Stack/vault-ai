import { AIProviderURL } from "Enums/ApiProvider";
import { request, type RequestUrlParam } from "obsidian";
import { Resolve } from "Services/DependencyService";
import { Services } from "Services/Services";
import type { IActioner } from "Actioner/IActioner";
import type { GeminiActionDefinitions } from "Actioner/Gemini/GeminiActionDefinitions";
import { create_file } from "Actioner/Actions";
import type { IAIClass } from "AIClasses/IAIClass";
import type { IPrompt } from "AIClasses/IPrompt";
import type { GenerateContentResponse, Part } from "@google/genai";

export class Gemini implements IAIClass {
  private readonly apiKey: string;
  private readonly aiPrompt: IPrompt;
  private readonly actionDefinitions: GeminiActionDefinitions;


  public constructor(apiKey: string) {
    this.apiKey = apiKey;

    this.aiPrompt = Resolve(Services.IPrompt);
    this.actionDefinitions = Resolve(Services.IActionDefinitions);
  }

  public async apiRequest(userInput: string, actioner: IActioner): Promise<Part[] | null> {
    let prompt: string = "The users prompt is: " + userInput;

    let requestBody = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: this.aiPrompt.instructions() + "\n" +
                this.aiPrompt.responseFormat() + "\n" +
                this.aiPrompt.getDirectories() + "\n" +
                prompt + "\n" +
                this.aiPrompt.instructionsReminder()
            },
          ],
        },
      ],
      tools: [{
        functionDeclarations: [this.actionDefinitions[create_file]]
      }]
    });

    let reqParam: RequestUrlParam = {
      url: AIProviderURL.Gemini,
      method: "POST",
      headers: {
        "X-goog-api-key": this.apiKey,
        "Content-Type": "application/json"
      },
      body: requestBody
    };

    let response: GenerateContentResponse = JSON.parse(await request(reqParam));

    console.log(response);

    let ai_response: Part[] = response.candidates?.first()?.content?.parts ?? [];

    console.log(ai_response);

    return ai_response;
  }
}