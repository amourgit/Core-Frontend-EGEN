/** @module @category UI */
import React from 'react';
import { type ObservationInterpretation, type OBSERVATION_INTERPRETATION, type ObsReferenceRanges } from './interpretation-utils';
export interface NumericObservationProps {
    /** The observation value to display */
    value: string | number;
    /** Unit of measurement */
    unit?: string;
    /** Label for the observation (only shown for card variant)*/
    label?: string;
    /** Pre-calculated interpretation (either ObservationInterpretation or OBSERVATION_INTERPRETATION format) */
    interpretation?: ObservationInterpretation | OBSERVATION_INTERPRETATION;
    /** Reference range for calculating interpretation */
    referenceRange?: ObsReferenceRanges;
    /** Concept UUID to fetch reference range from */
    conceptUuid?: string;
    /**
     * Display style variant, defaults to 'card'
     * - 'card': Card-style container with colored borders and backgrounds, typically used in header/summary views (e.g., vitals header)
     * - 'cell': Table cell styling with background colors, typically used in data tables (e.g., test results table). If using the cell variant inside a Carbon Table Cell, make sure to set the padding to 0.
     */
    variant?: 'card' | 'cell';
    patientUuid: string;
}
/**
 * Generic numeric observation component for displaying numeric observation values with interpretation-based styling.
 * Supports both vitals and test results display patterns.
 */
export declare const NumericObservation: React.FC<NumericObservationProps>;
//# sourceMappingURL=numeric-observation.component.d.ts.map