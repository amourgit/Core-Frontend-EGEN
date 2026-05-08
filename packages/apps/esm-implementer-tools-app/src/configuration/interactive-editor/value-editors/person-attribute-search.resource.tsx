import { eigenFetch, restBaseUrl } from '@egen/esm-framework';

export function fetchPersonAttributeTypeByUuid(personAttributeTypeUuid: string) {
  return eigenFetch(`${restBaseUrl}/personattributetype/${personAttributeTypeUuid}`, {
    method: 'GET',
  });
}

export function performPersonAttributeTypeSearch(query: string) {
  return eigenFetch(`${restBaseUrl}/personattributetype/?q=${query}`, {
    method: 'GET',
  });
}
