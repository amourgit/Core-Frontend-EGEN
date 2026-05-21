/**
 * @file Mock data for the egen backend API.
 * Shapes match the TypeScript interfaces in
 * packages/framework/esm-api/src/types/user-resource.ts exactly.
 *
 * Edit this file to customise the mocked user, roles, privileges
 * and locations for your local development session.
 */

// We re-declare the minimal types here so this package has zero
// dependency on the framework at runtime.

export interface Privilege { uuid: string; name: string; display: string; links?: any[] }
export interface Role      { uuid: string; name: string; display: string; links?: any[] }
export interface SessionLocation { uuid: string; display: string; links: any[] }
export interface Session {
  authenticated: boolean;
  sessionId: string;
  locale?: string;
  allowedLocales?: string[];
  user?: LoggedInUser;
  sessionLocation?: SessionLocation;
  currentProvider?: { uuid: string; identifier: string };
}
export interface LoggedInUser {
  uuid: string; display: string; username: string; systemId: string;
  userProperties: Record<string, string | undefined> | null;
  person: any;
  privileges: Privilege[];
  roles: Role[];
  retired: boolean;
  locale: string;
  allowedLocales: string[];
  [k: string]: any;
}

// ─── Privileges ──────────────────────────────────────────────────────────────

export const ALL_PRIVILEGES: Privilege[] = [
  { uuid: 'priv-001', name: 'View Users',               display: 'View Users'               },
  { uuid: 'priv-002', name: 'Manage Users',             display: 'Manage Users'             },
  { uuid: 'priv-003', name: 'View Realms',              display: 'View Realms'              },
  { uuid: 'priv-004', name: 'Manage Realms',            display: 'Manage Realms'            },
  { uuid: 'priv-005', name: 'View IAM Config',          display: 'View IAM Config'          },
  { uuid: 'priv-006', name: 'Manage IAM Config',        display: 'Manage IAM Config'        },
  { uuid: 'priv-007', name: 'View Roles',               display: 'View Roles'               },
  { uuid: 'priv-008', name: 'Manage Roles',             display: 'Manage Roles'             },
  { uuid: 'priv-009', name: 'View Audit Logs',          display: 'View Audit Logs'          },
  { uuid: 'priv-010', name: 'Manage Audit Logs',        display: 'Manage Audit Logs'        },
  { uuid: 'priv-011', name: 'View Sessions',            display: 'View Sessions'            },
  { uuid: 'priv-012', name: 'Manage Sessions',          display: 'Manage Sessions'          },
  { uuid: 'priv-013', name: 'View Groups',              display: 'View Groups'              },
  { uuid: 'priv-014', name: 'Manage Groups',            display: 'Manage Groups'            },
  { uuid: 'priv-015', name: 'View Identity Providers',  display: 'View Identity Providers'  },
  { uuid: 'priv-016', name: 'Manage Identity Providers',display: 'Manage Identity Providers'},
  { uuid: 'priv-017', name: 'View Tokens',              display: 'View Tokens'              },
  { uuid: 'priv-018', name: 'Manage Tokens',            display: 'Manage Tokens'            },
];

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLE_SUPER_ADMIN: Role = {
  // "System Developer" = isSuperUser() returns true in userHasAccess()
  uuid: 'role-001', name: 'System Developer', display: 'System Developer',
};
export const ROLE_IAM_ADMIN: Role = {
  uuid: 'role-002', name: 'IAM Administrator', display: 'IAM Administrator',
};
export const ROLE_IAM_VIEWER: Role = {
  uuid: 'role-003', name: 'IAM Viewer', display: 'IAM Viewer',
};

// ─── Locations ────────────────────────────────────────────────────────────────

export const MOCK_LOCATIONS: SessionLocation[] = [
  { uuid: 'loc-001', display: 'Nœud Central IAM – Libreville', links: [] },
  { uuid: 'loc-002', display: 'Nœud Secondaire – Franceville', links: [] },
  { uuid: 'loc-003', display: 'Nœud Test – Dev Local',         links: [] },
];

// ─── Users ────────────────────────────────────────────────────────────────────

const MOCK_PERSON_BASE = {
  gender: 'M', age: null, birthdate: null, birthdateEstimated: false,
  dead: false, deathDate: null, causeOfDeath: null,
  preferredAddress: null, attributes: [], voided: false, resourceVersion: '1.11',
};

export const MOCK_ADMIN_USER: LoggedInUser = {
  uuid: 'user-admin-001',
  display: 'Samuel Admin',
  username: 'admin',
  systemId: 'admin',
  userProperties: { defaultLocation: 'loc-001', defaultLocale: 'fr' },
  person: { ...MOCK_PERSON_BASE, uuid: 'person-001', display: 'Samuel Admin',
    preferredName: { uuid: 'pname-001', display: 'Samuel Admin', givenName: 'Samuel', familyName: 'Admin' } },
  privileges: ALL_PRIVILEGES,
  roles: [ROLE_SUPER_ADMIN, ROLE_IAM_ADMIN],
  retired: false,
  locale: 'fr',
  allowedLocales: ['fr', 'en'],
};

export const MOCK_VIEWER_USER: LoggedInUser = {
  uuid: 'user-viewer-002',
  display: 'Agent Observateur',
  username: 'viewer',
  systemId: 'viewer',
  userProperties: { defaultLocation: 'loc-002', defaultLocale: 'fr' },
  person: { ...MOCK_PERSON_BASE, uuid: 'person-002', display: 'Agent Observateur',
    preferredName: { uuid: 'pname-002', display: 'Agent Observateur', givenName: 'Agent', familyName: 'Observateur' } },
  privileges: ALL_PRIVILEGES.filter((p) => p.name.startsWith('View')),
  roles: [ROLE_IAM_VIEWER],
  retired: false,
  locale: 'fr',
  allowedLocales: ['fr', 'en'],
};

// ─── Sessions ─────────────────────────────────────────────────────────────────

function session(user: LoggedInUser, id: string): Session {
  return {
    authenticated: true,
    sessionId: id,
    locale: user.locale,
    allowedLocales: user.allowedLocales,
    user,
    sessionLocation: MOCK_LOCATIONS[0],
    currentProvider: { uuid: 'prov-001', identifier: user.username },
  };
}

export const SESSION_ADMIN  = session(MOCK_ADMIN_USER,  'mock-sess-admin-aabbccdd');
export const SESSION_VIEWER = session(MOCK_VIEWER_USER, 'mock-sess-viewer-eeffgghh');

export const SESSION_UNAUTHENTICATED: Session = { authenticated: false, sessionId: '' };

/**
 * Credential map used by the mock login handler.
 * Format: "username:password" → Session
 * Extend to add more test users.
 */
export const CREDENTIALS_MAP: Record<string, Session> = {
  'admin:Admin123!':   SESSION_ADMIN,
  'admin:admin':       SESSION_ADMIN,       // dev shortcut
  'viewer:Viewer123!': SESSION_VIEWER,
  'viewer:viewer':     SESSION_VIEWER,      // dev shortcut
};
