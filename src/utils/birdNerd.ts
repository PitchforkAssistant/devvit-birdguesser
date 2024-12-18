import {RedisClient} from "@devvit/public-api";

export const defaultChances = 4;

export const gamesKey = "birdNerdGames";
export const guessesKeyPrefix = "birdNerdGuesses:";
export const postsKey = "birdNerdPosts";

export type BirdNerdJoiner = "space" | "hyphen" | "none";

/**
 * The joiner is the character that follows the word.
 */
export type BirdNerdWord = {
    word: string;
    joiner: BirdNerdJoiner;
}

export type BirdNerdWordPartial = Pick<BirdNerdWord, "joiner">;

export type BirdNerdAnswer = BirdNerdWord[];

export type BirdNerdAnswerShape = BirdNerdWordPartial[];

export type BirdNerdGuessResult = "correct" | "incorrect" | "contains";

export type BirdNerdImage = {
    url: string;
    attribution?: string;
    attributionUrl?: string;
    aspectRatio?: number;
}

export type BirdNerdGame = {
    id: string;
    name: string;
    images: BirdNerdImage[];
    answer: BirdNerdAnswer;
    choices: string[];
    chances?: number;
}

export type BirdNerdGamePartial = Omit<BirdNerdGame, "answer"> & {answerShape: BirdNerdAnswerShape};

export type BirdNerdGuessedWord = {
    word: string;
    result: BirdNerdGuessResult;
}

export type BirdNerdGuess = BirdNerdGuessedWord[];

export type BirdNerdGuesses = BirdNerdGuess[];

export function isBirdNerdJoiner (joiner: unknown): joiner is BirdNerdJoiner {
    return joiner === "space" || joiner === "hyphen" || joiner === "none";
}

export function isBirdNerdWord (object: unknown): object is BirdNerdWord {
    if (!object || typeof object !== "object") {
        return false;
    }
    const word = object as BirdNerdWord;
    return typeof word.word === "string"
    && isBirdNerdJoiner(word.joiner);
}

export function isBirdNerdWordPartial (object: unknown): object is BirdNerdWord {
    if (!object || typeof object !== "object") {
        return false;
    }
    const word = object as BirdNerdWordPartial;
    return isBirdNerdJoiner(word.joiner);
}

export function isBirdNerdAnswer (object: unknown): object is BirdNerdAnswer {
    if (!object || !Array.isArray(object)) {
        return false;
    }
    return object.every(isBirdNerdWord);
}

export function isBirdNerdAnswerShape (object: unknown): object is BirdNerdAnswerShape {
    if (!object || !Array.isArray(object)) {
        return false;
    }
    return object.every(isBirdNerdWordPartial);
}

export function isBirdNerdGuessResult (result: unknown): result is BirdNerdGuessResult {
    return result === "correct" || result === "incorrect" || result === "contains";
}

export function isBirdNerdImage (object: unknown): object is BirdNerdImage {
    if (!object || typeof object !== "object") {
        return false;
    }
    const image = object as BirdNerdImage;
    return typeof image.url === "string"
        && (!image.attribution || typeof image.attribution === "string")
        && (!image.aspectRatio || typeof image.aspectRatio === "number")
        && (!image.attributionUrl || typeof image.attributionUrl === "string");
}

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
        && (!game.chances || typeof game.chances === "number");
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

export const JoinerToCharacter: Record<BirdNerdJoiner, string> = {
    space: " ",
    hyphen: "-",
    none: "",
};

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

export async function setBirdNerdGame (redis: RedisClient, game: BirdNerdGame): Promise<void> {
    await redis.hSet(gamesKey, {[game.id]: JSON.stringify(game)});
}

export async function getBirdNerdGame (redis: RedisClient, id: string): Promise<BirdNerdGame | null> {
    const rawGame = await redis.hGet(gamesKey, id);
    if (!rawGame) {
        return null;
    }
    const game: unknown = JSON.parse(rawGame);
    return isBirdNerdGame(game) ? game : null;
}

export async function getAllBirdNerdGames (redis: RedisClient): Promise<BirdNerdGame[]> {
    const rawGames = await redis.hGetAll(gamesKey);
    return Object.values(rawGames).map((game): unknown => JSON.parse(game)).filter(isBirdNerdGame);
}

export async function setPostGame (redis: RedisClient, postId: string, voteId: string): Promise<void> {
    await redis.hSet(postsKey, {[postId]: voteId});
}

export async function getPostGame (redis: RedisClient, postId: string): Promise<string | null> {
    const gameId = await redis.hGet(postsKey, postId);
    return gameId ?? null;
}

export async function storeBirdNerdGuesses (redis: RedisClient, gameId: string, userId: string, guesses: BirdNerdGuesses): Promise<void> {
    await redis.hSet(`${guessesKeyPrefix}:${gameId}`, {[userId]: JSON.stringify(guesses)});
}

export async function getBirdNerdGuesses (redis: RedisClient, gameId: string, userId: string): Promise<BirdNerdGuesses | null> {
    const rawGuesses = await redis.hGet(`${guessesKeyPrefix}:${gameId}`, userId);
    if (!rawGuesses) {
        return null;
    }
    const guesses: unknown = JSON.parse(rawGuesses);
    return isBirdNerdGuesses(guesses) ? guesses : null;
}

export async function resetBirdNerdGuesses (redis: RedisClient, gameId: string, userId?: string[]): Promise<void> {
    if (userId) {
        await redis.hDel(`${guessesKeyPrefix}:${gameId}`, userId);
    } else {
        await redis.del(`${guessesKeyPrefix}:${gameId}`);
    }
}
