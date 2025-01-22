import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "./state.js";
import {Page} from "./pages.js";
import {colors} from "./pages/game/gamePageConstants.js";

export const customPostExample = Devvit.addCustomPostType({
    name: "Custom Post Example",
    description: "An example of a custom post.",
    height: "tall",
    render: context => {
        const state = new CustomPostState(context);
        return (
            <blocks height="tall">
                <zstack alignment="center top" backgroundColor={colors.background} height="100%" width="100%">
                    <vstack alignment="center middle" grow height="100%" width="100%">
                        <Page state={state} />
                    </vstack>
                    <vstack alignment="center top" height="100%" width="100%">
                        <hstack alignment="center middle" minWidth="100%" padding="medium">
                            <spacer grow/>
                            {state.isModerator && state.currentPage === "game" &&
                                <vstack backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="full" onPress={() => state.changePage("manager")} padding="small">
                                    <icon color={colors.text} name="settings" size="small"/>
                                </vstack>
                            }
                        </hstack>
                    </vstack>
                </zstack>
            </blocks>
        );
    },
});
