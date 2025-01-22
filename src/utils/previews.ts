import {RedisClient} from "@devvit/public-api";

export const previewUpdateQueue = "birdnerd:previewUpdateQueue";

export async function getQueuedPreviews (redis: RedisClient): Promise<string[]> {
    const zRangeResult = await redis.zRange(previewUpdateQueue, 0, -1);
    return zRangeResult.map(result => result.member);
}

export async function queuePreview (redis: RedisClient, postId: string) {
    await redis.zAdd(previewUpdateQueue, {member: postId, score: Date.now()});
}
export async function queuePreviews (redis: RedisClient, postIds: string[]) {
    const members = postIds.map(postId => ({member: postId, score: Date.now()}));
    await redis.zAdd(previewUpdateQueue, ...members);
}

export async function unqueuePreview (redis: RedisClient, postId: string) {
    await redis.zRem(previewUpdateQueue, [postId]);
}
