/** @module @category UI */
import React from 'react';
export interface ToastProps {
    toast: ToastNotificationMeta;
    closeToast(): void;
}
export interface ToastDescriptor {
    description: React.ReactNode;
    onActionButtonClick?: () => void;
    actionButtonLabel?: string;
    kind?: ToastType;
    critical?: boolean;
    title?: string;
}
export interface ToastNotificationMeta extends ToastDescriptor {
    id: number;
}
export type ToastType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
export declare const Toast: React.FC<ToastProps>;
//# sourceMappingURL=toast.component.d.ts.map