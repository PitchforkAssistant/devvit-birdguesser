import {UIDimensions} from "@devvit/protos";
import {Devvit} from "@devvit/public-api";
import {chunkEvenly} from "../../utils/array.js";

export type ChoicesColumnProps = {
    choices: string[];
    selected: string | null;
    uiDims?: UIDimensions;
    reduceSize?: boolean;
    disableChoice: (word: string) => boolean;
    onChoicePress: (choice: string) => void;
};

export function getChoiceBackgroundColor (selected: boolean, disabled: boolean): string {
    if (selected) {
        return "rgba(0, 0, 0, 0.2)";
    }
    if (disabled) {
        return "rgba(0, 0, 0, 0)";
    }
    return "rgba(255, 255, 255, 0.2)";
}

export const ChoicesColumn = (props: ChoicesColumnProps) => {
    const height = props.uiDims?.height ?? 512;
    const elementsPerColumn = Math.floor(height / 48);
    const columns: string[][] = chunkEvenly(props.choices, elementsPerColumn);

    return (<hstack gap="none" alignment="center middle" border="thick" borderColor="rgba(255, 255, 255, 0.2)" backgroundColor="rgba(255, 255, 255, 0.2)" maxWidth="30%" height="100%" padding={columns.length > 1 ? "none" : "small"}>
        <spacer grow/>
        {columns.map(column => (
            <vstack gap="none" height="100%" alignment="center middle">
                <spacer grow/>
                {column.map(choice => (
                    <vstack alignment="center top" height={`${100 / column.length}%`}>
                        <zstack onPress={props.disableChoice(choice) ? undefined : () => props.onChoicePress(choice)} alignment="center middle" backgroundColor={getChoiceBackgroundColor(props.selected === choice, props.disableChoice(choice))} cornerRadius="full" padding={props.reduceSize ? "xsmall" : "small"}>
                            <text selectable={false} style="body" color={props.disableChoice(choice) ? "rgba(0,0,0,0.5)" : "#111"} >
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
