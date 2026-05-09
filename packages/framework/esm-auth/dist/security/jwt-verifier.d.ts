export interface IAMJWTPayload {
    /** Subject — identifiant utilisateur */
    sub: string;
    /** Expiration (Unix timestamp secondes) */
    exp: number;
    /** Emission (Unix timestamp secondes) */
    iat: number;
    /** Identifiant de session */
    sid?: string;
    /** Email de l'utilisateur */
    email?: string;
    /** Prénom */
    given_name?: string;
    /** Nom de famille */
    family_name?: string;
    /** Nom d'utilisateur préféré */
    preferred_username?: string;
    /** Rôles Realm Keycloak */
    realm_access?: {
        roles: string[];
    };
    /** Rôles par client Keycloak */
    resource_access?: Record<string, {
        roles: string[];
    }>;
    /** Tenant / organisation */
    tenantId?: string;
    /** Permissions custom */
    permissions?: string[];
    /** Champs supplémentaires */
    [key: string]: unknown;
}
/**
 * Décode un JWT sans vérifier la signature.
 * Retourne null si le token est malformé.
 *
 * ⚠️  NE PAS utiliser pour des décisions de sécurité — uniquement
 *     pour lire les claims dans l'UI (afficher le nom, l'email…).
 */
export declare function decodeJWTUnsafe(token: string): IAMJWTPayload | null;
/**
 * Vérifie si le token est expiré (côté client, basé sur `exp`).
 * Ajoute une marge de 30 s pour compenser les décalages d'horloge.
 */
export declare function isTokenExpired(token: string, marginSec?: number): boolean;
/**
 * Millisecondes avant expiration du token.
 * Retourne 0 si expiré ou invalide.
 */
export declare function tokenExpiresInMs(token: string): number;
/**
 * Extraire les rôles realm Keycloak du payload.
 */
export declare function extractRealmRoles(payload: IAMJWTPayload): string[];
/**
 * Extraire les rôles d'un client Keycloak spécifique.
 */
export declare function extractClientRoles(payload: IAMJWTPayload, clientId: string): string[];
//# sourceMappingURL=jwt-verifier.d.ts.map