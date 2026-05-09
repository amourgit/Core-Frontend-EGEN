import type { IAMJWTPayload } from './jwt-verifier';
export declare const tokenManager: {
    readonly setAccessToken: (token: string) => void;
    readonly setSessionId: (id: string) => void;
    readonly getAccessToken: () => string | null;
    readonly getSessionId: () => string | null;
    readonly hasValidToken: () => boolean;
    readonly getTokenPayload: () => IAMJWTPayload | null;
    /**
     * Millisecondes avant expiration du token en mémoire.
     * Retourne 0 si pas de token ou expiré.
     */
    readonly expiresInMs: () => number;
    /**
     * Pourcentage de vie restante du token (0-100).
     * Utile pour afficher une barre de progression de session.
     */
    readonly lifePercent: (totalLifeSec?: number) => number;
    /**
     * Efface les tokens de la mémoire.
     * Les cookies HttpOnly sont effacés par le Route Handler /api/auth/logout.
     */
    readonly clear: () => void;
    /**
     * Nettoyage complet : mémoire + données utilisateur localStorage.
     * Appelé au logout.
     */
    readonly clearAll: () => void;
};
export declare const userDataStore: {
    setUser(user: object): void;
    setPermissionsAndRoles(permissions: string[], roles: string[]): void;
    getUser<T = unknown>(): T | null;
    getPermissions(): string[];
    getRoles(): string[];
    clear(): void;
};
//# sourceMappingURL=token-manager.d.ts.map