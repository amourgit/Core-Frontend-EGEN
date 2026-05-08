import { type Concept, type EigenResource } from '@egen/esm-api';

export interface Drug extends EigenResource {
  uuid: string;
  strength: string;
  concept: Concept;
  dosageForm: EigenResource;
  display: string;
}
