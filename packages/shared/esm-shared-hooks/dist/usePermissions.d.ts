import type { IPermissionCheck, AccessLevel } from '@egen/esm-shared-types';
interface UsePermissionsOptions {
    /** Permissions requises (toutes doivent être présentes) */
    required?: string[];
    /** Niveau d'accès minimum */
    minLevel?: AccessLevel;
}
interface UsePermissionsResult {
    hasAccess: boolean;
    isLoading: boolean;
    checks: IPermissionCheck[];
    /** Re-vérifier les permissions (après changement de rôle) */
    recheck: () => void;
}
/**
 * Hook pour vérifier les permissions frontend d'un utilisateur.
 * S'intègre avec le store d'auth egen (esm-auth).
 *
 * @example
 * const { hasAccess } = usePermissions({ required: ['patient:read'] });
 * if (!hasAccess) return <AccessDenied />;
 */
export declare function usePermissions(options?: UsePermissionsOptions): UsePermissionsResult;
export {};
//# sourceMappingURL=usePermissions.d.ts.map