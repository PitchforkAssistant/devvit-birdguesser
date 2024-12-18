import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "./state.js";
import {Page} from "./pages.js";

export const customPostExample = Devvit.addCustomPostType({
    name: "Custom Post Example",
    description: "An example of a custom post.",
    height: "tall",
    render: context => {
        const state = new CustomPostState(context);
        return (
            <blocks height="tall">
                <zstack alignment="center top" width="100%" height="100%" backgroundColor="#D3DAC2">
                    <vstack alignment="center middle" grow height="100%" width="100%">
                        <Page state={state} />
                    </vstack>
                    <vstack alignment="center top" width="100%" height="100%">
                        <hstack padding="medium" alignment="center middle" minWidth="100%">
                            <spacer grow/>
                            {state.isModerator && state.currentPage === "game" &&
                                <vstack backgroundColor="#dce1ce" cornerRadius="full" padding="small" onPress={() => state.changePage("manager")}>
                                    <icon name="settings" size="small" color="#111"/>
                                </vstack>
                            }
                        </hstack>
                    </vstack>
                </zstack>
            </blocks>
        );
    },
});
