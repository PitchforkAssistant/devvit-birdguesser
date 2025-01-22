import {Devvit} from "@devvit/public-api";

import {CustomPostState} from "../../state.js";
import {colors} from "../game/gamePageConstants.js";

export const ManagerPage = (state: CustomPostState) => {
    const managerState = state.PageStates?.manager;

    return (

        <vstack alignment="center top" height="100%" width="100%">
            <hstack alignment="center middle" minWidth="100%" padding="medium">
                <hstack padding="small">
                    <spacer size="medium"/>
                </hstack>
                <spacer grow/>
                <vstack alignment="center middle" gap="small" padding="xsmall">
                    <text color={colors.text} size="xlarge" style="heading">Moderator Options</text>
                </vstack>
                <spacer grow/>
                <vstack backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="full" onPress={() => state.changePage("game")} padding="small">
                    <icon color={colors.text} name="close" size="small"/>
                </vstack>
            </hstack>
            <vstack alignment="top center" border="thick" borderColor={colors.border} cornerRadius="medium" gap="small" padding="small">
                <vstack alignment="center middle" gap="medium" padding="medium">
                    <button appearance="secondary" onPress={async () => managerState.updatePreviewPressed()}>Update Post Preview</button>
                    <button appearance="caution" onPress={async () => managerState.editRawGamePressed()}>Edit Raw Game Data</button>
                    <button appearance="destructive" onPress={async () => managerState.resetGamePressed()}>Reset Current Game</button>
                </vstack>
            </vstack>
        </vstack>

    );
};

