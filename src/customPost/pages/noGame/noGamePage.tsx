import {Devvit} from "@devvit/public-api";
import {CustomPostState} from "../../state.js";

export const NoGamePage = (state: CustomPostState) => (
    <vstack alignment="top center" padding="small" width="100%" height="100%" grow>
        <vstack alignment="center middle" gap="medium" padding="large">
            <image url={state.context.assets.getURL("Magnifying_Glass.png")} imageWidth="300px" imageHeight="300px" resizeMode="fit"/>
            <text style="heading" alignment="center">Loading BirdNerd Game...</text>
            <text style="metadata" alignment="center">If this takes more than a few seconds, something has gone horribly wrong.</text>
        </vstack>
    </vstack>
);

