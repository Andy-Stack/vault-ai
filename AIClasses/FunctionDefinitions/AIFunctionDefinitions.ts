import type { IAIFunctionDefinition } from "./IAIFunctionDefinition";
import { SearchVaultFiles } from "./Functions/SearchVaultFiles";
import { ReadFile } from "./Functions/ReadFile";

export class AIFunctionDefinitions {
    public getQueryActions(destructive: boolean): IAIFunctionDefinition[] {
        const actions = [
            SearchVaultFiles,
            ReadFile
        ];

        if (destructive) {
            actions.concat([
                
            ]);
        }

        return actions;
    }
}