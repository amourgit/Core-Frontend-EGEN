import React from 'react';
/** @module @category UI */
export interface ActionableNotificationProps {
    notification: ActionableNotificationMeta;
}
export interface ActionableNotificationDescriptor {
    actionButtonLabel: string;
    onActionButtonClick(): void;
    onClose?(): void;
    subtitle: string;
    title?: string;
    kind?: ActionableNotificationType | string;
    critical?: boolean;
    progressActionLabel?: string;
}
export interface ActionableNotificationMeta extends ActionableNotificationDescriptor {
    id: number;
}
export type ActionableNotificationType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
export declare const ActionableNotificationComponent: React.FC<ActionableNotificationProps>;
//# sourceMappingURL=actionable-notification.component.d.ts.map