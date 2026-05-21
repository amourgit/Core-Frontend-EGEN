import React from 'react';
import { usePermissions } from '@egen/esm-shared-hooks';

interface AccessGuardProps {
  /** Permissions requises (toutes) */
  required?: string[];
  /** Composant à afficher si accès refusé */
  fallback?: React.ReactNode;
  /** Afficher le contenu en mode dégradé sans permissions */
  graceful?: boolean;
  children: React.ReactNode;
}

/**
 * Garde d'accès basée sur les permissions egen.
 * Enveloppe les zones sensibles d'un micro-frontend.
 *
 * @example
 * <AccessGuard required={['patient:write']}>
 *   <EditPatientForm />
 * </AccessGuard>
 */
export function AccessGuard({ required = [], fallback = null, graceful = false, children }: AccessGuardProps) {
  const { hasAccess, isLoading } = usePermissions({ required });

  if (isLoading) return null;

  if (!hasAccess) {
    if (graceful) {
      return (
        <div style={{ opacity: 0.4, pointerEvents: 'none', cursor: 'not-allowed' }}
          title="Permissions insuffisantes">
          {children}
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
