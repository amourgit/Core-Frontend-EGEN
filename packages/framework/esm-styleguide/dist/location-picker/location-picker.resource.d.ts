import { type FetchResponse } from '@egen/esm-api';
import { type FHIRLocationResource } from '@egen/esm-egen-api';
export interface LocationResponse {
    type: string;
    total: number;
    resourceType: string;
    meta: {
        lastUpdated: string;
    };
    link: Array<{
        relation: string;
        url: string;
    }>;
    id: string;
    entry: Array<FHIRLocationResource>;
}
export interface LoginLocationData {
    locations: Array<FHIRLocationResource>;
    isLoading: boolean;
    totalResults?: number;
    hasMore: boolean;
    loadingNewData: boolean;
    error: Error | null;
    setPage: (size: number | ((_size: number) => number)) => Promise<FetchResponse<LocationResponse>[] | undefined>;
}
/**
 * A React hook that fetches a location by its UUID using the FHIR API.
 *
 * @param locationUuid Optional UUID of the location to fetch. If not provided,
 *   the hook returns null for the location without making a request.
 * @returns An object containing the location data, loading state, and any error.
 *
 * @category API
 */
export declare function useLocationByUuid(locationUuid?: string): {
    location: FHIRLocationResource;
    error: any;
    isLoading: boolean;
};
/**
 * A React hook that fetches locations from the FHIR API with support for
 * pagination, filtering by tag, and searching by name. Uses SWR infinite
 * loading for efficient pagination.
 *
 * @param locationTag Optional tag to filter locations (e.g., 'Login Location').
 * @param count The number of locations to fetch per page. Defaults to 0 (no limit).
 * @param searchQuery Optional search string to filter locations by name.
 * @returns An object containing the locations array, loading states, pagination info, and any error.
 *
 * @category API
 */
export declare function useLocations(locationTag?: string, count?: number, searchQuery?: string): LoginLocationData;
//# sourceMappingURL=location-picker.resource.d.ts.map