/**
 * @file MSW browser worker — used in development mode to intercept API calls
 * in the browser via a Service Worker, so the app works without a real backend.
 *
 * Setup (already done if you used `npm run dev:mock`):
 *   1. Run `npx msw init packages/shell/esm-app-shell/public --save` once
 *      to copy mockServiceWorker.js into the public folder.
 *   2. Import and start this worker in the shell's entry point when
 *      `process.env.NODE_ENV === 'development'` and `IGEN_MOCK === 'true'`.
 *
 * The shell already enables this automatically via the IGEN_MOCK env var.
 * See packages/shell/esm-app-shell/src/index.ts for the integration point.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export { resetMockSession, setMockSession } from './handlers';
export { SESSION_ADMIN, SESSION_VIEWER, SESSION_UNAUTHENTICATED } from '../data/index';
