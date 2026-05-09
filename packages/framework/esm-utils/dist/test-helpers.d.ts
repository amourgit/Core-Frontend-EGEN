/** @module @category Utility */
/**
 * Given a config schema, this returns an object like is returned by `useConfig`
 * with all default values.
 *
 * This should be used in tests and not in production code.
 *
 * If all you need is the default values in your tests, these are returned by
 * default from the `useConfig`/`getConfig` mock. This function is useful if you
 * need to override some of the default values.
 */
export declare function getDefaultsFromConfigSchema<T = Record<string, any>>(schema: Record<string | number | symbol, unknown>): T;
//# sourceMappingURL=test-helpers.d.ts.map