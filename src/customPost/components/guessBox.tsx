import {Devvit} from "@devvit/public-api";

import {BirdNerdGuessResult} from "../../types/birdNerd/guess.js";
import {BirdNerdGuess, BirdNerdGuessedWord, BirdNerdGuesses} from "../../types/birdNerd/guess.js";
import {BirdNerdAnswerShape} from "../../types/birdNerd/partialGame.js";
import {colors} from "../pages/game/gamePageConstants.js";
import {WordSlot} from "./word.js";

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
                        <WordSlot
                            backgroundColor={getGuessedWordBackgroundColor(word.word, word.result)}
                            color={colors.text}
                            joiner={wordIndex < props.answerShape.length - 1 ? props.answerShape[wordIndex].joiner : undefined}
                            reduceSize={props.reduceSize}
                            slotWidth={props.slotWidth}
                            underline={false}
                            word={word.word}
                        />
                    ) : null)}
                    <spacer size="xsmall"/>
                </hstack>))};
        </vstack>
    );
};

