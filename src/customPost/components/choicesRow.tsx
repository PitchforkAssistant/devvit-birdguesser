import {UIDimensions} from "@devvit/protos";
import {Devvit} from "@devvit/public-api";
import {getChoiceBackgroundColor} from "./choicesColumn.js";
import {chunkEvenly} from "../../utils/array.js";

export type ChoicesRowProps = {
    choices: string[];
    selected: string | null;
    uiDims?: UIDimensions;
    reduceSize?: boolean;
    disableChoice: (word: string) => boolean;
    onChoicePress: (choice: string) => void;
};

export const ChoicesRow = (props: ChoicesRowProps) => {
    const width = props.uiDims?.width ?? 512;
    const totalLetters = props.choices.join(" ").length;
    const lettersPerRow = Math.floor(width / (props.reduceSize ? 8 : 10));
    const rows: string[][] = chunkEvenly(props.choices, totalLetters / lettersPerRow);

    return (<vstack gap="small" border="thick" borderColor="rgba(255, 255, 255, 0.2)" backgroundColor="rgba(255, 255, 255, 0.2)" cornerRadius="medium" alignment="center middle">
        {rows.map(row => (
            <hstack gap="small" alignment="center middle">
                {row.map(choice => (
                    <zstack onPress={props.disableChoice(choice) ? undefined : () => props.onChoicePress(choice)} alignment="center middle" backgroundColor={getChoiceBackgroundColor(props.selected === choice, props.disableChoice(choice))} cornerRadius="full" padding={props.reduceSize ? "xsmall" : "small"}>
                        <text selectable={false} style="body" color={props.disableChoice(choice) ? "rgba(0,0,0,0.5)" : "#111"} >
                            {choice}
                        </text>
                    </zstack>
                ))}
            </hstack>
        ))}
    </vstack>);
};
