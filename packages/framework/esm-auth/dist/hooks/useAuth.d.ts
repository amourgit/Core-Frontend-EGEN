export interface UseAuthReturn {
    /** Utilisateur connecté (null si non authentifié) */
    user: {
        id: string;
        username: string;
        email: string;
        name: string;
        prenom?: string;
        nom?: string;
        roles: string[];
        avatarUrl?: string;
        tenantId?: string;
    } | null;
    /** L'utilisateur est-il authentifié ? */
    isAuthenticated: boolean;
    /** Initialisation en cours */
    isLoading: boolean;
    /** Vérifie si l'utilisateur a un rôle donné */
    hasRole: (role: string) => boolean;
    /** Vérifie si l'utilisateur a au moins un des rôles donnés */
    hasAnyRole: (roles: string[]) => boolean;
    /** Initiales de l'utilisateur (ex: "JD" pour Jean Dupont) */
    initials: string;
}
/**
 * Hook d'authentification à utiliser dans les composants.
 *
 * @example
 * const { user, isAuthenticated, hasRole } = useAuth();
 * if (!isAuthenticated) return <LoginPage />;
 * if (!hasRole('admin')) return <Forbidden />;
 */
export declare function useAuth(): UseAuthReturn;
//# sourceMappingURL=useAuth.d.ts.map