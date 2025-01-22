import {Devvit} from "@devvit/public-api";

import {BirdNerdAnswerShape} from "../../types/birdNerd/partialGame.js";
import {colors} from "../pages/game/gamePageConstants.js";
import {Joiner} from "./joiner.js";

export type AnswerRowProps = {
    answerShape: BirdNerdAnswerShape;
    currentGuess: string[];
    slotWidth: number;
    onSlotPress: (index: number) => void | Promise<void>;
    onSubmitPress: () => void | Promise<void>;
    onSharePress: () => void | Promise<void>;
    reduceSize?: boolean;
    disableSubmit?: boolean;
    totalGuesses: number;
    won: boolean;
};

export const AnswerRow = (props: AnswerRowProps) => (
    <hstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" padding={props.reduceSize ? "xsmall" : "small"}>
        <spacer size="xsmall"/>
        {!props.disableSubmit
            ? <hstack>
                {props.answerShape.map((shape, index) => (
                    <hstack alignment="center middle" gap="none">
                        <zstack alignment="center middle" backgroundColor={colors.backgroundBlank} cornerRadius="small" onPress={() => props.onSlotPress(index)}>
                            <hstack alignment="center middle">
                                <text alignment="center middle" color={colors.text} selectable={false} size={props.reduceSize ? "large" : "xlarge"} style="body">{"_".repeat(props.slotWidth)}</text>
                            </hstack>
                            {props.currentGuess[index] && <hstack alignment="center middle">
                                <text alignment="center middle" color={colors.text} selectable={false} size={props.reduceSize ? "medium" : "large"} style="body" weight="bold">{props.currentGuess[index]}</text>
                            </hstack>}
                        </zstack>
                        {index < props.answerShape.length - 1 && <Joiner joiner={shape.joiner} reduceSize={props.reduceSize}/>}
                    </hstack>
                ))}
                <spacer size={props.reduceSize ? "small" : "medium"}/>
                <button appearance="primary" disabled={props.disableSubmit} icon="send-fill" onPress={props.onSubmitPress} size="small"/>
            </hstack>
            : <vstack gap="small">
                <text alignment="center middle" color={colors.text} selectable={false} size={props.reduceSize ? "medium" : "large"} style="body" weight="bold">{props.won ? `You got it in ${props.totalGuesses}!` : "You lost."}</text>
                <button appearance="primary" disabled={!props.disableSubmit} icon="share-fill" onPress={props.onSharePress} size="small">Share Result</button>
            </vstack>}
        <spacer size="xsmall"/>
    </hstack>
);

