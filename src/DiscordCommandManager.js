import {InstallGlobalCommands} from "./services/discordService.js";
import {capitalize} from "./services/stringService.js";

export  default class DiscordCommandManager {
    constructor(appId) {
        this.appId = appId;
        this.commands = [];
    }

    addCommand(name, description, type, integrationTypes, contexts, options) {
        const command = {
            name,
            description,
            type,
            integration_types: integrationTypes,
            contexts,
            options,
        };
        this.commands.push(command);
    }

    createCommandChoices(choices) {
        return choices.map(choice => ({
            name: capitalize(choice),
            value: choice.toLowerCase(),
        }));
    }


    async installCommands() {
        await InstallGlobalCommands(this.appId, this.commands);
    }
}