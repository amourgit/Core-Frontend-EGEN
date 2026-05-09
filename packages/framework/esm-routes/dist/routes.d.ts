/** @module @category Routes Utilities */
import type { EgenAppRoutes, EgenRoutes } from '@egen/esm-globals';
/**
 * Used to add a route override to local storage. These are read as the routes registry
 * is assembled, so the app must be reloaded for new overrides to take effect.
 *
 * @internal
 * @param moduleName The name of the module the routes are for
 * @param routes Either an {@link EgenAppRoutes} object, a string that represents a JSON
 *  version of an {@link EgenAppRoutes} object or a string or URL that resolves to a
 *  JSON document that represents an {@link EgenAppRoutes} object
 */
export declare function addRoutesOverride(moduleName: string, routes: EgenAppRoutes | string | URL): void;
/**
 * Used to remove an existing routes override from local storage. These are read as the routes registry
 * is assembled, so the app must be reloaded for removed override to be removed.
 *
 * @internal
 * @param moduleName The module to remove the overrides for
 */
export declare function removeRoutesOverride(moduleName: string): void;
/**
 * Used to remove all existing routes overrides from local storage. These are read as the routes registry
 * is assembled, so the app must be reloaded for the removed overrides to appear to be removed.
 *
 * @internal
 */
export declare function resetAllRoutesOverrides(): void;
/**
 * Simple type-predicate to ensure that the value can be treated as an EgenAppRoutes
 * object.
 *
 * @internal
 * @param routes the object to check to see if it is an EgenAppRoutes object
 * @returns true if the routes value is an EgenAppRoutes
 */
export declare function isEgenAppRoutes(routes: EgenAppRoutes | unknown): routes is EgenAppRoutes;
/**
 * Simple type-predicate to ensure that the value can be treated as an EgenRoutes
 * object.
 *
 * @internal
 * @param routes the object to check to see if it is an EgenRoutes object
 * @returns true if the routes value is an EgenRoutes
 */
export declare function isEgenRoutes(routes: EgenRoutes | unknown): routes is EgenRoutes;
//# sourceMappingURL=routes.d.ts.map