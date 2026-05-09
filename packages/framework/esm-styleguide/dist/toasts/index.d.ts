import type { ToastDescriptor } from './toast.component';
export { type ToastDescriptor, type ToastType, type ToastNotificationMeta } from './toast.component';
/**
 * Starts a rendering host for toast notifications. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the toast notifications.
 */
export declare function renderToasts(target: HTMLElement | null): void;
/**
 * Displays a toast notification in the UI.
 * @param toast The description of the toast to display.
 */
export declare function showToast(toast: ToastDescriptor): void;
//# sourceMappingURL=index.d.ts.map