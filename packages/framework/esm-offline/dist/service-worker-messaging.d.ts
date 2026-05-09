/** @module @category Offline */
import type { ImportMap } from '@egen/esm-globals';
import type { OmrsOfflineCachingStrategy } from './service-worker-http-headers';
/**
 * Sends the specified message to the application's service worker.
 * @param message The message to be sent.
 * @returns A promise which completes when the message has been successfully processed by the Service Worker.
 */
export declare function messageOmrsServiceWorker(message: KnownOmrsServiceWorkerMessages): Promise<MessageServiceWorkerResult<any>>;
export interface OmrsServiceWorkerMessage<MessageTypeTypeIdentifier extends string> {
    type: MessageTypeTypeIdentifier;
}
export interface OnImportMapChangedMessage extends OmrsServiceWorkerMessage<'onImportMapChanged'> {
    importMap: ImportMap;
}
export interface ClearDynamicRoutesMessage extends OmrsServiceWorkerMessage<'clearDynamicRoutes'> {
}
export interface RegisterDynamicRouteMessage extends OmrsServiceWorkerMessage<'registerDynamicRoute'> {
    pattern?: string;
    url?: string;
    strategy?: OmrsOfflineCachingStrategy;
}
export type KnownOmrsServiceWorkerMessages = OnImportMapChangedMessage | ClearDynamicRoutesMessage | RegisterDynamicRouteMessage;
export interface MessageServiceWorkerResult<T> {
    success: boolean;
    result?: T;
    error?: string;
}
//# sourceMappingURL=service-worker-messaging.d.ts.map