import { useMemo } from 'react';
import useSWR from 'swr';
import { type FetchResponse, eigenFetch, restBaseUrl } from '@egen/esm-api';
import { type CohortMemberResponse } from './types';

export function usePatientListsForPatient(patientUuid: string) {
  const customRepresentation = 'custom:(uuid,patient:ref,cohort:(uuid,name,startDate,endDate))';
  const url = patientUuid
    ? `${restBaseUrl}/cohortm/cohortmember?patient=${patientUuid}&v=${customRepresentation}`
    : null;
  const { data, isLoading } = useSWR<FetchResponse<CohortMemberResponse>, Error>(url, eigenFetch);

  const cohorts = data?.data?.results.map((ref) => ({
    uuid: ref.cohort.uuid,
    name: ref.cohort.name,
    startDate: ref.cohort.startDate,
    endDate: ref.cohort.endDate,
  }));

  return useMemo(() => ({ cohorts, isLoading }), [isLoading, cohorts]);
}
