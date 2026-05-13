import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@igen/esm-shared-utils';
const MAX_WIDTHS = {
    sm: '640px', md: '768px', lg: '1024px',
    xl: '1280px', '2xl': '1536px', '3xl': '1920px', full: '100%',
};
/** Conteneur de page standardisé pour tous les MFEs IGEN */
export function PageContainer({ children, maxWidth = 'xl', className, padded = true }) {
    return (_jsx("div", { className: cn('igen-page-container', padded && 'igen-page-container--padded', className), style: { maxWidth: MAX_WIDTHS[maxWidth], margin: '0 auto', width: '100%' }, children: children }));
}
