import {Devvit} from "@devvit/public-api";
import {BirdNerdAnswerShape, BirdNerdGuess, BirdNerdGuessedWord, BirdNerdGuesses, BirdNerdGuessResult} from "../../utils/birdNerd.js";
import {Joiner} from "./joiner.js";

export type GuessRowProps = {
    answerShape: BirdNerdAnswerShape;
    guesses: BirdNerdGuesses;
    chances: number;
    getSlotWidth: () => number;
    reduceSize?: boolean;
    disableSubmit?: boolean;
};

export function getGuessedWordBackgroundColor (word: string, result: BirdNerdGuessResult, theme: "light" | "dark" = "light"): string {
    if (!word.trim()) {
        return theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.1)";
    }
    if (result === "correct") {
        return theme === "light" ? "#77DD77" : "#77DD77";
    }
    if (result === "incorrect") {
        return theme === "light" ? "#ff746c" : "#ff746c";
    }
    if (result === "contains") {
        return theme === "light" ? "#FDFD96" : "#FDFD96";
    }
    return theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.1)";
}

export function getGuessBackgroundColor (guess: BirdNerdGuess, theme: "light" | "dark" = "light"): string | undefined {
    if (guess.every(word => word.result === "correct")) {
        return theme === "light" ? "#77DD77" : "#77DD77";
    }
    return undefined;
}

export const GuessRow = (props: GuessRowProps) => {
    // Filled to be equal to length of props.chances but unused guesses just being empty
    const paddedGuesses: BirdNerdGuesses = Array<BirdNerdGuess>(props.chances - props.guesses.length).fill(Array<BirdNerdGuessedWord>(props.answerShape.length).fill({word: "", result: "incorrect"})).concat(props.guesses);
    return (
        <vstack gap="small" alignment="center middle" border="thick" borderColor="rgba(255, 255, 255, 0.2)" backgroundColor="rgba(255, 255, 255, 0.2)" cornerRadius="medium" padding={props.reduceSize ? "xsmall" : "small"} reverse>
            {paddedGuesses.map(guess => (
                <hstack alignment="center middle" cornerRadius="medium" border={guess.every(word => word.result === "correct") ? "thick" : "none"} borderColor={getGuessBackgroundColor(guess, "dark")} backgroundColor={getGuessBackgroundColor(guess, "light")}>
                    <spacer size="xsmall"/>
                    {guess.map((word, wordIndex) => props.answerShape[wordIndex] ? (
                        <hstack alignment="center middle" gap="none">
                            <zstack alignment="center middle" backgroundColor={getGuessedWordBackgroundColor(word.word, word.result, "dark")} cornerRadius="small">
                                <hstack alignment="center middle">
                                    <text selectable={false} style="body" size={props.reduceSize ? "large" : "xlarge"} alignment="center middle" lightColor="rgba(0, 0, 0, 0)" darkColor="rgba(255, 255, 255, 0)">{"_".repeat(props.getSlotWidth())}</text>
                                </hstack>
                                {word && <hstack alignment="center middle">
                                    <text color="#111" selectable={false} style="body" size={props.reduceSize ? "medium" : "large"} weight="bold" alignment="center middle">{word.word}</text>
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

