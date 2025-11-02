import { AIFunction } from "Enums/AIFunction";
import type { IAIFunctionDefinition } from "../IAIFunctionDefinition";

export const SearchVaultFiles: IAIFunctionDefinition = {
  name: AIFunction.SearchVaultFiles,
  description: `Searches the content of all vault files using regex pattern matching.
                Returns files containing any of the search terms with contextual snippets showing where matches appear.
                Use this function when you need to:
                - Find specific concepts, keywords, or text within note contents
                - Locate content matching multiple patterns or phrases
                - Answer questions about what the user has written about a topic
                - Search across both file names and file contents simultaneously
                - Search for multiple related terms or variations in a single query`,
  parameters: {
    type: "object",
    properties: {
      search_terms: {
        type: "array",
        items: {
          type: "string"
        },
        description: `Array of regex patterns to search for in vault files. Each pattern supports both simple text searches (e.g., 'meeting notes', 'project alpha') and advanced regex patterns (e.g., '(urgent|important)', '\\d{4}-\\d{2}-\\d{2}' for dates). Files matching ANY of the search terms will be returned (OR logic). The search is performed on both file names and content. Examples: ['meeting', 'project'] or ['TODO', 'FIXME', 'urgent'] or ['\\d{4}-\\d{2}-\\d{2}', 'deadline']. Use empty array [] to return all vault files.`,
      },
      user_message: {
        type: "string",
        description: "A short message to be displayed to the user explaining what is being searched for. Example: 'Searching for notes about project meetings' or 'Finding files containing todo items'"
      }
    },
    required: ["search_terms", "user_message"]
  }
}