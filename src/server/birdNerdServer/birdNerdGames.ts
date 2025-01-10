import {RedisClient} from "@devvit/public-api";
import {BirdNerdGame, isBirdNerdGame} from "../../types/birdNerd/game.js";
import {gamesKey} from "./redisKeys.server.js";

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
