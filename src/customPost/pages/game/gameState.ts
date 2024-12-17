import {Context, useAsync, UseAsyncResult, useState, UseStateResult} from "@devvit/public-api";

import {CustomPostState} from "../../state.js";
import {BirdNerdAnswerShape, BirdNerdGamePartial, BirdNerdGuess, BirdNerdGuesses, defaultChances, getBirdNerdGuesses, getPostGame} from "../../../utils/birdNerd.js";
import {getBirdNerdGamePartial, makeBirdNerdGuess} from "../../../server/birdNerd.server.js";
import {max} from "lodash";

export class GamePageState {
    public context: Context;

    readonly _guesses: UseStateResult<BirdNerdGuesses>;
    readonly _selected: UseStateResult<string | null>;
    readonly _currentGuess: UseStateResult<string[]>;

    readonly _currentGameId: UseAsyncResult<string | null>;
    readonly _currentPartialGame: UseAsyncResult<BirdNerdGamePartial | null>;
    readonly _pastGuesses: UseAsyncResult<BirdNerdGuesses | null>;

    constructor (readonly postState: CustomPostState) {
        this.context = postState.context;

        this._guesses = useState<BirdNerdGuess[]>([]);
        this._selected = useState<string | null>(null);
        this._currentGuess = useState<string[]>([]);

        this._currentGameId = useAsync<string | null>(async () => {
            if (!this.context.postId) {
                return null;
            }
            return getPostGame(this.context.redis, this.context.postId);
        }, {depends: [this.context.postId ?? null]});

        this._currentPartialGame = useAsync<BirdNerdGamePartial | null>(async () => {
            if (!this.currentGameId) {
                return null;
            }
            await this.context.reddit.getSubredditInfoByName("test"); // Workaround for server-side functions not existing in useAsync unless an async function is called first
            return getBirdNerdGamePartial(this.context.redis, this.currentGameId);
        }, {depends: [this.currentGameId]});
        this._pastGuesses = useAsync<BirdNerdGuesses | null>(async () => {
            if (!this.currentGameId || !this.postState.currentUserId) {
                return null;
            }
            return getBirdNerdGuesses(this.context.redis, this.currentGameId, this.postState.currentUserId);
        }, {depends: [this.currentGameId, this.postState.currentUserId], finally: this.onGuessesLoaded});
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

    get image (): string | null {
        return this._currentPartialGame.data?.images[0]?.url ?? null;
    }

    get imageAttribution (): string | null {
        return this._currentPartialGame.data?.images[0]?.attribution ?? null;
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

    sharePressed = () => {
        this.context.ui.showToast("Share pressed! (Not yet implemented)");
    };

    expandImagePressed = () => {
        if (!this.image) {
            console.log("No image to expand!");
            return;
        }
        this.context.ui.navigateTo(this.image);
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
}
