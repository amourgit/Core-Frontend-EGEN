/** @module @category Offline */
import type { ImportMap } from '@egen/esm-globals';
import type { EgenOfflineCachingStrategy } from './service-worker-http-headers';
/**
 * Sends the specified message to the application's service worker.
 * @param message The message to be sent.
 * @returns A promise which completes when the message has been successfully processed by the Service Worker.
 */
export declare function messageEgenServiceWorker(message: KnownEgenServiceWorkerMessages): Promise<MessageServiceWorkerResult<any>>;
export interface EgenServiceWorkerMessage<MessageTypeTypeIdentifier extends string> {
    type: MessageTypeTypeIdentifier;
}
export interface OnImportMapChangedMessage extends EgenServiceWorkerMessage<'onImportMapChanged'> {
    importMap: ImportMap;
}
export interface ClearDynamicRoutesMessage extends EgenServiceWorkerMessage<'clearDynamicRoutes'> {
}
export interface RegisterDynamicRouteMessage extends EgenServiceWorkerMessage<'registerDynamicRoute'> {
    pattern?: string;
    url?: string;
    strategy?: EgenOfflineCachingStrategy;
}
export type KnownEgenServiceWorkerMessages = OnImportMapChangedMessage | ClearDynamicRoutesMessage | RegisterDynamicRouteMessage;
export interface MessageServiceWorkerResult<T> {
    success: boolean;
    result?: T;
    error?: string;
}
//# sourceMappingURL=service-worker-messaging.d.ts.map