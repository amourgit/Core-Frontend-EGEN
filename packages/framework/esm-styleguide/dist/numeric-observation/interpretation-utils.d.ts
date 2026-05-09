declare const backendObservationInterpretations: readonly ["NORMAL", "HIGH", "CRITICALLY_HIGH", "OFF_SCALE_HIGH", "LOW", "CRITICALLY_LOW", "OFF_SCALE_LOW"];
declare const observationInterpretations: readonly ["critically_low", "critically_high", "high", "low", "normal", "off_scale_low", "off_scale_high"];
export type OBSERVATION_INTERPRETATION = (typeof backendObservationInterpretations)[number];
export type ObservationInterpretation = (typeof observationInterpretations)[number];
/**
 * Reference range values for calculating interpretation
 */
export type ReferenceRangeValue = number | null | undefined;
export interface ObsReferenceRanges {
    hiAbsolute: ReferenceRangeValue;
    hiCritical: ReferenceRangeValue;
    hiNormal: ReferenceRangeValue;
    lowNormal: ReferenceRangeValue;
    lowCritical: ReferenceRangeValue;
    lowAbsolute: ReferenceRangeValue;
}
/**
 * Normalizes interpretation between lowercase (ObservationInterpretation) and uppercase (OBSERVATION_INTERPRETATION) formats
 */
export declare function normalizeInterpretation(interpretation: ObservationInterpretation | OBSERVATION_INTERPRETATION | '--' | undefined): ObservationInterpretation | undefined;
/**
 * Calculates interpretation from a numeric value and reference range
 * Returns lowercase ObservationInterpretation format
 */
export declare function calculateInterpretation(value: string | number | undefined, range?: ObsReferenceRanges): ObservationInterpretation;
export {};
//# sourceMappingURL=interpretation-utils.d.ts.map