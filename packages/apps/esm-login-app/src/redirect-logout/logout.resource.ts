import { mutate } from 'swr';
import { clearCurrentUser, eigenFetch, refetchCurrentUser, restBaseUrl } from '@egen/esm-framework';

export async function performLogout() {
  await eigenFetch(`${restBaseUrl}/session`, {
    method: 'DELETE',
  });

  // clear the SWR cache on logout, do not revalidate
  // taken from the SWR docs
  mutate(() => true, undefined, { revalidate: false });

  clearCurrentUser();
  await refetchCurrentUser();
}
