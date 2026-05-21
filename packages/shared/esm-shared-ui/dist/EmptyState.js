import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Composant d'état vide standardisé pour tous les MFEs */
export function EmptyState({ title, description, icon, action }) {
    return (_jsxs("div", { className: "egen-empty-state", role: "status", children: [icon && _jsx("div", { className: "egen-empty-state__icon", children: icon }), _jsx("h3", { className: "egen-empty-state__title", children: title }), description && _jsx("p", { className: "egen-empty-state__desc", children: description }), action && _jsx("div", { className: "egen-empty-state__action", children: action })] }));
}
