import {Form, FormFunction} from "@devvit/public-api";

export type ShareFormSubmitData = {
    comment?: string;
}

export type ShareFormData = {
    defaultValues?: ShareFormSubmitData
}

export const shareForm: FormFunction<ShareFormData> = (data: ShareFormData): Form => ({
    fields: [
        {
            type: "paragraph",
            name: "comment",
            label: "Share Text",
            defaultValue: data.defaultValues?.comment ?? "I just played a game of Bird Nerd!",
            lineHeight: data.defaultValues?.comment?.split("\n").length ?? 7,
            disabled: true,
        },
    ],
    title: "Share Result",
    description: "You are about to submit a public comment with your game results in reply to the game post. Are you sure you wish to share your result?",
    acceptLabel: "Submit Comment",
    cancelLabel: "Cancel",
});
