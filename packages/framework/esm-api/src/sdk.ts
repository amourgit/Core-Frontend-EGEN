// ============================================================
// @igen/esm-api — SDK barrel for micro-frontends
//
// Import everything you need for API interactions:
//   import { eigenFetch, EigenFetchError, restBaseUrl } from '@igen/esm-api';
// ============================================================

// HTTP Client
export {
  eigenFetch,
  eigenObservableFetch,
  makeUrl,
  EigenFetchError,
  restBaseUrl,
  fhirBaseUrl,
  sessionEndpoint,
} from './eigen-fetch';

// Types
export type {
  FetchConfig,
  FetchHeaders,
  FetchResponseJson,
  FetchError,
  FetchResponse,
} from './eigen-fetch';

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
export * from './eigen-backend-dependencies';

// Resource types
export * from './types';
