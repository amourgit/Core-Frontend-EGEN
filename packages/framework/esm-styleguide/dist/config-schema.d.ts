import { type ConfigSchema } from '@egen/esm-config';
import { type CarbonTagColor } from './utils';
export interface StyleguideConfigObject {
    'Brand color #1': string;
    'Brand color #2': string;
    'Brand color #3': string;
    excludePatientIdentifierCodeTypes: {
        uuids: Array<string>;
    };
    implementationName: string;
    patientPhotoConceptUuid: string;
    preferredCalendar: {
        [key: string]: string;
    };
    preferredDateLocale: {
        [key: string]: string;
    };
    diagnosisTags: {
        primaryColor: CarbonTagColor;
        secondaryColor: CarbonTagColor;
    };
}
export declare const esmStyleGuideSchema: ConfigSchema;
//# sourceMappingURL=config-schema.d.ts.map