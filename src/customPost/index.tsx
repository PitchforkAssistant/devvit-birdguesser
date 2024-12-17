import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "./state.js";
import {Page} from "./pages.js";

export const customPostExample = Devvit.addCustomPostType({
    name: "Custom Post Example",
    description: "An example of a custom post.",
    height: "tall",
    render: context => {
        const state = new CustomPostState(context);
        console.log(context.uiEnvironment);
        return (
            <blocks>
                <zstack alignment="center top" width="100%" height="100%">
                    <vstack alignment="center middle" grow height="100%" width="100%">
                        <Page state={state} />
                    </vstack>
                </zstack>
            </blocks>
        );
    },
});
