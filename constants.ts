const CONSTANTS = {
    DEEEEP_API_URL: "https://apibeta.deeeep.io",
    GAMEMODES: {
        "1": "FFA",
        "2": "PD",
        "5": "1v1",
        "6": "TFFA"
    }
}
export default CONSTANTS;

export type CONSTANTS_GAMEMODES_TYPE = keyof typeof CONSTANTS.GAMEMODES;