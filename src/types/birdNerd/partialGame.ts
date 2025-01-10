import {BirdNerdGame} from "./game.js";
import {isBirdNerdImage} from "./image.js";
import {isBirdNerdJoiner} from "./joiner.js";
import {BirdNerdWord} from "./word.js";

export type BirdNerdWordPartial = Pick<BirdNerdWord, "joiner">;

export type BirdNerdAnswerShape = BirdNerdWordPartial[];

export type BirdNerdGamePartial = Omit<BirdNerdGame, "answer"> & { answerShape: BirdNerdAnswerShape; };

export function isBirdNerdWordPartial (object: unknown): object is BirdNerdWordPartial {
    if (!object || typeof object !== "object") {
        return false;
    }
    const word = object as BirdNerdWordPartial;
    return isBirdNerdJoiner(word.joiner);
}

export function isBirdNerdAnswerShape (object: unknown): object is BirdNerdAnswerShape {
    if (!object || !Array.isArray(object)) {
        return false;
    }
    return object.every(isBirdNerdWordPartial);
}

export function isBirdNerdGamePartial (object: unknown): object is BirdNerdGamePartial {
    if (!object || typeof object !== "object") {
        return false;
    }
    const game = object as BirdNerdGamePartial;
    return typeof game.id === "string"
        && typeof game.name === "string"
        && Array.isArray(game.images)
        && game.images.every(isBirdNerdImage)
        && Array.isArray(game.choices)
        && game.choices.every(choice => typeof choice === "string")
        && Array.isArray(game.answerShape) && game.answerShape.every(isBirdNerdWordPartial)
        && (!game.chances || typeof game.chances === "number");
}
