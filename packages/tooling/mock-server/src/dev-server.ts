#!/usr/bin/env tsx
/**
 * @file egen Mock HTTP Server (Express)
 *
 * Runs on http://localhost:3333 and mimics the egen backend REST API.
 * Point the webpack proxy at this server by setting:
 *
 *   EGEN_PROXY_TARGET=http://localhost:3333/
 *
 * in packages/shell/esm-app-shell/.env  (already done — see that file).
 *
 * Usage:
 *   npm run mock:server          # from repo root
 *   npm run dev:mock             # starts mock server + webpack dev server together
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
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
  type Session,
} from './data/index';

const app  = express();
const PORT = process.env.MOCK_PORT ? Number(process.env.MOCK_PORT) : 3333;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ─── Request logger ───────────────────────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`\x1b[36m[mock]\x1b[0m ${req.method} ${req.path}`);
  next();
});

// ─── Active session (mutated by login/logout/set-location) ───────────────────
let currentSession: Session = { ...SESSION_ADMIN };

// ─── Helper: decode Basic-auth header ────────────────────────────────────────
function decodeBasicAuth(header: string | undefined): { username: string; password: string } | null {
  if (!header?.startsWith('Basic ')) return null;
  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf-8');
  const colon   = decoded.indexOf(':');
  if (colon < 0) return null;
  return { username: decoded.slice(0, colon), password: decoded.slice(colon + 1) };
}

const BASE = '/egen/ws/rest/v1';

// ─── Session endpoints ────────────────────────────────────────────────────────

// GET /session — called by refetchCurrentUser() on every page load
app.get(`${BASE}/session`, (_req, res) => {
  res.json({ data: currentSession });
});

// POST /session — login OR set-location
app.post(`${BASE}/session`, (req, res) => {
  const body = req.body as Record<string, any>;

  // Set-location (no credential change)
  if (body?.sessionLocation && !body.username) {
    const loc = MOCK_LOCATIONS.find((l) => l.uuid === body.sessionLocation);
    if (!loc) { res.status(404).json({ error: 'Location not found' }); return; }
    currentSession = { ...currentSession, sessionLocation: loc };
    res.json({ data: currentSession });
    return;
  }

  // Login via Basic-auth header or body
  const authCreds = decodeBasicAuth(req.headers.authorization);
  const creds = authCreds ?? (body?.username ? { username: body.username, password: body.password } : null);

  if (!creds) {
    res.status(401).json({ data: SESSION_UNAUTHENTICATED });
    return;
  }

  const key = `${creds.username}:${creds.password}`;
  const matched = CREDENTIALS_MAP[key];

  if (!matched) {
    console.log(`  \x1b[33m[mock] Login failed for "${creds.username}"\x1b[0m`);
    res.status(401).json({ data: SESSION_UNAUTHENTICATED });
    return;
  }

  console.log(`  \x1b[32m[mock] Login OK — user: ${matched.user?.username}\x1b[0m`);
  currentSession = { ...matched };
  res.json({ data: currentSession });
});

// DELETE /session — logout
app.delete(`${BASE}/session`, (_req, res) => {
  currentSession = { ...SESSION_UNAUTHENTICATED };
  res.status(204).end();
});

// ─── Location endpoints ───────────────────────────────────────────────────────

app.get(`${BASE}/location`, (_req, res) => {
  res.json({ results: MOCK_LOCATIONS, links: [] });
});

app.get(`${BASE}/location/:uuid`, (req, res) => {
  const loc = MOCK_LOCATIONS.find((l) => l.uuid === req.params.uuid);
  if (!loc) { res.status(404).end(); return; }
  res.json(loc);
});

// ─── Privilege / Role endpoints ───────────────────────────────────────────────

app.get(`${BASE}/privilege`, (_req, res) => {
  res.json({ results: ALL_PRIVILEGES, links: [] });
});

app.get(`${BASE}/role`, (_req, res) => {
  res.json({ results: [ROLE_SUPER_ADMIN, ROLE_IAM_ADMIN, ROLE_IAM_VIEWER], links: [] });
});

// ─── User endpoints ───────────────────────────────────────────────────────────

app.get(`${BASE}/user`, (_req, res) => {
  res.json({ results: [MOCK_ADMIN_USER, MOCK_VIEWER_USER], links: [] });
});

app.get(`${BASE}/user/:uuid`, (req, res) => {
  const user = [MOCK_ADMIN_USER, MOCK_VIEWER_USER].find((u) => u.uuid === req.params.uuid);
  if (!user) { res.status(404).end(); return; }
  res.json(user);
});

app.post(`${BASE}/user/:uuid`, (req, res) => {
  const user = [MOCK_ADMIN_USER, MOCK_VIEWER_USER].find((u) => u.uuid === req.params.uuid);
  if (!user) { res.status(404).end(); return; }
  if (req.body?.userProperties) {
    Object.assign(user.userProperties ?? {}, req.body.userProperties);
  }
  res.json(user);
});

// ─── Catch-all: log unhandled routes ─────────────────────────────────────────

app.all('*', (req, res) => {
  console.warn(`  \x1b[33m[mock] Unhandled: ${req.method} ${req.path}\x1b[0m`);
  res.status(501).json({ error: `Not implemented: ${req.method} ${req.path}` });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n\x1b[32m✓ egen Mock Server running on http://localhost:${PORT}\x1b[0m`);
  console.log(`  Session active: \x1b[36m${currentSession.user?.username ?? 'unauthenticated'}\x1b[0m`);
  console.log(`  Proxy target:   set EGEN_PROXY_TARGET=http://localhost:${PORT}/ in your .env\n`);
});
