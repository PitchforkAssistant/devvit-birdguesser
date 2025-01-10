import {RedisClient} from "@devvit/public-api";
import {postsKey} from "./redisKeys.server.js";

export async function setPostGame (redis: RedisClient, postId: string, voteId: string): Promise<void> {
    await redis.hSet(postsKey, {[postId]: voteId});
}

export async function getPostGame (redis: RedisClient, postId: string): Promise<string | null> {
    const gameId = await redis.hGet(postsKey, postId);
    return gameId ?? null;
}
