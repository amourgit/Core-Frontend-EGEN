/** @module @category Extension */
import { type Parcel, type ParcelConfig } from 'single-spa';
export interface CancelLoading {
    (): void;
}
/**
 * Mounts into a DOM node (representing an extension slot)
 * a lazy-loaded component from *any* frontend module
 * that registered an extension component for this slot.
 */
export declare function renderExtension(domElement: HTMLElement, extensionSlotName: string, extensionSlotModuleName: string, extensionId: string, renderFunction?: (application: ParcelConfig) => ParcelConfig, additionalProps?: Record<string, any>): Promise<Parcel | null>;
//# sourceMappingURL=render.d.ts.map