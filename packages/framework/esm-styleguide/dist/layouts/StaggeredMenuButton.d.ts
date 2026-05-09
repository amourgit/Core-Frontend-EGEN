import React from 'react';
export interface MenuToggleButtonProps {
    isOpen: boolean;
    onToggle: () => void;
    menuButtonColor?: string;
    openMenuButtonColor?: string;
    changeMenuColorOnOpen?: boolean;
    className?: string;
}
export declare const MenuToggleButton: React.FC<MenuToggleButtonProps>;
export default MenuToggleButton;
//# sourceMappingURL=StaggeredMenuButton.d.ts.map