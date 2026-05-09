/** @module @category Offline */
export type OfflineMode = 'on' | 'off' | 'unavailable';
export interface OfflineModeResult {
    current: OfflineMode;
    notAvailable: boolean;
    active: boolean;
}
export declare function getCurrentOfflineMode(): OfflineModeResult;
export declare function setCurrentOfflineMode(mode: OfflineMode): void;
export declare function activateOfflineCapability(): Promise<void>;
//# sourceMappingURL=mode.d.ts.map