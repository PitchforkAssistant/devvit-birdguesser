import {UIDimensions} from "@devvit/protos";
import {Devvit} from "@devvit/public-api";
import {stringsToRowsSplitter} from "../../utils/string.js";

export type ChoicesRowProps = {
    choices: string[];
    selected: string | null;
    uiDims?: UIDimensions;
    reduceSize?: boolean;
    onChoicePress: (choice: string) => void;
};

export const ChoicesRow = (props: ChoicesRowProps) => {
    const width = props.uiDims?.width ?? 512;
    const lettersPerRow = Math.floor(width / (props.reduceSize ? 8 : 10));
    const rows: string[][] = stringsToRowsSplitter(props.choices, "   ", lettersPerRow);

    return (<vstack gap="small" alignment="center middle">
        {rows.map(row => (
            <hstack gap="small" alignment="center middle">
                {row.map(choice => (
                    <button key={choice} onPress={() => props.onChoicePress(choice)} appearance={props.selected === choice ? "primary" : "plain"} size={props.reduceSize ? "small" : "large"}>
                        {choice}
                    </button>
                ))}
            </hstack>
        ))}
    </vstack>);
};
