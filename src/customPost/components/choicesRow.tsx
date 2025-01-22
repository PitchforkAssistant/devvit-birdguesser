import {UIDimensions} from "@devvit/protos";
import {Devvit} from "@devvit/public-api";

import {chunkEvenly} from "../../utils/array.js";
import {choiceCharacterWidth, colors} from "../pages/game/gamePageConstants.js";
import {getChoiceBackgroundColor} from "./choicesColumn.js";

export function getChoicesRowCount (choices: string[], charWidth: number, viewWidth: number, joiner: string = " "): number {
    const charCount = choices.join(joiner).length;
    const charsPerRow = Math.floor(viewWidth / charWidth);
    return Math.ceil(charCount / charsPerRow);
}

export function getChoicesPerRow (choices: string[], charWidth: number, viewWidth: number, joiner: string = " "): number {
    return Math.floor(choices.length / getChoicesRowCount(choices, charWidth, viewWidth, joiner));
}

export type ChoicesRowProps = {
    choices: string[];
    selected: string | null;
    uiDims: UIDimensions;
    reduceSize?: boolean;
    disableChoice: (word: string) => boolean;
    onChoicePress: (choice: string) => void;
};

export const ChoicesRow = (props: ChoicesRowProps) => {
    const choicesPerRow = getChoicesPerRow(props.choices, choiceCharacterWidth, props.uiDims.width);
    const rows: string[][] = chunkEvenly(props.choices, choicesPerRow);

    return (<vstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" gap="small" padding="small">
        {rows.map(row => (
            <hstack alignment="center middle" gap="small">
                {row.map(choice => (
                    <zstack alignment="center middle" backgroundColor={getChoiceBackgroundColor(props.selected === choice, props.disableChoice(choice))} cornerRadius="full" onPress={props.disableChoice(choice) ? undefined : () => props.onChoicePress(choice)} padding={props.reduceSize ? "xsmall" : "small"}>
                        <text color={props.disableChoice(choice) ? colors.textDisabled : colors.text} selectable={false} style="body" >
                            {choice}
                        </text>
                    </zstack>
                ))}
            </hstack>
        ))}
    </vstack>);
};
