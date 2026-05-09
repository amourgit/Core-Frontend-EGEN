export declare function useRelationships(patientUuid: string): {
    data: ExtractedRelationship[];
    error: Error;
    isLoading: boolean;
    isValidating: boolean;
};
interface ExtractedRelationship {
    uuid: string;
    display: string;
    relativeAge: number;
    relativeUuid: string;
    relationshipType: string;
}
export interface Relationship {
    display: string;
    uuid: number;
    personA: {
        uuid: string;
        age: number;
        display: string;
    };
    personB: {
        uuid: string;
        age: number;
        display: string;
    };
    relationshipType: {
        uuid: string;
        display: string;
        aIsToB: string;
        bIsToA: string;
    };
}
export {};
//# sourceMappingURL=useRelationships.d.ts.map