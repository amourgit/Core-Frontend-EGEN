import type { SessionResponse } from '../models/auth.model';
export interface KcTokenResponse {
    access_token: string;
    refresh_token: string;
    id_token?: string;
    token_type: string;
    expires_in: number;
    refresh_expires_in: number;
    session_state: string;
    scope: string;
}
export interface KcUserInfo {
    sub: string;
    preferred_username: string;
    email?: string;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
    name?: string;
    phone_number?: string;
    realm_access?: {
        roles: string[];
    };
    resource_access?: Record<string, {
        roles: string[];
    }>;
    attributes?: Record<string, string[]>;
}
export interface KcUserRepresentation {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    enabled: boolean;
    emailVerified?: boolean;
    attributes?: Record<string, string[]>;
    realmRoles?: string[];
    createdTimestamp?: number;
}
export interface KcSessionRepresentation {
    id: string;
    username: string;
    userId: string;
    ipAddress: string;
    start: number;
    lastAccess: number;
    clients: Record<string, string>;
}
export interface KcCredentialRepresentation {
    type: string;
    value: string;
    temporary: boolean;
}
export interface KcRoleRepresentation {
    id?: string;
    name: string;
    description?: string;
    composite?: boolean;
    clientRole?: boolean;
    containerId?: string;
}
export declare function extractErrorMessage(error: unknown, fallback?: string): string;
export declare const authService: {
    /**
     * POST /realms/{realm}/protocol/openid-connect/token
     * grant_type=password  (Resource Owner Password Credentials)
     *
     * ⚠️  Ce grant doit être activé dans Keycloak :
     *     Client → Settings → "Direct access grants" = ON
     */
    login(username: string, password: string): Promise<KcTokenResponse>;
    /**
     * POST /realms/{realm}/protocol/openid-connect/token
     * grant_type=refresh_token
     */
    refreshToken(refreshToken: string): Promise<KcTokenResponse>;
    /**
     * POST /realms/{realm}/protocol/openid-connect/logout
     * Révoque la session côté Keycloak
     *
     * Headers : Content-Type: application/x-www-form-urlencoded
     * Body    : client_id + refresh_token
     */
    logout(refreshToken?: string): Promise<void>;
    /**
     * POST /realms/{realm}/protocol/openid-connect/token/introspect
     * Valide un token et retourne ses métadonnées
     *
     * ⚠️  Nécessite client_secret si client confidentiel.
     *     En public client, utiliser la validation JWT locale à la place.
     */
    introspectToken(token: string, clientSecret?: string): Promise<Record<string, unknown>>;
    /**
     * GET /realms/{realm}/protocol/openid-connect/userinfo
     * Retourne les claims de l'utilisateur courant (profil + rôles si mappés)
     *
     * Authorization: Bearer <access_token>
     */
    getUserInfo(accessToken: string): Promise<KcUserInfo>;
    /**
     * GET /admin/realms/{realm}/users/{userId}/sessions
     * Liste les sessions actives d'un utilisateur
     *
     * ⚠️  Requiert un token admin (realm-admin ou view-users)
     *     Pour les sessions de l'utilisateur courant, utilise userId extrait du token JWT
     */
    getUserSessions(userId: string, adminToken: string): Promise<KcSessionRepresentation[]>;
    /**
     * DELETE /admin/realms/{realm}/sessions/{sessionId}
     * Révoque une session spécifique (toutes applications)
     *
     * ⚠️  Requiert un token admin
     */
    revokeSession(sessionId: string, adminToken: string): Promise<void>;
    /**
     * DELETE /admin/realms/{realm}/users/{userId}/sessions
     * Révoque TOUTES les sessions d'un utilisateur
     */
    revokeAllUserSessions(userId: string, adminToken: string): Promise<void>;
};
export declare const profilService: {
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
    getMonProfil(accessToken: string): Promise<KcUserInfo>;
    /**
     * Extrait permissions et rôles depuis un KcUserInfo
     * Retourne { roles_actifs, permissions }
     */
    getMesHabilitations(userInfo: KcUserInfo, clientId?: any): {
        profil_id: string;
        roles_actifs: string[];
        permissions: {
            code: string;
            label: string;
        }[];
        groupes_actifs: string[];
    };
    /**
     * GET /admin/realms/{realm}/users/{userId}/role-mappings/realm
     * Rôles realm d'un utilisateur (admin uniquement)
     */
    getRealmRoles(userId: string, adminToken: string): Promise<KcRoleRepresentation[]>;
    /**
     * GET /admin/realms/{realm}/events
     * Journal des événements (login, logout, etc.) pour le realm
     * Filtrer par user : ?user={userId}&type=LOGIN&type=LOGOUT
     *
     * ⚠️  Requiert token admin avec permission view-events
     */
    getMonJournal(userId: string, adminToken: string, skip?: number, limit?: number): Promise<Record<string, unknown>[]>;
};
export declare const adminUserService: {
    /**
     * GET /admin/realms/{realm}/users
     * Liste les utilisateurs avec pagination et recherche
     *
     * Params optionnels : search, username, email, firstName, lastName,
     *                     first (offset), max (limit), enabled, emailVerified
     */
    listUsers(adminToken: string, params?: {
        search?: string;
        username?: string;
        email?: string;
        first?: number;
        max?: number;
        enabled?: boolean;
    }): Promise<KcUserRepresentation[]>;
    /**
     * GET /admin/realms/{realm}/users/{userId}
     * Récupère un utilisateur par son ID Keycloak
     */
    getUser(userId: string, adminToken: string): Promise<KcUserRepresentation>;
    /**
     * POST /admin/realms/{realm}/users
     * Crée un nouvel utilisateur
     * Retourne 201 Created (l'ID est dans le header Location)
     *
     * Body minimal : { username, enabled: true }
     */
    createUser(adminToken: string, user: {
        username: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        enabled?: boolean;
        credentials?: KcCredentialRepresentation[];
        attributes?: Record<string, string[]>;
    }): Promise<{
        userId: string;
    }>;
    /**
     * PUT /admin/realms/{realm}/users/{userId}
     * Met à jour un utilisateur (remplace les champs fournis)
     */
    updateUser(userId: string, adminToken: string, updates: Partial<KcUserRepresentation>): Promise<void>;
    /**
     * DELETE /admin/realms/{realm}/users/{userId}
     * Supprime un utilisateur
     */
    deleteUser(userId: string, adminToken: string): Promise<void>;
    /**
     * PUT /admin/realms/{realm}/users/{userId}/reset-password
     * Réinitialise le mot de passe d'un utilisateur (admin)
     *
     * Body : { type: "password", value: "newPassword", temporary: true|false }
     * temporary=true → l'utilisateur devra changer son MDP à la prochaine connexion
     */
    resetPassword(userId: string, adminToken: string, newPassword: string, temporary?: boolean): Promise<void>;
    /**
     * PUT /admin/realms/{realm}/users/{userId}
     * Active ou désactive un compte utilisateur
     */
    setUserEnabled(userId: string, adminToken: string, enabled: boolean): Promise<void>;
    /**
     * POST /admin/realms/{realm}/users/{userId}/role-mappings/realm
     * Assigne des rôles realm à un utilisateur
     *
     * Body : [{ id, name }]  (tableau de KcRoleRepresentation)
     */
    assignRealmRoles(userId: string, adminToken: string, roles: KcRoleRepresentation[]): Promise<void>;
    /**
     * DELETE /admin/realms/{realm}/users/{userId}/role-mappings/realm
     * Retire des rôles realm d'un utilisateur
     */
    removeRealmRoles(userId: string, adminToken: string, roles: KcRoleRepresentation[]): Promise<void>;
    /**
     * GET /admin/realms/{realm}/users/count
     * Nombre total d'utilisateurs du realm
     */
    countUsers(adminToken: string): Promise<number>;
};
export declare const adminSessionService: {
    /**
     * GET /admin/realms/{realm}/sessions/stats
     * Statistiques des sessions actives par client
     */
    getSessionStats(adminToken: string): Promise<Record<string, number>>;
    /**
     * GET /admin/realms/{realm}/clients/{clientUuid}/session-count
     * Nombre de sessions actives pour un client spécifique
     */
    getClientSessionCount(clientUuid: string, adminToken: string): Promise<{
        count: number;
    }>;
    /**
     * GET /admin/realms/{realm}/clients/{clientUuid}/user-sessions
     * Liste des sessions utilisateur pour un client
     */
    getClientUserSessions(clientUuid: string, adminToken: string, first?: number, max?: number): Promise<KcSessionRepresentation[]>;
};
/** Persiste le refresh token dans sessionStorage (SPA Vite) */
export declare function storeRefreshToken(token: string): void;
/** Récupère le refresh token depuis sessionStorage */
export declare function getStoredRefreshToken(): string | null;
/** Persiste l'access token dans sessionStorage (backup mémoire) */
export declare function storeAccessToken(token: string): void;
/** Récupère l'access token depuis sessionStorage (si mémoire perdue) */
export declare function getStoredAccessToken(): string | null;
/** Efface tous les tokens persistés (logout) */
export declare function clearStoredTokens(): void;
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
export declare function getSession(): Promise<SessionResponse>;
/** Logout : révoque le refresh token côté Keycloak + nettoie tout */
export declare function logoutAndClean(): Promise<void>;
export interface TokenRefreshCallbacks {
    /** Appelé avec le nouveau token après un refresh réussi */
    onRefreshed?: (newToken: string) => void;
    /** Appelé quand le refresh échoue (session révoquée / expirée) */
    onRevoked?: () => void;
}
/**
 * Planifie un refresh automatique 60 s avant l'expiration du token.
 * Appelé par AuthProvider après chaque login ou hydratation.
 *
 * @param callbacks.onRefreshed  Callback avec le nouveau token si succès
 * @param callbacks.onRevoked    Callback si révocation/expiration confirmée
 */
export declare function scheduleTokenRefresh(onRefreshed?: (newToken: string) => void, onRevoked?: () => void): void;
export declare function cancelTokenRefresh(): void;
//# sourceMappingURL=auth.service.d.ts.map