import { type Concept, type ConceptClass, type EigenResource } from '@egen/esm-api';
import { type Encounter } from './encounter-resource';
import { type Patient } from './patient-resource';

// TODO: make this extends EigenResourceStrict
export interface Diagnosis extends EigenResource {
  diagnosis?: {
    coded?: {
      uuid: string;
      display?: string;
      name?: Concept;
      datatype?: EigenResource;
      conceptClass?: ConceptClass;
    };
    nonCoded?: string;
  };
  patient?: Patient;
  encounter?: Encounter;
  certainty?: string;
  rank?: number;
  formFieldNamespace?: string;
  formFieldPath?: string;
  voided?: boolean;
}
