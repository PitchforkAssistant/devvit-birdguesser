export type BirdNerdOutcome = {
    guesses: number;
    result?: "won" | "lost";
}

export function isBirdNerdOutcome (object: unknown): object is BirdNerdOutcome {
    if (!object || typeof object !== "object") {
        return false;
    }
    const outcome = object as BirdNerdOutcome;
    return typeof outcome.guesses === "number"
        && (outcome.result === "won" || outcome.result === "lost" || outcome.result === undefined);
}
