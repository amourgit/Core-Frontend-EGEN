import { Workbox } from 'workbox-window';
/**
 * If not yet registered, registers the application's global Service Worker.
 * Throws if registration is not possible.
 * @param scriptURL The service worker script associated with this instance.
 * @param [registerOptions] The service worker options associated with this instance.
 * @returns A promise which resolves to the registered {@link Workbox} instance which manages the SW.
 */
export declare function registerOmrsServiceWorker(scriptUrl: string, registerOptions?: object): Promise<Workbox>;
/**
 * If a service worker has been registered, returns a promise that resolves to a {@link Workbox}
 * instance which is used by the application to manage that service worker.
 *
 * If no service worker has been registered (e.g. when the application is built without offline specific features),
 * returns a promise which immediately resolves to `undefined`.
 * @returns A promise which either resolves to `undefined` or to the app's {@link Workbox} instance.
 */
export declare function getOmrsServiceWorker(): Promise<Workbox | undefined>;
//# sourceMappingURL=service-worker.d.ts.map