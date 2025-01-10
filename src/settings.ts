import {Devvit, SettingsClient} from "@devvit/public-api";
import {validateDefaultChances} from "./validators/validateDefaultChances.js";

export type AppSettings = {
    defaultChances: number;
}

export const defaultAppSettings: AppSettings = {
    defaultChances: 10,
};

export async function getAppSettings (settings: SettingsClient): Promise<AppSettings> {
    const allSettings = await settings.getAll<AppSettings>();

    return {
        defaultChances: typeof allSettings.defaultChances === "number" ? allSettings.defaultChances : defaultAppSettings.defaultChances,
    };
}

// Set up the configuration field presented to the user for each installation (subreddit) of the app.
export const devvitAppSettings = Devvit.addSettings([
    {
        type: "number",
        name: "defaultChances",
        label: "Default Chances",
        helpText: "These are used as the default number of chances for each game, unless otherwise specified when creating the game.",
        defaultValue: defaultAppSettings.defaultChances,
        onValidate: validateDefaultChances,
    },
]);
