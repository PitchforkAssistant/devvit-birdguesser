import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";
import {createGameForm} from "../main.js";

const onPress = async (event: MenuItemOnPressEvent, context: Context) => {
    context.ui.showForm(createGameForm);
};

export const createGameButton = Devvit.addMenuItem({
    location: ["subreddit", "post", "comment"],
    label: "Create BirdNerd Game",
    forUserType: "moderator",
    onPress,
});
