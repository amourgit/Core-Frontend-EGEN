/**
 * @file MSW server for Vitest (Node.js environment).
 *
 * Import this in your package's setup-tests.ts:
 *
 * ```ts
 * // setup-tests.ts
 * import { server } from '@igen/mock-server/msw/node';
 *
 * beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 *
 * To override handlers for a specific test:
 * ```ts
 * import { server, setMockSession, SESSION_VIEWER } from '@igen/mock-server/msw/node';
 * import { http, HttpResponse } from 'msw';
 *
 * it('shows viewer UI', () => {
 *   setMockSession(SESSION_VIEWER);
 *   // or override completely:
 *   server.use(
 *     http.get('/igen/ws/rest/v1/session', () =>
 *       HttpResponse.json({ data: SESSION_VIEWER })
 *     )
 *   );
 *   // ... render & assert
 * });
 * ```
 */

import { setupServer } from 'msw/node';
import { handlers, resetMockSession, setMockSession } from './handlers';

export const server = setupServer(...handlers);

export { resetMockSession, setMockSession };
export { SESSION_ADMIN, SESSION_VIEWER, SESSION_UNAUTHENTICATED } from '../data/index';
export { http, HttpResponse } from 'msw';
