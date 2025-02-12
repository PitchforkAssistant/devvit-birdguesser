import {RedisClient, TriggerContext} from "@devvit/public-api";

export const LATEST_VERSION = 0;
export const INSTALL_VERSION_KEY = "birdNerdSchemaVersion";

export async function getInstalledVersion (redis: RedisClient): Promise<number> {
    try {
        const installedVersion = await redis.get(INSTALL_VERSION_KEY);

        // If no key is set, assume the latest version.
        if (!installedVersion) {
            await redis.set(INSTALL_VERSION_KEY, LATEST_VERSION.toString());
            return LATEST_VERSION;
        }

        return parseInt(installedVersion);
    } catch (e) {
        console.error("Failed to get installed version", e);
        throw e;
    }
}

export async function migrate ({redis}: TriggerContext): Promise<void> {
    const installedVersion = await getInstalledVersion(redis);

    if (installedVersion === LATEST_VERSION) {
        console.log(`Already at version ${LATEST_VERSION}`);
        return;
    }
    console.log(`Migrating data from version ${installedVersion} to ${LATEST_VERSION}`);

    // We initionally want to allow fallthroughs to allow for future migrations to be added on top of the current one
    /* eslint-disable no-fallthrough */
    switch (installedVersion) {
    case 0:
        // Future migration from version 0 to 1
        // TODO: Based on the guesses stored for each game, create a hash of all played games for each user. games:user_id = {game_id: outcome}
    case 1:
        // Future migrations can be added as needed.
        console.log("No further migrations needed");
        break;
    default:
        throw new Error(`Unknown installed version: ${installedVersion}`);
    }
    /* eslint-enable no-fallthrough */

    // Update installed version
    await redis.set(INSTALL_VERSION_KEY, LATEST_VERSION.toString());
    console.log(`Migration to version ${LATEST_VERSION} complete`);
}
