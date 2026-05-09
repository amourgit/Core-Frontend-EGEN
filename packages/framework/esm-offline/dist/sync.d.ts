/**
 * Defines an item queued up in the offline synchronization queue.
 * A `SyncItem` contains both meta information about the item in the sync queue, as well as the
 * actual data to be synchronized (i.e. the item's `content`).
 */
export interface SyncItem<T = any> {
    id?: number;
    userId: string;
    type: string;
    content: T;
    createdOn: Date;
    descriptor: QueueItemDescriptor;
    lastError?: {
        name?: string;
        message?: string;
    };
}
/**
 * Contains information about the sync item which has been provided externally by the caller
 * who added the item to the queue.
 * This information is all optional, but, when provided while enqueuing the item, can be used in other
 * locations to better represent the sync item, e.g. in the UI.
 */
export interface QueueItemDescriptor {
    id?: string;
    dependencies?: Array<{
        id: string;
        type: string;
    }>;
    patientUuid?: string;
    displayName?: string;
}
/**
 * A function which, when invoked, performs the actual client-server synchronization of the given
 * `item` (which is the actual data to be synchronized).
 * The function receives additional `options` which provide additional data that can be used
 * for synchronizing.
 */
export type ProcessSyncItem<T> = (item: T, options: SyncProcessOptions<T>) => Promise<any>;
/**
 * Additional data which can be used for synchronizing data in a {@link ProcessSyncItem} function.
 */
export interface SyncProcessOptions<T> {
    abort: AbortController;
    userId: string;
    index: number;
    items: Array<T>;
    dependencies: Array<any>;
}
/**
 * Defines additional options which can optionally be provided when setting up a synchronization callback
 * for a specific synchronization item type.
 * These are not required, but, when set, allow further
 */
interface SetupOfflineSyncOptions<T> {
    /**
     * Invoked when the user requests to edit a sync item.
     * The typical behavior for such a callback is to launch a UI which allows editing the content
     * encapsulated by the sync item.
     * @param syncItem The sync item to be edited.
     */
    onBeginEditSyncItem?(syncItem: SyncItem<T>): void;
}
/**
 * Represents the data inside the global offline synchronization store.
 * Provides information about a currently ongoing synchronization.
 */
export interface OfflineSynchronizationStore {
    synchronization?: {
        totalCount: number;
        pendingCount: number;
        abortController: AbortController;
    };
}
export declare function getOfflineSynchronizationStore(): import("zustand").StoreApi<OfflineSynchronizationStore>;
/**
 * Runs a full synchronization of **all** queued synchronization items.
 */
export declare function runSynchronization(): Promise<void>;
/**
 * Enqueues a new item in the sync queue for a specific user.
 * @param userId The user with whom the sync item should be associated with.
 * @param type The identifying type of the synchronization item.
 * @param content The actual data to be synchronized.
 * @param descriptor An optional descriptor providing additional metadata about the sync item.
 */
export declare function queueSynchronizationItemFor<T>(userId: string, type: string, content: T, descriptor?: QueueItemDescriptor): Promise<number>;
/**
 * Enqueues a new item in the sync queue and associates the item with the currently signed in user.
 * @param type The identifying type of the synchronization item.
 * @param content The actual data to be synchronized.
 * @param descriptor An optional descriptor providing additional metadata about the sync item.
 */
export declare function queueSynchronizationItem<T>(type: string, content: T, descriptor?: QueueItemDescriptor): Promise<number>;
/**
 * Returns the content of all currently queued up sync items of a given user.
 * @param userId The ID of the user whose synchronization items should be returned.
 * @param type The identifying type of the synchronization items to be returned..
 */
export declare function getSynchronizationItemsFor<T>(userId: string, type?: string): Promise<T[]>;
/**
 * Returns all currently queued up sync items of a given user.
 * @param userId The ID of the user whose synchronization items should be returned.
 * @param type The identifying type of the synchronization items to be returned..
 */
export declare function getFullSynchronizationItemsFor<T>(userId: string, type?: string): Promise<Array<SyncItem<T>>>;
/**
 * Returns the content of all currently queued up sync items of the currently signed in user.
 * @param type The identifying type of the synchronization items to be returned.
 */
export declare function getSynchronizationItems<T>(type?: string): Promise<T[]>;
/**
 * Returns all currently queued up sync items of the currently signed in user.
 * @param type The identifying type of the synchronization items to be returned.
 */
export declare function getFullSynchronizationItems<T>(type?: string): Promise<SyncItem<T>[]>;
/**
 * Returns a queued sync item with the given ID or `undefined` if no such item exists.
 * @param id The ID of the requested sync item.
 */
export declare function getSynchronizationItem<T = any>(id: number): Promise<SyncItem<T> | undefined>;
/**
 * Returns whether editing synchronization items of the given type is supported by the currently
 * registered synchronization handlers.
 * @param type The identifying type of the synchronization item which should be edited.
 */
export declare function canBeginEditSynchronizationItemsOfType(type: string): boolean;
/**
 * Triggers an edit flow for the given synchronization item.
 * If this is not possible, throws an error.
 * @param id The ID of the synchronization item to be edited.
 */
export declare function beginEditSynchronizationItem(id: number): Promise<void>;
/**
 * Deletes a queued up sync item with the given ID.
 * @param id The ID of the synchronization item to be deleted.
 */
export declare function deleteSynchronizationItem(id: number): Promise<void>;
/**
 * Registers a new synchronization handler which is able to synchronize data of a specific type.
 * @param type The identifying type of the synchronization items which can be handled by this handler.
 * @param dependsOn An array of other sync item types which must be synchronized before this handler
 *   can synchronize its own data. Items of these types are effectively dependencies of the data
 *   synchronized by this handler.
 * @param process A function which, when invoked, performs the actual client-server synchronization of the given
 *   `item` (which is the actual data to be synchronized).
 * @param options Additional options which can optionally be provided when setting up a synchronization callback
 *   for a specific synchronization item type.
 */
export declare function setupOfflineSync<T>(type: string, dependsOn: Array<string>, process: ProcessSyncItem<T>, options?: SetupOfflineSyncOptions<T>): void;
export {};
//# sourceMappingURL=sync.d.ts.map