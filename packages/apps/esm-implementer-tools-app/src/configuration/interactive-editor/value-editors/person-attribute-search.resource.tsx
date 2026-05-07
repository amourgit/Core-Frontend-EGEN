import { openmrsFetch, restBaseUrl } from '@egen/esm-framework';

export function fetchPersonAttributeTypeByUuid(personAttributeTypeUuid: string) {
  return openmrsFetch(`${restBaseUrl}/personattributetype/${personAttributeTypeUuid}`, {
    method: 'GET',
  });
}

export function performPersonAttributeTypeSearch(query: string) {
  return openmrsFetch(`${restBaseUrl}/personattributetype/?q=${query}`, {
    method: 'GET',
  });
}
