/** @module @category UI */
import React from 'react';
export interface PageHeaderContentProps {
    title: string | JSX.Element;
    illustration: React.ReactElement;
    className?: string;
}
export interface PageHeaderWrapperProps {
    children: React.ReactNode;
    className?: string;
}
/** @internal */
export type ExcludeOptionalKeys<T, U> = {
    [K in keyof T]: K extends keyof U ? never : K;
}[keyof T];
/** @internal */
export type XOR<T, U> = (T & {
    [K in ExcludeOptionalKeys<U, T>]?: never;
}) | (U & {
    [K in ExcludeOptionalKeys<T, U>]?: never;
});
export type PageHeaderProps = XOR<PageHeaderWrapperProps, PageHeaderContentProps>;
/**
 * The page header is typically located at the top of a dashboard. It includes a pictogram on the left,
 * the name of the dashboard or page, and the `implementationName` from the configuration, which is typically
 * the name of the clinic or the authority that is using the implementation. It can also include interactive
 * content on the right-hand side. It can be used in two ways:
 *
 * 1. Alone, in order to render just the page header, with no content on the right side:
 * @example
 * ```tsx
 *   <PageHeader title="My Dashboard" illustration={<Illustration />} />
 * ```
 *
 * 2. Wrapped around the [[PageHeaderContent]] component, in order to render the page header on the left
 * and some other content on the right side:
 * @example
 * ```tsx
 *   <PageHeader>
 *     <PageHeaderContent title="My Dashboard" illustration={<Illustration />} />
 *     <Button>Click me</Button>
 *   </PageHeader>
 * ```
 */
export declare const PageHeader: React.FC<PageHeaderProps>;
/**
 * The PageHeaderContent component should be used inside the [[PageHeader]] component. It is used if the page
 * header should include some content on the right side, in addition to the pictogram and the name of the page.
 * If only the page header is needed, without any additional content, the [[PageHeader]] component can be used
 * on its own, and the PageHeaderContent component is not needed.
 *
 * @example
 * ```tsx
 *   <PageHeader>
 *     <PageHeaderContent title="My Dashboard" illustration={<Illustration />} />
 *     <Button>Click me</Button>
 *   </PageHeader>
 * ```
 */
export declare const PageHeaderContent: React.FC<PageHeaderContentProps>;
//# sourceMappingURL=page-header.component.d.ts.map