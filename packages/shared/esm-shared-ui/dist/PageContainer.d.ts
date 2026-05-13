import React from 'react';
interface PageContainerProps {
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
    className?: string;
    padded?: boolean;
}
/** Conteneur de page standardisé pour tous les MFEs IGEN */
export declare function PageContainer({ children, maxWidth, className, padded }: PageContainerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PageContainer.d.ts.map