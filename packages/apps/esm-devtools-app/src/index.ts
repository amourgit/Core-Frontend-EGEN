import { getAsyncLifecycle } from '@egen/esm-framework';

const options = {
  featureName: 'devtools',
  moduleName: '@egen/esm-devtools-app',
  // React 18 StrictMode double-mounts components during development.
  // Combined with Single SPA lifecycle, this causes removeChild errors on already-removed DOM nodes.
  // StrictMode has no effect in production—disabled to prevent race conditions.
  strictMode: false,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const devtools = getAsyncLifecycle(() => import('./devtools/devtools.component'), options);

export const importmapOverrideModal = getAsyncLifecycle(
  () => import('./devtools/import-map-list/import-map.modal'),
  options,
);
