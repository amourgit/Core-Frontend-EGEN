import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { usePermissions } from '@igen/esm-shared-hooks';
/**
 * Render prop pour conditionner le rendu sur une permission.
 *
 * @example
 * <PermissionBoundary permission="admin:users">
 *   {(granted) => <button disabled={!granted}>Supprimer</button>}
 * </PermissionBoundary>
 */
export function PermissionBoundary({ permission, children }) {
    const { hasAccess, isLoading } = usePermissions({ required: [permission] });
    if (isLoading)
        return null;
    return _jsx(_Fragment, { children: children(hasAccess) });
}
