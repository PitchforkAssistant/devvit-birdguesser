import {Devvit} from "@devvit/public-api";

import {BirdNerdWord} from "../../types/birdNerd/word.js";
import {Joiner} from "./joiner.js";

export type WordSlotProps = {
    slotWidth: number;
    color?: Devvit.Blocks.ColorString;
    backgroundColor?: Devvit.Blocks.ColorString;
    onPress?: () => void | Promise<void>;
    reduceSize?: boolean;
    underline?: boolean;
} & Partial<BirdNerdWord>;

export const WordSlot = (props: WordSlotProps) => (
    <hstack alignment="center middle" gap="none" grow>
        <zstack alignment="center middle" backgroundColor={props.backgroundColor} cornerRadius="small" grow onPress={props.onPress ? props.onPress : undefined} >
            <hstack alignment="center middle" grow>
                <text alignment="center middle" color={props.underline ? props.color : "rgba(255, 255, 255, 0)"} grow selectable={false} size={props.reduceSize ? "large" : "xlarge"}>{"_".repeat(props.slotWidth)}</text>
            </hstack>
            {props.word ?
                <hstack alignment="center middle" grow>
                    <text alignment="center middle" color={props.color} selectable={false} size={props.reduceSize ? "medium" : "large"} weight="bold">{props.word}</text>
                </hstack> :
                null}
        </zstack>
        {props.joiner ?
            <Joiner joiner={props.joiner} reduceSize={props.reduceSize}/> :
            null}
    </hstack>
);
