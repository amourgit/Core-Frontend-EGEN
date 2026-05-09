import React from 'react';
export interface CardHeaderProps {
    /** The title for this card. This must be a pre-translated string. */
    title: string;
    /** The contents of the card header to render if any. */
    children?: React.ReactNode;
}
/**
 * Re-usable header component for O3-style cards, like those found on the patient chart
 */
export declare function CardHeader({ title, children }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=card-header.component.d.ts.map