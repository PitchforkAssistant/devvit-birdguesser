import {BirdNerdJoiner, isBirdNerdJoiner, JoinerToCharacter} from "./joiner.js";

/**
 * The joiner is the character that follows the word.
 */

export type BirdNerdWord = {
    word: string;
    joiner: BirdNerdJoiner;
};

export function isBirdNerdWord (object: unknown): object is BirdNerdWord {
    if (!object || typeof object !== "object") {
        return false;
    }
    const word = object as BirdNerdWord;
    return typeof word.word === "string"
        && isBirdNerdJoiner(word.joiner);
}
/**
 * Converts an input string with compound words separated by underscores into an array of words with joiners.
 * @param string Input with compound words separated by underscores.
 * @returns Array of words with joiners (space, hyphen, or none) following each word.
 */

export function stringToBirdNerdWords (string: string): BirdNerdWord[] {
    const words: BirdNerdWord[] = [];
    let currentWord = "";
    let currentJoiner: BirdNerdJoiner = "none";
    for (const char of string) {
        if (char === " ") {
            currentJoiner = "space";
        } else if (char === "-") {
            currentJoiner = "hyphen";
        } else if (char === "_") {
            currentJoiner = "none";
        } else {
            currentWord += char;
            continue;
        }
        words.push({word: currentWord, joiner: currentJoiner});
        currentWord = "";
        currentJoiner = "none";
    }
    if (currentWord) {
        words.push({word: currentWord, joiner: currentJoiner});
    }
    return words;
}

export function birdNerdWordsToString (words: BirdNerdWord[]): string {
    return words.reduce((acc, word) => {
        const joiner = JoinerToCharacter[word.joiner];
        return acc + word.word + joiner;
    }, "");
}
