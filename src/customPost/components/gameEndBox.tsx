import {BirdNerdAnswer} from "../../types/birdNerd/answer.js";

export type GameEndBoxProps = {
    answer: BirdNerdAnswer;
    slotWidth: number;
    reduceSize?: boolean;
    totalGuesses: number;
    won: boolean;
};
