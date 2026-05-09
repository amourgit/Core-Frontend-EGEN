// ============================================================
// lib/http-client.ts
// Client HTTP sécurisé — tokens via mémoire + Route Handlers.
//
// CHANGEMENTS vs ancienne version :
//  - getAccessToken() lit tokenManager (mémoire), plus localStorage
//  - Refresh 401 → POST /api/auth/refresh (Route Handler)
//    qui lit le cookie HttpOnly et retourne le nouveau token
//  - Le nouveau token est stocké en mémoire via tokenManager
//  - Jamais de contact direct avec localStorage pour les tokens
// ============================================================
import { tokenManager } from '../security/token-manager';
import { auditLogger } from '../security/audit-logger';
import { getCurrentRealm, resolveRealm } from '../lib/realm-resolver';
const BACKEND_BASE = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8000';
const API_V1 = `${BACKEND_BASE}/api/v1`;
// ── Realm dynamique ───────────────────────────────────────
// Expose le realm courant pour les services qui en ont besoin
// sans recalcul à chaque requête (cache module-level).
export function getActiveRealm() {
    if (typeof window !== 'undefined') {
        return getCurrentRealm().realm;
    }
    // SSR fallback
    return resolveRealm().realm;
}
export function getActiveAdminBase() {
    const { adminBase } = typeof window !== 'undefined'
        ? getCurrentRealm()
        : resolveRealm();
    return adminBase;
}
export function getActiveOidcBase() {
    const { oidcBase } = typeof window !== 'undefined'
        ? getCurrentRealm()
        : resolveRealm();
    return oidcBase;
}
// ── Helper : extraction du message d'erreur Keycloak ─────────
// Keycloak peut retourner plusieurs formats selon la version et l'endpoint :
//   { errorMessage: "..." }                   → Admin API standard
//   { error: "...", error_description: "..." } → OAuth2 / Token endpoint
//   { detail: "..." }                          → Proxy FastAPI
//   { detail: [ { msg: "..." } ] }             → Pydantic validation
//   "plain text"                               → certains endpoints Keycloak < 26
async function parseKeycloakError(res) {
    const text = await res.text().catch(() => '');
    if (!text)
        return `${res.status} ${res.statusText}`;
    try {
        const json = JSON.parse(text);
        return (json.errorMessage // Keycloak Admin API
            ?? json.error_description // OAuth2
            ?? (json.error && json.error !== 'unknown_error' ? json.error : undefined)
            ?? (typeof json.detail === 'string' ? json.detail : undefined)
            ?? (Array.isArray(json.detail) ? json.detail[0]?.msg : undefined)
            ?? `${res.status} ${res.statusText}`);
    }
    catch {
        // Réponse texte brute (ex: "Client not found")
        return text.length < 200 ? text : `${res.status} ${res.statusText}`;
    }
}
class HttpClient {
    constructor() {
        this.isRefreshing = false;
        this.pendingQueue = [];
    }
    setLogoutCallback(callback) {
        this.onLogout = callback;
    }
    resolveQueue(newToken) {
        this.pendingQueue.forEach((p) => p.resolve(newToken));
        this.pendingQueue = [];
    }
    rejectQueue(error) {
        this.pendingQueue.forEach((p) => p.reject(error));
        this.pendingQueue = [];
    }
    waitForRefresh() {
        return new Promise((resolve, reject) => {
            this.pendingQueue.push({ resolve, reject });
        });
    }
    /**
     * Rafraîchit le token via le Route Handler /api/auth/refresh.
     * Le Route Handler lit le cookie HttpOnly refresh_token,
     * appelle le backend, met à jour les cookies et retourne
     * le nouveau access_token en body JSON.
     */
    async refreshTokens() {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'same-origin', // envoie les cookies HttpOnly
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });
        if (!response.ok)
            throw new Error('Refresh failed');
        const data = await response.json();
        // Le Route Handler /api/auth/refresh retourne { accessToken, sessionId } en camelCase
        const newAccessToken = data.accessToken ?? data.access_token;
        if (!newAccessToken)
            throw new Error('No access token in refresh response');
        // Stocker en mémoire (jamais localStorage)
        tokenManager.setAccessToken(newAccessToken);
        auditLogger.logTokenRefreshed(tokenManager.getTokenPayload()?.sub);
        return newAccessToken;
    }
    /**
     * Requête HTTP avec injection Bearer + retry 401 automatique.
     */
    async fetch(endpoint, options = {}) {
        const token = tokenManager.getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(options.headers || {}),
        };
        if (token)
            headers['Authorization'] = `Bearer ${token}`;
        const url = endpoint.startsWith('http') ? endpoint : `${API_V1}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'same-origin',
            cache: 'no-store',
        });
        // ── Cas 401 : token expiré ou révoqué ─────────────────
        if (response.status === 401) {
            if (this.isRefreshing) {
                try {
                    const newToken = await this.waitForRefresh();
                    return this.fetch(endpoint, {
                        ...options,
                        headers: { ...headers, Authorization: `Bearer ${newToken}` },
                    });
                }
                catch {
                    this.onLogout?.();
                    throw new Error('Session expirée');
                }
            }
            this.isRefreshing = true;
            try {
                const newToken = await this.refreshTokens();
                this.isRefreshing = false;
                this.resolveQueue(newToken);
                return this.fetch(endpoint, {
                    ...options,
                    headers: { ...headers, Authorization: `Bearer ${newToken}` },
                });
            }
            catch (error) {
                this.isRefreshing = false;
                this.rejectQueue(error);
                tokenManager.clear();
                auditLogger.logForceLogout('refresh_failed', tokenManager.getTokenPayload()?.sub);
                this.onLogout?.();
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }
        }
        return response;
    }
    async get(endpoint, params) {
        let url = endpoint;
        if (params) {
            const qs = new URLSearchParams(Object.entries(params)
                .filter(([, v]) => v !== undefined && v !== null)
                .map(([k, v]) => [k, String(v)])).toString();
            if (qs)
                url += `?${qs}`;
        }
        const res = await this.fetch(url, { method: 'GET' });
        if (!res.ok)
            throw new Error(await parseKeycloakError(res));
        return res.json();
    }
    async post(endpoint, body) {
        const res = await this.fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (!res.ok)
            throw new Error(await parseKeycloakError(res));
        if (res.status === 204)
            return {};
        return res.json();
    }
    async delete(endpoint) {
        const res = await this.fetch(endpoint, { method: 'DELETE' });
        if (!res.ok)
            throw new Error(await parseKeycloakError(res));
        if (res.status === 204)
            return {};
        return res.json();
    }
    /**
     * DELETE avec body JSON — requis par certains endpoints Keycloak
     * (ex: scope-mappings/realm, scope-mappings/clients/{id})
     */
    async deleteWithBody(endpoint, body) {
        const res = await this.fetch(endpoint, {
            method: 'DELETE',
            body: JSON.stringify(body),
        });
        if (!res.ok)
            throw new Error(await parseKeycloakError(res));
        if (res.status === 204)
            return {};
        return res.json();
    }
    async put(endpoint, body) {
        const res = await this.fetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
        if (!res.ok)
            throw new Error(await parseKeycloakError(res));
        // Keycloak retourne 204 No Content pour les PUT réussis
        if (res.status === 204 || res.headers.get('content-length') === '0')
            return {};
        return res.json();
    }
}
export const httpClient = new HttpClient();
//# sourceMappingURL=http-client.js.map