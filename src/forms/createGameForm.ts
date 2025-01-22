import {Context, Devvit, Form, FormFunction, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {createGameForm as createGameFormKey} from "../main.js";
import {setBirdNerdGame} from "../server/birdNerdServer/birdNerdGames.js";
import {setPostGame} from "../server/birdNerdServer/postGameLinks.server.js";
import {BirdNerdGame} from "../types/birdNerd/game.js";
import {stringToBirdNerdWords} from "../types/birdNerd/word.js";
import {BasicPreview} from "../customPost/components/preview.js";
import {queuePreview} from "../utils/previews.js";

type CreateGameFormSubmitData = {
    name?: string;
    heading?: string;
    description?: string;
    image?: string;
    imageAttribution?: string;
    imageAttributionUrl?: string;
    imageAspectRatio?: number;
    answer?: string;
    choices?: string;
    chances?: number;
    post?: boolean;
    postTitle?: string;
    endText?: string;
}

type CreateGameFormData = {
    defaultValues?: CreateGameFormSubmitData;
}

const form: FormFunction<CreateGameFormData> = (data: CreateGameFormData): Form => {
    const choiceNum = 1;
    if (choiceNum < 1 || choiceNum > 4) {
        throw new Error("Invalid choice number!");
    }
    return {
        fields: [
            {
                type: "group",
                label: "Image",
                fields: [
                    {
                        type: "image",
                        name: "image",
                        label: "Images",
                        helpText: "This will be the image that players will see.",
                        required: true,
                    },
                    {
                        type: "number",
                        name: "imageAspectRatio",
                        label: "Image Aspect Ratio",
                        helpText: "This is the aspect ratio of the image. For example if you set it to 1, the image will be a square. If you set it to 2, the image width will be twice the height.",
                        defaultValue: data.defaultValues?.imageAspectRatio ?? 2,
                        required: true,
                    },
                    {
                        type: "string",
                        name: "imageAttribution",
                        label: "Image Attribution",
                        helpText: "Depending on the image license, you may need to credit the creator. This text will be displayed below the image if provided.",
                        defaultValue: data.defaultValues?.imageAttribution,
                    },
                    {
                        type: "string",
                        name: "imageAttributionUrl",
                        label: "Image Attribution URL",
                        helpText: "If provided, clicking on the attribution text will navigate players to this URL.",
                        defaultValue: data.defaultValues?.imageAttributionUrl,
                    },
                ],
            },
            {
                type: "string",
                name: "name",
                label: "Game Name",
                helpText: "This will not be shown to players, it is for you to be able to identify the game.",
                defaultValue: data.defaultValues?.name ?? `BirdNerd game created at ${new Date().toISOString()}`,
                required: true,
            },
            {
                type: "string",
                name: "answer",
                label: "Answer",
                helpText: 'This will be the correct answer to this game. Please use underscores to split compound words. For example the "Brown-headed Cowbird" should be entered as "Brown-headed Cow_bird".',
                defaultValue: data.defaultValues?.answer,
            },
            {
                type: "string",
                name: "choices",
                label: "Choices",
                helpText: "Enter the incorrect words that players will have as options. This should be a comma separated list of words. Do not include the words from the correct answer, those will be added as choices automatically.",
                defaultValue: data.defaultValues?.choices,
            },
            {
                type: "number",
                name: "chances",
                label: "Chances",
                helpText: "The number of chances players will have to guess the correct answer. If left blank, players will have unlimited guesses.",
                defaultValue: data.defaultValues?.chances,
                required: true,
            },
            {
                type: "string",
                name: "endText",
                label: "End Text",
                helpText: "This text will be displayed below the game result after the game is finished. If left blank, no message will be shown.",
                defaultValue: data.defaultValues?.endText,
            },
            {
                type: "group",
                label: "Post",
                helpText: "You can choose to post this game to the subreddit immediately. If you choose not to post it, the game will be saved for future use (not yet implemented).",
                fields: [
                    {
                        type: "boolean",
                        name: "post",
                        label: "Post",
                        helpText: "If enabled, this game will be immediately posted to the subreddit.",
                        defaultValue: data.defaultValues?.post ?? false,
                    },
                    {
                        type: "string",
                        name: "postTitle",
                        label: "Post Title",
                        helpText: "This is only used as the post title if you chose to post the game now.",
                        defaultValue: data.defaultValues?.postTitle ?? "BirdNerd Game",
                    },
                ],
            },
        ],
        title: "Create BirdNerd Game",
        description: "This form is used to create a new BirdNerd game. If you choose not to post it, it will be saved for future use.",
        acceptLabel: "Submit",
        cancelLabel: "Cancel",
    };
};

const formHandler: FormOnSubmitEventHandler<CreateGameFormSubmitData> = async (event: FormOnSubmitEvent<CreateGameFormSubmitData>, context: Context) => {
    console.log(`Submitted createGameForm: ${JSON.stringify(event.values)}`);

    let validationFailed = false;
    if (!event.values.name) {
        context.ui.showToast("You must enter a name for the game.");
        validationFailed = true;
    }

    if (!event.values.image) {
        context.ui.showToast("You must select an image for the game.");
        validationFailed = true;
    }

    if (!event.values.answer) {
        context.ui.showToast("You must enter an answer for the game.");
        validationFailed = true;
    }

    if (!event.values.choices) {
        context.ui.showToast("You must enter choices for the game.");
        validationFailed = true;
    }

    if (!event.values.chances) {
        context.ui.showToast("You must enter the number of chances for the game.");
        validationFailed = true;
    }

    if (event.values.post && !event.values.postTitle) {
        context.ui.showToast("You must enter a post title if you want to post the game.");
        validationFailed = true;
    }

    // Early returns and early form shows seem to behave oddly here. Using a variable to track failure is a workaround.
    // Without this (i.e. showForm inside each if block), the form will show the error message and then show the next form instead of showing the same form again.
    if (validationFailed) {
        context.ui.showForm(createGameFormKey, {defaultValues: event.values});
        return;
    } else {
        const values = event.values as Required<CreateGameFormSubmitData>;
        const birdNerdGame: BirdNerdGame = {
            id: Math.random().toString(36).substring(2),
            name: values.name,
            images: [{url: values.image, attribution: values.imageAttribution, attributionUrl: values.imageAttributionUrl, aspectRatio: values.imageAspectRatio}],
            answer: stringToBirdNerdWords(values.answer),
            choices: values.choices.split(",").map(choice => choice.trim()),
            chances: values.chances,
            endText: values.endText,
        };
        await setBirdNerdGame(context.redis, birdNerdGame);
        console.log(`Created BirdNerd game: ${JSON.stringify(birdNerdGame, null, 2)}`);
        context.ui.showToast("Game stored!");

        if (values.post) {
            const postTitle = values.postTitle;

            if (!context.subredditName) {
                context.ui.showToast("Somehow you're not in a subreddit, unable to post.");
                console.warn("User somehow tried to post a game without being in a subreddit??");
                return;
            }
            const post = await context.reddit.submitPost({
                subredditName: context.subredditName,
                title: postTitle,
                textFallback: {text: "The platform you're using doesn't support custom posts. Please use Shreddit or an up to date app to view this post."},
                preview: BasicPreview,
            });
            await setPostGame(context.redis, post.id, birdNerdGame.id);
            context.ui.showToast("Game posted!");
            await queuePreview(context.redis, post.id);
            context.ui.navigateTo(post);
        }
    }
};

export const createGameForm: FormKey = Devvit.createForm(form, formHandler);
