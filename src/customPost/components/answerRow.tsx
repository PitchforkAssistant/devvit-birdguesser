import {Devvit} from "@devvit/public-api";
import {BirdNerdAnswerShape} from "../../types/birdNerd/partialGame.js";
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
    totalGuesses: number;
    won: boolean;
};

export const AnswerRow = (props: AnswerRowProps) => (
    <hstack alignment="center middle" border="thick" borderColor="rgba(255, 255, 255, 0.2)" backgroundColor="rgba(255, 255, 255, 0.2)" cornerRadius="medium" padding={props.reduceSize ? "xsmall" : "small"}>
        <spacer size="xsmall"/>
        {!props.disableSubmit
            ? <hstack>
                {props.answerShape.map((shape, index) => (
                    <hstack alignment="center middle" gap="none">
                        <zstack onPress={() => props.onSlotPress(index)} alignment="center middle" backgroundColor="rgba(0, 0, 0, 0.1)" cornerRadius="small">
                            <hstack alignment="center middle">
                                <text color="#111" selectable={false} style="body" size={props.reduceSize ? "large" : "xlarge"} alignment="center middle">{"_".repeat(props.getSlotWidth())}</text>
                            </hstack>
                            {props.currentGuess[index] && <hstack alignment="center middle">
                                <text color="#111" selectable={false} style="body" size={props.reduceSize ? "medium" : "large"} weight="bold" alignment="center middle">{props.currentGuess[index]}</text>
                            </hstack>}
                        </zstack>
                        {index < props.answerShape.length - 1 && <Joiner joiner={shape.joiner} reduceSize={props.reduceSize}/>}
                    </hstack>
                ))}
                <spacer size={props.reduceSize ? "small" : "medium"}/>
                <button onPress={props.onSubmitPress} disabled={props.disableSubmit} appearance="primary" size="small" icon="send-fill"/>
            </hstack>
            : <vstack gap="small">
                <text selectable={false} style="body" size={props.reduceSize ? "medium" : "large"} weight="bold" alignment="center middle" color="#111">{props.won ? `You got it in ${props.totalGuesses}!` : "You lost."}</text>
                <button disabled={!props.disableSubmit} appearance="primary" size="small" icon="share-fill" onPress={props.onSharePress}>Share Result</button>
            </vstack>}
        <spacer size="xsmall"/>
    </hstack>
);

