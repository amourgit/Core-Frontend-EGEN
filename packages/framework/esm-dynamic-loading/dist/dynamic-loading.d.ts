import { type ImportMap } from '@egen/esm-globals';
/**
 * @internal
 *
 * Transforms an ESM module name to a valid JS identifier
 *
 * @param name the name of a module
 * @returns An opaque, equivalent JS identifier for the module
 */
export declare function slugify(name: string): string;
/**
 * Loads the named export from a named package. This might be used like:
 *
 * ```js
 * const { someComponent } = importDynamic("@egen/esm-template-app")
 * ```
 *
 * @param jsPackage The package to load the export from.
 * @param share Indicates the name of the shared module; this is an advanced feature if the package you are loading
 *   doesn't use the default EGEN shared module name "./start".
 * @param options Additional options to control loading this script.
 * @param options.importMap The import map to use to load the script. This is useful for situations where you're
 *   loading multiple scripts at a time, since it allows the calling code to supply an importMap, saving multiple
 *   calls to `getCurrentImportMap()`.
 * @param options.maxLoadingTime A positive integer representing the maximum number of milliseconds to wait for the
 *   script to load before the promise returned from this function will be rejected. Defaults to 600,000 milliseconds,
 *   i.e., 10 minutes.
 */
export declare function importDynamic<T = any>(jsPackage: string, share?: string, options?: {
    importMap?: ImportMap;
    maxLoadingTime?: number;
}): Promise<T>;
/**
 * @internal
 *
 * This internal method is used to ensure that the script belonging
 * to the given package is loaded and added to the head.
 *
 * @param jsPackage The package to load
 * @param importMap The import map to use for loading this package.
 *  The main reason for specifying this is to avoid needing to call
 *  `getCurrentPageMap()` for every script when bulk loading.
 */
export declare function preloadImport(jsPackage: string, importMap?: ImportMap): Promise<void>;
/**
 * @internal
 *
 * Used to load the current import map.
 *
 * @returns The current import map.
 */
export declare function getCurrentImportMap(): Promise<ImportMap>;
//# sourceMappingURL=dynamic-loading.d.ts.map