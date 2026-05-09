// ============================================================
// hooks/useAuth.ts
// Hook d'authentification unifié — source de vérité pour les
// composants qui ont besoin des données utilisateur.
//
// STRATÉGIE DOUBLE SOURCE :
//  1. useAuthStore (Zustand) → état léger, synchrone, partagé
//     globalement sans Provider (utile pour les composants deep)
//  2. useAuthContext (React Context) → état riche avec actions
//     (login, logout, hasPermission…)
//
// Ce hook expose un objet unifié compatible avec les deux sources,
// en privilégiant le Context quand disponible.
// ============================================================
import { useMemo } from 'react';
import { useAuthStore } from '../store/auth.store';
// ── Utilitaires ───────────────────────────────────────────────
function computeInitials(prenom, nom, username) {
    const f = prenom?.trim()?.[0] ?? '';
    const l = nom?.trim()?.[0] ?? '';
    if (f || l)
        return `${f}${l}`.toUpperCase();
    return (username?.trim()?.[0] ?? 'U').toUpperCase();
}
function computeFullName(prenom, nom, username, email) {
    const full = [prenom, nom].filter(Boolean).join(' ');
    return full || username || email?.split('@')[0] || 'Utilisateur';
}
// ── Hook principal ────────────────────────────────────────────
/**
 * Hook d'authentification à utiliser dans les composants.
 *
 * @example
 * const { user, isAuthenticated, hasRole } = useAuth();
 * if (!isAuthenticated) return <LoginPage />;
 * if (!hasRole('admin')) return <Forbidden />;
 */
export function useAuth() {
    const storeUser = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isLoading = useAuthStore((s) => s.isLoading);
    const user = useMemo(() => {
        if (!storeUser)
            return null;
        return {
            id: storeUser.id,
            username: storeUser.username,
            email: storeUser.email,
            name: computeFullName(storeUser.prenom, storeUser.nom, storeUser.username, storeUser.email),
            prenom: storeUser.prenom,
            nom: storeUser.nom,
            roles: storeUser.roles ?? [],
            avatarUrl: storeUser.avatarUrl,
            tenantId: storeUser.tenantId,
        };
    }, [storeUser]);
    const initials = useMemo(() => {
        if (!storeUser)
            return 'U';
        return computeInitials(storeUser.prenom, storeUser.nom, storeUser.username);
    }, [storeUser]);
    const hasRole = useMemo(() => (role) => user?.roles.includes(role) ?? false, [user]);
    const hasAnyRole = useMemo(() => (roles) => roles.length === 0 || roles.some((r) => user?.roles.includes(r) ?? false), [user]);
    return {
        user,
        isAuthenticated,
        isLoading,
        hasRole,
        hasAnyRole,
        initials,
    };
}
//# sourceMappingURL=useAuth.js.map