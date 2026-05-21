import React from 'react';
import { usePermissions } from '@egen/esm-shared-hooks';

interface PermissionBoundaryProps {
  permission: string;
  children: (granted: boolean) => React.ReactNode;
}

/**
 * Render prop pour conditionner le rendu sur une permission.
 *
 * @example
 * <PermissionBoundary permission="admin:users">
 *   {(granted) => <button disabled={!granted}>Supprimer</button>}
 * </PermissionBoundary>
 */
export function PermissionBoundary({ permission, children }: PermissionBoundaryProps) {
  const { hasAccess, isLoading } = usePermissions({ required: [permission] });
  if (isLoading) return null;
  return <>{children(hasAccess)}</>;
}
