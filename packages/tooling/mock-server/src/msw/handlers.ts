/**
 * @file MSW (Mock Service Worker) request handlers for the egen REST API.
 *
 * These handlers intercept HTTP calls at the fetch level — they work
 * identically in:
 *   • Vitest (via msw/node)   → packages/tooling/mock-server/src/msw/node.ts
 *   • Browser dev mode        → packages/tooling/mock-server/src/msw/browser.ts
 *
 * The URL prefix is driven by `window.egenBase` which defaults to `/egen`.
 * In tests, the base is set to `/egen` in setup-tests.ts.
 */

import { http, HttpResponse, type PathParams } from 'msw';
import {
  CREDENTIALS_MAP,
  MOCK_LOCATIONS,
  SESSION_ADMIN,
  SESSION_UNAUTHENTICATED,
  ALL_PRIVILEGES,
  ROLE_SUPER_ADMIN,
  ROLE_IAM_ADMIN,
  ROLE_IAM_VIEWER,
  MOCK_ADMIN_USER,
  MOCK_VIEWER_USER,
} from '../data/index';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Wrap a value the way the egen REST API does: { data: value }. */
function apiOk<T>(data: T, status = 200) {
  return HttpResponse.json({ data }, { status });
}

/** Return a standard egen REST error envelope. */
function apiError(message: string, status = 400) {
  return HttpResponse.json(
    { error: { globalErrors: [{ message }], fieldErrors: {} } },
    { status },
  );
}

/** Decode a Basic-auth header → { username, password } | null */
function decodeBasicAuth(authHeader: string | null) {
  if (!authHeader?.startsWith('Basic ')) return null;
  const [username, ...rest] = atob(authHeader.slice(6)).split(':');
  return { username, password: rest.join(':') };
}

// Active mock session (mutated by login / logout / set-location handlers).
let currentSession = { ...SESSION_ADMIN };

// ─── REST v1 base path ───────────────────────────────────────────────────────

const BASE = '/egen/ws/rest/v1';

// ─── Handlers ────────────────────────────────────────────────────────────────

export const handlers = [

  // ── GET /session ──────────────────────────────────────────────────────────
  // Called by getSessionStore() / refetchCurrentUser() on every page load.
  http.get(`${BASE}/session`, () => {
    return HttpResponse.json({ data: currentSession });
  }),

  // ── POST /session ─────────────────────────────────────────────────────────
  // Login: expects Basic-auth header or { username, password } body.
  // Also handles set-location (body: { sessionLocation: uuid }).
  http.post(`${BASE}/session`, async ({ request }) => {
    const body = await request.json().catch(() => null) as Record<string, any> | null;

    // Set-location shortcut (no auth change, just update sessionLocation)
    if (body?.sessionLocation && !body.username) {
      const loc = MOCK_LOCATIONS.find((l) => l.uuid === body.sessionLocation);
      if (!loc) return apiError('Location not found', 404);
      currentSession = { ...currentSession, sessionLocation: loc };
      return HttpResponse.json({ data: currentSession });
    }

    // Credentials from Basic-auth header OR request body
    const authHeader = request.headers.get('Authorization');
    const creds = authHeader
      ? decodeBasicAuth(authHeader)
      : body?.username && body?.password
        ? { username: body.username as string, password: body.password as string }
        : null;

    if (!creds) {
      return apiError('Missing credentials', 401);
    }

    const key = `${creds.username}:${creds.password}`;
    const matchedSession = CREDENTIALS_MAP[key];

    if (!matchedSession) {
      return HttpResponse.json(
        { data: SESSION_UNAUTHENTICATED },
        { status: 401 },
      );
    }

    currentSession = { ...matchedSession };
    return HttpResponse.json({ data: currentSession });
  }),

  // ── DELETE /session ───────────────────────────────────────────────────────
  // Logout
  http.delete(`${BASE}/session`, () => {
    currentSession = { ...SESSION_UNAUTHENTICATED };
    return new HttpResponse(null, { status: 204 });
  }),

  // ── GET /location ─────────────────────────────────────────────────────────
  http.get(`${BASE}/location`, () => {
    return HttpResponse.json({
      results: MOCK_LOCATIONS,
      links: [],
    });
  }),

  // ── GET /location/:uuid ───────────────────────────────────────────────────
  http.get(`${BASE}/location/:uuid`, ({ params }) => {
    const loc = MOCK_LOCATIONS.find((l) => l.uuid === params['uuid']);
    if (!loc) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(loc);
  }),

  // ── GET /privilege ────────────────────────────────────────────────────────
  http.get(`${BASE}/privilege`, () => {
    return HttpResponse.json({ results: ALL_PRIVILEGES, links: [] });
  }),

  // ── GET /role ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/role`, () => {
    return HttpResponse.json({
      results: [ROLE_SUPER_ADMIN, ROLE_IAM_ADMIN, ROLE_IAM_VIEWER],
      links: [],
    });
  }),

  // ── GET /user ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/user`, () => {
    return HttpResponse.json({
      results: [MOCK_ADMIN_USER, MOCK_VIEWER_USER],
      links: [],
    });
  }),

  // ── GET /user/:uuid ───────────────────────────────────────────────────────
  http.get(`${BASE}/user/:uuid`, ({ params }) => {
    const users = [MOCK_ADMIN_USER, MOCK_VIEWER_USER];
    const user = users.find((u) => u.uuid === params['uuid']);
    if (!user) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(user);
  }),

  // ── POST /user/:uuid (setUserProperties) ──────────────────────────────────
  http.post(`${BASE}/user/:uuid`, async ({ params, request }) => {
    const body = await request.json().catch(() => null) as any;
    const users = [MOCK_ADMIN_USER, MOCK_VIEWER_USER];
    const user = users.find((u) => u.uuid === params['uuid']);
    if (!user) return new HttpResponse(null, { status: 404 });
    if (body?.userProperties) {
      Object.assign(user.userProperties ?? {}, body.userProperties);
    }
    return HttpResponse.json(user);
  }),

  // ── SPA Configuration ─────────────────────────────────────────────────────
  // GET /egen/spa/routes.registry.json — empty by default (routes loaded dynamically)
  http.get('/egen/spa/routes.registry.json', () => {
    return HttpResponse.json({});
  }),

  // GET /egen/spa/importmap.json — empty by default (importmap loaded dynamically)
  http.get('/egen/spa/importmap.json', () => {
    return HttpResponse.json({ imports: {} });
  }),

  // ── Fallback: log unhandled egen API calls ────────────────────────────────
  http.all(`${BASE}/*`, ({ request }) => {
    console.warn(`[MSW] Unhandled egen API call: ${request.method} ${request.url}`);
    return new HttpResponse(null, { status: 501 });
  }),
];

/**
 * Reset the active mock session back to the default admin session.
 * Useful in `beforeEach` / `afterEach` in tests.
 */
export function resetMockSession() {
  currentSession = { ...SESSION_ADMIN };
}

/**
 * Forcibly set the mock session for a specific test scenario.
 * @example setMockSession(SESSION_VIEWER);
 * @example setMockSession(SESSION_UNAUTHENTICATED);
 */
export function setMockSession(session: typeof SESSION_ADMIN) {
  currentSession = { ...session };
}

export { SESSION_ADMIN, SESSION_VIEWER, SESSION_UNAUTHENTICATED } from '../data/index';
