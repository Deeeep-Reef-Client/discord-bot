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
        description: "Refresh /serverstatus hosts",
    }
];