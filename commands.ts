// Now you can remove these two imports in bot.ts!
import { SlashCommandPartial, SlashCommandOptionType } from "./deps.ts";

export const commands: SlashCommandPartial[] = [
    {
        name: "ping",
        description: "Pong!"
    },
    {
        name: "serverstatus",
        description: "Display Deeeep.io server status"
    },
    {
        name: "refreshhosts",
        description: "Force refresh /serverstatus hosts"
    },
    {
        name: "download",
        description: "Download Deeeep.io Reef Client"
    },
    {
        name: "accountinfo",
        description: "Fetch Deeeep.io account info",
        options: [
            {
                name: "account",
                description: "Name of the account",
                required: true,
                type: SlashCommandOptionType.STRING
            }
        ]
    }
];