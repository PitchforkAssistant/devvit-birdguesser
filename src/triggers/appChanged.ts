import {AppInstall, AppUpgrade} from "@devvit/protos";
import {TriggerContext} from "@devvit/public-api";
import {startSingletonJob} from "devvit-helpers";

import {getAllGamePosts} from "../server/birdNerdServer/postGameLinks.server.js";
import {queuePreviews} from "../utils/previews.js";

export async function onAppChanged (event: AppInstall | AppUpgrade, context: TriggerContext) {
    console.log(`onAppChanged\nevent:\n${JSON.stringify(event)}\ncontext:\n${JSON.stringify(context)}`);

    const allGamePosts = await getAllGamePosts(context.redis);
    await queuePreviews(context.redis, allGamePosts);

    await startSingletonJob(context.scheduler, "previewUpdaterJob", "* * * * *");
}
