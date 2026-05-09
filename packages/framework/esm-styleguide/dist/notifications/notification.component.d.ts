import React from 'react';
/** @module @category UI */
export interface NotificationProps {
    notification: InlineNotificationMeta;
}
export interface NotificationDescriptor {
    description: string;
    action?: string;
    kind?: InlineNotificationType;
    critical?: boolean;
    millis?: number;
    title?: string;
    onAction?: () => void;
}
export interface InlineNotificationMeta extends NotificationDescriptor {
    id: number;
}
export type InlineNotificationType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
export declare const Notification: React.FC<NotificationProps>;
//# sourceMappingURL=notification.component.d.ts.map