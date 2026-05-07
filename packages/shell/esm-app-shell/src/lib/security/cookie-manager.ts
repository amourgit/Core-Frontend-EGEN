// ============================================================
// lib/security/cookie-manager.ts
// Gestionnaire de cookies côté client.
//
// ARCHITECTURE SÉCURISÉE :
//  - Les cookies HttpOnly (access_token, refresh_token) sont
//    INACCESSIBLES via JS — ils sont gérés par le serveur.
//  - Ce module ne gère QUE le cookie miroir "session_active"
//    (non-HttpOnly) qui sert à savoir si une session existe,
//    sans exposer les tokens.
//  - Toute lecture/écriture de tokens passe par tokenManager
//    (mémoire) ou par /api/auth/* (Route Handlers).
// ============================================================

// ── Nom du cookie miroir ──────────────────────────────────────
const SESSION_ACTIVE_COOKIE = 'session_active';
const SESSION_ACTIVE_VALUE  = '1';

// ── Utilitaires cookie simples ────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function setCookie(name: string, value: string, options: {
  maxAgeSec?: number;
  path?: string;
  sameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
} = {}): void {
  if (typeof document === 'undefined') return;
  const {
    maxAgeSec = 3600,
    path      = '/',
    sameSite  = 'Lax',
    secure    = location.protocol === 'https:',
  } = options;

  let cookie = `${name}=${encodeURIComponent(value)}`;
  cookie += `; Max-Age=${maxAgeSec}`;
  cookie += `; Path=${path}`;
  cookie += `; SameSite=${sameSite}`;
  if (secure) cookie += '; Secure';

  document.cookie = cookie;
}

function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; Path=${path}`;
}

// ── clientCookieManager ───────────────────────────────────────

/**
 * Gestionnaire du cookie miroir "session_active".
 *
 * Ce cookie non-HttpOnly est positionné par le client pour
 * signaler qu'une session est censée être active, sans stocker
 * de token. Il permet à l'UI de savoir si elle doit tenter un
 * refresh via /api/auth/session au chargement de page.
 */
export const clientCookieManager = {
  /**
   * Indique si le cookie miroir "session_active" est présent.
   * Ne garantit pas que les tokens côté serveur sont encore valides.
   */
  hasActiveSession(): boolean {
    return getCookie(SESSION_ACTIVE_COOKIE) === SESSION_ACTIVE_VALUE;
  },

  /**
   * Positionne le cookie miroir (ex: après un login réussi).
   * @param maxAgeSec Durée de vie en secondes (défaut : 1 heure)
   */
  setSessionActiveCookie(maxAgeSec = 3600): void {
    setCookie(SESSION_ACTIVE_COOKIE, SESSION_ACTIVE_VALUE, { maxAgeSec });
  },

  /**
   * Supprime le cookie miroir (ex: après un logout).
   * Les cookies HttpOnly sont supprimés par le serveur via POST /api/auth/logout.
   */
  clearSessionActiveCookie(): void {
    deleteCookie(SESSION_ACTIVE_COOKIE);
  },

  /**
   * Lit la valeur brute d'un cookie accessible JS (non-HttpOnly).
   * Usage : lire des préférences UI stockées côté client.
   */
  get(name: string): string | null {
    return getCookie(name);
  },

  /**
   * Définit un cookie non-HttpOnly générique (préférences UI, langue…).
   */
  set(name: string, value: string, maxAgeSec = 31536000): void {
    setCookie(name, value, { maxAgeSec });
  },

  /**
   * Supprime un cookie JS accessible.
   */
  remove(name: string): void {
    deleteCookie(name);
  },
} as const;
