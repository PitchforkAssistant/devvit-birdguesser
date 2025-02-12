import {BirdNerdGuess} from "../types/birdNerd/guess.js";
import {BirdNerdOutcome} from "../types/birdNerd/outcome.js";

export function getGameOutcome (guesses: BirdNerdGuess[], maxGuesses: number): BirdNerdOutcome {
    const outcome: BirdNerdOutcome = {
        guesses: guesses.length,
    };

    if (guesses.some(guess => guess.every(word => word.result === "correct"))) {
        outcome.result = "won";
    } else if (guesses.length >= maxGuesses) {
        outcome.result = "lost";
    }

    return outcome;
}
