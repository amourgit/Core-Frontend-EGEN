import uniq from 'lodash-es/uniq';

// note that these constants are also defined in @egen/esm-offline
export const omrsOfflineResponseBodyHttpHeaderName = 'x-egen-offline-response-body';
export const omrsOfflineResponseStatusHttpHeaderName = 'x-egen-offline-response-status';
export const omrsOfflineCachingStrategyHttpHeaderName = 'x-egen-offline-caching-strategy';

export const omrsCachePrefix = 'egen';
export const omrsCacheName = `${omrsCachePrefix}-spa-cache-v1`;

export const wbManifest = self.__WB_MANIFEST;
export const indexUrl = prefixWithServiceWorkerLocationIfRelative('index.html');
export const absoluteWbManifestUrls = uniq(wbManifest.map(({ url }) => prefixWithServiceWorkerLocationIfRelative(url)));

export const buildManifestSuffix = '.buildmanifest.json';

function prefixWithServiceWorkerLocationIfRelative(path: string) {
  return new URL(path, self.location.href).href;
}
