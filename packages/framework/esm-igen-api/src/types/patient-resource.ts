import { type EigenResourceStrict, type Person } from '@egen/esm-api';

export interface PatientIdentifierType extends EigenResourceStrict {
  name?: string;
  description?: string;
  format?: string;
  formatDescription?: string;
  required?: boolean;
  validator?: string;
  locationBehavior?: string;
  uniquenessBehavior?: string;
  retired?: boolean;
}

export interface Patient extends EigenResourceStrict {
  identifiers?: PatientIdentifier[];
  person?: Person;
  voided?: boolean;
}

export interface PatientIdentifier extends EigenResourceStrict {
  identifier?: string;
  identifierType?: PatientIdentifierType;
  location?: Location;
  preferred?: boolean;
  voided?: boolean;
}
