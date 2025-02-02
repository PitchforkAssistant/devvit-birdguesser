import {Devvit} from "@devvit/public-api";

import {BirdNerdAnswerShape} from "../../types/birdNerd/partialGame.js";
import {colors} from "../pages/game/gamePageConstants.js";
import {WordSlot} from "./word.js";

export type AnswerBoxProps = {
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

export const AnswerBox = (props: AnswerBoxProps) => (
    <hstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" padding={props.reduceSize ? "xsmall" : "small"}>
        <spacer size="xsmall"/>
        {!props.disableSubmit
            ? <hstack>
                {props.answerShape.map((shape, index) => (
                    <WordSlot
                        backgroundColor={colors.backgroundBlank}
                        color={colors.text}
                        joiner={index < props.answerShape.length - 1 ? shape.joiner : undefined}
                        onPress={() => props.onSlotPress(index)}
                        reduceSize={props.reduceSize}
                        slotWidth={props.slotWidth}
                        underline={true}
                        word={props.currentGuess[index]}
                    />
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

