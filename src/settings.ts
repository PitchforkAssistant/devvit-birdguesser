import {Devvit} from "@devvit/public-api";
import {validateDiceRoll} from "./validators/validateDiceRoll.js";

// Set up the configuration field presented to the user for each installation (subreddit) of the app.
export const devvitAppSettings = Devvit.addSettings([
    {
        type: "number",
        name: "diceRoll",
        label: "LABELS.DICE_ROLL",
        helpText: "HELP_TEXTS.DICE_ROLL",
        defaultValue: 4,
        onValidate: validateDiceRoll,
    },
]);
