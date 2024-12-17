import {Devvit} from "@devvit/public-api";
import {BirdNerdAnswerShape} from "../../utils/birdNerd.js";
import {Joiner} from "./joiner.js";

export type AnswerRowProps = {
    answerShape: BirdNerdAnswerShape;
    currentGuess: string[];
    getSlotWidth: () => number;
    onSlotPress: (index: number) => void | Promise<void>;
    onSubmitPress: () => void | Promise<void>;
    onSharePress: () => void | Promise<void>;
    reduceSize?: boolean;
    disableSubmit?: boolean;
};

export const AnswerRow = (props: AnswerRowProps) => (
    <hstack alignment="center middle" border="thick" cornerRadius="medium" padding={props.reduceSize ? "xsmall" : "small"}>
        <spacer size="xsmall"/>
        {!props.disableSubmit
            ? <hstack>
                {props.answerShape.map((shape, index) => (
                    <hstack alignment="center middle" gap="none">
                        <zstack onPress={() => props.onSlotPress(index)} alignment="center middle" lightBackgroundColor="rgba(0, 0, 0, 0.1)" darkBackgroundColor="rgba(255, 255, 255, 0.1)" cornerRadius="small">
                            <hstack alignment="center middle">
                                <text selectable={false} style="body" size={props.reduceSize ? "large" : "xlarge"} alignment="center middle">{"_".repeat(props.getSlotWidth())}</text>
                            </hstack>
                            {props.currentGuess[index] && <hstack alignment="center middle">
                                <text selectable={false} style="body" size={props.reduceSize ? "medium" : "large"} weight="bold" alignment="center middle">{props.currentGuess[index]}</text>
                            </hstack>}
                        </zstack>
                        {index < props.answerShape.length - 1 && <Joiner joiner={shape.joiner} reduceSize={props.reduceSize}/>}
                    </hstack>
                ))}
                <spacer size={props.reduceSize ? "small" : "medium"}/>
                <button onPress={props.onSubmitPress} disabled={props.disableSubmit} appearance="primary" size="small" icon="send-fill"/>
            </hstack>
            : <vstack gap="small"><text selectable={false} style="body" size={props.reduceSize ? "medium" : "large"} weight="bold" alignment="center middle">Game Finished</text><button disabled={!props.disableSubmit} appearance="primary" size="small" icon="share-fill" onPress={props.onSharePress}>Share Result</button></vstack>}
        <spacer size="xsmall"/>
    </hstack>
);

