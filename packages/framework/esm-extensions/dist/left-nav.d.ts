import { type ComponentConfig } from './types';
import { type ExtensionSlotState } from './store';
type LeftNavMode = 'normal' | 'collapsed' | 'hidden';
export interface LeftNavStore {
    slotName: string | null;
    basePath: string;
    mode: LeftNavMode;
    componentContext?: ComponentConfig;
    state?: ExtensionSlotState;
}
/** @internal */
export declare const leftNavStore: import("zustand").StoreApi<LeftNavStore>;
export interface SetLeftNavParams {
    name: string;
    basePath: string;
    /**
     * In normal mode, the left nav is shown in desktop mode, and collapse into hamburger menu button in tablet mode
     * In collapsed mode, the left nav is always collapsed, regardless of desktop / tablet mode.
     * In hidden mode, the left nav is not shown at all.
     */
    mode?: LeftNavMode;
    componentContext?: ComponentConfig;
    state?: ExtensionSlotState;
}
/**
 * Sets the current left nav context. Must be paired with {@link unsetLeftNav}.
 *
 * @deprecated Please use {@link useLeftNav} instead. This function will be made internal in a future release.
 */
export declare function setLeftNav({ name, basePath, mode, componentContext, state }: SetLeftNavParams): void;
/**
 * Unsets the left nav context if the current context is for the supplied name.
 *
 * @deprecated Please use {@link useLeftNav} instead. This function will be made internal in a future release.
 */
export declare function unsetLeftNav(name: string): void;
export {};
//# sourceMappingURL=left-nav.d.ts.map