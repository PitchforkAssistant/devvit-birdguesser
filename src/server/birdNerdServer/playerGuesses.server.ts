import {RedisClient} from "@devvit/public-api";

import {BirdNerdGuesses, isBirdNerdGuesses} from "../../types/birdNerd/guess.js";
import {guessesKeyPrefix} from "./redisKeys.server.js";

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
