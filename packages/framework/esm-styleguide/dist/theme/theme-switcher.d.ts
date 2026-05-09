import React from 'react';
interface ThemeSwitcherProps {
    className?: string;
    showDarkModeToggle?: boolean;
    showThemeSelector?: boolean;
    showImportExport?: boolean;
    position?: 'dropdown' | 'inline';
}
export declare const ThemeSwitcher: React.FC<ThemeSwitcherProps>;
export declare const DarkModeToggle: React.FC<{
    className?: string;
}>;
export declare const ThemeColorPreview: React.FC<{
    className?: string;
}>;
export {};
//# sourceMappingURL=theme-switcher.d.ts.map