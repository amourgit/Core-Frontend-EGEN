// ============================================================
// @egen/esm-auth — Authentication & IAM Package
//
// Usage dans un micro-frontend :
//   import { useAuthContext, tokenManager, usePermissions } from '@egen/esm-auth';
// ============================================================
// ── Provider & Context ────────────────────────────────────────
export { AuthProvider, useAuthContext, AuthContext } from './lib/auth-provider';
export { tokenStore } from './lib/auth-store';
// ── Security ─────────────────────────────────────────────────
export { tokenManager, userDataStore } from './security/token-manager';
export { clientCookieManager } from './security/cookie-manager';
export { decodeJWTUnsafe, isTokenExpired, tokenExpiresInMs, } from './security/jwt-verifier';
export { auditLogger } from './security/audit-logger';
export { KEYCLOAK_REALM_HEADER, DEFAULT_REALM, } from './security/constants';
// ── Services ─────────────────────────────────────────────────
export { getSession, logoutAndClean, scheduleTokenRefresh, cancelTokenRefresh, } from './services/auth.service';
export { httpClient } from './services/http-client';
// ── Hooks ─────────────────────────────────────────────────────
export { useAuth } from './hooks/useAuth';
export { useIAMAuth } from './hooks/useIAMAuth';
export { usePermissions } from './hooks/usePermissions';
export { useKeycloakSession } from './hooks/useKeycloakSession';
export { useSessionMonitor } from './hooks/useSessionMonitor';
// ── Store (Zustand) ───────────────────────────────────────────
export { useAuthStore } from './store/auth.store';
export { useRegistryStore } from './store/registry.store';
// ── Utilities ─────────────────────────────────────────────────
export * from './utils-iam';
export { resolveSubdomains } from './lib/subdomain-resolver';
export { resolveRealm } from './lib/realm-resolver';
export { iamNavItems } from './lib/iam-nav-static';
//# sourceMappingURL=index.js.map