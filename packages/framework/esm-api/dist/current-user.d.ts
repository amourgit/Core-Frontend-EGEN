import { Observable } from 'rxjs';
import type { LoggedInUser, SessionLocation, Privilege, Role, Session } from './types';
type SessionErrorListener = (err: Error) => void;
/**
 * Subscribe to session fetch errors. The callback fires every time
 * `refetchCurrentUser` (or any internal session call) fails with a network
 * or server error.
 *
 * @returns An unsubscribe function.
 *
 * @example
 * ```ts
 * const unsub = subscribeToSessionErrors((err) => console.error(err.message));
 * // later:
 * unsub();
 * ```
 */
export declare function subscribeToSessionErrors(listener: SessionErrorListener): () => void;
export type SessionStore = LoadedSessionStore | UnloadedSessionStore;
export type LoadedSessionStore = {
    loaded: true;
    session: Session;
};
export type UnloadedSessionStore = {
    loaded: false;
    session: null;
};
/** @internal */
export declare const sessionStore: import("zustand").StoreApi<SessionStore>;
/**
 * The getCurrentUser function returns an observable that produces
 * **zero or more values, over time**. It will produce zero values
 * by default if the user is not logged in. And it will provide a
 * first value when the logged in user is fetched from the server.
 * Subsequent values will be produced whenever the user object is
 * updated.
 *
 * The function accepts an optional `opts` object with an `includeAuthStatus`
 * boolean property that defaults to `true`. When `includeAuthStatus` is `true`,
 * the entire {@link Session} object from the API will be provided. When
 * `includeAuthStatus` is `false`, only the {@link LoggedInUser} property of the
 * response object will be provided.
 *
 * @returns An Observable that produces zero or more values (as described above).
 *   The values produced will be a {@link LoggedInUser} object (if `includeAuthStatus`
 *   is set to `false`) or a {@link Session} object with authentication status
 *   (if `includeAuthStatus` is set to `true` or not provided).
 *
 * @example
 *
 * ```js
 * import { getCurrentUser } from '@egen/esm-api'
 * const subscription = getCurrentUser().subscribe(
 *   user => console.log(user)
 * )
 * subscription.unsubscribe()
 * getCurrentUser({includeAuthStatus: true}).subscribe(
 *   data => console.log(data.authenticated)
 * )
 * ```
 *
 * #### Be sure to unsubscribe when your component unmounts
 *
 * Otherwise your code will continue getting updates to the user object
 * even after the UI component is gone from the screen. This is a memory
 * leak and source of bugs.
 */
declare function getCurrentUser(): Observable<Session>;
/**
 * @param opts Options for controlling the response format.
 * @param opts.includeAuthStatus When `true`, returns the full {@link Session} object
 *   including authentication status.
 * @returns An Observable that produces {@link Session} objects.
 */
declare function getCurrentUser(opts: {
    includeAuthStatus: true;
}): Observable<Session>;
/**
 * @param opts Options for controlling the response format.
 * @param opts.includeAuthStatus When `false`, returns only the {@link LoggedInUser} object
 *   without the surrounding session information.
 * @returns An Observable that produces {@link LoggedInUser} objects.
 */
declare function getCurrentUser(opts: {
    includeAuthStatus: false;
}): Observable<LoggedInUser>;
export { getCurrentUser };
/**
 * Returns the global session store containing the current user's session information.
 * If the session data is stale (older than 1 minute) or not yet loaded, this function
 * will trigger a refetch of the current user's session.
 *
 * @returns The global session store that can be subscribed to for session updates.
 *
 * @example
 * ```ts
 * import { getSessionStore } from '@egen/esm-api';
 * const store = getSessionStore();
 * const unsubscribe = store.subscribe((state) => {
 *   if (state.loaded) {
 *     console.log('Session:', state.session);
 *   }
 * });
 * ```
 */
export declare function getSessionStore(): import("zustand").StoreApi<SessionStore>;
/**
 * Sets the document's language attribute based on the user's locale preference
 * from the session data. This affects the HTML `lang` attribute which is used
 * for accessibility and internationalization.
 *
 * The locale is determined from either the session's locale or the user's
 * default locale property. Underscores in the locale are converted to hyphens
 * to match BCP 47 language tag format.
 *
 * @param data The session object containing locale information.
 */
export declare function setUserLanguage(data: Session): void;
/**
 * The `refetchCurrentUser` function causes a network request to redownload
 * the user. All subscribers to the current user will be notified of the
 * new users once the new version of the user object is downloaded.
 *
 * @returns The same observable as returned by {@link getCurrentUser}.
 *
 * @example
 * ```js
 * import { refetchCurrentUser } from '@egen/esm-api'
 * refetchCurrentUser()
 * ```
 */
export declare function refetchCurrentUser(username?: string, password?: string): Promise<SessionStore>;
/**
 * Clears the current user session from the session store, setting the session
 * to an unauthenticated state. This is typically called during logout to reset
 * the application's authentication state.
 *
 * @example
 * ```ts
 * import { clearCurrentUser } from '@egen/esm-api';
 * // During logout
 * clearCurrentUser();
 * ```
 */
export declare function clearCurrentUser(): void;
/**
 * Checks whether the given user has access based on the required privilege(s).
 * A user has access if they have the required privilege(s) or if they are a
 * "System Developer" (super user). If no privilege is required, access is granted.
 *
 * @param requiredPrivilege A single privilege string or an array of privilege strings
 *   that the user must have. If an array is provided, the user must have ALL privileges.
 * @param user The user object containing their privileges and roles.
 * @returns `true` if the user has access, `false` otherwise. Returns `true` if no
 *   privilege is required, and `false` if the user is undefined but a privilege is required.
 *
 * @example
 * ```ts
 * import { userHasAccess } from '@egen/esm-api';
 * const hasAccess = userHasAccess('View Patients', currentUser);
 * const hasMultipleAccess = userHasAccess(['View Patients', 'Edit Patients'], currentUser);
 * ```
 */
export declare function userHasAccess(requiredPrivilege: string | Array<string>, user: {
    privileges: Array<Privilege>;
    roles: Array<Role>;
}): boolean;
/**
 * Returns a Promise that resolves with the currently logged-in user object.
 * If the user is already loaded in the session store, the Promise resolves immediately.
 * Otherwise, it subscribes to the session store and resolves when a logged-in user
 * becomes available.
 *
 * @returns A Promise that resolves with the LoggedInUser object once available.
 *
 * @example
 * ```ts
 * import { getLoggedInUser } from '@egen/esm-api';
 * const user = await getLoggedInUser();
 * console.log('Logged in as:', user.display);
 * ```
 */
export declare function getLoggedInUser(): Promise<LoggedInUser>;
/**
 * Returns a Promise that resolves with the current session location, if one is set.
 * The session location represents the physical location where the user is currently
 * working (e.g., a clinic or ward).
 *
 * @returns A Promise that resolves with the SessionLocation object, or `undefined`
 *   if no session location is set.
 *
 * @example
 * ```ts
 * import { getSessionLocation } from '@egen/esm-api';
 * const location = await getSessionLocation();
 * if (location) {
 *   console.log('Current location:', location.display);
 * }
 * ```
 */
export declare function getSessionLocation(): Promise<SessionLocation>;
/**
 * Sets the session location for the current user. The session location represents
 * the physical location where the user is working (e.g., a clinic or ward).
 * This triggers a server request to update the session and refreshes the local
 * session store.
 *
 * @param locationUuid The UUID of the location to set as the session location.
 * @param abortController An AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the updated SessionStore.
 *
 * @example
 * ```ts
 * import { setSessionLocation } from '@egen/esm-api';
 * const abortController = new AbortController();
 * await setSessionLocation('location-uuid-here', abortController);
 * ```
 */
export declare function setSessionLocation(locationUuid: string, abortController: AbortController): Promise<any>;
/**
 * Updates the user properties for a specific user. User properties are key-value
 * pairs that store user-specific settings and preferences. After updating the
 * properties on the server, the current user session is refetched to reflect
 * the changes.
 *
 * @param userUuid The UUID of the user whose properties should be updated.
 * @param userProperties An object containing the properties to set or update.
 * @param abortController Optional AbortController to allow cancellation of the request.
 *   If not provided, a new AbortController is created.
 * @returns A Promise that resolves with the updated SessionStore after refetching
 *   the current user.
 *
 * @example
 * ```ts
 * import { getLoggedInUser, setUserProperties } from '@egen/esm-api';
 * const user = await getLoggedInUser();
 * await setUserProperties(user.uuid, {
 *   defaultLocale: 'en_GB',
 *   customSetting: 'value'
 * });
 * ```
 */
export declare function setUserProperties(userUuid: string, userProperties: {
    [x: string]: string;
}, abortController?: AbortController): Promise<SessionStore>;
//# sourceMappingURL=current-user.d.ts.map