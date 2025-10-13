import type { IAIFunctionDefinition } from "./IAIFunctionDefinition";
import { ListVaultFiles } from "./Functions/ListVaultFiles";
import { ReadFile } from "./Functions/ReadFile";

export class AIFunctionDefinitions {
    public getQueryActions(destructive: boolean): IAIFunctionDefinition[] {
        const actions = [
            ListVaultFiles,
            ReadFile
        ];

        if (destructive) {
            actions.concat([
                
            ]);
        }

        return actions;
    }
}