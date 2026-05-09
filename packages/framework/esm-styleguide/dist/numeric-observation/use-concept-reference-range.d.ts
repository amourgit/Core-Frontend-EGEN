import type { ObsReferenceRanges } from './interpretation-utils';
export interface UseConceptReferenceRangeResult {
    referenceRange: ObsReferenceRanges | undefined;
    error?: Error;
    isLoading: boolean;
}
/**
 * Hook to fetch concept reference range from EGEN REST API
 * @param conceptUuid - The UUID of the concept to fetch reference range for
 * @returns Reference range data, loading state, and error
 */
export declare function useConceptReferenceRange(conceptUuid: string | undefined, patientUuid: string | undefined): UseConceptReferenceRangeResult;
//# sourceMappingURL=use-concept-reference-range.d.ts.map