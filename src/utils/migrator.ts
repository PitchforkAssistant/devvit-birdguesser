import {RedisClient, TriggerContext} from "@devvit/public-api";

import {getAllBirdNerdGames} from "../server/birdNerdServer/birdNerdGame.server.js";
import {getAllBirdNerdGuesses} from "../server/birdNerdServer/playerGuesses.server.js";
import {userPlayedGamesKey} from "../server/birdNerdServer/redisKeys.server.js";
import {AppSettings, getAppSettings} from "../settings.js";
import {BirdNerdOutcome} from "../types/birdNerd/outcome.js";
import {getGameOutcome} from "./outcome.js";

export const LATEST_VERSION = 1;
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

/**
 * Copies existing games into an additional user-centric list of past games, intended to be used for things such as "Games Won: X" flairs
 * @param redis Redis client
 * @param appSettings App settings
 */
async function createUserGameLists (redis: RedisClient, appSettings: AppSettings): Promise<void> {
    const allGames = await getAllBirdNerdGames(redis);

    const allGameGuesses = await Promise.all(allGames.map(async game => {
        const guesses = await getAllBirdNerdGuesses(redis, game.id);
        return {game, playerEntries: guesses};
    }));

    const userGameLists: Record<string, Record<string, BirdNerdOutcome>> = {};
    for (const {game, playerEntries} of allGameGuesses) {
        for (const [userId, guesses] of Object.entries(playerEntries)) {
            if (!userGameLists[userId]) {
                userGameLists[userId] = {};
            }
            userGameLists[userId][game.id] = getGameOutcome(guesses, game.chances ?? appSettings.defaultChances);
        }
    }

    for (const [userId, gameList] of Object.entries(userGameLists)) {
        const redisGameEntries = Object.fromEntries(Object.entries(gameList).map(([gameId, outcome]) => [gameId, JSON.stringify(outcome)]));
        await redis.hSet(`${userPlayedGamesKey}:${userId}`, redisGameEntries);
    }
}

export async function migrate ({redis, settings}: TriggerContext): Promise<void> {
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
        await createUserGameLists(redis, await getAppSettings(settings));
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
