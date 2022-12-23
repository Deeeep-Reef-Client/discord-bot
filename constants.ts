const CONSTANTS = {
    DEEEEP_API_URL: "https://apibeta.deeeep.io",
    GAMEMODES: {
        "1": "FFA",
        "2": "PD",
        "5": "1v1",
        "6": "TFFA"
    },
    SOCIAL_NETWORKS: {
        "dc": "Discord",
        "ig": "Instagram",
        "qq": "QQ",
        "rd": "Reddit",
        "tc": "Twitch",
        "tw": "Twitter",
        "wb": "Weibo",
        "wx": "Weixin",
        "fb": "Facebook",
        "vk": "VK"
    }
}
export default CONSTANTS;

export type CONSTANTS_GAMEMODES_TYPE = keyof typeof CONSTANTS.GAMEMODES;
export type CONSTANTS_SOCIAL_NETWORKS_TYPE = keyof typeof CONSTANTS.SOCIAL_NETWORKS;