import {UIDimensions} from "@devvit/protos";
import {Devvit} from "@devvit/public-api";

import {chunkEvenly} from "../../utils/array.js";
import {choiceHeightColumn, colors} from "../pages/game/gamePageConstants.js";

export function getChoicesColumnCount (choices: string[], choiceHeight: number, viewHeight: number): number {
    return Math.ceil(choices.length / getChoicesPerColumn(choiceHeight, viewHeight));
}

export function getChoicesPerColumn (choiceHeight: number, viewHeight: number): number {
    return Math.floor(viewHeight / choiceHeight);
}

export type ChoicesColumnProps = {
    choices: string[];
    selected: string | null;
    uiDims: UIDimensions;
    reduceSize?: boolean;
    disableChoice: (word: string) => boolean;
    onChoicePress: (choice: string) => void;
};

export function getChoiceBackgroundColor (selected: boolean, disabled: boolean): string {
    if (disabled) {
        return colors.backgroundDisabled;
    }
    if (selected) {
        return colors.backgroundSelected;
    }
    return colors.backgroundTertiary;
}

export const ChoicesColumn = (props: ChoicesColumnProps) => {
    const choicesPerColumn = getChoicesPerColumn(choiceHeightColumn, props.uiDims.height);
    const columns: string[][] = chunkEvenly(props.choices, choicesPerColumn);

    return (<hstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} gap="none" height="100%" maxWidth="30%" padding={columns.length > 1 ? "none" : "small"}>
        <spacer grow/>
        {columns.map(column => (
            <vstack alignment="center middle" gap="none" height="100%">
                {column.map(choice => (
                    <vstack alignment="center middle" height={`${100 / column.length}%`}>
                        <spacer grow/>
                        <zstack alignment="center middle" backgroundColor={getChoiceBackgroundColor(props.selected === choice, props.disableChoice(choice))} cornerRadius="full" onPress={props.disableChoice(choice) ? undefined : () => props.onChoicePress(choice)} padding={props.reduceSize ? "xsmall" : "small"}>
                            <text color={props.disableChoice(choice) ? colors.textDisabled : colors.text} selectable={false} style="body" >
                                {choice}
                            </text>
                        </zstack>
                        <spacer grow/>
                    </vstack>
                ))}
            </vstack>
        ))}
        <spacer grow/>
    </hstack>);
};
