import { type ReactElement } from 'react';
import { type RenderOptions } from '@testing-library/react';
export declare const swrWrapper: ({ children }: {
    children: any;
}) => import("react/jsx-runtime").JSX.Element;
export declare const renderWithSwr: (ui: ReactElement, options?: Omit<RenderOptions, "queries">) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
//# sourceMappingURL=test-utils.d.ts.map