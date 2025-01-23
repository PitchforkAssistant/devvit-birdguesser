import {useInterval, UseIntervalResult, useState, UseStateResult} from "@devvit/public-api";

import {CustomPostState} from "../../state.js";

export class NoGamePageState {
    readonly _counter: UseStateResult<number>;
    readonly interval: UseIntervalResult;

    constructor (readonly postState: CustomPostState) {
        this._counter = useState<number>(0);

        this.interval = useInterval(this.onInterval, 1000);
        this.interval.start();
    }

    get counter () {
        return this._counter[0];
    }
    set counter (value: number) {
        this._counter[1](value);
    }
    get showWarning () {
        return this.counter >= 2;
    }

    onInterval = async () => {
        if (this.postState.currentPage !== "noGame") {
            this.interval.stop();
            return;
        }

        if (this.postState.PageStates.game.isLoaded) {
            this.postState.changePage("game");
            this.counter = 0;
            this.interval.stop();
            return;
        }

        this.counter++;
    };
}
