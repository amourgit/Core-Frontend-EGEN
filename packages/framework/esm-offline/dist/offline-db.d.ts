import type { Table } from 'dexie';
import Dexie from 'dexie';
import type { DynamicOfflineData } from './dynamic-offline-data';
import type { SyncItem } from './sync';
/**
 * Accesses the central IndexedDB used by the `esm-offline` module to persist offline related state.
 * Leverages the `dexie` library for IndexedDB management.
 */
export declare class OfflineDb extends Dexie {
    /**
     * The table used to store the data of the offline synchronization queue (aka "sync queue" / "offline actions").
     */
    syncQueue: Table<SyncItem, number>;
    dynamicOfflineData: Table<DynamicOfflineData, number>;
    constructor();
}
/**
 * @internal Temporarily added for esm-offline-tools-app and workarounds. Please don't use elsewhere.
 * @deprecated Should/Will be removed in the future per the above reason.
 */
export declare function getOfflineDb(): OfflineDb;
//# sourceMappingURL=offline-db.d.ts.map