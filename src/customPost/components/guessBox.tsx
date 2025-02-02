import {Devvit} from "@devvit/public-api";

import {BirdNerdGuessResult} from "../../types/birdNerd/guess.js";
import {BirdNerdGuess, BirdNerdGuessedWord, BirdNerdGuesses} from "../../types/birdNerd/guess.js";
import {BirdNerdAnswerShape} from "../../types/birdNerd/partialGame.js";
import {colors} from "../pages/game/gamePageConstants.js";
import {Joiner} from "./joiner.js";

export type GuessBoxProps = {
    answerShape: BirdNerdAnswerShape;
    guesses: BirdNerdGuesses;
    chances: number;
    slotWidth: number;
    reduceSize?: boolean;
};

export function getGuessedWordBackgroundColor (word: string, result: BirdNerdGuessResult): string {
    if (!word.trim()) {
        return colors.backgroundBlank;
    }
    switch (result) {
    case "correct":
        return colors.backgroundCorrect;
    case "incorrect":
        return colors.backgroundIncorrect;
    case "contains":
        return colors.backgroundContains;
    default:
        return colors.backgroundBlank;
    }
}

export function getGuessBackgroundColor (guess: BirdNerdGuess): string | undefined {
    if (guess.every(word => word.result === "correct")) {
        return colors.backgroundCorrect;
    }
    return undefined;
}

export const GuessBox = (props: GuessBoxProps) => {
    // Filled to be equal to length of props.chances but unused guesses just being empty
    const paddedGuesses: BirdNerdGuesses = Array<BirdNerdGuess>(props.chances - props.guesses.length).fill(Array<BirdNerdGuessedWord>(props.answerShape.length).fill({word: "", result: "incorrect"})).concat(props.guesses);
    return (
        <vstack alignment="center middle" backgroundColor={colors.backgroundSecondary} border="thick" borderColor={colors.border} cornerRadius="medium" gap="small" padding="small" reverse>
            {paddedGuesses.map(guess => (
                <hstack alignment="center middle" backgroundColor={getGuessBackgroundColor(guess)} border={guess.every(word => word.result === "correct") ? "thick" : "none"} borderColor={getGuessBackgroundColor(guess)} cornerRadius="medium">
                    <spacer size="xsmall"/>
                    {guess.map((word, wordIndex) => props.answerShape[wordIndex] ? (
                        <hstack alignment="center middle" gap="none" grow>
                            <zstack alignment="center middle" backgroundColor={getGuessedWordBackgroundColor(word.word, word.result)} cornerRadius="small" grow>
                                <hstack alignment="center middle" grow>
                                    <text alignment="center middle" darkColor="rgba(255, 255, 255, 0)" grow lightColor="rgba(0, 0, 0, 0)" selectable={false} size={props.reduceSize ? "large" : "xlarge"}>{"_".repeat(props.slotWidth)}</text>
                                </hstack>
                                {word && <hstack alignment="center middle" grow>
                                    <text alignment="center middle" color={colors.text} selectable={false} size={props.reduceSize ? "medium" : "large"} weight="bold">{word.word}</text>
                                </hstack>}
                            </zstack>
                            {wordIndex < props.answerShape.length - 1 && <Joiner joiner={props.answerShape[wordIndex].joiner} reduceSize={props.reduceSize}/>}
                        </hstack>
                    ) : null)}
                    <spacer size="xsmall"/>
                </hstack>))};
        </vstack>
    );
};

