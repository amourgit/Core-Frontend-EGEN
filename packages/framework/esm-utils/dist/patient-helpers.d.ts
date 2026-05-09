/** @module @category Utility */
import { type NameUse } from '@egen/esm-globals';
/**
 * Gets the formatted display name for a patient.
 *
 * The display name will be taken from the patient's 'usual' name,
 * or may fall back to the patient's 'official' name.
 *
 * @param patient The patient details in FHIR format.
 * @returns The patient's display name or an empty string if name is not present.
 */
export declare function getPatientName(patient: fhir.Patient): string;
/** @deprecated Use `getPatientName` */
export declare function displayName(patient: fhir.Patient): string;
/**
 * Get a formatted display string for an FHIR name.
 * @param name The name to be formatted.
 * @returns The formatted display name or an empty string if name is undefined.
 */
export declare function formatPatientName(name: fhir.HumanName | undefined): string;
/** @deprecated Use `formatPatientName` */
export declare function formattedName(name: fhir.HumanName | undefined): string;
/**
 * Select the preferred name from the collection of names associated with a patient.
 *
 * Names may be specified with a usage such as 'usual', 'official', 'nickname', 'maiden', etc.
 * A name with no usage specified is treated as the 'usual' name.
 *
 * The chosen name will be selected according to the priority order of `preferredNames`.
 *
 * @param patient The patient from whom a name will be selected.
 * @param preferredNames Optional ordered sequence of preferred name usages; defaults to 'usual' if not specified.
 * @returns The preferred name for the patient, or undefined if no acceptable name could be found.
 *
 * @example
 * ```ts
 * // normal use case; prefer usual name, fallback to official name
 * selectPreferredName(patient, 'usual', 'official')
 *
 * // prefer usual name over nickname, fallback to official name
 * selectPreferredName(patient, 'usual', 'nickname', 'official')
 * ```
 */
export declare function selectPreferredName(patient: fhir.Patient, ...preferredNames: NameUse[]): fhir.HumanName | undefined;
//# sourceMappingURL=patient-helpers.d.ts.map