import {Context, FormKey, useChannel, UseChannelResult, useForm, useState, UseStateResult} from "@devvit/public-api";

import {CustomPostState} from "../../state.js";
import {BirdNerdAnswerShape, BirdNerdGamePartial} from "../../../types/birdNerd/partialGame.js";
import {BirdNerdGuessResult} from "../../../types/birdNerd/guess.js";
import {BirdNerdGuess, BirdNerdGuesses} from "../../../types/birdNerd/guess.js";
import {getBirdNerdGamePartial, makeBirdNerdGuess, getPostGame, getBirdNerdGuesses} from "../../../server/clientRpcs.server.js";
import {max} from "lodash";
import {ChannelStatus} from "@devvit/public-api/types/realtime.js";
import {shareForm, ShareFormSubmitData} from "../../../forms/shareForm.js";
import {GameChannelPacket, GameOverlay} from "./gamePageTypes.js";
import {LoadState} from "../../../types/loadState.js";
import {useAsyncState, UseAsyncStateResult} from "../../../utils/useAsyncState.js";
import {BirdNerdImage} from "../../../types/birdNerd/image.js";
import {BirdNerdOutcome} from "../../../types/birdNerd/outcome.js";
import {choiceCharacterWidth, choiceHeightColumn, choiceHeightRow, defaultAspectRatio, guessRowHeight, horizontalLayoutPadding, verticalLayoutPadding, placeholderBirdNerdImage} from "./gamePageConstants.js";
import {defaultAppSettings} from "../../../settings.js";
import {getChoicesRowCount} from "../../components/choicesRow.js";
import {getChoicesColumnCount} from "../../components/choicesColumn.js";

export const gameChannelName = "birdNerdGame";

export class GamePageState {
    public context: Context;

    readonly _loaded: UseStateResult<LoadState>;
    readonly _selected: UseStateResult<string | null>;
    readonly _currentGuess: UseStateResult<string[]>;
    readonly _reload: UseStateResult<number>;
    readonly _overlay: UseStateResult<GameOverlay>;

    readonly _shareFormKey: FormKey;

    readonly _currentGameId: UseAsyncStateResult<string>;
    readonly _guesses: UseAsyncStateResult<BirdNerdGuesses>;
    readonly _currentPartialGame: UseAsyncStateResult<BirdNerdGamePartial>;

    readonly _channel: UseChannelResult<GameChannelPacket>;

    constructor (readonly postState: CustomPostState) {
        this.context = postState.context;

        this._loaded = useState<LoadState>("loading");
        this._selected = useState<string | null>(null);
        this._currentGuess = useState<string[]>([]);
        this._reload = useState<number>(0);
        this._overlay = useState<GameOverlay>("none");

        this._shareFormKey = useForm(shareForm, this.shareSubmit);

        this._currentGameId = useAsyncState<string>(async () => {
            if (!this.context.postId) {
                return null;
            }
            return getPostGame(this.context.redis, this.context.postId);
        }, {depends: [this.context.postId ?? null, this.reload]});

        this._guesses = useAsyncState<BirdNerdGuesses>(async () => {
            if (!this.currentGameId || !this.postState.currentUserId) {
                return null;
            }
            return getBirdNerdGuesses(this.context.redis, this.currentGameId, this.postState.currentUserId);
        }, {depends: [this.currentGameId, this.postState.currentUserId, this.reload], defaultData: [], blockDirtyReload: true});

        this._currentPartialGame = useAsyncState<BirdNerdGamePartial>(async () => {
            if (!this.currentGameId) {
                return null;
            }
            await this.context.reddit.getSubredditInfoByName("test"); // Workaround for server-side functions not existing in useAsync unless an async function is called first
            return getBirdNerdGamePartial(this.context.redis, this.currentGameId);
        }, {depends: [this.currentGameId, this.reload]});

        this._channel = useChannel<GameChannelPacket>({
            name: gameChannelName,
            onMessage: this.onChannelMessage,
            onSubscribed: this.onChannelSubscribed,
            onUnsubscribed: this.onChannelUnsubscribed,
        });
        try {
            this._channel.subscribe();
        } catch (e) {
            console.error(`Error starting channel: ${String(e)}`);
        }
    }

    get isLoaded (): boolean {
        return this.loaded === "loaded";
    }

    get loaded (): LoadState {
        if (this._loaded[0] === "loading") {
            if (this.postState.isLoaded) {
                const loadingChecks = [this._currentGameId, this._guesses, this._currentPartialGame];
                if (loadingChecks.every(check => !check.loading)) {
                    if (loadingChecks.every(check => check.error === null)) {
                        this.loaded = "loaded";
                        return "loaded";
                    }
                    this.loaded = "error";
                    return "error";
                }
            }
            return this._loaded[0];
        }
        return this._loaded[0];
    }

    protected set loaded (value: LoadState) {
        this._loaded[1](value);
    }

    get guesses (): BirdNerdGuesses {
        return this._guesses.data ?? [];
    }

    protected set guesses (value: BirdNerdGuesses) {
        this._guesses.setData(value);
    }

    get selected (): string | null {
        return this._selected[0];
    }

    set selected (value: string | null) {
        if (value === null || this.choices.includes(value)) {
            this._selected[1](value);
            return;
        }
        this._selected[1](null);
    }

    get currentGuess (): string[] {
        return this._currentGuess[0];
    }

    protected set currentGuess (value: string[]) {
        if (value.length !== this.answerShape.length) {
            this._currentGuess[1](Array<string>(this.answerShape.length).fill(""));
        }
        this._currentGuess[1](value);
    }

    get reload (): number {
        return this._reload[0];
    }

    set reload (value: number) {
        this._reload[1](value + 1);
    }

    get overlay (): GameOverlay {
        return this._overlay[0];
    }

    protected set overlay (value: GameOverlay) {
        this._overlay[1](value);
    }

    changeOverlay (overlay: GameOverlay): void {
        if (this.overlay === overlay) {
            return;
        }
        this.overlay = overlay;
    }

    get image (): BirdNerdImage {
        return this._currentPartialGame.data?.images[0] ?? placeholderBirdNerdImage;
    }

    get imageDims (): [number, number] {
        if (!this.image) {
            return [50, 50];
        }

        const aspect = this.image.aspectRatio ?? defaultAspectRatio;

        // Because the Devvit <image> element doesn't support percentage-based sizing or a grow property,
        // we need to calculate the best possible image size in pixels based on the estimated size of the other UI elements.
        const guessesHeight = (this.chances ?? defaultAppSettings.defaultChances) * guessRowHeight;
        const choicesHeight = this.postState.layout === "horizontal" ? 0 : getChoicesRowCount(this.choices, choiceCharacterWidth, this.postState.uiDims.width) * choiceHeightRow;
        const paddingHeight = (this.postState.layout === "horizontal" ? 4 : 5) * (this.postState.layout === "horizontal" ? horizontalLayoutPadding : verticalLayoutPadding);
        const usedHeight = guessesHeight + choicesHeight + paddingHeight;
        const maxImageHeight = Math.max(this.postState.uiDims.height - usedHeight, 10);

        const choicesWidth = this.postState.layout === "vertical" ? 0 : getChoicesColumnCount(this.choices, choiceHeightColumn, this.postState.uiDims.height) * choiceCharacterWidth * this.slotWidth;
        const paddingWidth = (this.postState.layout === "vertical" ? 2 : 3) * (this.postState.layout === "horizontal" ? horizontalLayoutPadding : verticalLayoutPadding);
        const usedWidth = choicesWidth + paddingWidth;
        const maxImageWidth = Math.max(this.postState.uiDims.width - usedWidth, 10);

        // We want to preserve aspect ratio, but we also want to fill all available space.
        // If the imageWidth would result in the image being too tall, we'll need to scale based on maxImageHeight instead.
        // Otherwise we'll get the height based on the width we calculated.
        const imageWidth = Math.min(maxImageWidth, maxImageHeight * aspect);
        if (imageWidth / aspect > maxImageHeight) {
            return [maxImageHeight * aspect, maxImageHeight];
        } else {
            return [imageWidth, imageWidth / aspect];
        }
    }

    get slotWidth (): number {
        return (max(this.choices.map(choice => choice.length)) ?? 0) + (this.postState.layout === "horizontal" ? 2 : 1);
    }

    get choices (): string[] {
        return this._currentPartialGame.data?.choices ?? [];
    }

    get answerShape (): BirdNerdAnswerShape {
        return this._currentPartialGame.data?.answerShape ?? [];
    }

    get currentGameId (): string | null {
        return this._currentGameId.data;
    }

    get chances (): number | null {
        if (this._currentPartialGame.loading) {
            return null;
        }
        return this._currentPartialGame.data?.chances ?? (this.postState.appSettings?.defaultChances ?? null);
    }

    get outcome (): BirdNerdOutcome | null {
        if (!this.isLoaded || !this.chances || !this.guesses.length) {
            return null;
        }

        const outcome: BirdNerdOutcome = {
            guesses: this.guesses.length,
            result: undefined,
        };

        // If any of the guesses were all green, it's a win. We don't really care about which guess it was.
        if (this.guesses.some(guess => guess.every(word => word.result === "correct"))) {
            outcome.result = "won";
            return outcome;
        }

        // We already know none of the guesses were all correct, so if we haven't run out of chances yet, there's no outcome.
        if (this.guesses.length < this.chances) {
            return null;
        }

        // We didn't win and we don't have any more chances, so we lost.
        outcome.result = "lost";
        return outcome;
    }

    get finished (): boolean {
        return this.outcome !== null;
    }

    get won (): boolean {
        return this.outcome?.result === "won";
    }

    // Use previous guess results to determine which word can't be in the answer, account for duplicate words
    notInAnswer = (word: string) => {
        if (!this.guesses.length) {
            return false;
        }
        const notInAnswer: boolean[] = [];
        for (const guess of this.guesses) {
            let excludedByGuess = false;
            for (const guessedWord of guess) {
                if (guessedWord.word === word) {
                    if (guessedWord.result !== "incorrect") {
                        excludedByGuess = false;
                        break;
                    } else {
                        excludedByGuess = true;
                    }
                }
            }
            notInAnswer.push(excludedByGuess);
        }

        return notInAnswer.some(excluded => excluded);
    };

    appendGuess = (guess: BirdNerdGuess) => {
        this.guesses = [...this.guesses, guess];
    };

    sendToChannel = async (message: Omit<GameChannelPacket, "gameId">) => {
        if (!this.context.userId || !this.currentGameId) {
            return;
        }
        const fullMessage: GameChannelPacket = {
            ...message,
            gameId: this.currentGameId,
        } as GameChannelPacket;
        try {
            if (this._channel.status === ChannelStatus.Connected) {
                await this._channel.send(fullMessage);
            } else {
                this._channel.subscribe();
                await this._channel.send(fullMessage);
            }
        } catch (e) {
            console.error(`Error sending message to channel: ${String(e)}`);
        }
    };

    onChannelMessage = (message: GameChannelPacket) => {
        if (message.gameId !== this.currentGameId) {
            return;
        }

        if (message.type === "refresh") {
            this.reload = message.data;
        }
    };

    onChannelSubscribed = async () => {
        if (this.postState.currentUser) {
            console.log(`${this.postState.currentUser.username} has subscribed to the ${this.context.postId} channel with environment ${JSON.stringify(this.context.uiEnvironment ?? {})}`);
        }
    };

    onChannelUnsubscribed = async () => {
        if (this.postState.currentUser) {
            console.log(`${this.postState.currentUser.username} has unsubscribed from the ${this.context.postId} channel`);
        }
        try {
            this._channel.subscribe();
        } catch (e) {
            console.error(`Error resubscribing to channel: ${String(e)}`);
        }
    };

    choicePressed = (choice: string) => {
        if (choice === this.selected) {
            this.selected = null;
            return;
        }
        this.selected = choice;
    };

    slotPressed = (slot: number) => {
        let newGuess: string[] = this.currentGuess;
        if (newGuess.length !== this.answerShape.length) {
            newGuess = Array<string>(this.answerShape.length).fill("");
        }

        if (newGuess[slot] === this.selected && newGuess === this.currentGuess) {
            return;
        }

        newGuess[slot] = this.selected ?? "";
        this.currentGuess = newGuess;
        this.selected = null;
    };

    submitPressed = async () => {
        if (!this.currentGameId || !this.chances || !this.postState.currentUserId) {
            console.warn("Guess submitted with no game or user?");
            this.context.ui.showToast("Somehow you submitted a guess without it being fully loaded. Please try refreshing the page.");
            return;
        }

        if (this.currentGuess.length !== this.answerShape.length || !this.currentGuess.every(guess => guess && this.choices.includes(guess))) {
            console.log("here?");
            this.context.ui.showToast("Please fill in all the blanks before submitting your guess!");
            return;
        }

        await this.context.reddit.getPostById(this.context.postId ?? "");

        const guessResult = await makeBirdNerdGuess(this.context, this.postState.currentUserId, this.currentGameId, this.currentGuess);
        console.log("Guess result: ", guessResult);
        this.appendGuess(guessResult);
        this.currentGuess = [];

        if (guessResult.every(result => result.result === "correct")) {
            this.context.ui.showToast({text: "Congratulations! You got it right!", appearance: "success"});
        } else if (this.guesses.length >= this.chances) {
            this.context.ui.showToast("Sorry, you're out of chances!");
        }
    };

    expandImagePressed = () => {
        if (!this.image) {
            console.log("No image to expand!");
            return;
        }
        this.overlay = "image";
    };

    attributionPressed = () => {
        if (!this.image?.attributionUrl) {
            return;
        }
        this.context.ui.navigateTo(this.image.attributionUrl);
    };

    sharePressed = async () => {
        if (!this.currentGameId) {
            console.warn("No game to share!");
            this.context.ui.showToast("ERROR: Current game not loaded!");
            return;
        }

        const emojiMap: Record<BirdNerdGuessResult, string> = {
            correct: "🟩",
            incorrect: "🟥",
            contains: "🟨",
        };
        const guessesText = this.guesses.map(guess => `${guess.map(word => `${emojiMap[word.result]}`).join("")}`).reverse().join("  \n");
        this.context.ui.showForm(this._shareFormKey, {defaultValues: {comment: this.outcome?.result === "won" ? `I got it in ${this.guesses.length}!\n\n${guessesText}` : `I didn't get it!\n\n&nbsp;\n\n${guessesText}`}});
    };

    shareSubmit = async (data: ShareFormSubmitData) => {
        if (!this.postState.currentPost) {
            console.warn("No post to share on!");
            this.context.ui.showToast("ERROR: Current post not loaded!");
            return;
        }

        if (!data.comment) {
            console.warn("No comment to share!");
            this.context.ui.showToast("ERROR: Share comment blank!");
            return;
        }

        const comment = await this.context.reddit.submitComment({
            id: this.postState.currentPost.id,
            text: data.comment,
        });
        this.context.ui.navigateTo(comment);
    };
}
