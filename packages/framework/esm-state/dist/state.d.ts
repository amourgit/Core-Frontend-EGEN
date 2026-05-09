import type { StoreApi } from 'zustand/vanilla';
/**
 * Creates a Zustand store.
 *
 * @param name A name by which the store can be looked up later.
 *    Must be unique across the entire application.
 * @param initialState An object which will be the initial state of the store.
 * @returns The newly created store.
 */
export declare function createGlobalStore<T>(name: string, initialState: T): StoreApi<T>;
/**
 * Registers an existing Zustand store.
 *
 * @param name A name by which the store can be looked up later.
 *    Must be unique across the entire application.
 * @param store The Zustand store to use for this.
 * @returns The newly registered store.
 */
export declare function registerGlobalStore<T>(name: string, store: StoreApi<T>): StoreApi<T>;
/**
 * Returns the existing store named `name`,
 * or creates a new store named `name` if none exists.
 *
 * @param name The name of the store to look up.
 * @param fallbackState The initial value of the new store if no store named `name` exists.
 * @returns The found or newly created store.
 */
export declare function getGlobalStore<T>(name: string, fallbackState?: T): StoreApi<T>;
/**
 * Subscribes to a store and invokes a callback when the state changes.
 * The callback is also immediately invoked with the current state upon subscription.
 * Uses shallow equality comparison to determine if the state has changed.
 *
 * This function has two overloads:
 * 1. Subscribe to the entire store state
 * 2. Subscribe to a selected portion of the state using a selector function
 *
 * @param store The store to subscribe to.
 * @param handle A callback function that receives the state (or selected state) when it changes.
 * @returns An unsubscribe function to stop listening for changes.
 *
 */
export declare function subscribeTo<T, U = T>(store: StoreApi<T>, handle: (state: T) => void): () => void;
export declare function subscribeTo<T, U>(store: StoreApi<T>, select: (state: T) => U, handle: (subState: U) => void): () => void;
//# sourceMappingURL=state.d.ts.map