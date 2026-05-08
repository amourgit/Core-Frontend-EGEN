import { type EigenResource } from './eigen-resource';

// TODO: make this extends EigenResourceStrict
export interface Concept extends EigenResource {
  name?: ConceptName;
  datatype?: ConceptDatatype;
  conceptClass?: ConceptClass;
  set?: boolean;
  version?: string;
  retired?: boolean;
  names?: Array<ConceptName>;
  descriptions?: Array<EigenResource>;
  // TODO: add better typings
  mappings?: any;
  answers?: any;
  setMembers?: any;
  attributes?: any;
}

export interface ConceptDatatype extends EigenResource {
  name?: string;
  description?: string;
  hl7Abbreviation?: string;
  retired?: boolean;
}

export interface ConceptName extends EigenResource {
  name?: string;
  locale?: string;
  localPreferred?: boolean;
  conceptNameType?: 'FULLY_SPECIFIED' | 'SHORT' | 'INDEX_TERM';
}

export interface ConceptClass extends EigenResource {
  name?: string;
  description?: string;
  retired?: boolean;
}
