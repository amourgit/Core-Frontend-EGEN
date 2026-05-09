// ============================================================
// hooks/useIAMAuth.ts
// Hook principal d'authentification Keycloak pour le Core SPA.
//
// FLUX LOGIN :
//  1. POST Keycloak OIDC → access_token + refresh_token
//  2. Stockage sécurisé : access en mémoire, refresh en sessionStorage
//  3. GET userinfo → profil + rôles
//  4. Hydrate le Context React → propagé aux modules via coreContext
//
// HOOKS DISPONIBLES :
//  - useIAMAuth()         → login / logout / état courant
//  - useIAMSessions()     → sessions actives de l'utilisateur
//  - useChangePassword()  → changement MDP (Keycloak Account API)
//  - useJournal()         → journal d'événements Keycloak
//  - useAdminResetPassword() → reset MDP par un admin
// ============================================================
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../lib/auth-provider';
import { tokenManager } from '../security/token-manager';
import { useSessionMonitor } from './useSessionMonitor';
import { getCurrentRealm } from '../lib/realm-resolver';
import { authService, profilService, adminUserService, storeAccessToken, storeRefreshToken, extractErrorMessage, } from '../services/auth.service';
// ── useIAMAuth ────────────────────────────────────────────────
export function useIAMAuth() {
    const ctx = useAuthContext();
    const navigate = useNavigate();
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    // Active le SessionMonitor dès l'authentification
    useSessionMonitor();
    // ── LOGIN ──────────────────────────────────────────────────
    const handleLogin = useCallback(async (credentials, redirectTo = '/home') => {
        setIsLoginLoading(true);
        setLoginError(null);
        try {
            // ── ÉTAPE 1 : Authentification OIDC Keycloak ────────
            // POST /realms/{realm}/protocol/openid-connect/token
            // grant_type=password + username + password + client_id
            const tokenResponse = await authService.login(credentials.username, credentials.password);
            // ── ÉTAPE 2 : Stockage sécurisé des tokens ──────────
            // access_token  → mémoire JS (tokenManager)
            // refresh_token → sessionStorage (SPA Vite — pas de BFF)
            tokenManager.setAccessToken(tokenResponse.access_token);
            tokenManager.setSessionId(tokenResponse.session_state);
            storeAccessToken(tokenResponse.access_token);
            storeRefreshToken(tokenResponse.refresh_token);
            // ── ÉTAPE 3 : Profil et rôles via userinfo ──────────
            // GET /realms/{realm}/protocol/openid-connect/userinfo
            // Authorization: Bearer <access_token>
            let permissions = [];
            let roles = [];
            let userInfo = null;
            try {
                userInfo = await profilService.getMonProfil(tokenResponse.access_token);
                const hab = profilService.getMesHabilitations(userInfo);
                roles = hab.roles_actifs;
                permissions = hab.permissions.map(p => p.code);
            }
            catch {
                // Non-bloquant : on peut se connecter même si userinfo échoue
            }
            // ── ÉTAPE 4 : Construction de l'objet utilisateur ───
            const userData = {
                id: userInfo?.sub ?? '',
                username: userInfo?.preferred_username ?? credentials.username,
                nom: userInfo?.family_name ?? '',
                prenom: userInfo?.given_name ?? '',
                email: userInfo?.email ?? '',
                roles,
                tenantId: getCurrentRealm().realm,
                type_profil: roles.includes('realm-admin') ? 'admin' : 'standard',
                is_admin: roles.includes('realm-admin'),
            };
            // ── ÉTAPE 5 : Hydratation du Context React ───────────
            await ctx.login(tokenResponse.access_token, tokenResponse.session_state, userData, permissions, roles);
            // ── ÉTAPE 6 : Redirection ────────────────────────────
            setTimeout(() => navigate(redirectTo), 300);
            return { success: true };
        }
        catch (error) {
            const msg = extractErrorMessage(error, 'Identifiant ou mot de passe incorrect');
            setLoginError(msg);
            tokenManager.clear();
            return { success: false, error: msg };
        }
        finally {
            setIsLoginLoading(false);
        }
    }, [ctx, navigate]);
    // ── LOGOUT ────────────────────────────────────────────────
    const handleLogout = useCallback(async () => {
        await ctx.logout(true);
    }, [ctx]);
    return {
        // État
        user: ctx.user,
        isAuthenticated: ctx.isAuthenticated,
        isLoading: ctx.isLoading,
        isLoginLoading,
        loginError,
        permissions: ctx.permissions,
        roles: ctx.roles,
        sessionId: ctx.sessionId,
        accessToken: ctx.accessToken,
        // Actions
        login: handleLogin,
        logout: handleLogout,
        clearLoginError: () => setLoginError(null),
        // Utilitaires
        hasPermission: ctx.hasPermission,
        hasRole: ctx.hasRole,
        refreshUser: ctx.refreshUser,
    };
}
// ── useIAMSessions ────────────────────────────────────────────
//
// Keycloak ne fournit pas d'endpoint "mes sessions" accessible
// avec le token utilisateur standard.
// → Le Core doit soit exposer un proxy server-side, soit
//   l'utilisateur doit avoir des droits admin view-users.
//
// Dans notre architecture SPA, on passe par le tokenManager
// pour fournir au moins la session courante.
export function useIAMSessions() {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const ctx = useAuthContext();
    const fetchSessions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const accessToken = tokenManager.getAccessToken();
            if (!accessToken || !ctx.user?.id) {
                setSessions([]);
                return;
            }
            // Appel Admin API avec le token courant
            // ⚠️ Requiert que l'utilisateur ait le rôle view-users ou realm-admin
            const kcSessions = await authService.getUserSessions(ctx.user.id, accessToken);
            setSessions(kcSessions.map(s => ({
                id: s.id,
                ipAddress: s.ipAddress,
                start: s.start,
                lastAccess: s.lastAccess,
                clients: s.clients,
            })));
        }
        catch (err) {
            setError(extractErrorMessage(err, 'Erreur lors du chargement des sessions'));
            // Fallback : afficher la session courante comme seule session connue
            if (ctx.sessionId) {
                setSessions([{
                        id: ctx.sessionId,
                        ipAddress: 'session courante',
                        start: Date.now() - 3600000,
                        lastAccess: Date.now(),
                        clients: {},
                    }]);
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [ctx.user?.id, ctx.sessionId]);
    const revokeSession = useCallback(async (sessionId) => {
        try {
            const accessToken = tokenManager.getAccessToken();
            if (!accessToken)
                throw new Error('Non authentifié');
            await authService.revokeSession(sessionId, accessToken);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            // Si on révoque la session courante → logout
            if (sessionId === ctx.sessionId)
                await ctx.logout(false);
            return { success: true };
        }
        catch (err) {
            const msg = extractErrorMessage(err, 'Erreur lors de la révocation');
            setError(msg);
            return { success: false, error: msg };
        }
    }, [ctx]);
    return { sessions, isLoading, error, currentSessionId: ctx.sessionId, fetchSessions, revokeSession };
}
// ── useChangePassword ─────────────────────────────────────────
//
// Utilise l'Account REST API de Keycloak (nécessite scope "account") :
//   POST /realms/{realm}/account/credentials/password
//
// Si non disponible, fallback vers l'Admin API via route proxy.
export function useChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const changePassword = useCallback(async (oldPassword, newPassword) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const accessToken = tokenManager.getAccessToken();
            if (!accessToken)
                throw new Error('Non authentifié');
            const { oidcBase } = getCurrentRealm();
            // POST /realms/{realm}/account/credentials/password
            const res = await fetch(`${oidcBase.replace('/protocol/openid-connect', '')}/account/credentials/password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: oldPassword,
                    newPassword,
                    confirmation: newPassword,
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.errorMessage ?? err?.error ?? `HTTP ${res.status}`);
            }
            setSuccess(true);
            return { success: true };
        }
        catch (err) {
            const msg = extractErrorMessage(err, 'Erreur lors du changement de mot de passe');
            setError(msg);
            return { success: false, error: msg };
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return {
        isLoading, error, success, changePassword,
        reset: () => { setError(null); setSuccess(false); },
    };
}
// ── useJournal ────────────────────────────────────────────────
//
// Journal des événements Keycloak de l'utilisateur courant.
// Requiert que l'utilisateur soit admin ou que le realm autorise
// l'accès aux events via account API.
export function useJournal(limit = 10) {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const ctx = useAuthContext();
    const fetchJournal = useCallback(async (skip = 0) => {
        setIsLoading(true);
        setError(null);
        try {
            const accessToken = tokenManager.getAccessToken();
            if (!accessToken || !ctx.user?.id) {
                setEntries([]);
                return;
            }
            const data = await profilService.getMonJournal(ctx.user.id, accessToken, skip, limit);
            setEntries(data);
        }
        catch (err) {
            setError(extractErrorMessage(err, 'Erreur lors du chargement du journal'));
        }
        finally {
            setIsLoading(false);
        }
    }, [ctx.user?.id, limit]);
    useEffect(() => { fetchJournal(); }, [fetchJournal]);
    return { entries, isLoading, error, refetch: fetchJournal };
}
// ── useAdminResetPassword ─────────────────────────────────────
//
// Réinitialisation du MDP par un admin :
//   PUT /admin/realms/{realm}/users/{userId}/reset-password
//   Body: { type: "password", value, temporary: true }
export function useAdminResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const resetPassword = useCallback(async (userId, newPassword, temporary = true) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const accessToken = tokenManager.getAccessToken();
            if (!accessToken)
                throw new Error('Non authentifié');
            await adminUserService.resetPassword(userId, accessToken, newPassword, temporary);
            setSuccess(true);
            return { success: true };
        }
        catch (err) {
            const msg = extractErrorMessage(err, 'Erreur lors de la réinitialisation');
            setError(msg);
            return { success: false, error: msg };
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return {
        isLoading, error, success, resetPassword,
        reset: () => { setError(null); setSuccess(false); },
    };
}
//# sourceMappingURL=useIAMAuth.js.map