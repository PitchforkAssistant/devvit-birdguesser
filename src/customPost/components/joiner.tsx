import {Devvit} from "@devvit/public-api";

import {BirdNerdJoiner} from "../../types/birdNerd/joiner.js";
import {colors} from "../pages/game/gamePageConstants.js";

export type JoinerProps = {
    joiner: BirdNerdJoiner;
    reduceSize?: boolean;
};

export const Joiner = (props: JoinerProps) => {
    switch (props.joiner) {
    case "space":
        return <spacer size={props.reduceSize ? "small" : "medium"}/>;
    case "hyphen":
        return <text alignment="center top" color={colors.text} selectable={false} size={props.reduceSize ? "medium" : "large"} style="body" weight="bold">-</text>;
    case "none":
        return null;
    default:
        return null;
    }
};
