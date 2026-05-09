/** @module @category UI */
import React, { type ComponentProps } from 'react';
import { OverflowMenuItem } from '@carbon/react';
interface CustomOverflowMenuContextValue {
    closeMenu: () => void;
}
export declare function useCustomOverflowMenu(): CustomOverflowMenuContextValue;
interface CustomOverflowMenuProps {
    /** The content to display as the menu trigger button. */
    menuTitle: React.ReactNode;
    /** The menu items to display when the menu is open. */
    children: React.ReactNode;
}
/**
 * A custom overflow menu that supports a text/icon trigger button instead of
 * Carbon's icon-only OverflowMenu trigger. Uses CSS-based show/hide rather
 * than Carbon's FloatingMenu portal, so keyboard behavior (Escape, arrow keys,
 * auto-focus) is implemented here to match the WAI-ARIA menu button pattern.
 */
export declare function CustomOverflowMenu({ menuTitle, children }: CustomOverflowMenuProps): import("react/jsx-runtime").JSX.Element;
type OverflowMenuItemProps = ComponentProps<typeof OverflowMenuItem>;
export declare function CustomOverflowMenuItem(props: Omit<OverflowMenuItemProps, 'closeMenu'>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=custom-overflow-menu.component.d.ts.map