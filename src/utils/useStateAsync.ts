import {AsyncError, JSONValue, useState, useAsync, AsyncUseStateInitializer} from "@devvit/public-api";

/**
 * The return type of the useStateAsync function.
 * @param data The data stored in the state.
 * @param setData A function to set the data in the state. Using this will also mark the data as dirty, which will prevent it from being overwritten by a reload if blockDirtyReload is true.
 * @param dirty Whether the data has been changed locally.
 * @param loading Whether the data is currently loading.
 * @param error The error that occurred during the last load, if any.
**/
export type UseStateAsyncResult<T extends JSONValue> = {
    data: T | null;
    setData: (data: T | null) => void;
    dirty: boolean;
    loading: boolean;
    error: AsyncError | null;
}

/**
 * Options for the useStateAsync function.
 * @param depends An array of values that, when changed, will trigger a reload of the data.
 * @param finally A function that is called after the data is loaded, with the data and error as arguments. This is called after state updates internally to the hook. Make sure to use the values provided to the function to avoid issues.
 * @param defaultData The initial value of the data, defaults to null.
 * @param blockDirtyReload If true, reloads triggered by depends will not change the data if it has been changed locally (i.e. the data is dirty).
 */
export type StateAsyncOptions<T extends JSONValue> = {
    depends?: JSONValue[];
    finally?: (data: T | null, error: Error | null) => void;
    defaultData?: T | null;
    blockDirtyReload?: boolean;
}

/**
 * A hook that combines useState and useAsync into a single function. The advantage of this is not having to use both useState and useAsync to handle a mix of sync and async data.
 * @param initializer Functionally identical to the useAsync initializer, except null is always allowed as a return value.
 * @param options Same options as useAsync, with the addition of defaultData, which is the initial value of the data.
 * @returns {UseStateAsyncResult<T>} The data, loading state, error, and a setData function.
 */
export function useStateAsync <T extends JSONValue> (initializer: AsyncUseStateInitializer<T | null>, options: StateAsyncOptions<T>): UseStateAsyncResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AsyncError | null>(null);
    const [dirty, setDirty] = useState<boolean>(false);

    const asyncResult = useAsync<T | null>(initializer, {
        depends: options.depends,
        finally: (newData, newError) => {
            if (dirty && options.blockDirtyReload) {
                return;
            }
            if (newError) {
                setError({message: newError.message, details: newError.stack ?? null});
                console.error(newError);
            }
            if (newData) {
                setData(newData);
                setDirty(false);
            }
            if (options.finally) {
                options.finally(newData, newError);
            }
        },
    });

    return {
        data,
        error,
        dirty,
        setData: (data: T | null) => {
            setData(data);
            setDirty(true);
        },
        loading: asyncResult.loading,
    };
}
