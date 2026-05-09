// ============================================================
// lib/auth-store.ts
// Re-exports centralisés pour l'authentification.
//
// IMPORTANT : useAuthContext est ré-exporté depuis le vrai Provider
// (lib/auth/AuthProvider) pour éviter des imports dupliqués
// et garantir que tout le monde utilise le même Context.
// ============================================================

// ── Re-export depuis le vrai Provider ────────────────────────
export { useAuthContext, AuthContext, AuthProvider } from '../lib/auth-provider';

// ── Types ────────────────────────────────────────────────────
export type { AuthContextType } from '../lib/auth-store.types';

// ── tokenStore (compatibilité descendante) ────────────────────
// Les anciens composants qui importent tokenStore continuent de fonctionner.
import { tokenManager, userDataStore } from '../security/token-manager';
import { clientCookieManager }         from '../security/cookie-manager';
import type { CurrentUser }            from '../models/auth.model';

export const tokenStore = {
  setTokens(accessToken: string, _refreshToken: string, sessionId?: string): void {
    tokenManager.setAccessToken(accessToken);
    if (sessionId) tokenManager.setSessionId(sessionId);
  },
  setUser(user: CurrentUser): void    { userDataStore.setUser(user); },
  setPermissionsAndRoles(p: string[], r: string[]): void { userDataStore.setPermissionsAndRoles(p, r); },
  getAccessToken(): string | null     { return tokenManager.getAccessToken(); },
  getRefreshToken(): null             { return null; },
  getSessionId(): string | null       { return tokenManager.getSessionId(); },
  getUser(): CurrentUser | null       { return userDataStore.getUser<CurrentUser>(); },
  getPermissions(): string[]          { return userDataStore.getPermissions(); },
  getRoles(): string[]                { return userDataStore.getRoles(); },
  hasValidSession(): boolean          { return tokenManager.hasValidToken() || clientCookieManager.hasActiveSession(); },
  clear(): void                       { tokenManager.clearAll(); clientCookieManager.clearSessionActiveCookie(); },
};
