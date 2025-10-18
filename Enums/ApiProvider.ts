export enum AIProvider {
    Claude = "Claude",
    Gemini = "Gemini",
    OpenAI = "OpenAI"
};

export enum AIProviderModel {
    Claude = "claude-sonnet-4-5",
    Gemini = "gemini-2.5-flash",
    OpenAI = ""
}

export enum AIProviderURL {
    Gemini = `https://generativelanguage.googleapis.com/v1beta/models/${AIProviderModel.Gemini}:streamGenerateContent?key=API_KEY&alt=sse`,
    GeminiNamer = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=API_KEY"
}