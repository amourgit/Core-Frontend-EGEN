import React from 'react';
export interface StaggeredMenuItem {
    label: string;
    ariaLabel: string;
    link: string;
}
export interface StaggeredMenuSocialItem {
    label: string;
    link: string;
}
export interface StaggeredMenuPanelProps {
    isOpen: boolean;
    onClose?: () => void;
    position?: 'left' | 'right';
    colors?: string[];
    items?: StaggeredMenuItem[];
    socialItems?: StaggeredMenuSocialItem[];
    displaySocials?: boolean;
    displayItemNumbering?: boolean;
    accentColor?: string;
    closeOnClickAway?: boolean;
}
export declare const StaggeredMenuPanel: React.FC<StaggeredMenuPanelProps>;
export default StaggeredMenuPanel;
//# sourceMappingURL=StaggeredMenu.d.ts.map