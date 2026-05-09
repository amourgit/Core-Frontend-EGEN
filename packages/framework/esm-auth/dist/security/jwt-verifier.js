// ============================================================
// lib/security/jwt-verifier.ts
// Utilitaires JWT côté client — DÉCODAGE uniquement (pas de vérification
// cryptographique, qui doit toujours rester côté serveur).
//
// Principes :
//  - Ne jamais vérifier la signature côté client.
//  - Utiliser uniquement pour lire les claims (exp, sub, roles…).
//  - Toute décision d'autorisation réelle est vérifiée côté API.
// ============================================================
// ── Décodage ─────────────────────────────────────────────────
/**
 * Décode un JWT sans vérifier la signature.
 * Retourne null si le token est malformé.
 *
 * ⚠️  NE PAS utiliser pour des décisions de sécurité — uniquement
 *     pour lire les claims dans l'UI (afficher le nom, l'email…).
 */
export function decodeJWTUnsafe(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        // Padding Base64URL → Base64 standard
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const decoded = typeof window !== 'undefined'
            ? atob(padded)
            : Buffer.from(padded, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    }
    catch {
        return null;
    }
}
// ── Vérification d'expiration ─────────────────────────────────
/**
 * Vérifie si le token est expiré (côté client, basé sur `exp`).
 * Ajoute une marge de 30 s pour compenser les décalages d'horloge.
 */
export function isTokenExpired(token, marginSec = 30) {
    const payload = decodeJWTUnsafe(token);
    if (!payload?.exp)
        return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp - marginSec < nowSec;
}
/**
 * Millisecondes avant expiration du token.
 * Retourne 0 si expiré ou invalide.
 */
export function tokenExpiresInMs(token) {
    const payload = decodeJWTUnsafe(token);
    if (!payload?.exp)
        return 0;
    const remainingMs = payload.exp * 1000 - Date.now();
    return Math.max(0, remainingMs);
}
/**
 * Extraire les rôles realm Keycloak du payload.
 */
export function extractRealmRoles(payload) {
    return payload.realm_access?.roles ?? [];
}
/**
 * Extraire les rôles d'un client Keycloak spécifique.
 */
export function extractClientRoles(payload, clientId) {
    return payload.resource_access?.[clientId]?.roles ?? [];
}
//# sourceMappingURL=jwt-verifier.js.map