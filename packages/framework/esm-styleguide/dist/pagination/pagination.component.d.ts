import React from 'react';
import { type PaginationProps as CarbonPaginationProps } from '@carbon/react';
export interface PaginationProps {
    /** The count of current items displayed */
    currentItems: number;
    /** The count of total items displayed */
    totalItems: number;
    /** The current page number */
    pageNumber: number;
    /** The size of each page */
    pageSize: number;
    /** A callback to be called when the page changes */
    onPageNumberChange?: CarbonPaginationProps['onChange'];
    /** An optional URL the user should be directed to if they click on the link to see all results */
    dashboardLinkUrl?: string;
    /** Optional text to display instead of the default "See all" */
    dashboardLinkLabel?: string;
}
/**
 * Re-usable pagination bar
 */
export declare const Pagination: React.FC<PaginationProps>;
//# sourceMappingURL=pagination.component.d.ts.map