import React from 'react';
import { cn } from '@egen/esm-shared-utils';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  className?: string;
  padded?: boolean;
}

const MAX_WIDTHS = {
  sm: '640px', md: '768px', lg: '1024px',
  xl: '1280px', '2xl': '1536px', '3xl': '1920px', full: '100%',
};

/** Conteneur de page standardisé pour tous les MFEs egen */
export function PageContainer({ children, maxWidth = 'xl', className, padded = true }: PageContainerProps) {
  return (
    <div
      className={cn('egen-page-container', padded && 'egen-page-container--padded', className)}
      style={{ maxWidth: MAX_WIDTHS[maxWidth], margin: '0 auto', width: '100%' }}
    >
      {children}
    </div>
  );
}
