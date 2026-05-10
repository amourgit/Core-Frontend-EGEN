/** @module @category UI */
import React from 'react';
import { type SideNavProps } from '@carbon/react';
/**
 * Extended props for the LeftNavMenu component
 */
interface LeftNavMenuProps extends SideNavProps {
    /**
     * Flag indicating if this component is a child of the header component.
     */
    isChildOfHeader?: boolean;
    /** HTML inert attribute */
    inert?: boolean;
}
/**
 * This component renders the left nav in desktop mode. It's also used to render the same
 * nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx
 *
 * Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
 * is deprecated; it simply renders nothing.
 */
export declare const LeftNavMenu: React.ForwardRefExoticComponent<LeftNavMenuProps & React.RefAttributes<HTMLElement>>;
export {};
//# sourceMappingURL=index.d.ts.map