export type { Theme, ThemeColors, ThemeGlass, ThemeGlass as GlassTheme, GlassLayer, GlassPalette, ThemeTypography, ThemeSpacing, ThemeLayout, ThemeAnimation, ThemeEffects, ThemeComponents, ThemeContextType, ThemeChangeEvent, ThemeStorage, ColorScale, SurfaceMode, BorderMode, FontSize, ThemeTenant, ComponentVariant, } from './types';
export { ThemeProvider, useTheme, useThemeEvents, useThemeVariables, } from './theme-context';
export { ThemeInitScript } from './theme-init-script';
export { ThemeSwitcher, DarkModeToggle, ThemeColorPreview, } from './theme-switcher';
export { ThemeLoader } from './theme-loader';
export declare const themeUtils: {
    hexToRgb(hex: string): {
        r: number;
        g: number;
        b: number;
    } | null;
    rgbToHex(r: number, g: number, b: number): string;
    getLuminance(hex: string): number;
    getContrastRatio(c1: string, c2: string): number;
    isAccessible(fg: string, bg: string, level?: "AA" | "AAA"): boolean;
    lighten(hex: string, pct: number): string;
    darken(hex: string, pct: number): string;
    generateColorScale(base: string): Record<string, string>;
    glassStyle(layer: "xs" | "sm" | "md" | "lg" | "xl" | "card" | "sidebar" | "header" | "modal" | "dropdown" | "toast"): {
        background: string;
        backdropFilter: string;
        WebkitBackdropFilter: string;
        border: string;
        boxShadow: string;
    };
};
//# sourceMappingURL=index.d.ts.map