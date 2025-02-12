/**
 * @file This file contains server-side functions that are called from the custom post by players. These are the only server functions that should be exposed to the client.
 */

import {Context, RedisClient} from "@devvit/public-api";
import {shuffle} from "lodash";

import {getAppSettings} from "../settings.js";
import {BirdNerdGame} from "../types/birdNerd/game.js";
import {BirdNerdGuess} from "../types/birdNerd/guess.js";
import {BirdNerdGamePartial} from "../types/birdNerd/partialGame.js";
import {getGameOutcome} from "../utils/outcome.js";
import {getBirdNerdGame} from "./birdNerdServer/birdNerdGame.server.js";
import {getBirdNerdGuesses, storeBirdNerdGuesses} from "./birdNerdServer/playerGuesses.server.js";
import {getPostGame} from "./birdNerdServer/postGameLinks.server.js";

export async function getBirdNerdGamePartial (redis: RedisClient, gameId: string): Promise<BirdNerdGamePartial | null> {
    const fullGame = await getBirdNerdGame(redis, gameId);
    if (!fullGame) {
        return null;
    }
    return {
        id: fullGame.id,
        name: fullGame.name,
        images: fullGame.images,
        choices: shuffle([...fullGame.choices.map(word => word.toLowerCase()), ...fullGame.answer.map(word => word.word.toLowerCase())]),
        answerShape: fullGame.answer.map(word => ({joiner: word.joiner})),
        chances: fullGame.chances,
    };
}

export async function makeBirdNerdGuess ({userId, postId, redis, settings}: Context, targetGameId: string, guess: string[]): Promise<BirdNerdGuess | null> {
    if (!userId || !postId) {
        console.warn(`makeBirdNerdGuess called without userId (${userId}) or postId (${postId})`);
        return null;
    }

    const gameId = await getPostGame(redis, postId);
    if (gameId !== targetGameId) {
        console.warn(`makeBirdNerdGuess called with incorrect gameId: ${targetGameId} instead of ${gameId}`);
        return null;
    }

    const fullGame = await getBirdNerdGame(redis, gameId);
    const existingGuesses = await getBirdNerdGuesses(redis, gameId, userId);
    const appSettings = await getAppSettings(settings);
    if (!fullGame || existingGuesses && existingGuesses.length >= (fullGame.chances ?? appSettings.defaultChances)) {
        console.warn("makeBirdNerdGuess called with missing game or too many guesses: ", fullGame, existingGuesses);
        return null;
    }

    // Get a count of all the words in the answer
    const wordCounts: Record<string, number> = {};
    fullGame.answer.forEach(answer => {
        const word = answer.word.toLowerCase().trim();
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Track how many times each word has been seen
    const seenCounts: Record<string, number> = Object.fromEntries(Object.keys(wordCounts).map(word => [word, 0]));

    // Assume all guesses are incorrect
    const gameResult: BirdNerdGuess = guess.map(word => ({word, result: "incorrect"}));

    // Check for correct guesses
    fullGame.answer.forEach((answer, index) => {
        // We don't need to check the seenCounts here because it's impossible for a word to be correct and in the right spot more times than it appears in the answer
        if (answer.word.toLowerCase().trim() === guess[index].toLowerCase().trim()) {
            gameResult[index].result = "correct";
            seenCounts[answer.word.toLowerCase().trim()]++;
        }
    });

    // Check all the guessed words that are in the answer but not in the correct spot
    guess.forEach((rawWord, index) => {
        const word = rawWord.toLowerCase().trim();
        if (gameResult[index].result === "correct") {
            return;
        }
        // Only count the word as contains if it hasn't been seen more times than it appears in the answer
        // For example if the answer is "one one two three" and the guess is "one two one one" the third "one" should show as incorrect
        if (wordCounts[word] > (seenCounts[word] || 0)) {
            gameResult[index].result = "contains";
            seenCounts[word]++;
        }
    });

    await storeBirdNerdGuesses(redis, gameId, userId, [...existingGuesses || [], gameResult], getGameOutcome([...existingGuesses || [], gameResult], fullGame.chances ?? appSettings.defaultChances));
    return gameResult;
}

export async function requestFullGame ({userId, postId, redis, settings}: Context, gameId: string): Promise<BirdNerdGame | null> {
    if (!userId || !postId) {
        console.warn(`makeBirdNerdGuess called without userId (${userId}) or postId (${postId})`);
        return null;
    }

    const guesses = await getBirdNerdGuesses(redis, gameId, userId);
    const appSettings = await getAppSettings(settings);

    // No guesses have been made, so the game is not finished.
    if (!guesses) {
        return null;
    }

    const fullGame = await getBirdNerdGame(redis, gameId);
    if (!fullGame) {
        console.warn(`requestFullGame called with missing game: ${gameId}`);
        return null;
    }

    if (getGameOutcome(guesses, fullGame.chances ?? appSettings.defaultChances).result) {
        return fullGame;
    }
    return null;
}

export {getBirdNerdGuesses} from "./birdNerdServer/playerGuesses.server.js";
export {getPostGame} from "./birdNerdServer/postGameLinks.server.js";
