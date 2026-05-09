// ============================================================
// services/iam/authService.ts
// Tous les appels Keycloak — OIDC Token Endpoint + Admin REST API
//
// ARCHITECTURE KEYCLOAK :
//  🔐 Auth   → POST /realms/{realm}/protocol/openid-connect/token
//  👤 Profil → GET  /realms/{realm}/protocol/openid-connect/userinfo
//  🛠 Admin  → /admin/realms/{realm}/users/**   (Bearer token admin)
//
// Variables d'environnement attendues (Vite) :
//   VITE_KEYCLOAK_URL    = https://auth.mondomaine.com
//   VITE_KEYCLOAK_REALM  = mon-realm
//   VITE_KEYCLOAK_CLIENT = mon-client-id
//   KEYCLOAK_CLIENT_SECRET      = (si client confidentiel, côté serveur uniquement)
// ============================================================
import { getCurrentRealm } from '../lib/realm-resolver';
import { tokenManager, userDataStore } from '../security/token-manager';
import { decodeJWTUnsafe } from '../security/jwt-verifier';
// ── Config Keycloak ────────────────────────────────────────
const KC_URL = import.meta.env.VITE_KEYCLOAK_URL;
const KC_CLIENT = import.meta.env.VITE_KEYCLOAK_CLIENT;
/**
 * Retourne la base OIDC pour le realm courant (dynamique via sous-domaine).
 * Appelée à chaque requête pour garantir la cohérence multi-tenant.
 */
function getOidcBase() {
    const { realm } = getCurrentRealm();
    return `${KC_URL}/realms/${realm}/protocol/openid-connect`;
}
/**
 * Retourne la base Admin REST API pour le realm courant.
 */
function getAdminBase() {
    const { realm } = getCurrentRealm();
    return `${KC_URL}/admin/realms/${realm}`;
}
// ── Extraction du message d'erreur Keycloak ────────────────
export function extractErrorMessage(error, fallback = 'Une erreur est survenue') {
    if (error instanceof Error) {
        const msg = error.message;
        // Keycloak retourne { error: "invalid_grant", error_description: "..." }
        try {
            const parsed = JSON.parse(msg);
            if (parsed.error_description)
                return parsed.error_description;
            if (parsed.errorMessage)
                return parsed.errorMessage;
            if (parsed.error)
                return parsed.error;
        }
        catch { /* pas du JSON */ }
        if (msg.includes('401') || msg.toLowerCase().includes('invalid_grant'))
            return 'Identifiant ou mot de passe incorrect';
        if (msg.includes('403'))
            return 'Accès refusé';
        if (msg.includes('404'))
            return 'Ressource introuvable';
        if (msg.includes('409'))
            return 'Conflit : ressource déjà existante';
        if (msg.includes('429'))
            return 'Trop de tentatives, réessayez dans quelques minutes';
        if (msg.includes('500'))
            return 'Erreur serveur, veuillez réessayer';
        return msg || fallback;
    }
    return fallback;
}
// ── Helper : appel OIDC token endpoint (x-www-form-urlencoded) ──
async function oidcTokenRequest(params) {
    const body = new URLSearchParams({
        client_id: KC_CLIENT,
        ...params,
    });
    const res = await fetch(`${getOidcBase()}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(err) || `HTTP ${res.status}`);
    }
    return res.json();
}
// ── Helper : appel Admin REST API (JSON + Bearer) ──────────
async function adminRequest(method, path, token, body) {
    const res = await fetch(`${getAdminBase()}${path}`, {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(err) || `HTTP ${res.status}`);
    }
    // 204 No Content → pas de body
    if (res.status === 204)
        return undefined;
    return res.json();
}
// ============================================================
// AUTH SERVICE  — OIDC Token Endpoint
// ============================================================
export const authService = {
    /**
     * POST /realms/{realm}/protocol/openid-connect/token
     * grant_type=password  (Resource Owner Password Credentials)
     *
     * ⚠️  Ce grant doit être activé dans Keycloak :
     *     Client → Settings → "Direct access grants" = ON
     */
    async login(username, password) {
        return oidcTokenRequest({
            grant_type: 'password',
            username,
            password,
            scope: 'openid profile email',
        });
    },
    /**
     * POST /realms/{realm}/protocol/openid-connect/token
     * grant_type=refresh_token
     */
    async refreshToken(refreshToken) {
        return oidcTokenRequest({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });
    },
    /**
     * POST /realms/{realm}/protocol/openid-connect/logout
     * Révoque la session côté Keycloak
     *
     * Headers : Content-Type: application/x-www-form-urlencoded
     * Body    : client_id + refresh_token
     */
    async logout(refreshToken) {
        if (!refreshToken)
            return;
        const body = new URLSearchParams({
            client_id: KC_CLIENT,
            refresh_token: refreshToken,
        });
        await fetch(`${getOidcBase()}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });
        // Keycloak retourne 204 — on ignore les erreurs de logout
    },
    /**
     * POST /realms/{realm}/protocol/openid-connect/token/introspect
     * Valide un token et retourne ses métadonnées
     *
     * ⚠️  Nécessite client_secret si client confidentiel.
     *     En public client, utiliser la validation JWT locale à la place.
     */
    async introspectToken(token, clientSecret) {
        const body = new URLSearchParams({
            client_id: KC_CLIENT,
            token,
            ...(clientSecret ? { client_secret: clientSecret } : {}),
        });
        const res = await fetch(`${getOidcBase()}/token/introspect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });
        if (!res.ok)
            throw new Error(`Introspection failed: HTTP ${res.status}`);
        return res.json();
    },
    /**
     * GET /realms/{realm}/protocol/openid-connect/userinfo
     * Retourne les claims de l'utilisateur courant (profil + rôles si mappés)
     *
     * Authorization: Bearer <access_token>
     */
    async getUserInfo(accessToken) {
        const res = await fetch(`${getOidcBase()}/userinfo`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!res.ok)
            throw new Error(`UserInfo failed: HTTP ${res.status}`);
        return res.json();
    },
    // ── Sessions utilisateur courant ──────────────────────────
    /**
     * GET /admin/realms/{realm}/users/{userId}/sessions
     * Liste les sessions actives d'un utilisateur
     *
     * ⚠️  Requiert un token admin (realm-admin ou view-users)
     *     Pour les sessions de l'utilisateur courant, utilise userId extrait du token JWT
     */
    async getUserSessions(userId, adminToken) {
        return adminRequest('GET', `/users/${userId}/sessions`, adminToken);
    },
    /**
     * DELETE /admin/realms/{realm}/sessions/{sessionId}
     * Révoque une session spécifique (toutes applications)
     *
     * ⚠️  Requiert un token admin
     */
    async revokeSession(sessionId, adminToken) {
        return adminRequest('DELETE', `/sessions/${sessionId}`, adminToken);
    },
    /**
     * DELETE /admin/realms/{realm}/users/{userId}/sessions
     * Révoque TOUTES les sessions d'un utilisateur
     */
    async revokeAllUserSessions(userId, adminToken) {
        return adminRequest('DELETE', `/users/${userId}/sessions`, adminToken);
    },
};
// ============================================================
// PROFIL SERVICE  — Profil + Rôles de l'utilisateur courant
// ============================================================
export const profilService = {
    /**
     * GET /realms/{realm}/protocol/openid-connect/userinfo
     * Profil complet de l'utilisateur authentifié
     *
     * Les rôles sont dans :
     *   userInfo.realm_access.roles        → rôles du realm
     *   userInfo.resource_access[clientId] → rôles du client
     *
     * ⚠️  Pour que les rôles apparaissent, configurer les Protocol Mappers
     *     dans Keycloak : Client → Client Scopes → roles → mapper "realm roles"
     */
    async getMonProfil(accessToken) {
        return authService.getUserInfo(accessToken);
    },
    /**
     * Extrait permissions et rôles depuis un KcUserInfo
     * Retourne { roles_actifs, permissions }
     */
    getMesHabilitations(userInfo, clientId = KC_CLIENT) {
        const realmRoles = userInfo.realm_access?.roles ?? [];
        const clientRoles = userInfo.resource_access?.[clientId]?.roles ?? [];
        const roles_actifs = [...new Set([...realmRoles, ...clientRoles])];
        // On mappe les rôles comme "permissions" pour garder la compatibilité
        const permissions = roles_actifs.map((code) => ({ code, label: code }));
        return {
            profil_id: userInfo.sub,
            roles_actifs,
            permissions,
            groupes_actifs: [], // Keycloak ne retourne pas les groupes dans userinfo par défaut
        };
    },
    /**
     * GET /admin/realms/{realm}/users/{userId}/role-mappings/realm
     * Rôles realm d'un utilisateur (admin uniquement)
     */
    async getRealmRoles(userId, adminToken) {
        return adminRequest('GET', `/users/${userId}/role-mappings/realm`, adminToken);
    },
    /**
     * GET /admin/realms/{realm}/events
     * Journal des événements (login, logout, etc.) pour le realm
     * Filtrer par user : ?user={userId}&type=LOGIN&type=LOGOUT
     *
     * ⚠️  Requiert token admin avec permission view-events
     */
    async getMonJournal(userId, adminToken, skip = 0, limit = 50) {
        const params = new URLSearchParams({
            user: userId,
            first: String(skip),
            max: String(limit),
        });
        const res = await fetch(`${getAdminBase()}/events?${params}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` },
        });
        if (!res.ok)
            throw new Error(`Events failed: HTTP ${res.status}`);
        return res.json();
    },
};
// ============================================================
// ADMIN USER SERVICE  — Gestion des utilisateurs (admin)
// ============================================================
export const adminUserService = {
    /**
     * GET /admin/realms/{realm}/users
     * Liste les utilisateurs avec pagination et recherche
     *
     * Params optionnels : search, username, email, firstName, lastName,
     *                     first (offset), max (limit), enabled, emailVerified
     */
    async listUsers(adminToken, params = {}) {
        const qs = new URLSearchParams();
        if (params.search !== undefined)
            qs.set('search', params.search);
        if (params.username !== undefined)
            qs.set('username', params.username);
        if (params.email !== undefined)
            qs.set('email', params.email);
        if (params.first !== undefined)
            qs.set('first', String(params.first));
        if (params.max !== undefined)
            qs.set('max', String(params.max));
        if (params.enabled !== undefined)
            qs.set('enabled', String(params.enabled));
        const res = await fetch(`${getAdminBase()}/users?${qs}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` },
        });
        if (!res.ok)
            throw new Error(`List users failed: HTTP ${res.status}`);
        return res.json();
    },
    /**
     * GET /admin/realms/{realm}/users/{userId}
     * Récupère un utilisateur par son ID Keycloak
     */
    async getUser(userId, adminToken) {
        return adminRequest('GET', `/users/${userId}`, adminToken);
    },
    /**
     * POST /admin/realms/{realm}/users
     * Crée un nouvel utilisateur
     * Retourne 201 Created (l'ID est dans le header Location)
     *
     * Body minimal : { username, enabled: true }
     */
    async createUser(adminToken, user) {
        const res = await fetch(`${getAdminBase()}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ enabled: true, ...user }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(JSON.stringify(err) || `Create user failed: HTTP ${res.status}`);
        }
        // Keycloak met l'ID dans le header Location : .../users/{id}
        const location = res.headers.get('Location') ?? '';
        const userId = location.split('/').pop() ?? '';
        return { userId };
    },
    /**
     * PUT /admin/realms/{realm}/users/{userId}
     * Met à jour un utilisateur (remplace les champs fournis)
     */
    async updateUser(userId, adminToken, updates) {
        return adminRequest('PUT', `/users/${userId}`, adminToken, updates);
    },
    /**
     * DELETE /admin/realms/{realm}/users/{userId}
     * Supprime un utilisateur
     */
    async deleteUser(userId, adminToken) {
        return adminRequest('DELETE', `/users/${userId}`, adminToken);
    },
    /**
     * PUT /admin/realms/{realm}/users/{userId}/reset-password
     * Réinitialise le mot de passe d'un utilisateur (admin)
     *
     * Body : { type: "password", value: "newPassword", temporary: true|false }
     * temporary=true → l'utilisateur devra changer son MDP à la prochaine connexion
     */
    async resetPassword(userId, adminToken, newPassword, temporary = true) {
        return adminRequest('PUT', `/users/${userId}/reset-password`, adminToken, { type: 'password', value: newPassword, temporary });
    },
    /**
     * PUT /admin/realms/{realm}/users/{userId}
     * Active ou désactive un compte utilisateur
     */
    async setUserEnabled(userId, adminToken, enabled) {
        return adminRequest('PUT', `/users/${userId}`, adminToken, { enabled });
    },
    /**
     * POST /admin/realms/{realm}/users/{userId}/role-mappings/realm
     * Assigne des rôles realm à un utilisateur
     *
     * Body : [{ id, name }]  (tableau de KcRoleRepresentation)
     */
    async assignRealmRoles(userId, adminToken, roles) {
        return adminRequest('POST', `/users/${userId}/role-mappings/realm`, adminToken, roles);
    },
    /**
     * DELETE /admin/realms/{realm}/users/{userId}/role-mappings/realm
     * Retire des rôles realm d'un utilisateur
     */
    async removeRealmRoles(userId, adminToken, roles) {
        return adminRequest('DELETE', `/users/${userId}/role-mappings/realm`, adminToken, roles);
    },
    /**
     * GET /admin/realms/{realm}/users/count
     * Nombre total d'utilisateurs du realm
     */
    async countUsers(adminToken) {
        return adminRequest('GET', '/users/count', adminToken);
    },
};
// ============================================================
// ADMIN SESSION SERVICE  — Métriques et stats (admin)
// ============================================================
export const adminSessionService = {
    /**
     * GET /admin/realms/{realm}/sessions/stats
     * Statistiques des sessions actives par client
     */
    async getSessionStats(adminToken) {
        return adminRequest('GET', '/sessions/stats', adminToken);
    },
    /**
     * GET /admin/realms/{realm}/clients/{clientUuid}/session-count
     * Nombre de sessions actives pour un client spécifique
     */
    async getClientSessionCount(clientUuid, adminToken) {
        return adminRequest('GET', `/clients/${clientUuid}/session-count`, adminToken);
    },
    /**
     * GET /admin/realms/{realm}/clients/{clientUuid}/user-sessions
     * Liste des sessions utilisateur pour un client
     */
    async getClientUserSessions(clientUuid, adminToken, first = 0, max = 100) {
        return adminRequest('GET', `/clients/${clientUuid}/user-sessions?first=${first}&max=${max}`, adminToken);
    },
};
// ── Gestion du Refresh Token (SPA Vite — sans BFF) ───────────
//
// ARCHITECTURE SÉCURITÉ SPA :
//   - access_token  → mémoire JS uniquement (tokenManager)
//   - refresh_token → sessionStorage (survit aux navigations,
//     effacé à la fermeture de l'onglet/fenêtre)
//   - Le refresh se fait directement vers Keycloak OIDC
//     (pas de Route Handler intermédiaire dans une SPA Vite)
//
// COMPROMIS ACCEPTÉ :
//   Dans une vraie SPA sans BFF (Backend For Frontend),
//   le refresh token doit vivre quelque part côté client.
//   sessionStorage est préférable à localStorage car il est
//   isolé par onglet et effacé à la fermeture du navigateur.
//
// POUR UNE SÉCURITÉ MAXIMALE : déployer un BFF (Node/Express)
//   qui stocke le refresh token dans un cookie HttpOnly et
//   expose un endpoint /api/auth/refresh sécurisé.
// ─────────────────────────────────────────────────────────────
const RT_STORAGE_KEY = 'iam_rt_session';
const AT_STORAGE_KEY = 'iam_at_session';
/** Persiste le refresh token dans sessionStorage (SPA Vite) */
export function storeRefreshToken(token) {
    if (typeof window === 'undefined')
        return;
    try {
        sessionStorage.setItem(RT_STORAGE_KEY, token);
    }
    catch { /* quota */ }
}
/** Récupère le refresh token depuis sessionStorage */
export function getStoredRefreshToken() {
    if (typeof window === 'undefined')
        return null;
    try {
        return sessionStorage.getItem(RT_STORAGE_KEY);
    }
    catch {
        return null;
    }
}
/** Persiste l'access token dans sessionStorage (backup mémoire) */
export function storeAccessToken(token) {
    if (typeof window === 'undefined')
        return;
    try {
        sessionStorage.setItem(AT_STORAGE_KEY, token);
    }
    catch { /* quota */ }
}
/** Récupère l'access token depuis sessionStorage (si mémoire perdue) */
export function getStoredAccessToken() {
    if (typeof window === 'undefined')
        return null;
    try {
        return sessionStorage.getItem(AT_STORAGE_KEY);
    }
    catch {
        return null;
    }
}
/** Efface tous les tokens persistés (logout) */
export function clearStoredTokens() {
    if (typeof window === 'undefined')
        return;
    try {
        sessionStorage.removeItem(RT_STORAGE_KEY);
        sessionStorage.removeItem(AT_STORAGE_KEY);
    }
    catch { /* ignore */ }
}
// ── Session hydration (SPA Vite — remplace /api/auth/session) ─
/**
 * Simule un GET /api/auth/session pour une SPA Vite.
 *
 * Dans Next.js, ce serait un Route Handler qui lit les cookies HttpOnly.
 * Ici, on restitue la session depuis :
 *   1. tokenManager (mémoire — si l'app n'a pas été rechargée)
 *   2. sessionStorage (backup — si l'app a été rechargée dans l'onglet)
 *   3. Refresh via Keycloak si l'access token est expiré mais le refresh existe
 */
/**
 * Restaure la session côté SPA Vite (sans BFF).
 *
 * Priorité :
 *  1. Token valide en mémoire (tokenManager) + vérification Keycloak userinfo
 *  2. Access token valide en sessionStorage + vérification Keycloak userinfo
 *  3. Refresh token disponible → appel Keycloak pour obtenir un nouveau AT
 *  4. Aucune session valide → { authenticated: false }
 *
 * La vérification via userinfo garantit que la session Keycloak est
 * toujours active (pas juste que le JWT est localement valide).
 */
export async function getSession() {
    // ── 1. Token en mémoire valide ─────────────────────────
    let accessToken = tokenManager.getAccessToken();
    if (accessToken && !isTokenExpiredLocal(accessToken)) {
        // Vérifier que la session Keycloak est toujours active
        const kcCheck = await verifyKeycloakSession(accessToken);
        if (kcCheck === 'valid') {
            const user = userDataStore.getUser();
            const permissions = userDataStore.getPermissions();
            const roles = userDataStore.getRoles();
            const sessionId = tokenManager.getSessionId();
            if (user) {
                return { authenticated: true, accessToken, user, permissions, roles, sessionId: sessionId ?? undefined };
            }
        }
        else if (kcCheck === 'revoked') {
            // Session révoquée côté Keycloak → nettoyer et continuer vers refresh
            clearStoredTokens();
            tokenManager.clear();
            accessToken = null;
        }
        // kcCheck === 'network_error' → on continue et tente le refresh
    }
    // ── 2. Restauration depuis sessionStorage ───────────────
    const storedAT = getStoredAccessToken();
    const storedRT = getStoredRefreshToken();
    if (storedAT && !isTokenExpiredLocal(storedAT)) {
        const kcCheck = await verifyKeycloakSession(storedAT);
        if (kcCheck === 'valid') {
            tokenManager.setAccessToken(storedAT);
            const payload = decodeJWTUnsafe(storedAT);
            const roles = [
                ...(payload?.realm_access?.roles ?? []),
                ...Object.values(payload?.resource_access ?? {}).flatMap(c => c.roles),
            ];
            const user = userDataStore.getUser() ?? buildUserFromToken(storedAT);
            if (user) {
                userDataStore.setUser(user);
                userDataStore.setPermissionsAndRoles(roles, roles);
                return { authenticated: true, accessToken: storedAT, user, permissions: roles, roles };
            }
        }
        else if (kcCheck === 'revoked') {
            clearStoredTokens();
            tokenManager.clear();
        }
    }
    // ── 3. Refresh token dispo → renouvellement Keycloak ───
    if (storedRT) {
        try {
            const tokenResp = await authService.refreshToken(storedRT);
            tokenManager.setAccessToken(tokenResp.access_token);
            tokenManager.setSessionId(tokenResp.session_state);
            storeAccessToken(tokenResp.access_token);
            storeRefreshToken(tokenResp.refresh_token);
            const payload = decodeJWTUnsafe(tokenResp.access_token);
            const roles = [
                ...(payload?.realm_access?.roles ?? []),
                ...Object.values(payload?.resource_access ?? {}).flatMap(c => c.roles),
            ];
            const userInfo = await profilService.getMonProfil(tokenResp.access_token).catch(() => null);
            const user = userInfo ? buildUserFromUserInfo(userInfo, roles) : buildUserFromToken(tokenResp.access_token);
            if (user) {
                userDataStore.setUser(user);
                userDataStore.setPermissionsAndRoles(roles, roles);
                return {
                    authenticated: true,
                    accessToken: tokenResp.access_token,
                    sessionId: tokenResp.session_state,
                    user,
                    permissions: roles,
                    roles,
                };
            }
        }
        catch (err) {
            // Refresh refusé par Keycloak (session révoquée, expirée, etc.)
            console.info('[getSession] Refresh token rejeté par Keycloak:', err);
            clearStoredTokens();
            tokenManager.clear();
        }
    }
    return { authenticated: false };
}
/**
 * Vérifie si la session Keycloak est toujours valide via userinfo.
 *
 * @returns 'valid'         — session active et token valide
 * @returns 'revoked'       — 401/403 → session révoquée ou token invalide
 * @returns 'network_error' — erreur réseau ou timeout (failsafe)
 */
async function verifyKeycloakSession(accessToken) {
    try {
        const { oidcBase } = getCurrentRealm();
        const res = await fetch(`${oidcBase}/userinfo`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Cache-Control': 'no-store',
            },
            signal: AbortSignal.timeout(8000),
        });
        if (res.status === 401 || res.status === 403)
            return 'revoked';
        if (!res.ok)
            return 'network_error'; // 5xx → failsafe
        return 'valid';
    }
    catch {
        // Timeout ou erreur réseau → failsafe (ne pas déconnecter)
        return 'network_error';
    }
}
/** Logout : révoque le refresh token côté Keycloak + nettoie tout */
export async function logoutAndClean() {
    const refreshToken = getStoredRefreshToken();
    clearStoredTokens();
    tokenManager.clearAll();
    userDataStore.clear();
    if (refreshToken) {
        try {
            await authService.logout(refreshToken);
        }
        catch {
            // Non-bloquant
        }
    }
}
// ── Helpers internes ──────────────────────────────────────────
function isTokenExpiredLocal(token) {
    const p = decodeJWTUnsafe(token);
    if (!p?.exp)
        return true;
    // Marge de 30s pour les décalages d'horloge
    return p.exp - 30 < Math.floor(Date.now() / 1000);
}
function buildUserFromToken(token) {
    const p = decodeJWTUnsafe(token);
    if (!p?.sub)
        return null;
    return {
        id: p.sub,
        username: p.preferred_username ?? p.sub,
        email: p.email ?? '',
        prenom: p.given_name,
        nom: p.family_name,
        roles: [
            ...(p.realm_access?.roles ?? []),
            ...Object.values(p.resource_access ?? {}).flatMap(c => c.roles),
        ],
    };
}
function buildUserFromUserInfo(info, roles) {
    return {
        id: info.sub,
        username: info.preferred_username,
        email: info.email ?? '',
        prenom: info.given_name,
        nom: info.family_name,
        roles,
    };
}
// ── Planification du refresh automatique ──────────────────────
//
// FLUX CORRECT :
//  1. Timer déclenché 60s avant expiration du token
//  2. Vérification que le refresh token existe en sessionStorage
//  3. Appel Keycloak token endpoint → refresh_token grant
//  4. Si Keycloak répond 401/400 → refresh_token expiré/révoqué
//     → signaler au callback pour déclencher un logout propre
//  5. Si succès → nouveau token en mémoire + re-planification
//
// DÉTECTION DE RÉVOCATION :
//  Si Keycloak refuse le refresh (invalid_grant, session_not_active,
//  token_expired) → la session est définitivement invalide.
//  On appelle onRevoked() pour que l'AuthProvider déconnecte l'utilisateur.
// ─────────────────────────────────────────────────────────────
let _refreshTimer = null;
/**
 * Planifie un refresh automatique 60 s avant l'expiration du token.
 * Appelé par AuthProvider après chaque login ou hydratation.
 *
 * @param callbacks.onRefreshed  Callback avec le nouveau token si succès
 * @param callbacks.onRevoked    Callback si révocation/expiration confirmée
 */
export function scheduleTokenRefresh(onRefreshed, onRevoked) {
    cancelTokenRefresh();
    const token = tokenManager.getAccessToken();
    if (!token)
        return;
    const payload = decodeJWTUnsafe(token);
    if (!payload?.exp)
        return;
    // Refresh 60 s avant expiration (minimum 10 s)
    const nowMs = Date.now();
    const expMs = payload.exp * 1000;
    const delayMs = Math.max(10000, expMs - nowMs - 60000);
    _refreshTimer = setTimeout(async () => {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) {
            // Pas de refresh token → session perdue (rechargement page sans RT)
            // Le SessionMonitor détectera l'expiration du AT et déconnectera
            cancelTokenRefresh();
            onRevoked?.();
            return;
        }
        try {
            const resp = await authService.refreshToken(refreshToken);
            // Succès : stocker les nouveaux tokens
            tokenManager.setAccessToken(resp.access_token);
            tokenManager.setSessionId(resp.session_state);
            storeAccessToken(resp.access_token);
            storeRefreshToken(resp.refresh_token);
            // Re-planifier le prochain refresh
            scheduleTokenRefresh(onRefreshed, onRevoked);
            onRefreshed?.(resp.access_token);
        }
        catch (err) {
            // Analyser l'erreur Keycloak
            const errMsg = err instanceof Error ? err.message : String(err);
            let isRevocation = false;
            try {
                const parsed = JSON.parse(errMsg);
                // Codes d'erreur Keycloak indiquant une révocation définitive :
                // - invalid_grant : refresh token expiré ou révoqué
                // - session_not_active : session Keycloak fermée
                // - token_expired : token expiré côté serveur
                const revokedErrors = ['invalid_grant', 'session_not_active', 'token_expired'];
                if (revokedErrors.includes(parsed?.error)) {
                    isRevocation = true;
                }
            }
            catch {
                // Si le message contient ces codes sans JSON
                if (errMsg.includes('invalid_grant') || errMsg.includes('session_not_active')) {
                    isRevocation = true;
                }
                // 400 = invalid_grant (Keycloak standard)
                if (errMsg.includes('HTTP 400') || errMsg.includes('HTTP 401')) {
                    isRevocation = true;
                }
            }
            clearStoredTokens();
            tokenManager.clear();
            cancelTokenRefresh();
            if (isRevocation) {
                // Session définitivement invalide → déclencher logout côté AuthProvider
                console.info('[TokenRefresh] Session révoquée par Keycloak → logout');
                onRevoked?.();
            }
            else {
                // Erreur réseau transitoire → ne pas déconnecter, on réessaiera
                console.warn('[TokenRefresh] Erreur réseau transitoire, refresh reporté:', errMsg);
                // Re-planifier un essai dans 30s
                _refreshTimer = setTimeout(() => scheduleTokenRefresh(onRefreshed, onRevoked), 30000);
            }
        }
    }, delayMs);
}
export function cancelTokenRefresh() {
    if (_refreshTimer !== null) {
        clearTimeout(_refreshTimer);
        _refreshTimer = null;
    }
}
//# sourceMappingURL=auth.service.js.map