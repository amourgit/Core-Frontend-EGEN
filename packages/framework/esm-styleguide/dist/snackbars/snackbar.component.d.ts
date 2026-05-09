/** @module @category UI */
import React from 'react';
export interface SnackbarProps {
    snackbar: SnackbarMeta;
    closeSnackbar(): void;
}
export interface SnackbarDescriptor {
    actionButtonLabel?: string;
    isLowContrast?: boolean;
    kind?: SnackbarType | string;
    onActionButtonClick?: () => void;
    progressActionLabel?: string;
    subtitle?: React.ReactNode;
    timeoutInMs?: number;
    autoClose?: boolean;
    title: string;
}
export interface SnackbarMeta extends SnackbarDescriptor {
    id: number;
}
export type SnackbarType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
export declare const Snackbar: React.FC<SnackbarProps>;
//# sourceMappingURL=snackbar.component.d.ts.map