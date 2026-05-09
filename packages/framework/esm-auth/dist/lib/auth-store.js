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
// ── tokenStore (compatibilité descendante) ────────────────────
// Les anciens composants qui importent tokenStore continuent de fonctionner.
import { tokenManager, userDataStore } from '../security/token-manager';
import { clientCookieManager } from '../security/cookie-manager';
export const tokenStore = {
    setTokens(accessToken, _refreshToken, sessionId) {
        tokenManager.setAccessToken(accessToken);
        if (sessionId)
            tokenManager.setSessionId(sessionId);
    },
    setUser(user) { userDataStore.setUser(user); },
    setPermissionsAndRoles(p, r) { userDataStore.setPermissionsAndRoles(p, r); },
    getAccessToken() { return tokenManager.getAccessToken(); },
    getRefreshToken() { return null; },
    getSessionId() { return tokenManager.getSessionId(); },
    getUser() { return userDataStore.getUser(); },
    getPermissions() { return userDataStore.getPermissions(); },
    getRoles() { return userDataStore.getRoles(); },
    hasValidSession() { return tokenManager.hasValidToken() || clientCookieManager.hasActiveSession(); },
    clear() { tokenManager.clearAll(); clientCookieManager.clearSessionActiveCookie(); },
};
//# sourceMappingURL=auth-store.js.map