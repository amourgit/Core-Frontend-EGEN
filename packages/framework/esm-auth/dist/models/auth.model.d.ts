/**
 * Représentation de l'utilisateur authentifié tel que retourné
 * par le serveur après décodage du JWT Keycloak.
 */
export interface CurrentUser {
    /** Identifiant unique Keycloak (sub) */
    id: string;
    /** Nom d'utilisateur préféré (preferred_username) */
    username: string;
    /** Adresse email */
    email: string;
    /** Prénom (given_name) */
    prenom?: string;
    /** Nom de famille (family_name) */
    nom?: string;
    /** Nom complet calculé */
    name?: string;
    /** Rôles Keycloak (realm + client) */
    roles: string[];
    /** Identifiant du tenant/organisation */
    tenantId?: string;
    /** URL de l'avatar */
    avatarUrl?: string;
}
/**
 * État global d'authentification porté par le Context React.
 * Les tokens ne sont PAS dans cet objet (sécurité).
 * Seul l'accessToken opaque est exposé pour les appels API directs.
 */
export interface AuthState {
    /** Token d'accès en mémoire (null si non authentifié) */
    accessToken: string | null;
    /**
     * Refresh token — toujours null côté client.
     * Il vit dans un cookie HttpOnly géré par le serveur.
     */
    refreshToken: null;
    /** Identifiant de session Keycloak */
    sessionId: string | null;
    /** Données de l'utilisateur connecté */
    user: CurrentUser | null;
    /** L'utilisateur est-il authentifié ? */
    isAuthenticated: boolean;
    /** Initialisation en cours (hydratation depuis /api/auth/session) */
    isLoading: boolean;
    /** Liste des permissions fonctionnelles */
    permissions: string[];
    /** Liste des rôles Keycloak */
    roles: string[];
}
/**
 * Réponse du Route Handler POST /api/auth/login.
 */
export interface LoginResponse {
    accessToken: string;
    sessionId: string;
    user: CurrentUser;
    permissions: string[];
    roles: string[];
    expiresIn: number;
}
/**
 * Réponse du Route Handler GET /api/auth/session.
 * Appelé au chargement de page pour ré-hydrater l'état auth.
 */
export interface SessionResponse {
    authenticated: boolean;
    accessToken?: string;
    sessionId?: string;
    user?: CurrentUser;
    permissions?: string[];
    roles?: string[];
}
export interface LoginCredentials {
    username: string;
    password: string;
    tenantId?: string;
}
//# sourceMappingURL=auth.model.d.ts.map