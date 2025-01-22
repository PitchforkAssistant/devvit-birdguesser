import {Devvit} from "@devvit/public-api";

// Enable any Devvit features you might need. For example purposes, we'll enable all non-privileged plugins.
Devvit.configure({
    redditAPI: true,
    redis: true,
    media: true,
    realtime: true,
});

Devvit.debug.emitSnapshots = true;
Devvit.debug.emitState = true;

// These are exports of Devvit.add... functions contained in other files, which helps with organization.
// It's effectively the same as if you had written the code here.

// Buttons
export {createGameButton} from "./buttons/createGameButton.js";

// Custom Post
export {customPostExample} from "./customPost/index.js";

// Forms
export {createGameForm} from "./forms/createGameForm.js";
export {createPostForm} from "./forms/createPostForm.js";

// Scheduler jobs
export {previewUpdaterJob} from "./scheduler/previewUpdaterJob.js";

// Settings
export {devvitAppSettings} from "./settings.js";

// Triggers
export {appInstallTrigger} from "./triggers/appInstall.js";
export {appUpgradeTrigger} from "./triggers/appUpgrade.js";

export default Devvit;
