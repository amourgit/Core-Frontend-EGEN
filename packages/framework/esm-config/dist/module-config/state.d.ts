import { type StoreApi } from 'zustand';
import type { Config, ConfigObject, ConfigSchema, ExtensionSlotConfig, ProvidedConfig } from '../types';
/**
 * Internal store
 *   A store of the inputs and internal state
 * @internal
 */
export interface ConfigInternalStore {
    /** Configs added using the `provide` function */
    providedConfigs: Array<ProvidedConfig>;
    /** An object with module names for keys and schemas for values */
    schemas: Record<string, ConfigSchema>;
    /**
     * Before modules are loaded, they get implicit schemas added to `schemas`. Therefore
     * we need to track separately whether they have actually been loaded (that is,
     * whether the schema has actually been defined).
     */
    moduleLoaded: Record<string, boolean>;
}
/**
 * @internal
 */
export declare const configInternalStore: StoreApi<ConfigInternalStore>;
/**
 * Temporary config
 *   LocalStorage-based config used by the implementer tools
 * @internal
 */
export interface TemporaryConfigStore {
    config: Config;
}
/** @internal */
export declare const temporaryConfigStore: StoreApi<TemporaryConfigStore>;
/**
 * Config-side extension store
 *   Just what esm-config needs to know about extension state. This
 *   is to avoid having esm-config depend on esm-extensions, which would
 *   create a circular dependency.
 * @internal
 */
export interface ConfigExtensionStore {
    mountedExtensions: Array<ConfigExtensionStoreElement>;
}
/** @internal */
export interface ConfigExtensionStoreElement {
    slotModuleName: string;
    extensionModuleName: string;
    slotName: string;
    extensionId: string;
}
/** @internal */
export declare const configExtensionStore: StoreApi<ConfigExtensionStore>;
/**
 * Output configs
 *
 * Each module has its own stores for its config and its extension slots' configs.
 * @internal
 */
export interface ConfigStore {
    config: ConfigObject | null;
    loaded: boolean;
    translationOverridesLoaded: boolean;
}
/**
 * Returns the configuration store for a specific module. Each module has its
 * own store that tracks the loading state and resolved configuration values.
 *
 * @param moduleName The name of the module whose config store to retrieve.
 * @returns A Zustand store containing the module's configuration state.
 *
 * @internal
 */
export declare function getConfigStore(moduleName: string): StoreApi<ConfigStore>;
/**
 * Configuration for all the specific extension slots
 * @internal
 */
export interface ExtensionSlotsConfigStore {
    slots: {
        [slotName: string]: {
            config: ExtensionSlotConfig;
            loaded: boolean;
        };
    };
}
/** @internal */
export declare function getExtensionSlotsConfigStore(): StoreApi<ExtensionSlotsConfigStore>;
/** @internal */
export declare function getExtensionSlotConfig(slotName: string): {
    config: ExtensionSlotConfig;
    loaded: boolean;
};
/** @internal */
export declare function getExtensionSlotConfigFromStore(state: ExtensionSlotsConfigStore, slotName: string): {
    config: ExtensionSlotConfig;
    loaded: boolean;
};
/** @internal */
export interface ExtensionsConfigStore {
    configs: {
        [slotName: string]: {
            [extensionId: string]: ConfigStore;
        };
    };
}
/**
 * One store for all the extensions
 * @internal
 */
export declare function getExtensionsConfigStore(): StoreApi<ExtensionsConfigStore>;
/** @internal */
export declare function getExtensionConfig(slotName: string, extensionId: string): StoreApi<Omit<ConfigStore, 'translationOverridesLoaded'>>;
/** @internal */
export declare function getExtensionConfigFromStore(state: ExtensionsConfigStore, slotName: string, extensionId: string): ConfigStore | {
    loaded: false;
    config: any;
};
/** @internal */
export declare function getExtensionConfigFromExtensionSlotStore(state: ExtensionSlotConfig, slotName: string, extensionId: string): object;
/**
 * A store of the implementer tools output config
 * @internal
 */
export interface ImplementerToolsConfigStore {
    config: Config;
}
/** @internal */
export declare const implementerToolsConfigStore: StoreApi<ImplementerToolsConfigStore>;
//# sourceMappingURL=state.d.ts.map