export interface ConnectivityChangedEvent {
    online: boolean;
}
/** @internal */
export declare function dispatchConnectivityChanged(online: boolean): void;
/** @category Offline */
export declare function subscribeConnectivityChanged(cb: (ev: ConnectivityChangedEvent) => void): () => void;
/** @category Offline */
export declare function subscribeConnectivity(cb: (ev: ConnectivityChangedEvent) => void): () => void;
export interface PrecacheStaticDependenciesEvent {
}
export declare function dispatchPrecacheStaticDependencies(data?: PrecacheStaticDependenciesEvent): void;
/** @category Offline */
export declare function subscribePrecacheStaticDependencies(cb: (data: PrecacheStaticDependenciesEvent) => void): () => void;
/** @category UI */
export interface ShowNotificationEvent {
    description: any;
    kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
    title?: string;
    action?: any;
    millis?: number;
}
export interface ShowActionableNotificationEvent {
    subtitle: any;
    kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
    title?: string;
    actionButtonLabel: string | any;
    onActionButtonClick: () => void;
    progressActionLabel?: string;
}
/** @category UI */
export interface ShowToastEvent {
    description: any;
    kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
    title?: string;
    actionButtonLabel?: string | any;
    onActionButtonClick?: () => void;
}
/** @category UI */
export interface ShowSnackbarEvent {
    subtitle?: any;
    kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
    title: string;
    actionButtonLabel?: string | any;
    onActionButtonClick?: () => void;
    progressActionLabel?: string;
    isLowContrast?: boolean;
    timeoutInMs?: number;
}
export declare function dispatchNotificationShown(data: ShowNotificationEvent): void;
/** @internal */
export declare function dispatchActionableNotificationShown(data: ShowActionableNotificationEvent): void;
/** @internal */
export declare function dispatchSnackbarShown(data: ShowSnackbarEvent): void;
/** @internal */
export declare function dispatchToastShown(data: ShowToastEvent): void;
/** @category UI */
export declare function subscribeNotificationShown(cb: (data: ShowNotificationEvent) => void): () => void;
/** @category UI */
export declare function subscribeActionableNotificationShown(cb: (data: ShowActionableNotificationEvent) => void): () => void;
/** @category UI */
export declare function subscribeToastShown(cb: (data: ShowToastEvent) => void): () => void;
/** @category UI */
export declare function subscribeSnackbarShown(cb: (data: ShowSnackbarEvent) => void): () => void;
//# sourceMappingURL=events.d.ts.map