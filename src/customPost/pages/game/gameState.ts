import {Context, FormKey, useAsync, UseAsyncResult, useChannel, UseChannelResult, useForm, useState, UseStateResult} from "@devvit/public-api";

import {CustomPostState} from "../../state.js";
import {BirdNerdAnswerShape, BirdNerdGamePartial, BirdNerdGuess, BirdNerdGuesses, BirdNerdGuessResult, defaultChances, getBirdNerdGuesses, getPostGame} from "../../../utils/birdNerd.js";
import {getBirdNerdGamePartial, makeBirdNerdGuess} from "../../../server/birdNerd.server.js";
import {max} from "lodash";
import {ChannelStatus} from "@devvit/public-api/types/realtime.js";
import {shareForm, ShareFormSubmitData} from "../../../forms/shareForm.js";

export const gameChannelName = "birdNerdGame";

export type GameChannelPacket = {
    gameId: string;
} & ({
    type: "refresh";
    data: number;
})

export type GameOverlay = "none" | "image" | "help";

export class GamePageState {
    public context: Context;

    readonly _guesses: UseStateResult<BirdNerdGuesses>;
    readonly _selected: UseStateResult<string | null>;
    readonly _currentGuess: UseStateResult<string[]>;
    readonly _reload: UseStateResult<number>;
    readonly _overlay: UseStateResult<GameOverlay>;

    readonly _shareFormKey: FormKey;

    readonly _currentGameId: UseAsyncResult<string | null>;
    readonly _currentPartialGame: UseAsyncResult<BirdNerdGamePartial | null>;
    readonly _pastGuesses: UseAsyncResult<BirdNerdGuesses | null>;

    readonly _channel: UseChannelResult<GameChannelPacket>;

    constructor (readonly postState: CustomPostState) {
        this.context = postState.context;

        this._guesses = useState<BirdNerdGuess[]>([]);
        this._selected = useState<string | null>(null);
        this._currentGuess = useState<string[]>([]);
        this._reload = useState<number>(0);
        this._overlay = useState<GameOverlay>("none");

        this._shareFormKey = useForm(shareForm, this.shareSubmit);

        this._currentGameId = useAsync<string | null>(async () => {
            if (!this.context.postId) {
                return null;
            }
            return getPostGame(this.context.redis, this.context.postId);
        }, {depends: [this.context.postId ?? null, this.reload]});

        this._currentPartialGame = useAsync<BirdNerdGamePartial | null>(async () => {
            if (!this.currentGameId) {
                return null;
            }
            await this.context.reddit.getSubredditInfoByName("test"); // Workaround for server-side functions not existing in useAsync unless an async function is called first
            return getBirdNerdGamePartial(this.context.redis, this.currentGameId);
        }, {depends: [this.currentGameId, this.reload]});
        this._pastGuesses = useAsync<BirdNerdGuesses | null>(async () => {
            if (!this.currentGameId || !this.postState.currentUserId) {
                return null;
            }
            return getBirdNerdGuesses(this.context.redis, this.currentGameId, this.postState.currentUserId);
        }, {depends: [this.currentGameId, this.postState.currentUserId, this.reload], finally: this.onGuessesLoaded});

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

    get guesses (): BirdNerdGuess[] {
        return this._guesses[0];
    }

    protected set guesses (value: BirdNerdGuess[]) {
        this._guesses[1](value);
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

    get image (): string | null {
        return this._currentPartialGame.data?.images[0]?.url ?? null;
    }

    get imageAttribution (): string | null {
        return this._currentPartialGame.data?.images[0]?.attribution ?? null;
    }

    get imageAttributionUrl (): string | null {
        return this._currentPartialGame.data?.images[0]?.attributionUrl ?? null;
    }

    get imageAspectRatio (): number {
        return this._currentPartialGame.data?.images[0]?.aspectRatio ?? 2;
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
        return this._currentPartialGame.data ? this._currentPartialGame.data.chances ?? defaultChances : null;
    }

    get finished (): boolean {
        return this.guesses.length >= (this.chances ?? 0) || this.guesses.some(guess => guess.every(word => word.result === "correct"));
    }

    get won (): boolean {
        return this.guesses.some(guess => guess.every(word => word.result === "correct"));
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

    getSlotWidth = () => (max(this.choices.map(choice => choice.length)) ?? 0) + (this.postState.reduceSize ? 0 : 2);

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

        const guessResult = await makeBirdNerdGuess(this.context.redis, this.postState.currentUserId, this.currentGameId, this.currentGuess);
        console.log("Guess result: ", guessResult);
        this.appendGuess(guessResult);
        this.currentGuess = [];

        if (guessResult.every(result => result.result === "correct")) {
            this.context.ui.showToast({text: "Congratulations! You got it right!", appearance: "success"});
        } else if (this.guesses.length >= this.chances) {
            this.context.ui.showToast("Sorry, you're out of chances!");
        }
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
        this.context.ui.showForm(this._shareFormKey, {defaultValues: {comment: this.won ? `I got it in ${this.guesses.length}!\n\n${guessesText}` : `I didn't get it!\n\n&nbsp;\n\n${guessesText}`}});
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

        await this.context.reddit.submitComment({
            id: this.postState.currentPost.id,
            text: data.comment,
        });
    };

    expandImagePressed = () => {
        if (!this.image) {
            console.log("No image to expand!");
            return;
        }
        this.overlay = "image";
    };

    openImagePressed = () => {
        if (!this.image) {
            console.log("No image to open!");
            return;
        }
        this.context.ui.navigateTo(this.image);
    };

    attributionPressed = () => {
        if (!this.imageAttributionUrl) {
            return;
        }
        this.context.ui.navigateTo(this.imageAttributionUrl);
    };

    onGuessesLoaded = (guesses: BirdNerdGuesses | null, error: Error | null) => {
        if (error) {
            console.error("Failed to load guesses:", error);
            return;
        }

        if (!guesses) {
            this.guesses = [];
            return;
        }

        this.guesses = guesses;
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
}
