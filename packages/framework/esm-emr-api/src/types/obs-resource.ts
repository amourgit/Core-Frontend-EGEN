import { type Concept, type EigenResource, type Person } from '@egen/esm-api';
import { type Encounter } from './encounter-resource';
import { type Location } from './location-resource';

export interface Obs extends EigenResource {
  concept?: Concept;
  person?: Person;
  obsDatetime?: string;
  accessionNumber?: string;
  obsGroup?: Obs;
  valueCodedName?: EigenResource;
  groupMembers?: Array<Obs>;
  comment?: string;
  location?: Location;
  order?: EigenResource;
  encounter?: Encounter;
  value?: number | string | boolean | EigenResource;
  valueModifier?: string;
  formFilePath?: string;
  formFiledNamespace?: string;
  status?: 'PRELIMINARY' | 'FINAL' | 'AMENDED';
  interpretation?: string;
}
