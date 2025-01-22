import {Devvit} from "@devvit/public-api";

import {CustomPostState} from "../../state.js";
import {colors} from "../game/gamePageConstants.js";

export const NoGamePage = (postState: CustomPostState) => {
    if (postState.PageStates.game.isLoaded) {
        postState.changePage("game");
    }

    return (
        <vstack alignment="top center" grow height="100%" padding="small" width="100%">
            <vstack alignment="center middle" gap="medium" padding="large">
                <icon color={colors.text} name="load" size="large"/>
                <text alignment="center" color={colors.text} style="heading">Loading BirdNerd Game...</text>
                <text alignment="center" color={colors.text} style="metadata">If this takes more than a few seconds, something has gone horribly wrong.</text>
            </vstack>
        </vstack>
    );
};
