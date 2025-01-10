import {Form} from "@devvit/public-api";

export const resetGameForm: Form = {
    title: "Reset Game",
    description: "Are you sure you want to reset the current game?",
    acceptLabel: "Reset",
    cancelLabel: "Cancel",
    fields: [
        {
            type: "select",
            name: "target",
            label: "Target",
            options: [
                {label: "None", value: "none"},
                {label: "Me", value: "me"},
                {label: "All", value: "all"},
            ],
        },
    ],
};

export type ResetGameFormSubmitData = {
    target?: ["none" | "me" | "all"];
};
