
export type BirdNerdJoiner = "space" | "hyphen" | "none";

export function isBirdNerdJoiner (joiner: unknown): joiner is BirdNerdJoiner {
    return joiner === "space" || joiner === "hyphen" || joiner === "none";
}

export const JoinerToCharacter: Record<BirdNerdJoiner, string> = {
    space: " ",
    hyphen: "-",
    none: "",
};
