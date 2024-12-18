import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "../../state.js";

export const ManagerPage = (state: CustomPostState) => {
    const managerState = state.PageStates?.manager;

    return (

        <vstack alignment="center top" width="100%" height="100%">
            <hstack padding="medium" alignment="center middle" minWidth="100%" border="thick">
                <vstack backgroundColor="rgba(0,0,0,0.5)" cornerRadius="full" padding="xsmall">
                    <button icon="back" size="small" onPress={() => state.changePage("game")}/>
                </vstack>
                <spacer grow/>
                <vstack padding="xsmall" alignment="center middle" gap="small">
                    <text style="heading" size="xlarge">Management Options</text>
                </vstack>
                <spacer grow/>
                <hstack padding="small">
                    <spacer size="large"/>
                </hstack>
            </hstack>
            <vstack alignment="top center" gap="small" padding="small" width="100%" grow>
                <vstack alignment="center middle" gap="medium" padding="medium">
                    <button appearance="secondary" onPress={async () => managerState.updatePreviewPressed()}>Update Post Preview</button>
                    <button appearance="caution" onPress={async () => managerState.editRawGamePressed()}>Edit Raw Game Data</button>
                    <button appearance="destructive" onPress={async () => managerState.resetGamePressed()}>Reset Current Game</button>
                </vstack>
            </vstack>
        </vstack>

    );
};

