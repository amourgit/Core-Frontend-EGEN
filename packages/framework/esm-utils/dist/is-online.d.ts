/**
 * Determines if the application should behave as if it is online.
 * When offline mode is enabled (`window.offlineEnabled`), this returns the
 * provided `online` parameter or falls back to `navigator.onLine`.
 * When offline mode is disabled, this always returns `true`.
 *
 * @param online Optional override for the online status. If provided and offline
 *   mode is enabled, this value is returned directly.
 * @returns `true` if the application should behave as online, `false` otherwise.
 *
 * @category Utility
 */
export declare function isOnline(online?: boolean): boolean;
//# sourceMappingURL=is-online.d.ts.map