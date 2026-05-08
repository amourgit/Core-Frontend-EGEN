import { type EigenResource } from '@egen/esm-api';
import { type Diagnosis } from './diagnosis-resource';
import { type Location } from './location-resource';
import { type Obs } from './obs-resource';
import { type Patient } from './patient-resource';
import { type Visit } from './visit-resource';

// TODO: make this extends EigenResourceStrict
export interface Encounter extends EigenResource {
  encounterDatetime?: string;
  patient?: Patient;
  location?: Location;
  encounterType?: EncounterType;
  obs?: Array<Obs>;
  visit?: Visit;
  encounterProviders?: Array<EncounterProvider>;
  diagnoses?: Array<Diagnosis>;
  form?: EigenResource;
}

export interface EncounterType extends EigenResource {
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface EncounterProvider extends EigenResource {
  provider?: EigenResource;
  encounterRole?: EncounterRole;
}

export interface EncounterRole extends EigenResource {
  name?: string;
  description?: string;
  retired?: boolean;
}
