// ============================================================
// lib/security/constants.ts
// Source unique de vérité pour toute la configuration sécurité.
// Ne jamais dupliquer ces valeurs dans d'autres fichiers.
// ============================================================
// ── Clés de stockage ─────────────────────────────────────
export const STORAGE_KEYS = {
    LEGACY_ACCESS_TOKEN: 'iam_access_token',
    LEGACY_REFRESH_TOKEN: 'iam_refresh_token',
    LEGACY_SESSION_ID: 'iam_session_id',
    USER: 'iam_user',
    PERMISSIONS: 'iam_permissions',
    ROLES: 'iam_roles',
};
// ── Noms des cookies ──────────────────────────────────────
export const COOKIE_NAMES = {
    ACCESS_TOKEN: 'iam_at',
    REFRESH_TOKEN: 'iam_rt',
    SESSION_ID: 'iam_sid',
    SESSION_ACTIVE: 'iam_session_active',
    // Cookie JS-lisible (non HttpOnly) contenant l'expiry Unix (secondes)
    // du refresh token. Permet au frontend de détecter immédiatement
    // l'expiration du refresh token sans attendre celle de l'access token.
    REFRESH_TOKEN_EXP: 'iam_rt_exp',
};
// ── Durées de vie ─────────────────────────────────────────
export const TOKEN_TTL = {
    ACCESS_TOKEN_SECONDS: 3600,
    REFRESH_TOKEN_SECONDS: 86400 * 7,
    SESSION_ACTIVE_SECONDS: 86400,
};
// ── Inactivité & session ──────────────────────────────────
export const INACTIVITY = {
    TIMEOUT_MS: 15 * 60 * 1000,
    WARNING_BEFORE_MS: 2 * 60 * 1000,
    RESET_EVENTS: ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'],
};
// ── Polling SessionMonitor ────────────────────────────────
export const SESSION_MONITOR = {
    POLL_STANDARD_MS: 60000,
    POLL_ELEVATED_MS: 15000,
    POLL_CRITICAL_MS: 5000,
    HEALTH_ENDPOINT: '/compte/moi',
};
// ── Routes publiques exactes (pour middleware) ────────────
export const PUBLIC_EXACT_ROUTES = new Set([
    '/',
    '/welcome',
]);
// ── Préfixes publics (pour middleware) ───────────────────
export const PUBLIC_PREFIXES = [
    '/auth/login',
    '/auth/forgot',
    '/auth/logout',
    '/_next',
    '/api',
    '/favicon',
    '/images',
    '/logo',
    '/motion_logo',
    '/opengraph-image',
    '/themes',
];
// ── Headers de sécurité (appliqués par le middleware) ────
export const SECURITY_HEADERS = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};
// ── Utilitaire route publique ─────────────────────────────
export function isPublicPath(pathname) {
    if (PUBLIC_EXACT_ROUTES.has(pathname))
        return true;
    return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
// ── Keycloak Realm Header ─────────────────────────────────
/** En-tête HTTP personnalisé pour transmettre le realm Keycloak */
export const KEYCLOAK_REALM_HEADER = 'X-Keycloak-Realm';
/** Realm Keycloak par défaut */
export const DEFAULT_REALM = 'master';
//# sourceMappingURL=constants.js.map