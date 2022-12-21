import {
    Client,
    Intents,
    slash,
    event,
    Interaction,
    Message,
    InteractionResponseType
} from "./deps.ts";
import { commands } from "./commands.ts";
import { GUILD_ID, DISCORD_TOKEN } from "./config.ts";
import CONSTANTS, {CONSTANTS_GAMEMODES_TYPE} from "./constants.ts";

let serverStatusRefreshedDate = new Date();

let hosts: any = {};
let customHosts: any = {};
let regions: any = {};

async function refreshHosts() {
    hosts = await fetch(CONSTANTS.DEEEEP_API_URL + "/hosts?servers=1")
        .then(res => res.json());

    customHosts = await fetch(CONSTANTS.DEEEEP_API_URL + "/hosts?custom=1&servers=1")
        .then(res => res.json());

    regions = await fetch(CONSTANTS.DEEEEP_API_URL + "/regions")
        .then(res => res.json());

    hosts = hosts.hosts;
    customHosts = customHosts.hosts;

    serverStatusRefreshedDate = new Date();
}

setInterval(refreshHosts, 150000);

refreshHosts()

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

    @slash()
    ping(i: Interaction) {
        i.respond({
            content: "Pong!"
        });
    }

    @slash()
    serverstatus(i: Interaction) {

        let regularServerList = "";
        let customServerList = "";

        for (const i in hosts) {
            regularServerList += `
${CONSTANTS.GAMEMODES[(String(hosts[i]!.gamemode) as CONSTANTS_GAMEMODES_TYPE)]} - ${hosts[i].server.region} - ${hosts[i].id} - ${hosts[i].map.string_id} - ${hosts[i].users} players
            `;
        }

        for (const i in customHosts) {
            customServerList += `
${CONSTANTS.GAMEMODES[(String(customHosts[i]!.gamemode) as CONSTANTS_GAMEMODES_TYPE)]} - ${customHosts[i].server.region} - ${customHosts[i].id} - ${customHosts[i].map.string_id} - ${hosts[i].users} players
            `;
        }

        i.respond({
            content: `
**Deeeep.io Server Status**
(Last refreshed at ${serverStatusRefreshedDate.getUTCHours()}:${serverStatusRefreshedDate.getUTCMinutes()}:${serverStatusRefreshedDate.getUTCSeconds()} UTC)

**Regular Servers**
\`\`\`yaml
${regularServerList}
\`\`\`

**Custom Servers**
\`\`\`yaml
${customServerList}
\`\`\`
`
        });
    }
}

const client = new TagBot();

client.connect(DISCORD_TOKEN, Intents.None);