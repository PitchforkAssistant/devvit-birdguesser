import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "../../state.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HelpPage = (state: CustomPostState) => (
    <vstack alignment="top center" padding="small" width="100%" height="100%" grow>
        <vstack alignment="center middle" gap="medium" padding="large">
            <text style="heading" wrap alignment="center">What is this?</text>

            <spacer size="medium" shape="thin" width="100%"/>

            <text style="body" wrap alignment="center">
                Guess the name of the bird in the image by using the words provided.
            </text>

            <spacer size="xsmall" grow/>
        </vstack>
    </vstack>
);

