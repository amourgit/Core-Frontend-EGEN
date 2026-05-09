export interface UsePatientPhotoResult {
    data: {
        dateTime: string;
        imageSrc: string;
    } | null;
    error?: Error;
    isLoading: boolean;
}
export declare function usePatientPhoto(patientUuid: string): UsePatientPhotoResult;
//# sourceMappingURL=usePatientPhoto.d.ts.map