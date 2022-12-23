import {
    Client,
    Intents,
    slash,
    event,
    Interaction,
    Message,
    InteractionResponseType,
    subcommand
} from "./deps.ts";
import { commands } from "./commands.ts";
import { GUILD_ID, DISCORD_TOKEN } from "./config.ts";
import CONSTANTS, { CONSTANTS_GAMEMODES_TYPE, CONSTANTS_SOCIAL_NETWORKS_TYPE } from "./constants.ts";

interface serverStatusInterface {
    refreshedDate: Date;
    hosts: any;
    customHosts: any;
    regions: any;
    refreshHosts: Function;
}

let serverStatus: serverStatusInterface = {
    refreshedDate: new Date(),
    hosts: {},
    customHosts: {},
    regions: {},
    refreshHosts: async function () {
        serverStatus.hosts = await fetch(CONSTANTS.DEEEEP_API_URL + "/hosts?servers=1")
            .then(res => res.json());

        serverStatus.customHosts = await fetch(CONSTANTS.DEEEEP_API_URL + "/hosts?custom=1&servers=1")
            .then(res => res.json());

        serverStatus.regions = await fetch(CONSTANTS.DEEEEP_API_URL + "/regions")
            .then(res => res.json());

        serverStatus.hosts = serverStatus.hosts.hosts;
        serverStatus.customHosts = serverStatus.customHosts.hosts;

        serverStatus.refreshedDate = new Date();
    }
}

setInterval(() => serverStatus.refreshHosts(), 150000);

serverStatus.refreshHosts()

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

        for (const i in serverStatus.hosts) {
            regularServerList += `
${CONSTANTS.GAMEMODES[(String(serverStatus.hosts[i]!.gamemode) as CONSTANTS_GAMEMODES_TYPE)]} - ${serverStatus.hosts[i].server.region} - ${serverStatus.hosts[i].id} - ${serverStatus.hosts[i].map.string_id} - ${serverStatus.hosts[i].users} players
            `;
        }

        for (const i in serverStatus.customHosts) {
            customServerList += `
${CONSTANTS.GAMEMODES[(String(serverStatus.customHosts[i]!.gamemode) as CONSTANTS_GAMEMODES_TYPE)]} - ${serverStatus.customHosts[i].server.region} - ${serverStatus.customHosts[i].id} - ${serverStatus.customHosts[i].map.string_id} - ${serverStatus.customHosts[i].users} players
            `;
        }

        i.respond({
            content: `
**Deeeep.io Server Status**
(Last refreshed at <t:${Math.round(serverStatus.refreshedDate.getTime() / 1000)}:R>)

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

    @slash()
    refreshhosts(i: Interaction) {
        serverStatus.refreshHosts();
        i.respond({
            content: "All hosts refreshed."
        });
    }

    @slash()
    download(i: Interaction) {
        i.respond({
            content: "Download the client\nhttps://deeeep-reef-client.netlify.app/downloads/latest/"
        });
    }

    @slash()
    accountinfo(i: Interaction) {
        //@ts-ignore: No docs
        const account = i.data.options.find((e) => e.name == "account")?.value as string;
        //@ts-ignore: No docs
        const searchType = (i.data.options.find((e) => e.name == "type")?.value as boolean | undefined) ?? true;

        //@ts-ignore: I don't care
        if (!searchType && isNaN(account)) {
            i.respond({
                content: account + " is not a valid ID."
            });
            return;
        }

        (async () => {
            let error = false;
            const accountAPIPath = searchType ? "/users/u/" : "/users/";
            const accountInfo = await fetch(CONSTANTS.DEEEEP_API_URL + accountAPIPath + account)
                .then(res => res.json())
                .catch(err => {
                    error = true;
                    i.respond({
                        content: "Error fetching account " + account + "."
                    });
                });

            if (accountInfo === undefined) return;

            const socialNetworks = await fetch(CONSTANTS.DEEEEP_API_URL + "/socialNetworks/u/" + accountInfo.id)
                .then(res => res.json())
                .catch(err => {
                    if (error) return;
                    error = true;
                    i.respond({
                        content: "Error fetching account " + account + "."
                    });
                });

            if (socialNetworks === undefined) return;

            if (error) return;

            if (accountInfo?.message != undefined && accountInfo?.message == "User not found") {
                i.respond({
                    content: "Account " + account + " does not exist."
                });
                return;
            };



            let socialNetworksText = "";
            for (let i in socialNetworks) {
                socialNetworksText += `
- ${CONSTANTS.SOCIAL_NETWORKS[socialNetworks[i].platform_id as CONSTANTS_SOCIAL_NETWORKS_TYPE]}: ${socialNetworks[i].platform_user_id}`;
            }

            i.respond({
                content: `
**Account info for ${accountInfo.username}**
*"${accountInfo.description}" (description)*
About Me: *"${accountInfo.about}"*
ID: ${accountInfo.id}
Tier: ${accountInfo.tier} (${accountInfo.xp} XP)
Created: ${accountInfo.date_created}
Last Played: ${accountInfo.date_last_played}
Kill Count: ${accountInfo.kill_count}
Play Count: ${accountInfo.play_count}
Highest Score: ${accountInfo.highest_score}
Social Networks:
${socialNetworksText}
https://cdn.deeeep.io/uploads/avatars/${accountInfo.picture}
                `
            })
        })();
    }
}

const client = new TagBot();

client.connect(DISCORD_TOKEN, Intents.None);