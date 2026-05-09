import type { Config, ConfigObject, ConfigSchema } from '../types';
/**
 * This defines a configuration schema for a module. The schema tells the
 * configuration system how the module can be configured. It specifies
 * what makes configuration valid or invalid.
 *
 * See [Configuration System](https://docs.iam-central.ga/docs/configuration-system)
 * for more information about defining a config schema.
 *
 * @param moduleName Name of the module the schema is being defined for. Generally
 *   should be the one in which the `defineConfigSchema` call takes place.
 * @param schema The config schema for the module
 */
export declare function defineConfigSchema(moduleName: string, schema: ConfigSchema): void;
/**
 * This alerts the configuration system that a module exists. This allows config to be
 * processed, while still allowing the extension system to know whether the module has
 * actually had its front bundle executed yet.
 *
 * This should only be used in esm-app-shell.
 *
 * @internal
 * @param moduleName
 */
export declare function registerModuleWithConfigSystem(moduleName: string): void;
/**
 * This alerts the configuration system that a module has been loaded.
 *
 * This should only be used in esm-app-shell.
 *
 * @internal
 * @param moduleName
 */
export declare function registerModuleLoad(moduleName: string): void;
/**
 * This allows the config system to support translation overrides for namespaces that
 * do not correspond to modules.
 *
 * This should only be used in esm-app-shell.
 *
 * @internal
 * @param namespace
 */
export declare function registerTranslationNamespace(namespace: string): void;
/**
 * This defines a configuration schema for an extension. When a schema is defined
 * for an extension, that extension will receive the configuration corresponding
 * to that schema, rather than the configuration corresponding to the module
 * in which it is defined.
 *
 * The schema tells the configuration system how the module can be configured.
 * It specifies what makes configuration valid or invalid.
 *
 * See [Configuration System](https://docs.iam-central.ga/docs/configuration-system)
 * for more information about defining a config schema.
 *
 * @param extensionName Name of the extension the schema is being defined for.
 *   Should match the `name` of one of the `extensions` entries defined in
 *   the app's `routes.json` file.
 * @param schema The config schema for the extension
 */
export declare function defineExtensionConfigSchema(extensionName: string, schema: ConfigSchema): void;
/**
 * Provides configuration values programmatically. This is an alternative to
 * providing configuration through the config-file. Configuration provided this
 * way will be merged with configuration from other sources.
 *
 * @param config A configuration object to merge into the existing configuration.
 * @param sourceName An optional name to identify the source of this configuration,
 *   used for debugging purposes. Defaults to 'provided'.
 */
export declare function provide(config: Config, sourceName?: string): void;
/**
 * A promise-based way to access the config as soon as it is fully loaded.
 * If it is already loaded, resolves the config in its present state.
 *
 * This is a useful function if you need to get the config in the course
 * of the execution of a function.
 *
 * @param moduleName The name of the module for which to look up the config
 */
export declare function getConfig<T = Record<string, any>>(moduleName: string): Promise<T>;
/**
 * Retrieves translation overrides for an extension, optionally scoped to a specific
 * extension slot. When called with only a module name, retrieves module-level overrides.
 * Translation overrides allow customizing translated strings without modifying the
 * original translation files.
 *
 * @param moduleName The name of the module providing the translation context.
 * @param slotName Optional extension slot name to include slot-specific overrides.
 * @param extensionId Optional extension ID to include extension-specific overrides.
 * @returns A Promise resolving to an array of translation override objects.
 *
 * @internal
 */
export declare function getTranslationOverrides(moduleName: string, slotName?: string, extensionId?: string): Promise<Array<Record<string, Record<string, string>>>>;
/**
 * Validate and interpolate defaults for `providedConfig` according to `schema`
 *
 * @param schema  a configuration schema
 * @param providedConfig  an object of config values (without the top-level module name)
 * @param keyPathContext  a dot-separated string which helps the user figure out where
 *     the provided config came from
 * @returns The validated and processed configuration object with defaults applied.
 * @internal
 */
export declare function processConfig(schema: ConfigSchema, providedConfig: ConfigObject, keyPathContext: string): Config;
/**
 * Normally, configuration errors are only displayed once. This function clears the list of
 * displayed errors, so that they will be displayed again.
 *
 * @internal
 */
export declare function clearConfigErrors(keyPath?: string): void;
/**
 * Cleans up all config store subscriptions and re-establishes them. This is primarily
 * useful for testing, where subscriptions set up at module load time need to be cleared
 * between tests to prevent infinite update loops. After clearing, subscriptions are
 * re-established so the config system continues to work normally.
 *
 * @internal
 */
export declare function resetConfigSystem(): void;
//# sourceMappingURL=module-config.d.ts.map