type ModalSize = 'xs' | 'sm' | 'md' | 'lg';
export interface ModalProps {
    size?: ModalSize;
    [key: string]: unknown;
}
/**
 * @internal
 * Sets up the modals system. Should be called in the app shell during initialization.
 */
export declare function setupModals(modalContainer: HTMLElement | null): void;
/**
 * Shows a modal dialog.
 *
 * The modal must have been registered by name. This should be done in the `routes.json` file of the
 * app that defines the modal. Note that both the `<ModalHeader>` and `<ModalBody>` should be at the
 * top level of the modal component (wrapped in a React.Fragment), or else the content of the modal
 * body might not vertical-scroll properly.
 *
 * @param modalName The name of the modal to show.
 * @param props The optional props to provide to the modal.
 * @param onClose The optional callback to call when the modal is closed.
 * @returns The dispose function to force closing the modal dialog.
 */
export declare function showModal(modalName: string, props?: ModalProps, onClose?: () => void): () => void;
export {};
//# sourceMappingURL=index.d.ts.map