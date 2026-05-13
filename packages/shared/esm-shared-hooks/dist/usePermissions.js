import { useState, useEffect, useCallback } from 'react';
/**
 * Hook pour vérifier les permissions frontend d'un utilisateur.
 * S'intègre avec le store d'auth IGEN (esm-auth).
 *
 * @example
 * const { hasAccess } = usePermissions({ required: ['patient:read'] });
 * if (!hasAccess) return <AccessDenied />;
 */
export function usePermissions(options = {}) {
    const { required = [] } = options;
    const [isLoading, setIsLoading] = useState(true);
    const [checks, setChecks] = useState([]);
    const [tick, setTick] = useState(0);
    const recheck = useCallback(() => setTick(t => t + 1), []);
    useEffect(() => {
        if (required.length === 0) {
            setChecks([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        // Résolution via le store global IGEN (injecté par le CORE)
        const store = window.__IGEN_AUTH_STORE__;
        const userPermissions = store?.getState?.()?.permissions?.map((p) => p.code) ?? [];
        const result = required.map(perm => ({
            requiredPermission: perm,
            granted: userPermissions.includes(perm),
            reason: userPermissions.includes(perm) ? undefined : `Permission "${perm}" non accordée`,
        }));
        setChecks(result);
        setIsLoading(false);
    }, [required.join(','), tick]);
    return {
        hasAccess: checks.length === 0 || checks.every(c => c.granted),
        isLoading,
        checks,
        recheck,
    };
}
