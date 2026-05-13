import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** En-tête de section standardisé */
export function SectionHeader({ title, subtitle, actions, icon }) {
    return (_jsxs("div", { className: "igen-section-header", children: [_jsxs("div", { className: "igen-section-header__left", children: [icon && _jsx("span", { className: "igen-section-header__icon", children: icon }), _jsxs("div", { children: [_jsx("h2", { className: "igen-section-header__title", children: title }), subtitle && _jsx("p", { className: "igen-section-header__subtitle", children: subtitle })] })] }), actions && _jsx("div", { className: "igen-section-header__actions", children: actions })] }));
}
