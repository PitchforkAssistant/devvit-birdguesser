import {Devvit} from "@devvit/public-api";

// Enable any Devvit features you might need. For example purposes, we'll enable all non-privileged plugins.
Devvit.configure({
    redditAPI: true,
    redis: true,
    media: true,
    http: true,
    kvStore: true,
    realtime: true,
});

Devvit.debug.emitSnapshots = true;
Devvit.debug.emitState = true;

// These are exports of Devvit.add... functions contained in other files, which helps with organization.
// It's effectively the same as if you had written the code here.

// Settings
export {devvitAppSettings} from "./settings.js";

// Forms
export {createGameForm} from "./forms/createGameForm.js";
export {createPostForm} from "./forms/createPostForm.js";

// Buttons
export {createGameButton} from "./buttons/createGameButton.js";
export {customPostButton} from "./buttons/customPostButton.js";

// Custom Post
export {customPostExample} from "./customPost/index.js";

// Scheduler jobs

// Triggers
export {appInstallTrigger} from "./triggers/appInstall.js";
export {appUpgradeTrigger} from "./triggers/appUpgrade.js";
export {postCreateTrigger} from "./triggers/postCreate.js";

export default Devvit;
