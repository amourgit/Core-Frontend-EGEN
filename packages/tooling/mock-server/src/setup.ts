/**
 * @file Shared Vitest setup with MSW.
 *
 * This file starts the MSW Node server before all tests and resets
 * handlers after each test to prevent test pollution.
 *
 * HOW TO USE IN A PACKAGE
 * ─────────────────────────
 * In your package's vitest.config.ts, add this file to setupFiles:
 *
 * ```ts
 * // vitest.config.ts
 * import { defineConfig } from 'vitest/config';
 *
 * export default defineConfig({
 *   test: {
 *     environment: 'happy-dom',
 *     mockReset: true,
 *     setupFiles: [
 *       '@igen/mock-server/setup',          // ← add this
 *       './setup-tests.ts',
 *     ],
 *   },
 * });
 * ```
 *
 * CONTROLLING THE SESSION IN TESTS
 * ─────────────────────────────────
 * ```ts
 * import { setMockSession, SESSION_VIEWER, SESSION_UNAUTHENTICATED }
 *   from '@igen/mock-server/msw/node';
 *
 * describe('viewer access', () => {
 *   beforeEach(() => setMockSession(SESSION_VIEWER));
 *
 *   it('shows read-only UI', async () => {
 *     // your test
 *   });
 * });
 * ```
 *
 * OVERRIDING A SINGLE HANDLER
 * ─────────────────────────────
 * ```ts
 * import { server } from '@igen/mock-server/msw/node';
 * import { http, HttpResponse } from 'msw';
 *
 * it('handles 500 on location fetch', () => {
 *   server.use(
 *     http.get('/igen/ws/rest/v1/location', () =>
 *       new HttpResponse(null, { status: 500 })
 *     )
 *   );
 *   // assert error state in UI
 * });
 * ```
 */

import { afterAll, afterEach, beforeAll } from 'vitest';
import { server, resetMockSession } from './msw/node';

// Start MSW before the test suite
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any runtime handler overrides after each test
afterEach(() => {
  server.resetHandlers();
  // Restore the default admin session so tests don't bleed into each other
  resetMockSession();
});

// Shut down the interceptor after all tests in this suite
afterAll(() => server.close());
