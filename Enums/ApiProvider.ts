export enum AIProvider {
    Claude = "Claude",
    Gemini = "Gemini",
    OpenAI = "OpenAI"
};

export enum AIProviderModel {
    Claude = "claude-sonnet-4-5-20250929",
    ClaudeNamer = "claude-haiku-4-5-20251001",

    Gemini = "gemini-2.5-flash",
    GeminiNamer = "gemini-2.5-flash",

    OpenAI = "gpt-5",
    OpenAINamer = "gpt-5-nano"
}

export enum AIProviderURL {
    Claude = "https://api.anthropic.com/v1/messages",
    ClaudeNamer = "https://api.anthropic.com/v1/messages",

    Gemini = `https://generativelanguage.googleapis.com/v1beta/models/${AIProviderModel.GeminiNamer}:streamGenerateContent?key=API_KEY&alt=sse`,
    GeminiNamer = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=API_KEY",

    OpenAINamer = "https://api.openai.com/v1/chat/completions"
}