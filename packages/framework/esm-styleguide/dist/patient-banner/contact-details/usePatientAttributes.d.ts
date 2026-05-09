/**
 *  React hook that takes patientUuid and return Patient Attributes {@link Attribute}
 * @param patientUuid Unique Patient identifier
 * @returns Object containing `patient-attributes`, `isLoading` loading status, `error`
 */
export declare const usePatientAttributes: (patientUuid: string) => {
    isLoading: boolean;
    attributes: import("./types").Attribute[];
    error: any;
};
/**
 * React hook that takes patientUuid and returns contact details
 * derived from patient attributes using configured attributeTypes.
 *
 * Note: This hook loads configuration from '@egen/esm-patient-banner-app'
 * because the contact attribute types are defined in the patient banner's
 * configuration schema. While this hook lives in esm-styleguide, it serves
 * the patient banner's contact details display.
 *
 * @param patientUuid - Unique patient identifier
 * @returns {Object} Object containing filtered contact attributes, loading status, and error
 * @property {Array} contactAttributes - List of contact-related attributes
 * @property {boolean} isLoading - Loading status
 * @property {Error|null} error - Error object if request fails
 */
export declare const usePatientContactAttributes: (patientUuid: string) => {
    contactAttributes: import("./types").Attribute[];
    isLoading: boolean;
    error: any;
};
//# sourceMappingURL=usePatientAttributes.d.ts.map