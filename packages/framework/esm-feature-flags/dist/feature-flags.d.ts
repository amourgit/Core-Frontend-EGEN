export interface FeatureFlagsStore {
    flags: {
        [flagName: string]: FeatureFlag;
    };
}
export interface FeatureFlag {
    enabled: boolean;
    label: string;
    description: string;
}
/** @internal */
export declare const featureFlagsStore: import("zustand/vanilla").StoreApi<FeatureFlagsStore>;
/**
 * This function creates a feature flag. Call it in top-level code anywhere. It will
 * not reset whether the flag is enabled or not, so it's safe to call it multiple times.
 * Once a feature flag is created, it will appear with a toggle in the Implementer Tools.
 * It can then be used to turn on or off features in the code.
 *
 * @param flagName A code-friendly name for the flag, which will be used to reference it in code
 * @param label A human-friendly name which will be displayed in the Implementer Tools
 * @param description An explanation of what the flag does, which will be displayed in the Implementer Tools
 */
export declare function registerFeatureFlag(flagName: string, label: string, description: string): void;
/**
 * This function removes feature flags from local storage that no longer exist in the current state.
 */
export declare function cleanupObsoleteFeatureFlags(): void;
/**
 * Use this function to access the current value of the feature flag.
 *
 * If you are using React, use `useFeatureFlag` instead.
 *
 * @param flagName The name of the feature flag to check.
 * @returns `true` if the feature flag is enabled, `false` otherwise.
 */
export declare function getFeatureFlag(flagName: string): boolean;
/**
 * Use this function to subscribe to the value of the feature flag.
 * The callback will be invoked immediately with the current value and
 * again whenever the flag value changes.
 *
 * If you are using React, use `useFeatureFlag` instead.
 *
 * @param flagName The name of the feature flag to subscribe to.
 * @param callback A function that will be called with the current flag value.
 */
export declare function subscribeToFeatureFlag(flagName: string, callback: (value: boolean) => void): void;
/** @internal for Implementer Tools */
export declare function setFeatureFlag(flagName: string, value: boolean): void;
//# sourceMappingURL=feature-flags.d.ts.map