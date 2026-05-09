/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientDataSyncStore {
    offlinePatientDataSyncState: Record<string, OfflinePatientDataSyncState>;
    handlers: Record<string, OfflinePatientDataSyncHandler>;
}
/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientDataSyncState {
    readonly timestamp: Date;
    readonly syncingHandlers: Array<string>;
    readonly syncedHandlers: Array<string>;
    readonly failedHandlers: Array<string>;
    readonly errors: Record<string, string>;
    abort(): boolean;
}
/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientDataSyncHandler {
    readonly displayName: string;
    onOfflinePatientAdded(args: OfflinePatientArgs): Promise<void>;
}
/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientArgs {
    patientUuid: string;
    signal: AbortSignal;
}
/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export declare function getOfflinePatientDataStore(): import("zustand").StoreApi<OfflinePatientDataSyncStore>;
/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export declare function registerOfflinePatientHandler(identifier: string, handler: OfflinePatientDataSyncHandler): void;
/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export declare function syncOfflinePatientData(patientUuid: string): Promise<void>;
//# sourceMappingURL=offline-patient-data.d.ts.map