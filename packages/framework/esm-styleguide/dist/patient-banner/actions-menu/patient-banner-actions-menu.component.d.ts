export interface PatientBannerActionsMenuProps {
    patient: fhir.Patient;
    patientUuid: string;
    actionsSlotName: string;
    /**
     * Parts of the actions slot extension state that don't really make sense go in this object,
     * so as to keep the PatientBannerActionsMenu API clean.
     */
    additionalActionsSlotState?: object;
}
/**
 * Overflow menu for the patient banner whose items come from an ExtensionSlot
 * rather than direct React children. Because cloneElement cannot inject props
 * into extension-rendered components, arrow key navigation is handled at the
 * container level via onKeyDown instead of delegating to Carbon's OverflowMenuItem.
 */
export declare function PatientBannerActionsMenu({ patient, patientUuid, actionsSlotName, additionalActionsSlotState, }: PatientBannerActionsMenuProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=patient-banner-actions-menu.component.d.ts.map