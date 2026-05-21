import { useState, useEffect, useCallback } from 'react';
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
export function usePermissions(options: UsePermissionsOptions = {}): UsePermissionsResult {
  const { required = [] } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [checks, setChecks] = useState<IPermissionCheck[]>([]);
  const [tick, setTick] = useState(0);

  const recheck = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (required.length === 0) {
      setChecks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Résolution via le store global egen (injecté par le CORE)
    const store = (window as any).__egen_AUTH_STORE__;
    const userPermissions: string[] = store?.getState?.()?.permissions?.map(
      (p: { code: string }) => p.code
    ) ?? [];

    const result: IPermissionCheck[] = required.map(perm => ({
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
