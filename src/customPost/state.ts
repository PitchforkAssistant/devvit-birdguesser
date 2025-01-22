import {Context, useState, UseStateResult} from "@devvit/public-api";
import {BasicPostData, BasicUserData} from "../types/basicData.js";
import {PageName, PageStateList} from "./pages.js";
import {isModerator} from "devvit-helpers";
import {GamePageState} from "./pages/game/gameState.js";
import {UIDimensions} from "@devvit/protos";
import {ManagerPageState} from "./pages/manager/managerState.js";
import {AppSettings, getAppSettings} from "../settings.js";
import {LoadState} from "../types/loadState.js";
import {useAsyncState, UseAsyncStateResult} from "../utils/useAsyncState.js";
import {PostDirection} from "../utils/post.js";

export class CustomPostState {
    // Core states
    readonly _loaded: UseStateResult<LoadState>;
    readonly _errors: UseStateResult<Record<string, string>>;
    readonly _currentPage: UseStateResult<PageName>;

    // Data states
    readonly _currentUserId: UseStateResult<string | null>;
    readonly _currentUser: UseAsyncStateResult<BasicUserData>;
    readonly _currentPost: UseAsyncStateResult<BasicPostData>;
    readonly _appSettings: UseAsyncStateResult<AppSettings>;
    readonly _manager: UseAsyncStateResult<boolean>;

    // Sub-states
    public PageStates: PageStateList;

    constructor (public context: Context, startPage: PageName = "game") {
        this._loaded = useState<LoadState>("loading");
        this._errors = useState<Record<string, string>>({});
        this._currentPage = useState<PageName>(startPage);

        this._currentUserId = useState<string | null>(context.userId ?? null);

        this._currentUser = useAsyncState<BasicUserData>(async () => {
            const user = await context.reddit.getCurrentUser();
            if (user) {
                const snoovatar = await user.getSnoovatarUrl();
                return {
                    username: user.username,
                    id: user.id,
                    snoovatar: snoovatar ?? context.assets.getURL("Avatar_Missing.png"),
                };
            }
            return null;
        }, {depends: [context.userId ?? null]});

        this._currentPost = useAsyncState<BasicPostData>(async () => {
            if (!context.postId) {
                return null;
            }
            const post = await context.reddit.getPostById(context.postId);
            return {
                title: post.title,
                id: post.id,
                subreddit: {
                    name: post.subredditName,
                    id: post.subredditId,
                },
                author: {
                    username: post.authorName ?? "",
                    id: post.authorId ?? "",
                },
                permalink: post.permalink,
                score: post.score,
            };
        }, {depends: [context.postId ?? null]});

        this._appSettings = useAsyncState<AppSettings>(async () => getAppSettings(context.settings), {depends: []});

        this._manager = useAsyncState<boolean>(async () => {
            if (!context.subredditName || !this.currentUser) {
                return false;
            }
            return isModerator(context.reddit, context.subredditName, this.currentUser.username);
        }, {depends: [this.currentUser]});

        // We need to initialize the page states here, otherwise they'll get reset on every page change
        this.PageStates = {
            game: new GamePageState(this),
            manager: new ManagerPageState(this),
            noGame: undefined,
            help: undefined,
        };
    }

    get isLoaded (): boolean {
        return this.loaded === "loaded";
    }

    get loaded (): LoadState {
        if (this._loaded[0] === "loading") {
            const loadingChecks = [this._currentUser, this._currentPost, this._appSettings, this._manager];
            if (loadingChecks.every(check => !check.loading)) {
                if (loadingChecks.every(check => check.error === null)) {
                    this.loaded = "loaded";
                    return "loaded";
                }
                this.loaded = "error";
                return "error";
            }
            return this._loaded[0];
        }
        return this._loaded[0];
    }

    protected set loaded (value: LoadState) {
        this._loaded[1](value);
    }

    get currentPost (): BasicPostData | null {
        return this._currentPost.data;
    }

    get appSettings (): AppSettings | null {
        return this._appSettings.data;
    }

    get isModerator (): boolean {
        return this._manager.data ?? false;
    }

    get isDebug (): boolean {
        if (!this.currentPost) {
            return false;
        }
        return this.currentPost.title.includes("debug");
    }

    get currentPage (): PageName {
        return this._currentPage[0];
    }

    get uiDims (): UIDimensions {
        return this.context.uiEnvironment?.dimensions ?? {height: 320, width: 379, scale: 3.5};
    }

    get layout (): PostDirection {
        return this.uiDims.width > this.uiDims.height && this.uiDims.width > 400 ? "horizontal" : "vertical";
    }

    protected set currentPage (page: PageName) {
        this._currentPage[1](page);
    }

    changePage (page: PageName): void {
        if (this.currentPage === page) {
            return;
        }
        this.currentPage = page;
    }

    get currentUser (): BasicUserData | null {
        if (this._currentUser.loading) {
            return null;
        }
        return this._currentUser.data;
    }

    get currentUserId (): string | null {
        return this._currentUserId[0];
    }
}
