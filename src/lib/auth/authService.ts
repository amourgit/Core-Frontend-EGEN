// ============================================================
// lib/auth/authService.ts
// Service d'authentification du Core — communique avec le backend IAM.
//
// ARCHITECTURE :
//  Le Core est le point d'entrée auth. Il gère :
//   - Le login/logout centralisés
//   - Les cookies HttpOnly pour le refresh token (côté backend)
//   - La session (hydratation au rechargement de page)
//   - La propagation des tokens aux modules via coreContext
//
// Endpoints attendus (backend IAM / proxy Keycloak) :
//   POST /api/auth/login    → { accessToken, sessionId, user, permissions, roles }
//   GET  /api/auth/session  → { authenticated, accessToken, user, ... }
//   POST /api/auth/logout   → 204
//   POST /api/auth/refresh  → { accessToken, sessionId }
// ============================================================

import type { LoginCredentials, LoginResponse, SessionResponse } from '@/lib/models/iam/auth.model';
import { tokenManager } from '@/lib/security/token-manager';
import { clientCookieManager } from '@/lib/security/cookie-manager';

// ── Configuration ─────────────────────────────────────────────
const IAM_API = import.meta.env.VITE_IAM_URL ?? 'http://localhost:3000';
const AUTH_BASE = `${IAM_API}/api/auth`;
const TIMEOUT_MS = 10_000;

// ── Helpers ───────────────────────────────────────────────────

function authHeaders(extra?: Record<string, string>): HeadersInit {
  const token = tokenManager.getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function safeFetch<T>(
  url: string,
  init: RequestInit,
  timeoutMs = TIMEOUT_MS,
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      credentials: 'include', // pour les cookies HttpOnly
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new AuthError(
        body?.message ?? body?.error ?? `HTTP ${res.status}`,
        res.status,
      );
    }
    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

// ── Erreur typée ──────────────────────────────────────────────

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ── Service d'authentification ────────────────────────────────

export const authService = {
  /**
   * Authentifie l'utilisateur.
   * Le backend pose un cookie HttpOnly refresh_token.
   * On stocke l'access_token en mémoire via tokenManager.
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const data = await safeFetch<LoginResponse>(`${AUTH_BASE}/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(credentials),
    });

    // Stocker le token en mémoire (jamais en localStorage)
    tokenManager.setAccessToken(data.accessToken);
    if (data.sessionId) tokenManager.setSessionId(data.sessionId);

    // Cookie miroir non-HttpOnly pour savoir si une session existe
    clientCookieManager.setSessionActiveCookie(3600);

    return data;
  },

  /**
   * Déconnexion. Le backend invalide la session et supprime le cookie HttpOnly.
   */
  async logout(): Promise<void> {
    try {
      await safeFetch<void>(`${AUTH_BASE}/logout`, {
        method: 'POST',
        headers: authHeaders(),
      });
    } catch {
      // On nettoie quand même côté client même si le serveur échoue
    } finally {
      tokenManager.clearAll();
      clientCookieManager.clearSessionActiveCookie();
    }
  },

  /**
   * Hydrate la session depuis le serveur au rechargement de page.
   * Le backend lit le cookie HttpOnly refresh_token et retourne les infos.
   */
  async getSession(): Promise<SessionResponse> {
    try {
      const data = await safeFetch<SessionResponse>(`${AUTH_BASE}/session`, {
        method: 'GET',
        headers: authHeaders(),
      });

      if (data.authenticated && data.accessToken) {
        tokenManager.setAccessToken(data.accessToken);
        if (data.sessionId) tokenManager.setSessionId(data.sessionId);
        clientCookieManager.setSessionActiveCookie(3600);
      } else {
        tokenManager.clear();
        clientCookieManager.clearSessionActiveCookie();
      }

      return data;
    } catch (err) {
      // Si la session endpoint échoue (serveur down), on suppose non-authentifié
      tokenManager.clear();
      clientCookieManager.clearSessionActiveCookie();
      return { authenticated: false };
    }
  },

  /**
   * Rafraîchit l'access token via le refresh_token (cookie HttpOnly côté serveur).
   * Appelé automatiquement quand le token expire.
   */
  async refresh(): Promise<{ accessToken: string; sessionId?: string }> {
    const data = await safeFetch<{ accessToken: string; sessionId?: string }>(
      `${AUTH_BASE}/refresh`,
      {
        method: 'POST',
        headers: authHeaders(),
      },
    );

    tokenManager.setAccessToken(data.accessToken);
    if (data.sessionId) tokenManager.setSessionId(data.sessionId);
    return data;
  },

  /**
   * Vérifie si le token courant en mémoire est encore valide.
   * Si expiré et qu'une session miroir existe → tente un refresh.
   */
  async ensureValidToken(): Promise<boolean> {
    if (tokenManager.hasValidToken()) return true;

    if (!clientCookieManager.hasActiveSession()) return false;

    try {
      await authService.refresh();
      return tokenManager.hasValidToken();
    } catch {
      return false;
    }
  },

  /**
   * Retourne le token courant (depuis la mémoire).
   * À utiliser par les modules pour les appels API.
   */
  getToken(): string | null {
    return tokenManager.getAccessToken();
  },

  /**
   * Vrai si le cookie miroir "session_active" est présent.
   * Permet de savoir si on doit tenter une hydratation.
   */
  hasSessionCookie(): boolean {
    return clientCookieManager.hasActiveSession();
  },
} as const;

// ── Auto-refresh proactif ────────────────────────────────────
// Planifie un refresh 60 s avant l'expiration du token en mémoire.
// Appelé après un login réussi ou une hydratation de session.

let _refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleTokenRefresh(onRefresh?: () => void): void {
  cancelTokenRefresh();

  const msLeft = tokenManager.expiresInMs();
  if (msLeft <= 0) return;

  // Refresh 60 s avant l'expiration
  const delay = Math.max(0, msLeft - 60_000);

  _refreshTimer = setTimeout(async () => {
    try {
      await authService.refresh();
      onRefresh?.();
      // Re-planifier après le refresh
      scheduleTokenRefresh(onRefresh);
    } catch {
      // Le refresh a échoué → la session est probablement expirée
    }
  }, delay);
}

export function cancelTokenRefresh(): void {
  if (_refreshTimer !== null) {
    clearTimeout(_refreshTimer);
    _refreshTimer = null;
  }
}
