import {Devvit} from "@devvit/public-api";
import {BirdNerdJoiner} from "../../utils/birdNerd.js";

export type JoinerProps = {
    joiner: BirdNerdJoiner;
    reduceSize?: boolean;
};

export const Joiner = (props: JoinerProps) => {
    switch (props.joiner) {
    case "space":
        return <spacer size={props.reduceSize ? "small" : "medium"}/>;
    case "hyphen":
        return <text selectable={false} style="body" size={props.reduceSize ? "medium" : "large"} alignment="center top" weight="bold">-</text>;
    case "none":
        return null;
    default:
        return null;
    }
};
