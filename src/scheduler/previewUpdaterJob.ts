import {TriggerContext, ScheduledJobEvent, Devvit} from "@devvit/public-api";
import {getQueuedPreviews} from "../utils/previews.js";

export async function onPreviewUpdaterJob (event: ScheduledJobEvent<undefined>, context: TriggerContext) {
    console.log(`onPreviewUpdaterJob\nevent:\n${JSON.stringify(event)}\ncontext:\n${JSON.stringify(context)}`);
    const postIds = await getQueuedPreviews(context.redis);

    for (const postId of postIds) {
        try {
            throw new Error("Not implemented");
        } catch (e) {
            console.error(`Error updating preview for post ${postId}: ${String(e)}`);
        }
    }
}

export const previewUpdaterJob = Devvit.addSchedulerJob({
    name: "previewUpdaterJob",
    onRun: onPreviewUpdaterJob,
});
