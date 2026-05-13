import React from 'react';
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
export declare function PermissionBoundary({ permission, children }: PermissionBoundaryProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PermissionBoundary.d.ts.map