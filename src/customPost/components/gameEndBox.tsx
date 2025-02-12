import {Devvit} from "@devvit/public-api";

import {BirdNerdAnswer} from "../../types/birdNerd/answer.js";
import {birdNerdWordsToString} from "../../types/birdNerd/word.js";
import {colors} from "../pages/game/gamePageConstants.js";

export type GameEndBoxProps = {
    answer: BirdNerdAnswer;
    slotWidth: number;
    reduceSize?: boolean;
    totalGuesses: number;
    won: boolean;
    endText?: string;
    onSharePress: () => void | Promise<void>;
};

export const GameEndBox = (props: GameEndBoxProps) => (
    <vstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" padding={props.reduceSize ? "xsmall" : "small"}>
        <text alignment="center middle" color={colors.text} selectable={false} size={props.reduceSize ? "medium" : "large"} style="body" weight="bold">{props.won ? `You got it in ${props.totalGuesses}!` : "You lost!"}</text>
        <spacer size="xsmall"/>
        {props.endText ? <text alignment="center middle" color={colors.text} selectable={false} size={props.reduceSize ? "xsmall" : "small"} style="metadata" wrap>{props.endText}</text> : null}
        {!props.endText && !props.won ? <text alignment="center middle" color={colors.text} selectable={false} size={props.reduceSize ? "xsmall" : "small"} style="metadata" wrap>{`It was the ${birdNerdWordsToString(props.answer)}.`}</text> : null}
        <spacer size="xsmall"/>
        <button appearance="primary" grow={false} icon="share-fill" onPress={props.onSharePress} size="small">Share Result</button>
        <spacer size="xsmall"/>
    </vstack>
);
