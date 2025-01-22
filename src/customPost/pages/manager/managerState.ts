import {Context, FormKey, useForm} from "@devvit/public-api";

import {editGameForm, EditGameFormSubmitData} from "../../../forms/editGameForm.js";
import {resetGameForm, ResetGameFormSubmitData} from "../../../forms/resetGameForm.js";
import {getBirdNerdGame, setBirdNerdGame} from "../../../server/birdNerdServer/birdNerdGames.js";
import {resetBirdNerdGuesses} from "../../../server/birdNerdServer/playerGuesses.server.js";
import {isBirdNerdGame} from "../../../types/birdNerd/game.js";
import {queuePreview} from "../../../utils/previews.js";
import {CustomPostState} from "../../state.js";

export class ManagerPageState {
    readonly context: Context;
    readonly editRawGameFormKey: FormKey;
    readonly resetGameFormKey: FormKey;

    constructor (readonly postState: CustomPostState) {
        this.context = postState.context;
        this.editRawGameFormKey = useForm(editGameForm, this.editRawGameSubmit);
        this.resetGameFormKey = useForm(resetGameForm, this.resetGameSubmit);
    }

    get currentGameId () {
        return this.gameState.currentGameId;
    }
    get gameState () {
        return this.postState.PageStates.game;
    }

    editRawGamePressed = async () => {
        if (!this.currentGameId) {
            this.context.ui.showToast("Unable to edit, no game currently loaded.");
            return;
        }

        this.context.ui.showForm(this.editRawGameFormKey, {
            defaultValues: {
                rawGame: JSON.stringify(await getBirdNerdGame(this.context.redis, this.currentGameId), null, 2),
            },
        });
    };
    editRawGameSubmit = async (data: EditGameFormSubmitData) => {
        const rawGameString = data.rawGame;
        if (!rawGameString) {
            this.context.ui.showToast("No raw game data provided!");
            return;
        }

        if (!this.context.postId) {
            this.context.ui.showToast("No post ID found!");
            console.warn("No post ID found when trying to update game data.");
            return;
        }

        // Force server-side execution, otherwise server-functions may be undefined
        await this.context.reddit.getCurrentUser();

        try {
            const rawGame = JSON.parse(rawGameString) as unknown;
            if (!rawGame) {
                throw new Error("Failed to parse game data!");
            }

            if (!isBirdNerdGame(rawGame)) {
                throw new Error("Failed to validate game data against schema!");
            }

            await setBirdNerdGame(this.context.redis, rawGame);
            await queuePreview(this.context.redis, this.context.postId);
            this.context.ui.showToast("Game data updated!");
            await this.gameState.sendToChannel({type: "refresh", data: Date.now()});
        } catch (e) {
            this.context.ui.showToast(`Failed to update game: ${String(e)}`);
            this.context.ui.showForm(this.editRawGameFormKey, {defaultValues: {rawGame: rawGameString}});
        }
    };
    resetGamePressed = async () => {
        this.context.ui.showForm(this.resetGameFormKey);
    };
    resetGameSubmit = async (data: ResetGameFormSubmitData) => {
        if (!this.currentGameId) {
            this.context.ui.showToast("Unable to reset, no game currently loaded.");
            return;
        }

        if (!this.postState.currentUserId) {
            this.context.ui.showToast("Unable to reset, no user ID found.");
            return;
        }

        const resetTarget = data.target?.[0] ?? "none";
        if (resetTarget === "none") {
            this.context.ui.showToast("No reset target selected, aborting.");
            return;
        }

        // Force server-side execution, otherwise server-functions may be undefined
        await this.context.reddit.getCurrentUser();

        if (resetTarget === "all") {
            await resetBirdNerdGuesses(this.context.redis, this.currentGameId);
            this.gameState._guesses.setData([]);
            await this.gameState.sendToChannel({type: "refresh", data: Date.now()});
            this.context.ui.showToast("All guesses reset! Users may need to refresh.");
        } else if (resetTarget === "me") {
            await resetBirdNerdGuesses(this.context.redis, this.currentGameId, [this.postState.currentUserId]);
            this.gameState._guesses.setData([]);
            this.context.ui.showToast("Only your game has been reset!");
        }
    };
    updatePreviewPressed = async () => {
        if (!this.context.postId) {
            this.context.ui.showToast("No post ID found!");
            return;
        }

        // Force server-side execution, otherwise server-functions may be undefined
        await this.context.reddit.getCurrentUser();

        await queuePreview(this.context.redis, this.context.postId);
        this.context.ui.showToast("Preview update queued!");
    };
}
