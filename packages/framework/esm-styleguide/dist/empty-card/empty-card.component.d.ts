import React from 'react';
export interface EmptyCardProps {
    /** The name of the type of item that would be displayed here if not empty. This must be a pre-translated string. */
    displayText: string;
    /** The title to use for this empty component. This must be a pre-translated string. */
    headerTitle: string;
    /** A callback to invoke when the user tries to record a new item. */
    launchForm?(): void;
}
export declare const EmptyCardIllustration: ({ width, height }: {
    width?: string;
    height?: string;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Re-usable card for displaying an empty state
 */
export declare const EmptyCard: React.FC<EmptyCardProps>;
//# sourceMappingURL=empty-card.component.d.ts.map