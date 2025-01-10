import {BirdNerdWord, isBirdNerdWord} from "./word.js";

export type BirdNerdAnswer = BirdNerdWord[];

export function isBirdNerdAnswer (object: unknown): object is BirdNerdAnswer {
    if (!object || !Array.isArray(object)) {
        return false;
    }
    return object.every(isBirdNerdWord);
}
