import {Devvit} from "@devvit/public-api";

import {CustomPostState} from "../../state.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HelpPage = (state: CustomPostState) => (
    <vstack alignment="top center" grow height="100%" padding="small" width="100%">
        <vstack alignment="center middle" gap="medium" padding="large">
            <text alignment="center" style="heading" wrap>What is this?</text>

            <spacer shape="thin" size="medium" width="100%"/>

            <text alignment="center" style="body" wrap>
                Guess the name of the bird in the image by using the words provided.
            </text>

            <spacer grow size="xsmall"/>
        </vstack>
    </vstack>
);

