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
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
    py?: SpacingSize;
    px?: SpacingSize;
    background?: string;
    bottomBorder?: boolean;
    topBorder?: boolean;
    id?: string;
}
interface SectionHeaderProps extends BaseProps {
    align?: AlignItems;
    justify?: JustifyContent;
    direction?: FlexDirection;
    gap?: SpacingSize;
    pb?: SpacingSize;
    border?: boolean;
    borderColor?: string;
}
interface SectionBodyProps extends BaseProps {
    layout?: 'flex' | 'grid' | 'stack';
    direction?: FlexDirection;
    gridCols?: GridCols;
    gridColsMd?: GridCols;
    gridColsLg?: GridCols;
    gap?: SpacingSize;
    alignItems?: AlignItems;
    justifyContent?: JustifyContent;
    pt?: SpacingSize;
    pb?: SpacingSize;
}
interface SectionTitleProps extends BaseProps {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
    color?: string;
}
export declare const Section: React.FC<SectionRootProps> & {
    Header: React.FC<SectionHeaderProps>;
    Body: React.FC<SectionBodyProps>;
    Title: React.FC<SectionTitleProps>;
};
export {};
//# sourceMappingURL=SectionTest.d.ts.map