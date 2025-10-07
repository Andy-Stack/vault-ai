import type { IAIFunctionDefinition } from "./IAIFunctionDefinition";
import { ListVaultFiles } from "./Functions/ListVaultFiles";
import { ReadFile } from "./Functions/ReadFile";

export class AIFunctionDefinitions {
    public getQueryActions(): IAIFunctionDefinition[] {
        return [ListVaultFiles, ReadFile];
    }
}