import {AppInstall, AppUpgrade} from "@devvit/protos";
import {TriggerContext} from "@devvit/public-api";
import {startSingletonJob} from "devvit-helpers";

import {getAllGamePosts} from "../server/birdNerdServer/postGameLinks.server.js";
import {migrate} from "../utils/migrator.js";
import {queuePreviews} from "../utils/previews.js";

export async function onAppChanged (event: AppInstall | AppUpgrade, context: TriggerContext) {
    console.log(`onAppChanged\nevent:\n${JSON.stringify(event)}\ncontext:\n${JSON.stringify(context)}`);

    // Migrate any necessary data
    await migrate(context);

    // Refresh all post previews, they may have changed.
    const allGamePosts = await getAllGamePosts(context.redis);
    await queuePreviews(context.redis, allGamePosts);

    await startSingletonJob(context.scheduler, "previewUpdaterJob", "* * * * *");
}
