export enum Path {
    Root = "/",
    VaultkeeperAIDir = "Vaultkeeper AI",
    Conversations = `${Path.VaultkeeperAIDir}/Conversations`,
    UserInstructions = `${Path.VaultkeeperAIDir}/User Instructions`,
    ExampleUserInstructions = `${Path.UserInstructions}/EXAMPLE_INSTRUCTIONS.md`
};