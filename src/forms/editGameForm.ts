import {Form, FormFunction} from "@devvit/public-api";

export type EditGameFormSubmitData = {
    rawGame?: string;
}

export type EditGameFormData = {
    defaultValues?: EditGameFormSubmitData
}

export const editGameForm: FormFunction<EditGameFormData> = (data: EditGameFormData): Form => ({
    fields: [
        {
            type: "paragraph",
            name: "rawGame",
            label: "Raw Game Data",
            helpText: "You'll want to copy the JSON provided, edit it, and paste it back in here before submitting.",
            defaultValue: data.defaultValues?.rawGame ?? "ERROR: No raw game data provided.",
            lineHeight: data.defaultValues?.rawGame?.split("\n").length ?? 4,
            required: true,
        },
    ],
    title: "Edit Raw Game Data",
    description: "This lets you directly edit the JSON of the game data. This data is validated less thoroughly than the initial create game form, so be careful.",
    acceptLabel: "Submit",
    cancelLabel: "Cancel",
});
