import {SettingsFormFieldValidatorEvent} from "@devvit/public-api";

export async function validateDefaultChances (event: SettingsFormFieldValidatorEvent<number>) {
    const value = Number(event.value);
    if (isNaN(value)) {
        return "Default Chances must be a number!";
    }
    if (value < 1) {
        return "Default Chances must be above or equal to 1!";
    }
    if (!Number.isInteger(value)) {
        return "Default Chances must be a whole number!";
    }
}
