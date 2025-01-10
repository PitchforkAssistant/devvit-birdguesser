export type BirdNerdGuessResult = "correct" | "incorrect" | "contains";

export type BirdNerdGuessedWord = {
    word: string;
    result: BirdNerdGuessResult;
};

export type BirdNerdGuess = BirdNerdGuessedWord[];

export type BirdNerdGuesses = BirdNerdGuess[];

export function isBirdNerdGuessResult (result: unknown): result is BirdNerdGuessResult {
    return result === "correct" || result === "incorrect" || result === "contains";
}

export function isBirdNerdGuessedWord (object: unknown): object is BirdNerdGuessedWord {
    if (!object || typeof object !== "object") {
        return false;
    }
    const word = object as BirdNerdGuessedWord;
    return typeof word.word === "string"
        && isBirdNerdGuessResult(word.result);
}

export function isBirdNerdGuess (object: unknown): object is BirdNerdGuess {
    if (!object || !Array.isArray(object)) {
        return false;
    }
    return object.every(isBirdNerdGuessedWord);
}

export function isBirdNerdGuesses (object: unknown): object is BirdNerdGuesses {
    if (!object || !Array.isArray(object)) {
        return false;
    }
    return object.every(isBirdNerdGuess);
}
