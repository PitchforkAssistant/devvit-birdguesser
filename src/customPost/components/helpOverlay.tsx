import {Devvit} from "@devvit/public-api";

import {PostDirection} from "../../utils/post.js";
import {colors} from "../pages/game/gamePageConstants.js";

export type HelpOverlayProps = {
    direction: PostDirection;
    imageWidth: Devvit.Blocks.SizeString;
    imageHeight: Devvit.Blocks.SizeString;
};

export const HelpOverlay = (props: HelpOverlayProps) => {
    let helpElement: JSX.Element | undefined;
    if (props.direction === "horizontal") {
        helpElement = (
            <hstack alignment="start top" grow height="100%" width="100%">
                <spacer grow maxWidth={"25%"} width={"25%"}/>
                <vstack alignment="center top" grow maxWidth={"70%"} padding="medium">
                    <text alignment="center middle" color={colors.textOverlay} size="large" style="heading">Bird Nerd</text>
                    <text alignment="center middle" color={colors.textOverlay} size="medium" style="body" wrap>You are presented with a photo of a bird. Your goal is to guess its name.</text>
                    <spacer height={props.imageHeight}/>
                    <text alignment="center middle" color={colors.textOverlay} size="medium" style="body" wrap>This is where you input your guess. Select a choice from the left and then click on one of the answer slots.</text>
                    <spacer grow minHeight={"80px"}/>
                    <text alignment="center middle" color={colors.textOverlay} size="medium" style="body" wrap>The fields on the bottom show the guesses you've already made, starting with the most recent guess at the top and oldest at the bottom. Rows without any guesses at the bottom indicate the number of tries you have left.</text>
                </vstack>
                <spacer grow/>
            </hstack>
        );
    } else if (props.direction === "vertical") {
        helpElement = (
            <vstack alignment="center top" padding="medium">
                <text alignment="center middle" size="large" style="heading">Bird Nerd</text>
                <text alignment="center middle" color={colors.textOverlay} size="medium" style="body" wrap>You are presented with a photo of a bird. Your goal is to guess its name.</text>
                <spacer height={props.imageHeight}/>
                <text alignment="center middle" color={colors.textOverlay} size="medium" style="body" wrap>This is where you input your guess. Select a choice from the provided words and then click on one of the answer slots.</text>
                <spacer grow minHeight={"50px"}/>
                <text alignment="center middle" color={colors.textOverlay} size="medium" style="body" wrap>The fields on the bottom show the guesses you've already made, starting with the most recent guess at the top and oldest at the bottom. Rows without any guesses at the bottom indicate the number of tries you have left.</text>
                <spacer grow/>
            </vstack>
        );
    }
    return (
        <zstack backgroundColor={colors.backgroundOverlay} grow height="100%" width="100%">
            {helpElement}
        </zstack>
    );
};

