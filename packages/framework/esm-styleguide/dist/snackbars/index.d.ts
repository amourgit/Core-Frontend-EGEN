import type { SnackbarDescriptor } from './snackbar.component';
export { type SnackbarDescriptor, type SnackbarType, type SnackbarMeta } from './snackbar.component';
/**
 * Starts a rendering host for snack bar notifications. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the snack bar notifications.
 */
export declare function renderSnackbars(target: HTMLElement | null): void;
/**
 * Displays a snack bar notification in the UI.
 * @param snackbar The description of the snack bar to display.
 */
export declare function showSnackbar(snackbar: SnackbarDescriptor): void;
//# sourceMappingURL=index.d.ts.map