/**
 * A handler for synchronizing dynamically declared offline data.
 * Can be setup using the {@link setupDynamicOfflineDataHandler} function.
 */
export interface DynamicOfflineDataHandler {
    /**
     * A string uniquely identifying the handler.
     */
    id: string;
    /**
     * The type of offline data handled by this handler.
     * See {@link DynamicOfflineData.type} for details.
     */
    type: string;
    /**
     * A human-readable string representing the handler.
     * If provided, the handler can be rendered in the UI using that string.
     */
    displayName?: string;
    /**
     * Evaluates whether the given offline data is correctly synced at this point in time from the perspective
     * of this single handler.
     * If `false`, the handler would have to (re-)sync the data in order for offline mode to properly work.
     * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
     * @param abortSignal An `AbortSignal` which can be used to cancel the operation.
     */
    isSynced(identifier: string, abortSignal?: AbortSignal): Promise<boolean>;
    /**
     * Synchronizes the given offline data.
     * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
     * @param abortSignal An `AbortSignal` which can be used to cancel the operation.
     */
    sync(identifier: string, abortSignal?: AbortSignal): Promise<void>;
}
/**
 * Represents the registration of a single dynamic offline data entry.
 */
export interface DynamicOfflineData {
    /**
     * The internal ID of the data entry, as assigned by the IndexedDB where it is stored.
     */
    id?: number;
    /**
     * The underlying type used for categorizing the data entry.
     * Examples could be `"patient"` or `"form"`.
     */
    type: string;
    /**
     * The externally provided identifier of the data entry.
     * This is typically the ID of the resource as assigned by a remote API.
     */
    identifier: string;
    /**
     * The UUIDs of the users who need this data entry available offline.
     */
    users: Array<string>;
    /**
     * If this entry has already been synced, returns the result of that last sync attempt.
     * Otherwise this is `undefined`.
     */
    syncState?: DynamicOfflineDataSyncState;
}
/**
 * Represents the result of syncing a given {@link DynamicOfflineData} entry.
 */
export interface DynamicOfflineDataSyncState {
    /**
     * The time when the entry has been synced the last time.
     */
    syncedOn: Date;
    /**
     * The ID of the user who has triggered the data synchronization.
     */
    syncedBy: string;
    /**
     * The IDs of the handlers which successfully synchronized their data.
     */
    succeededHandlers: Array<string>;
    /**
     * The IDs of the handlers which failed to synchronize their data.
     */
    erroredHandlers: Array<string>;
    /**
     * A collection of the errors caught while synchronizing, per handler.
     */
    errors: Array<{
        handlerId: string;
        message: string;
    }>;
}
/**
 * Returns all handlers which have been setup using the {@link setupDynamicOfflineDataHandler} function.
 */
export declare function getDynamicOfflineDataHandlers(): DynamicOfflineDataHandler[];
/**
 * Sets up a handler for synchronizing dynamic offline data.
 * See {@link DynamicOfflineDataHandler} for details.
 * @param handler The handler to be setup.
 */
export declare function setupDynamicOfflineDataHandler(handler: DynamicOfflineDataHandler): void;
/**
 * Returns all {@link DynamicOfflineData} entries which registered for the currently logged in user.
 * Optionally returns only entries of a given type.
 * @param type The type of the entries to be returned. If `undefined`, returns all types.
 */
export declare function getDynamicOfflineDataEntries<T extends DynamicOfflineData>(type?: string): Promise<Array<T>>;
/**
 * Returns all {@link DynamicOfflineData} entries which registered for the given user.
 * Optionally returns only entries of a given type.
 * @param userId The ID of the user whose entries are to be retrieved.
 * @param type The type of the entries to be returned. If `undefined`, returns all types.
 */
export declare function getDynamicOfflineDataEntriesFor<T extends DynamicOfflineData>(userId: string, type?: string): Promise<Array<T>>;
/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * should be made available offline for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export declare function putDynamicOfflineData(type: string, identifier: string): Promise<void>;
/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * should be made available offline for the user with the given ID.
 * @param userId The ID of the user for whom the dynamic offline data should be made available.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export declare function putDynamicOfflineDataFor(userId: string, type: string, identifier: string): Promise<void>;
/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * no longer needs to be available offline for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export declare function removeDynamicOfflineData(type: string, identifier: string): Promise<void>;
/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * no longer needs to be available offline for the user with the given ID.
 * @param userId The ID of the user who doesn't require the specified offline data.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export declare function removeDynamicOfflineDataFor(userId: string, type: string, identifier: string): Promise<void>;
/**
 * Synchronizes all offline data entries of the given {@link type} for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param abortSignal An `AbortSignal` which can be used to cancel the operation.
 */
export declare function syncAllDynamicOfflineData(type: string, abortSignal?: AbortSignal): Promise<void>;
/**
 * Synchronizes a single offline data entry of the given {@link type} for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 * @param abortSignal An `AbortSignal` which can be used to cancel the operation.
 */
export declare function syncDynamicOfflineData(type: string, identifier: string, abortSignal?: AbortSignal): Promise<void>;
//# sourceMappingURL=dynamic-offline-data.d.ts.map