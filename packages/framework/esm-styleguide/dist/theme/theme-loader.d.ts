import { Theme, ThemeStorage } from './types';
export declare class ThemeLoader {
    private static instance;
    private currentTheme;
    static getInstance(): ThemeLoader;
    loadTheme(name: string): Promise<Theme>;
    applyTheme(theme: Theme, isDark?: boolean): void;
    buildCSSBlock(theme: Theme, isDark: boolean): string;
    private buildGlassVars;
    private buildKeyframes;
    /**
     * Retourne un script JS inline à insérer dans <head>
     * Il lit localStorage et injecte les variables AVANT le premier paint.
     * Résultat : ZÉRO flash, ZÉRO FOUC.
     */
    buildSSRScript(): string;
    saveThemePreferences(themeName: string, isDark: boolean, customTheme?: Theme): void;
    loadThemePreferences(): ThemeStorage | null;
    private validate;
    getCurrentTheme(): Theme | null;
    discoverThemes(): Promise<string[]>;
    exportTheme(): Theme | null;
    importTheme(theme: Theme): void;
}
//# sourceMappingURL=theme-loader.d.ts.map