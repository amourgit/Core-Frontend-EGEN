import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Composant d'état vide standardisé pour tous les MFEs */
export function EmptyState({ title, description, icon, action }) {
    return (_jsxs("div", { className: "igen-empty-state", role: "status", children: [icon && _jsx("div", { className: "igen-empty-state__icon", children: icon }), _jsx("h3", { className: "igen-empty-state__title", children: title }), description && _jsx("p", { className: "igen-empty-state__desc", children: description }), action && _jsx("div", { className: "igen-empty-state__action", children: action })] }));
}
