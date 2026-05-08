import { type EigenResource } from '@egen/esm-api';

export interface Location {
  uuid: string;
  display?: string;
  name?: string;
}

export interface VisitType {
  uuid: string;
  display: string;
  name?: string;
}

export interface Patient {
  uuid: string;
  display: string;
  identifiers: Array<any>;
  person: Person;
}

export interface Person {
  age: number;
  attributes: Array<Attribute>;
  birthDate: string;
  gender: string;
  display: string;
  preferredAddress: EigenResource;
  uuid: string;
}

export interface Attribute {
  attributeType: EigenResource;
  display: string;
  uuid: string;
  value: string | number;
}

export interface CohortMemberResponse {
  results: Array<CohortMember>;
}

interface CohortMember {
  uuid: string;
  patient: EigenResource;
  cohort: Cohort;
}

interface Cohort {
  uuid: string;
  name: string;
  startDate: string;
  endDate: string | null;
}
