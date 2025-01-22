import {GamePage} from "./pages/game/gamePage.js";
import {GamePageState} from "./pages/game/gameState.js";
import {HelpPage} from "./pages/help/helpPage.js";
import {ManagerPage} from "./pages/manager/managerPage.js";
import {ManagerPageState} from "./pages/manager/managerState.js";
import {NoGamePage} from "./pages/noGame/noGamePage.js";
import {CustomPostState} from "./state.js";

export type PageName = "game" | "noGame" | "help" | "manager";

export type PageList = {
    [key in PageName]: (state: CustomPostState) => JSX.Element;
};

export const Pages: PageList = {
    game: GamePage,
    noGame: NoGamePage,
    help: HelpPage,
    manager: ManagerPage,
};

export interface PageProps {
    state: CustomPostState;
}

export const Page = ({state}: PageProps) => Pages[state.currentPage](state);

export const PageStateTypes = {
    game: GamePageState,
    manager: ManagerPageState,
    noGame: undefined,
    help: undefined,
};

export type PageStateList = {
    [key in PageName]: typeof PageStateTypes[key] extends new (state: CustomPostState) => unknown ? InstanceType<typeof PageStateTypes[key]> : undefined;
}
