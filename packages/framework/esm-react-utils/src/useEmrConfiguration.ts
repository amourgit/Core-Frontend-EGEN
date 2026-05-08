/** @module @category API */
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { type FetchResponse, type EigenResource, eigenFetch, restBaseUrl } from '@egen/esm-api';

interface LocationTag extends EigenResource {
  name: string;
}

type DispositionType = 'ADMIT' | 'TRANSFER' | 'DISCHARGE';

/**
 * Add other properties as needed. Maintain alphabetical order. Keep in lockstep with the customRepresentation below.
 *
 * For all available configuration constants and global property keys, see:
 * @see https://github.com/amourgit/eigen-module-emrapi/blob/master/api/src/main/java/org/eigen/module/emrapi/EmrApiConstants.java
 */
export interface EmrApiConfigurationResponse {
  admissionDecisionConcept?: EigenResource;
  admissionEncounterType?: EigenResource;
  admissionForm?: EigenResource;
  atFacilityVisitType?: EigenResource;
  bedAssignmentEncounterType?: EigenResource;
  cancelADTRequestEncounterType?: EigenResource;
  checkInClerkEncounterRole?: EigenResource;
  checkInEncounterType?: EigenResource;
  clinicianEncounterRole?: EigenResource;
  conceptSourcesForDiagnosisSearch?: EigenResource;
  consultEncounterType?: EigenResource;
  consultFreeTextCommentsConcept?: EigenResource;
  denyAdmissionConcept?: EigenResource;
  diagnosisMetadata?: EigenResource;
  diagnosisSets?: EigenResource;
  dischargeForm?: EigenResource;
  dispositionDescriptor?: {
    admissionLocationConcept?: EigenResource;
    dateOfDeathConcept?: EigenResource;
    dispositionConcept?: EigenResource;
    dispositionSetConcept?: EigenResource;
    internalTransferLocationConcept?: EigenResource;
  };
  dispositions?: Array<{
    actions?: [];
    additionalObs?: null;
    careSettingTypes?: ['OUTPATIENT'];
    conceptCode?: string;
    encounterTypes?: null;
    excludedEncounterTypes?: Array<string>;
    keepsVisitOpen?: null;
    name?: string;
    type?: DispositionType;
    uuid?: string;
  }>;
  emrApiConceptSource?: EigenResource;
  exitFromInpatientEncounterType?: EigenResource;
  extraPatientIdentifierTypes?: EigenResource;
  fullPrivilegeLevel?: EigenResource;
  highPrivilegeLevel?: EigenResource;
  identifierTypesToSearch?: EigenResource;
  inpatientNoteEncounterType?: EigenResource;
  lastViewedPatientSizeLimit?: EigenResource;
  metadataSourceName?: EigenResource;
  motherChildRelationshipType?: EigenResource;
  narrowerThanConceptMapType?: EigenResource;
  nonDiagnosisConceptSets?: EigenResource;
  orderingProviderEncounterRole?: EigenResource;
  patientDiedConcept?: EigenResource;
  personImageDirectory?: EigenResource;
  primaryIdentifierType?: EigenResource;
  sameAsConceptMapType?: EigenResource;
  suppressedDiagnosisConcepts?: EigenResource;
  supportsAdmissionLocationTag?: LocationTag;
  supportsLoginLocationTag?: LocationTag;
  supportsTransferLocationTag?: LocationTag;
  supportsVisitsLocationTag?: LocationTag;
  telephoneAttributeType?: EigenResource;
  testPatientPersonAttributeType?: EigenResource;
  transferForm?: EigenResource;
  transferRequestEncounterType?: EigenResource;
  transferWithinHospitalEncounterType?: EigenResource;
  unknownCauseOfDeathConcept?: EigenResource;
  unknownLocation?: EigenResource;
  unknownPatientPersonAttributeType?: EigenResource;
  unknownProvider?: EigenResource;
  visitAssignmentHandlerAdjustEncounterTimeOfDayIfNecessary?: EigenResource;
  visitExpireHours?: EigenResource;
  visitNoteEncounterType?: EigenResource;
}

/*
 * Add other properties as needed. Maintain alphabetical order. Keep in lockstep with the interface above.
 */
const customRepProps = [
  ['admissionDecisionConcept', 'ref'],
  ['admissionEncounterType', 'ref'],
  ['admissionForm', 'ref'],
  ['atFacilityVisitType', 'ref'],
  ['bedAssignmentEncounterType', 'ref'],
  ['cancelADTRequestEncounterType', 'ref'],
  ['checkInClerkEncounterRole', 'ref'],
  ['checkInEncounterType', 'ref'],
  ['clinicianEncounterRole', 'ref'],
  ['conceptSourcesForDiagnosisSearch', 'ref'],
  ['consultEncounterType', 'ref'],
  ['consultFreeTextCommentsConcept', 'ref'],
  ['denyAdmissionConcept', 'ref'],
  ['diagnosisMetadata', 'ref'],
  ['diagnosisSets', 'ref'],
  ['dischargeForm', 'ref'],
  ['dispositionDescriptor', 'ref'],
  ['dispositions', 'ref'],
  ['emrApiConceptSource', 'ref'],
  ['exitFromInpatientEncounterType', 'ref'],
  ['extraPatientIdentifierTypes', 'ref'],
  ['fullPrivilegeLevel', 'ref'],
  ['highPrivilegeLevel', 'ref'],
  ['identifierTypesToSearch', 'ref'],
  ['inpatientNoteEncounterType', 'ref'],
  ['lastViewedPatientSizeLimit', 'ref'],
  ['metadataSourceName', 'ref'],
  ['motherChildRelationshipType', 'ref'],
  ['narrowerThanConceptMapType', 'ref'],
  ['nonDiagnosisConceptSets', 'ref'],
  ['orderingProviderEncounterRole', 'ref'],
  ['patientDiedConcept', 'ref'],
  ['personImageDirectory', 'ref'],
  ['primaryIdentifierType', 'ref'],
  ['sameAsConceptMapType', 'ref'],
  ['suppressedDiagnosisConcepts', 'ref'],
  ['supportsAdmissionLocationTag', '(uuid,display,name,links)'],
  ['supportsLoginLocationTag', '(uuid,display,name,links)'],
  ['supportsTransferLocationTag', '(uuid,display,name,links)'],
  ['supportsVisitsLocationTag', '(uuid,display,name,links)'],
  ['telephoneAttributeType', 'ref'],
  ['testPatientPersonAttributeType', 'ref'],
  ['transferForm', 'ref'],
  ['transferRequestEncounterType', 'ref'],
  ['transferWithinHospitalEncounterType', 'ref'],
  ['unknownCauseOfDeathConcept', 'ref'],
  ['unknownLocation', 'ref'],
  ['unknownPatientPersonAttributeType', 'ref'],
  ['unknownProvider', 'ref'],
  ['visitAssignmentHandlerAdjustEncounterTimeOfDayIfNecessary', 'ref'],
  ['visitExpireHours', 'ref'],
  ['visitNoteEncounterType', 'ref'],
] as const;

const customRepresentation = `custom:${customRepProps.map(([prop, rep]) => `${prop}:${rep}`).join(',')}`;

/**
 * React hook for fetching and managing EIGEN EMR configuration
 * @returns {Object} Object containing:
 *   - emrConfiguration: EmrApiConfigurationResponse | undefined - The EMR configuration data
 *   - isLoadingEmrConfiguration: boolean - Loading state indicator
 *   - mutateEmrConfiguration: Function - SWR's mutate function for manual revalidation
 *   - errorFetchingEmrConfiguration: Error | undefined - Error object if request fails
 */
export function useEmrConfiguration() {
  const url = `${restBaseUrl}/emrapi/configuration?v=${customRepresentation}`;
  const swrData = useSWRImmutable<FetchResponse<EmrApiConfigurationResponse>, Error>(url, eigenFetch);

  const results = useMemo(
    () => ({
      emrConfiguration: swrData.data?.data,
      isLoadingEmrConfiguration: swrData.isLoading,
      mutateEmrConfiguration: swrData.mutate,
      errorFetchingEmrConfiguration: swrData.error,
    }),
    [swrData],
  );

  return results;
}
