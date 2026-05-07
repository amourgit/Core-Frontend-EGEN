import type {} from '@egen/esm-globals';

export function isDevEnabled() {
  return window.spaEnv === 'development' || localStorage.getItem('openmrs:devtools') === 'true';
}
