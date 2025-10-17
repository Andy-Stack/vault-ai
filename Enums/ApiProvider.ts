export enum AIProvider {
    Claude = "Claude",
    Gemini = "Gemini",
    OpenAI = "OpenAI"
};

export enum AIProviderModel {
    Gemini = "gemini-2.5-flash"
}

export enum AIProviderURL {
    Gemini = `https://generativelanguage.googleapis.com/v1beta/models/${AIProviderModel.Gemini}:streamGenerateContent?key=API_KEY&alt=sse`,
    GeminiNamer = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=API_KEY"
}