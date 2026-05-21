import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** En-tête de section standardisé */
export function SectionHeader({ title, subtitle, actions, icon }) {
    return (_jsxs("div", { className: "egen-section-header", children: [_jsxs("div", { className: "egen-section-header__left", children: [icon && _jsx("span", { className: "egen-section-header__icon", children: icon }), _jsxs("div", { children: [_jsx("h2", { className: "egen-section-header__title", children: title }), subtitle && _jsx("p", { className: "egen-section-header__subtitle", children: subtitle })] })] }), actions && _jsx("div", { className: "egen-section-header__actions", children: actions })] }));
}
