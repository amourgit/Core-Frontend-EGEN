import React from 'react';
interface LocationPickerProps {
    selectedLocationUuid?: string;
    defaultLocationUuid?: string;
    locationTag?: string;
    locationsPerRequest?: number;
    onChange: (locationUuid?: string) => void;
}
export declare const LocationPicker: React.FC<LocationPickerProps>;
export {};
//# sourceMappingURL=location-picker.component.d.ts.map