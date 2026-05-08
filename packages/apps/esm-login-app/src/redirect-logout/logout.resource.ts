import { mutate } from 'swr';
import { clearCurrentUser, egenFetch, refetchCurrentUser, restBaseUrl } from '@egen/esm-framework';

export async function performLogout() {
  await egenFetch(`${restBaseUrl}/session`, {
    method: 'DELETE',
  });

  // clear the SWR cache on logout, do not revalidate
  // taken from the SWR docs
  mutate(() => true, undefined, { revalidate: false });

  clearCurrentUser();
  await refetchCurrentUser();
}
