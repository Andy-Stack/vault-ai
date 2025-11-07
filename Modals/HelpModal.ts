import type AIAgentPlugin from "main";
import { Modal } from "obsidian";
import { Resolve } from "Services/DependencyService";
import { Services } from "Services/Services";

export class HelpModal extends Modal {
    
    public constructor() {
        const plugin = Resolve<AIAgentPlugin>(Services.AIAgentPlugin);
        super(plugin.app);
    }

}