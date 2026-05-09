import React, { ReactNode } from 'react';
type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';
type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 'auto-fit' | 'auto-fill';
interface BaseProps {
    children?: ReactNode;
    className?: string;
}
interface SectionRootProps extends BaseProps {
    /** Largeur maximale de la section */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
    /** Padding vertical de la section */
    py?: SpacingSize;
    /** Padding horizontal de la section */
    px?: SpacingSize;
    /** Couleur de fond */
    background?: string;
    /** Bordure en bas */
    bottomBorder?: boolean;
    /** Bordure en haut */
    topBorder?: boolean;
    /** ID pour ancre */
    id?: string;
}
interface SectionHeaderProps extends BaseProps {
    /** Alignement des éléments */
    align?: AlignItems;
    /** Justification du contenu */
    justify?: JustifyContent;
    /** Direction du flex */
    direction?: FlexDirection;
    /** Gap entre les éléments */
    gap?: SpacingSize;
    /** Padding bottom */
    pb?: SpacingSize;
    /** Bordure en bas */
    border?: boolean;
    /** Couleur de la bordure */
    borderColor?: string;
}
interface SectionBodyProps extends BaseProps {
    /** Type de layout */
    layout?: 'flex' | 'grid' | 'stack';
    /** Direction du flex (si layout=flex) */
    direction?: FlexDirection;
    /** Colonnes de la grille (si layout=grid) */
    gridCols?: GridCols;
    /** Colonnes responsive (si layout=grid) */
    gridColsMd?: GridCols;
    gridColsLg?: GridCols;
    /** Gap entre les éléments */
    gap?: SpacingSize;
    /** Alignement des items */
    alignItems?: AlignItems;
    /** Justification du contenu */
    justifyContent?: JustifyContent;
    /** Padding top */
    pt?: SpacingSize;
    /** Padding bottom */
    pb?: SpacingSize;
}
interface SectionFooterProps extends BaseProps {
    /** Alignement des éléments */
    align?: AlignItems;
    /** Justification du contenu */
    justify?: JustifyContent;
    /** Direction du flex */
    direction?: FlexDirection;
    /** Gap entre les éléments */
    gap?: SpacingSize;
    /** Padding top */
    pt?: SpacingSize;
    /** Bordure en haut */
    border?: boolean;
    /** Couleur de la bordure */
    borderColor?: string;
}
interface SectionTitleProps extends BaseProps {
    /** Niveau de titre (h1-h6) */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** Taille du texte */
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    /** Poids de la police */
    weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    /** Couleur du texte */
    color?: string;
    /** Gradient de texte */
    gradient?: boolean;
}
interface SectionDescriptionProps extends BaseProps {
    /** Taille du texte */
    size?: 'xs' | 'sm' | 'base' | 'lg';
    /** Couleur du texte */
    color?: string;
    /** Opacité */
    opacity?: number;
    /** Marge top */
    mt?: SpacingSize;
}
interface SectionActionsProps extends BaseProps {
    /** Direction */
    direction?: FlexDirection;
    /** Gap */
    gap?: SpacingSize;
    /** Alignement */
    align?: AlignItems;
}
export declare const Section: React.FC<SectionRootProps> & {
    Header: React.FC<SectionHeaderProps>;
    Body: React.FC<SectionBodyProps>;
    Footer: React.FC<SectionFooterProps>;
    Title: React.FC<SectionTitleProps>;
    Description: React.FC<SectionDescriptionProps>;
    Actions: React.FC<SectionActionsProps>;
};
export type { SectionRootProps, SectionHeaderProps, SectionBodyProps, SectionFooterProps, SectionTitleProps, SectionDescriptionProps, SectionActionsProps, };
//# sourceMappingURL=Section.d.ts.map