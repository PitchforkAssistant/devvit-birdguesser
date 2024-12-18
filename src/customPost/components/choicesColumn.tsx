import {UIDimensions} from "@devvit/protos";
import {Devvit} from "@devvit/public-api";
import {chunkEvenly} from "../../utils/array.js";

export type ChoicesColumnProps = {
    choices: string[];
    selected: string | null;
    uiDims?: UIDimensions;
    reduceSize?: boolean;
    onChoicePress: (choice: string) => void;
};

export const ChoicesColumn = (props: ChoicesColumnProps) => {
    const height = props.uiDims?.height ?? 512;
    const elementsPerColumn = Math.floor(height / 48);
    const columns: string[][] = chunkEvenly(props.choices, elementsPerColumn);

    return (<hstack gap="none" alignment="center middle" maxWidth="30%" height="100%" padding={columns.length > 1 ? "none" : "small"}>
        <spacer grow/>
        {columns.map(column => (
            <vstack gap="small" height="100%" alignment="center middle">
                <spacer grow/>
                {column.map(choice => (
                    <vstack grow alignment="center top">
                        <button key={choice} onPress={() => props.onChoicePress(choice)} appearance={props.selected === choice ? "primary" : "plain"} size={props.reduceSize ? "small" : "large"}>
                            {choice}
                        </button>
                        <spacer grow/>
                    </vstack>
                ))}
                <spacer grow/>
            </vstack>
        ))}
        <spacer grow/>
    </hstack>);
};
