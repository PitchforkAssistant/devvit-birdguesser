import {TriggerContext, ScheduledJobEvent, Devvit} from "@devvit/public-api";
import {getQueuedPreviews, unqueuePreview} from "../utils/previews.js";
import {getBirdNerdGamePartial} from "../server/clientRpcs.server.js";
import {getPostGame} from "../server/birdNerdServer/postGameLinks.server.js";
import {BasicPreview} from "../customPost/components/preview.js";
import {advancedPreviewMaker} from "../customPost/components/advancedPreview.js";

export async function onPreviewUpdaterJob (event: ScheduledJobEvent<undefined>, context: TriggerContext) {
    console.log(`onPreviewUpdaterJob\nevent:\n${JSON.stringify(event)}\ncontext:\n${JSON.stringify(context)}`);
    const postIds = await getQueuedPreviews(context.redis);

    for (const postId of postIds) {
        try {
            const post = await context.reddit.getPostById(postId);

            const gameId = await getPostGame(context.redis, post.id);
            if (!gameId) {
                await post.setCustomPostPreview(() => BasicPreview);
                return;
            }

            const partialGame = await getBirdNerdGamePartial(context.redis, gameId);
            if (!partialGame) {
                await post.setCustomPostPreview(() => BasicPreview);
                return;
            }

            if (!partialGame) {
                await post.setCustomPostPreview(() => BasicPreview);
            } else {
                await post.setCustomPostPreview(() => advancedPreviewMaker({
                    partialGame,
                    uiDims: {width: 512, height: 512, scale: 3.5},
                }));
            }
            console.log(`Updated preview for post ${postId}`);
            await unqueuePreview(context.redis, postId);
        } catch (e) {
            console.error(`Error updating preview for post ${postId}: ${String(e)}`);
        }
    }
}

export const previewUpdaterJob = Devvit.addSchedulerJob({
    name: "previewUpdaterJob",
    onRun: onPreviewUpdaterJob,
});
