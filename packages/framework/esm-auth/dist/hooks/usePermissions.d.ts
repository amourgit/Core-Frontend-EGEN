/**
 * Hook de vérification des permissions pour les modules.
 * Vérifie les rôles Keycloak de l'utilisateur connecté.
 */
export declare function usePermissions(): {
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAllRoles: (roles: string[]) => boolean;
    canAccessModule: (requiredRoles: string[]) => boolean;
    roles: string[];
};
//# sourceMappingURL=usePermissions.d.ts.map