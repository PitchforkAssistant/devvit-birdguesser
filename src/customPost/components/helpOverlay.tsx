import {Devvit} from "@devvit/public-api";

export type HelpOverlayProps = {
    direction: "columns" | "rows";
    finished?: boolean;
    imageWidth: Devvit.Blocks.SizeString;
    imageHeight: Devvit.Blocks.SizeString;
};

export const HelpOverlay = (props: HelpOverlayProps) => {
    let helpElement: JSX.Element | undefined;
    if (props.direction === "columns") {
        helpElement = (
            <hstack alignment="start top" width="100%" height="100%" grow>
                <spacer width={"30%"}/>
                <vstack alignment="center top" padding="medium">
                    <text style="heading" alignment="center middle" size="large">Bird Nerd</text>
                    <text style="body" size="medium" alignment="center middle" maxWidth={props.imageWidth} wrap>You are presented with a photo of a bird. Your goal is to guess its name.</text>
                    <spacer height={props.imageHeight}/>
                    <text style="body" size="medium" alignment="center middle" maxWidth={props.imageWidth} wrap>This is where you input your guess. Select a choice from the left and then click on one of the answer slots.</text>
                    <spacer grow minHeight={"80px"}/>
                    <text style="body" size="medium" alignment="center middle" maxWidth={props.imageWidth} wrap>The fields on the bottom show the guesses you've already made, starting with the most recent guess at the top and oldest at the bottom. Rows without any guesses at the bottom indicate the number of tries you have left.</text>
                </vstack>
                <spacer grow/>
            </hstack>
        );
    } else {
        helpElement = (
            <vstack alignment="center top" padding="medium">
                <text style="heading" alignment="center middle" size="large">Bird Nerd</text>
                <text style="body" size="medium" alignment="center middle" maxWidth={props.imageWidth} wrap>You are presented with a photo of a bird. Your goal is to guess its name.</text>
                <spacer height={props.imageHeight}/>
                <text style="body" size="medium" alignment="center middle" maxWidth={props.imageWidth} wrap>This is where you input your guess. Select a choice from the provided words and then click on one of the answer slots.</text>
                <spacer grow minHeight={"80px"}/>
                <text style="body" size="medium" alignment="center middle" maxWidth={props.imageWidth} wrap>The fields on the bottom show the guesses you've already made, starting with the most recent guess at the top and oldest at the bottom. Rows without any guesses at the bottom indicate the number of tries you have left.</text>
            </vstack>
        );
    }
    return (
        <zstack height="100%" width="100%" backgroundColor="rgba(0,0,0,0.75)" grow>
            {helpElement}
        </zstack>
    );
};

