import React from 'react';
export interface ErrorStateProps {
    /** The error that caused this error card to be rendered. Expected to be a failed fetch result. */
    error: any;
    /** The title to use for this empty component. This must be a pre-translated string. */
    headerTitle: string;
}
export declare const ErrorState: React.FC<ErrorStateProps>;
export declare const ErrorCard: React.FC<ErrorStateProps>;
export type ErrorCardProps = ErrorStateProps;
//# sourceMappingURL=error-state.component.d.ts.map