import type { NotificationDescriptor } from './notification.component';
import type { ActionableNotificationDescriptor } from './actionable-notification.component';
/**
 * Starts a rendering host for inline notifications. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the inline notifications.
 */
export declare function renderInlineNotifications(target: HTMLElement | null): void;
/**
 * Displays an inline notification in the UI.
 * @param notification The description of the notification to display.
 */
export declare function showNotification(notification: NotificationDescriptor): void;
export declare function renderActionableNotifications(target: HTMLElement | null): void;
/**
 * Displays an actionable notification in the UI.
 * @param notification The description of the notification to display.
 */
export declare function showActionableNotification(notification: ActionableNotificationDescriptor): void;
//# sourceMappingURL=index.d.ts.map