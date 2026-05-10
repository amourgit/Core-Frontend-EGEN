// ============================================================
// @egen/esm-auth — Authentication & IAM Package
//
// Usage dans un micro-frontend :
//   import { useAuthContext, tokenManager, usePermissions } from '@egen/esm-auth';
// ============================================================

// ── Provider & Context ────────────────────────────────────────
export { AuthProvider, useAuthContext, AuthContext } from './lib/auth-provider';
export type { AuthContextType }                      from './lib/auth-store.types';
export { tokenStore }                                from './lib/auth-store';

// ── Security ─────────────────────────────────────────────────
export { tokenManager, userDataStore }  from './security/token-manager';
export { clientCookieManager }          from './security/cookie-manager';
export {
  decodeJWTUnsafe, isTokenExpired, tokenExpiresInMs,
} from './security/jwt-verifier';
export type { IAMJWTPayload }            from './security/jwt-verifier';
export { auditLogger }                   from './security/audit-logger';
export {
  KEYCLOAK_REALM_HEADER,
  DEFAULT_REALM,
} from './security/constants';

// ── Models / Types ────────────────────────────────────────────
export type {
  CurrentUser, AuthState, LoginResponse,
  SessionResponse, LoginCredentials,
} from './models/auth.model';
export type { CoreConfig, MicrofrontendConfig, RegistryEntry } from './types';

// ── Services ─────────────────────────────────────────────────
export {
  getSession, logoutAndClean,
  scheduleTokenRefresh, cancelTokenRefresh,
} from './services/auth.service';
export { httpClient } from './services/http-client';

// ── Hooks ─────────────────────────────────────────────────────
export { useAuth }            from './hooks/useAuth';
export { useIAMAuth }         from './hooks/useIAMAuth';
export { usePermissions }     from './hooks/usePermissions';
export { useKeycloakSession } from './hooks/useKeycloakSession';
export { useSessionMonitor }  from './hooks/useSessionMonitor';

// ── Store (Zustand) ───────────────────────────────────────────
export { useAuthStore }    from './store/auth.store';
export { useRegistryStore } from './store/registry.store';

// ── Utilities ─────────────────────────────────────────────────
export * from './utils-iam';
export { resolveSubdomains }  from './lib/subdomain-resolver';
export { resolveRealm }      from './lib/realm-resolver';
export { iamNavItems }     from './lib/iam-nav-static';

// ── Realm Utilities (additional) ──────────────────────────────────
export {
  getCurrentRealm, getRealm, getAdminBase, getOidcBase,
  extractSubdomain, clearRealmCache, resolveRealmFromRequest,
} from './lib/realm-resolver';
export type { ResolvedRealm } from './lib/realm-resolver';

// ── Auth Services (extended) ───────────────────────────────────────
export {
  authService, profilService, adminUserService, adminSessionService,
  storeAccessToken, storeRefreshToken, getStoredAccessToken, getStoredRefreshToken,
  clearStoredTokens, extractErrorMessage,
} from './services/auth.service';
export type {
  KcTokenResponse, KcUserInfo, KcUserRepresentation, KcSessionRepresentation,
  KcCredentialRepresentation, KcRoleRepresentation, TokenRefreshCallbacks,
} from './services/auth.service';

// ── Extended Hooks ────────────────────────────────────────────────
export { useChangePassword } from './hooks/useChangePassword';
export { useJournal }        from './hooks/useJournal';
export { useIAMSessions }    from './hooks/useIAMSessions';

// ── Extended Types ────────────────────────────────────────────────
export type {
  CurrentUserExtended, JournalEntry, PermissionEffective,
  Habilitations, Session,
} from './models/auth.model';

// ── Navigation ─────────────────────────────────────────────────────
export { iamNavItems as navigationData, iamNavGroups } from './lib/iam-nav-static';
export type { NavItem as NavigationItem, NavGroup } from './lib/iam-nav-static';

// ── Extended Auth Service ──────────────────────────────────────────
export { extendedAuthService } from './services/auth.service';

// ── Security Constants ─────────────────────────────────────────────
export {
  STORAGE_KEYS, COOKIE_NAMES, TOKEN_TTL, INACTIVITY,
  SESSION_MONITOR, PUBLIC_EXACT_ROUTES, PUBLIC_PREFIXES,
  SECURITY_HEADERS,
} from './security/constants';

export { isPublicPath } from './security/constants';
