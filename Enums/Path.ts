export enum Path {
    Root = "/",
    AIAgentDir = "AI Agent",
    Conversations = `${Path.AIAgentDir}/Conversations`,
    UserInstructions = `${Path.AIAgentDir}/User Instructions`,
    ExampleUserInstructions = `${Path.UserInstructions}/EXAMPLE_INSTRUCTIONS.md`
};