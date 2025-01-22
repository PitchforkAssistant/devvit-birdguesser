import {BirdNerdAnswer} from "./answer.js";
import {BirdNerdImage, isBirdNerdImage} from "./image.js";
import {isBirdNerdWord} from "./word.js";

export type BirdNerdGame = {
    id: string;
    name: string;
    images: BirdNerdImage[];
    answer: BirdNerdAnswer;
    choices: string[];
    chances?: number;
    endText?: string;
};

export function isBirdNerdGame (object: unknown): object is BirdNerdGame {
    if (!object || typeof object !== "object") {
        return false;
    }
    const game = object as BirdNerdGame;
    return typeof game.id === "string"
        && typeof game.name === "string"
        && Array.isArray(game.images)
        && game.images.every(isBirdNerdImage)
        && Array.isArray(game.choices)
        && game.choices.every(choice => typeof choice === "string")
        && Array.isArray(game.answer) && game.answer.every(isBirdNerdWord)
        && (!game.chances || typeof game.chances === "number")
        && (!game.endText || typeof game.endText === "string");
}
