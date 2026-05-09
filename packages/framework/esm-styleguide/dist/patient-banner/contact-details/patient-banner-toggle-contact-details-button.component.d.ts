/** @module @category UI */
import { type MouseEvent } from 'react';
export interface PatientBannerToggleContactDetailsButtonProps {
    /** Whether the contact details are currently being displayed */
    showContactDetails: boolean;
    /** Function called when this button is clicked. */
    toggleContactDetails: (e: MouseEvent) => void;
    /** Passed through to the Carbon Button component */
    className?: string;
}
export declare function PatientBannerToggleContactDetailsButton({ showContactDetails, toggleContactDetails, className, }: PatientBannerToggleContactDetailsButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=patient-banner-toggle-contact-details-button.component.d.ts.map