import {RedisClient} from "@devvit/public-api";

import {BirdNerdGuesses, isBirdNerdGuesses} from "../../types/birdNerd/guess.js";
import {BirdNerdOutcome} from "../../types/birdNerd/outcome.js";
import {guessesKeyPrefix, userPlayedGamesKey} from "./redisKeys.server.js";

export async function storeBirdNerdGuesses (redis: RedisClient, gameId: string, userId: string, guesses: BirdNerdGuesses, outcome: BirdNerdOutcome): Promise<void> {
    await redis.hSet(`${guessesKeyPrefix}:${gameId}`, {[userId]: JSON.stringify(guesses)});
    await redis.hSet(`${userPlayedGamesKey}:${userId}`, {[gameId]: JSON.stringify(outcome)});
}

export async function getBirdNerdGuesses (redis: RedisClient, gameId: string, userId: string): Promise<BirdNerdGuesses | null> {
    const rawGuesses = await redis.hGet(`${guessesKeyPrefix}:${gameId}`, userId);
    if (!rawGuesses) {
        return null;
    }
    const guesses: unknown = JSON.parse(rawGuesses);
    return isBirdNerdGuesses(guesses) ? guesses : null;
}

export async function getAllBirdNerdGuesses (redis: RedisClient, gameId: string): Promise<Record<string, BirdNerdGuesses>> {
    const rawGuesses = await redis.hGetAll(`${guessesKeyPrefix}:${gameId}`);
    const guesses: Record<string, BirdNerdGuesses> = {};
    for (const [userId, rawGuess] of Object.entries(rawGuesses)) {
        const guessesData: unknown = JSON.parse(rawGuess);
        if (isBirdNerdGuesses(guessesData)) {
            guesses[userId] = guessesData;
        }
    }
    return guesses;
}

export async function resetBirdNerdGuesses (redis: RedisClient, gameId: string, userId?: string[]): Promise<void> {
    if (userId) {
        await redis.hDel(`${guessesKeyPrefix}:${gameId}`, userId);
    } else {
        await redis.del(`${guessesKeyPrefix}:${gameId}`);
    }
}
