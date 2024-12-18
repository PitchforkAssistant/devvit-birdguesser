import {Context, FormKey, useForm} from "@devvit/public-api";
import {CustomPostState} from "../../state.js";
import {getBirdNerdGame, isBirdNerdGame, resetBirdNerdGuesses, setBirdNerdGame} from "../../../utils/birdNerd.js";
import {editGameForm, EditGameFormSubmitData} from "../../../forms/editGameForm.js";
import {queuePreview} from "../../../utils/previews.js";
import {resetGameForm, ResetGameFormSubmitData} from "../../../forms/resetGameForm.js";

export class ManagerPageState {
    public context: Context;
    readonly editRawGameFormKey: FormKey;
    readonly resetGameFormKey: FormKey;

    constructor (readonly postState: CustomPostState) {
        this.context = postState.context;
        this.editRawGameFormKey = useForm(editGameForm, this.editRawGameSubmit);
        this.resetGameFormKey = useForm(resetGameForm, this.resetGameSubmit);
    }

    get gameState () {
        return this.postState.PageStates.game;
    }

    get currentGameId () {
        return this.gameState.currentGameId;
    }

    updatePreviewPressed = async () => {
        if (!this.context.postId) {
            this.context.ui.showToast("No post ID found!");
            return;
        }
        await queuePreview(this.context.redis, this.context.postId);
        this.context.ui.showToast("Preview update queued!");
    };

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
            this.context.ui.showForm(this.editRawGameFormKey, {defaultValues: {rawVote: rawGameString}});
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

        const resetTarget = data.target ?? "none";
        if (resetTarget === "none") {
            this.context.ui.showToast("No reset target selected, aborting.");
            return;
        }

        if (resetTarget === "all") {
            await resetBirdNerdGuesses(this.context.redis, this.currentGameId);
            this.context.ui.showToast("All guesses reset!");
        } else if (resetTarget === "me") {
            await resetBirdNerdGuesses(this.context.redis, this.currentGameId, [this.postState.currentUserId]);
            this.context.ui.showToast("Only your game has been reset!");
        }

        await this.gameState.sendToChannel({type: "refresh", data: Date.now()});
    };
}
