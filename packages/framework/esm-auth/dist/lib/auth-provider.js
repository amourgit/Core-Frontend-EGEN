import { jsx as _jsx } from "react/jsx-runtime";
// ============================================================
// lib/auth/AuthProvider.tsx
// Provider React d'authentification — Source de vérité auth du Core.
//
// ARCHITECTURE SPA VITE (sans BFF / Route Handlers) :
//  1. Au montage → restaure la session :
//     a. Token en mémoire (tokenManager) si pas de reload de page
//     b. Access token en sessionStorage si rechargement récent
//     c. Refresh via Keycloak OIDC si access expiré mais refresh dispo
//  2. Login  → appel Keycloak OIDC → mémoire + sessionStorage
//  3. Logout → révocation refresh token côté Keycloak + nettoyage complet
//  4. Refresh auto planifié 60s avant expiration
//  5. Synchronise le store Zustand + expose le token aux modules
// ============================================================
import { createContext, useContext, useEffect, useRef, useState, useCallback, } from 'react';
import { getSession, logoutAndClean, scheduleTokenRefresh, cancelTokenRefresh, } from '../services/auth.service';
import { tokenManager, userDataStore } from '../security/token-manager';
import { clientCookieManager } from '../security/cookie-manager';
import { useAuthStore } from '../store/auth.store';
import { auditLogger } from '../security/audit-logger';
// ── Contexte ──────────────────────────────────────────────────
const AuthContext = createContext(null);
export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        return {
            accessToken: null,
            refreshToken: null,
            sessionId: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            permissions: [],
            roles: [],
            login: async () => { },
            logout: async () => { },
            hasPermission: () => false,
            hasRole: () => false,
            refreshUser: async () => { },
        };
    }
    return ctx;
}
const INITIAL_STATE = {
    user: null, accessToken: null, sessionId: null,
    isAuthenticated: false, isLoading: true,
    permissions: [], roles: [],
};
// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children, autoHydrate = true, onLogout, onLogin }) {
    const { setUser, setTenant, logout: storeLogout, setLoading } = useAuthStore();
    const [state, setState] = useState(INITIAL_STATE);
    const initialized = useRef(false);
    // ── Sync → Zustand ────────────────────────────────────────
    const syncToStore = useCallback((user, accessToken, permissions, roles) => {
        if (user && accessToken) {
            setUser({ id: user.id, username: user.username, email: user.email,
                prenom: user.prenom, nom: user.nom, roles, token: accessToken,
                tenantId: user.tenantId ?? 'default', avatarUrl: user.avatarUrl });
            userDataStore.setUser(user);
            userDataStore.setPermissionsAndRoles(permissions, roles);
        }
        else {
            storeLogout();
            userDataStore.clear();
        }
        setLoading(false);
    }, [setUser, storeLogout, setLoading]);
    // ── Hydratation ───────────────────────────────────────────
    useEffect(() => {
        if (initialized.current || !autoHydrate) {
            if (!autoHydrate)
                setState(p => ({ ...p, isLoading: false }));
            return;
        }
        initialized.current = true;
        (async () => {
            try {
                const session = await getSession();
                if (session.authenticated && session.user && session.accessToken) {
                    const { user, accessToken, permissions = [], roles = [], sessionId } = session;
                    setState({ user, accessToken, sessionId: sessionId ?? null,
                        isAuthenticated: true, isLoading: false, permissions, roles });
                    syncToStore(user, accessToken, permissions, roles);
                    clientCookieManager.setSessionActiveCookie(3600 * 8);
                    scheduleTokenRefresh((newToken) => {
                        setState(p => ({ ...p, accessToken: newToken }));
                        syncToStore(user, newToken, permissions, roles);
                    }, () => {
                        // Session révoquée côté Keycloak → logout propre
                        doLogout(false);
                    });
                }
                else {
                    setState(p => ({ ...p, isAuthenticated: false, isLoading: false }));
                    syncToStore(null, null, [], []);
                    clientCookieManager.clearSessionActiveCookie();
                }
            }
            catch (err) {
                console.error('[AuthProvider] hydrate error:', err);
                setState(p => ({ ...p, isAuthenticated: false, isLoading: false }));
                syncToStore(null, null, [], []);
            }
        })();
        return () => cancelTokenRefresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ── Connect httpClient logout callback ────────────────────
    useEffect(() => {
        import('../services/http-client').then(({ httpClient }) => {
            httpClient.setLogoutCallback(() => doLogout(false));
        }).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ── Login ─────────────────────────────────────────────────
    const login = useCallback(async (accessToken, sessionId, user, permissions, roles) => {
        setState({ user, accessToken, sessionId, isAuthenticated: true, isLoading: false, permissions, roles });
        syncToStore(user, accessToken, permissions, roles);
        clientCookieManager.setSessionActiveCookie(3600 * 8);
        scheduleTokenRefresh((newToken) => {
            setState(p => ({ ...p, accessToken: newToken }));
            syncToStore(user, newToken, permissions, roles);
        }, () => {
            doLogout(false);
        });
        auditLogger.log('token_refreshed', { user_id: user.id, session_id: sessionId });
        onLogin?.(user);
    }, [syncToStore, onLogin]);
    // ── Logout ────────────────────────────────────────────────
    const doLogout = useCallback(async (callApi = true) => {
        cancelTokenRefresh();
        if (callApi) {
            await logoutAndClean().catch(() => { });
        }
        else {
            tokenManager.clearAll();
            userDataStore.clear();
        }
        setState({ user: null, accessToken: null, sessionId: null,
            isAuthenticated: false, isLoading: false, permissions: [], roles: [] });
        syncToStore(null, null, [], []);
        clientCookieManager.clearSessionActiveCookie();
        auditLogger.log('logout_manual');
        onLogout?.();
    }, [syncToStore, onLogout]);
    // ── Refresh User ──────────────────────────────────────────
    const refreshUser = useCallback(async () => {
        const session = await getSession();
        if (session.authenticated && session.user && session.accessToken) {
            const { user, accessToken, permissions = [], roles = [], sessionId } = session;
            setState(p => ({ ...p, user, accessToken, sessionId: sessionId ?? p.sessionId,
                isAuthenticated: true, permissions, roles }));
            syncToStore(user, accessToken, permissions, roles);
        }
    }, [syncToStore]);
    // ── Utilitaires ───────────────────────────────────────────
    const hasPermission = useCallback((p) => state.permissions.includes(p), [state.permissions]);
    const hasRole = useCallback((r) => state.roles.includes(r), [state.roles]);
    const value = {
        accessToken: state.accessToken,
        refreshToken: null,
        sessionId: state.sessionId,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        permissions: state.permissions,
        roles: state.roles,
        login,
        logout: doLogout,
        hasPermission,
        hasRole,
        refreshUser,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export { AuthContext };
//# sourceMappingURL=auth-provider.js.map