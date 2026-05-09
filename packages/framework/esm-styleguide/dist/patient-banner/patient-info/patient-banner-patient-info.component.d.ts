interface PatientBannerPatientInfoProps {
    patient: fhir.Patient;
    /**
     * A unique string to identify where the PatientInfo is rendered from.
     * (ex: Patient Chart, search app, etc...). This string is passed into extensions to
     * affect how / if they should be rendered
     */
    renderedFrom?: string;
}
export declare function PatientBannerPatientInfo({ patient, renderedFrom }: PatientBannerPatientInfoProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=patient-banner-patient-info.component.d.ts.map