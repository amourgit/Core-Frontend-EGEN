interface EgenAppContext {
    [namespace: string]: NonNullable<object>;
}
/**
 * @internal
 *
 * The application context store, using immer to potentially simplify updates
 */
export declare const contextStore: import("zustand/vanilla").StoreApi<EgenAppContext>;
/**
 * Used by callers to register a new namespace in the application context. Attempting to register
 * an already-registered namespace will display a warning and make no modifications to the state.
 *
 * @param namespace the namespace to register
 * @param initialValue the initial value of the namespace
 */
export declare function registerContext<T extends NonNullable<object> = NonNullable<object>>(namespace: string, initialValue?: T): void;
/**
 * Used by caller to unregister a namespace in the application context. Unregistering a namespace
 * will remove the namespace and all associated data.
 */
export declare function unregisterContext(namespace: string): void;
/**
 * Returns an _immutable_ version of the state of the namespace as it is currently
 *
 * @typeParam T The type of the value stored in the namespace
 * @param namespace The namespace to load properties from
 * @returns The immutable state of the namespace, or `null` if the namespace is not registered.
 */
export declare function getContext<T extends NonNullable<object> = NonNullable<object>>(namespace: string): Readonly<T> | null;
/**
 * Updates a namespace in the global context. If the namespace does not exist, it is registered.
 */
export declare function updateContext<T extends NonNullable<object> = NonNullable<object>>(namespace: string, update: (state: T) => T): void;
export type ContextCallback<T extends NonNullable<object> = NonNullable<object>> = (state: Readonly<T> | null | undefined) => void;
/**
 * Subscribes to updates of a given namespace. Note that the returned object is immutable.
 *
 * @param namespace the namespace to subscribe to
 * @param callback a function invoked with the current context whenever
 * @returns A function to unsubscribe from the context
 */
export declare function subscribeToContext<T extends NonNullable<object> = NonNullable<object>>(namespace: string, callback: ContextCallback<T>): () => void;
export {};
//# sourceMappingURL=context.d.ts.map