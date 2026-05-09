import { useAuthStore } from '../store/auth.store';
/**
 * Hook de vérification des permissions pour les modules.
 * Vérifie les rôles Keycloak de l'utilisateur connecté.
 */
export function usePermissions() {
    const user = useAuthStore(s => s.user);
    function hasRole(role) {
        return user?.roles?.includes(role) ?? false;
    }
    function hasAnyRole(roles) {
        if (!roles.length)
            return true; // pas de contrainte
        return roles.some(r => hasRole(r));
    }
    function hasAllRoles(roles) {
        return roles.every(r => hasRole(r));
    }
    function canAccessModule(requiredRoles) {
        if (!requiredRoles.length)
            return true;
        // super-admin a accès à tout
        if (hasRole('super-admin'))
            return true;
        return hasAnyRole(requiredRoles);
    }
    return { hasRole, hasAnyRole, hasAllRoles, canAccessModule, roles: user?.roles ?? [] };
}
//# sourceMappingURL=usePermissions.js.map