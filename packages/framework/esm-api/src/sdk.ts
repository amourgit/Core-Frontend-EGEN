// ============================================================
// @egen/esm-api — SDK barrel for micro-frontends
//
// Import everything you need for API interactions:
//   import { egenFetch, EgenFetchError, restBaseUrl } from '@egen/esm-api';
// ============================================================

// HTTP Client
export {
  egenFetch,
  egenObservableFetch,
  makeUrl,
  EgenFetchError,
  restBaseUrl,
  fhirBaseUrl,
  sessionEndpoint,
} from './egen-fetch';

// Types
export type {
  FetchConfig,
  FetchHeaders,
  FetchResponseJson,
  FetchError,
} from './egen-fetch';
export type { FetchResponse } from './types';

// User session
export {
  getCurrentUser,
  getLoggedInUser,
  getSessionStore,
  getSessionLocation,
  refetchCurrentUser,
  setSessionLocation,
  setUserLanguage,
  setUserProperties,
  userHasAccess,
  clearCurrentUser,
} from './current-user';

export type { LoadedSessionStore, SessionStore, UnloadedSessionStore } from './current-user';

// Environment
export * from './environment';

// Backend dependencies
export * from './egen-backend-dependencies';

// Resource types
export * from './types';
