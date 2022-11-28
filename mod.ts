// bot.ts
import {
    Client,
    Intents,
    slash,
    event,
    Interaction,
    InteractionResponseType,
} from "./deps.ts";
import { commands } from "./commands.ts";
import { GUILD_ID, DISCORD_TOKEN } from "./config.ts";

class TagBot extends Client {
    @event()
    ready() {
        console.log("Ready!")
        commands.forEach(command => {
            // If you want to create command globally, just remove 'Your Server/Guild ID' part
            // I recommend making it for only one guild for now because Global Slash Commands can take max 1 hour to come live.
            this.slash.commands.create(command, GUILD_ID)
                .then((cmd) => console.log(`Created Slash Command ${cmd.name}!`))
                .catch((cmd) => console.log(`Failed to create ${cmd.name} command!`));
        })
    }

    @slash("helloworld")
    mytags(i: Interaction) {
        i.respond({
            content: "Hello world!"
        })
    }
}

const bot = new TagBot();

bot.connect(DISCORD_TOKEN, Intents.None);