import React, { ReactNode } from 'react';
type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';
/**
 * Variantes de bordures sci-fi disponibles
 */
type BorderVariant = 'default' | 'tech-corners' | 'angular' | 'notched' | 'circuit' | 'beveled' | 'sliced' | 'paneled';
/**
 * Couleurs de thème pour les bordures
 */
type ThemeColor = 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'red' | 'custom';
interface BaseProps {
    children?: ReactNode;
    className?: string;
}
interface FrameRootProps extends BaseProps {
    /** Variante de bordure sci-fi */
    variant?: BorderVariant;
    /** Couleur du thème */
    theme?: ThemeColor;
    /** Couleur personnalisée (si theme='custom') */
    customColor?: string;
    /** Intensité de la lueur */
    glowIntensity?: 'none' | 'low' | 'medium' | 'high';
    /** Animation de la bordure */
    animated?: boolean;
    /** Largeur de la bordure */
    borderWidth?: 1 | 2 | 3 | 4;
    /** Padding global */
    p?: SpacingSize;
    /** Largeur maximale */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
    /** ID pour ancre */
    id?: string;
}
interface FrameHeaderProps extends BaseProps {
    /** Alignement des éléments */
    align?: AlignItems;
    /** Justification du contenu */
    justify?: JustifyContent;
    /** Direction du flex */
    direction?: FlexDirection;
    /** Gap entre les éléments */
    gap?: SpacingSize;
    /** Hauteur du header */
    height?: 'sm' | 'md' | 'lg';
    /** Arrière-plan avec gradient */
    gradient?: boolean;
}
interface FrameBodyProps extends BaseProps {
    /** Type de layout */
    layout?: 'flex' | 'grid' | 'stack';
    /** Direction du flex (si layout=flex) */
    direction?: FlexDirection;
    /** Colonnes de la grille (si layout=grid) */
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Gap entre les éléments */
    gap?: SpacingSize;
    /** Alignement des items */
    alignItems?: AlignItems;
    /** Justification du contenu */
    justifyContent?: JustifyContent;
    /** Padding */
    p?: SpacingSize;
    /** Scroll si contenu dépasse */
    scrollable?: boolean;
    /** Hauteur max si scrollable */
    maxHeight?: string;
}
interface FrameFooterProps extends BaseProps {
    /** Alignement des éléments */
    align?: AlignItems;
    /** Justification du contenu */
    justify?: JustifyContent;
    /** Direction du flex */
    direction?: FlexDirection;
    /** Gap entre les éléments */
    gap?: SpacingSize;
    /** Hauteur du footer */
    height?: 'sm' | 'md' | 'lg';
    /** Transparence accrue */
    transparent?: boolean;
}
export declare const Frame: React.FC<FrameRootProps> & {
    Header: React.FC<FrameHeaderProps>;
    Body: React.FC<FrameBodyProps>;
    Footer: React.FC<FrameFooterProps>;
};
export type { FrameRootProps, FrameHeaderProps, FrameBodyProps, FrameFooterProps, BorderVariant, ThemeColor, };
//# sourceMappingURL=Frame.d.ts.map