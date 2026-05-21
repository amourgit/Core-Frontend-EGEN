import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Composant générique pour afficher les 4 états async (idle/loading/success/error).
 *
 * @example
 * <AsyncStateView
 *   state={state}
 *   renderSuccess={(patients) => <PatientList data={patients} />}
 * />
 */
export function AsyncStateView({ state, renderSuccess, renderLoading = () => _jsx("div", { className: "egen-spinner", "aria-label": "Chargement\u2026" }), renderError = (msg) => _jsx("div", { className: "egen-error", role: "alert", children: msg }), renderIdle = () => null, }) {
    switch (state.status) {
        case 'loading': return _jsx(_Fragment, { children: renderLoading() });
        case 'success': return _jsx(_Fragment, { children: renderSuccess(state.data) });
        case 'error': return _jsx(_Fragment, { children: renderError(state.error.message) });
        default: return _jsx(_Fragment, { children: renderIdle() });
    }
}
