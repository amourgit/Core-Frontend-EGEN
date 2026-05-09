/** @module @category Extension */
import { type AssignedExtension, type ExtensionInternalStore, type ExtensionRegistration, type ExtensionSlotCustomState } from './store';
/**
 * Given an extension ID, which is a string uniquely identifying
 * an instance of an extension within an extension slot, this
 * returns the extension name.
 *
 * @example
 * ```js
 * getExtensionNameFromId("foo#bar")
 *  --> "foo"
 * getExtensionNameFromId("baz")
 *  --> "baz"
 * ```
 */
export declare function getExtensionNameFromId(extensionId: string): string;
export declare function getExtensionRegistrationFrom(state: ExtensionInternalStore, extensionId: string): ExtensionRegistration | undefined;
export declare function getExtensionRegistration(extensionId: string): ExtensionRegistration | undefined;
/**
 * Extensions must be registered in order to be rendered.
 * This is handled by the app shell, when extensions are provided
 * via the `routes.json` file and registered through `registerApp()`.
 * @internal
 */
export declare const registerExtension: (extensionRegistration: ExtensionRegistration) => void;
/**
 * Attach an extension to an extension slot.
 *
 * This will cause the extension to be rendered into the specified
 * extension slot, unless it is removed by configuration. Using
 * `attach` is an alternative to specifying the `slot` or `slots`
 * in the extension declaration.
 *
 * It is particularly useful when creating a slot into which
 * you want to render an existing extension. This enables you
 * to do so without modifying the extension's declaration, which
 * may be impractical or inappropriate, for example if you are
 * writing a module for a specific implementation.
 *
 * @param slotName a name uniquely identifying the slot
 * @param extensionId an extension name, with an optional #-suffix
 *    to distinguish it from other instances of the same extension
 *    attached to the same slot.
 */
export declare function attach(slotName: string, extensionId: string): void;
/**
 * Detaches an extension from an extension slot.
 *
 * @param extensionSlotName The name of the extension slot to detach from.
 * @param extensionId The ID of the extension to detach.
 *
 * @deprecated Avoid using this. Extension attachments should be considered declarative.
 */
export declare function detach(extensionSlotName: string, extensionId: string): void;
/**
 * Detaches all extensions from an extension slot.
 *
 * @param extensionSlotName The name of the extension slot to clear.
 *
 * @deprecated Avoid using this. Extension attachments should be considered declarative.
 */
export declare function detachAll(extensionSlotName: string): void;
/**
 * Gets the list of extensions assigned to a given slot
 *
 * @param slotName The slot to load the assigned extensions for
 * @returns An array of extensions assigned to the named slot
 */
export declare function getAssignedExtensions(slotName: string): Array<AssignedExtension>;
/**
 * Used by by extension slots at mount time.
 *
 * @param moduleName The name of the module that contains the extension slot
 * @param slotName The extension slot name that is actually used
 * @param state Optional custom state for the slot, which will be stored in the extension store.
 * @internal
 */
export declare const registerExtensionSlot: (moduleName: string, slotName: string, state?: ExtensionSlotCustomState) => void;
/**
 * Used by extension slots to update the copy of the state for the extension slot
 *
 * @param slotName The name of the slot with state to update
 * @param state A copy of the new state
 * @param partial Whether this should be applied as a partial
 */
export declare function updateExtensionSlotState(slotName: string, state: ExtensionSlotCustomState, partial?: boolean): void;
/**
 * @internal
 * Just for testing.
 */
export declare const reset: () => void;
//# sourceMappingURL=extensions.d.ts.map