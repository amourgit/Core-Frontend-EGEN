import { getSyncLifecycle } from '@egen/esm-framework';
import implementerToolsComponent from './implementer-tools.component';
import globalImplementerToolsComponent from './global-implementer-tools.component';
import implementerToolsButtonComponent from './implementer-tools.button';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@egen/esm-implementer-tools-app';
const options = {
  featureName: 'Implementer Tools',
  moduleName,
  // React 18 StrictMode double-mounts components during development.
  // Combined with Single SPA lifecycle, this causes removeChild errors on already-removed DOM nodes.
  // StrictMode has no effect in production—disabled to prevent race conditions.
  strictMode: false,
};

export const implementerTools = getSyncLifecycle(implementerToolsComponent, options);

export const globalImplementerTools = getSyncLifecycle(globalImplementerToolsComponent, options);

export const implementerToolsButton = getSyncLifecycle(implementerToolsButtonComponent, options);

export { default as ConfigEditButton } from './config-edit-button/config-edit-button.component';
