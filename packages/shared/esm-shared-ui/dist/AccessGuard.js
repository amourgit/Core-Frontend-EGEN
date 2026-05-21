import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { usePermissions } from '@egen/esm-shared-hooks';
/**
 * Garde d'accès basée sur les permissions egen.
 * Enveloppe les zones sensibles d'un micro-frontend.
 *
 * @example
 * <AccessGuard required={['patient:write']}>
 *   <EditPatientForm />
 * </AccessGuard>
 */
export function AccessGuard({ required = [], fallback = null, graceful = false, children }) {
    const { hasAccess, isLoading } = usePermissions({ required });
    if (isLoading)
        return null;
    if (!hasAccess) {
        if (graceful) {
            return (_jsx("div", { style: { opacity: 0.4, pointerEvents: 'none', cursor: 'not-allowed' }, title: "Permissions insuffisantes", children: children }));
        }
        return _jsx(_Fragment, { children: fallback });
    }
    return _jsx(_Fragment, { children: children });
}
