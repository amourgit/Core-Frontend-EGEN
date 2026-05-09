import { ReactNode } from 'react';
import { Theme, ThemeContextType, ThemeChangeEvent } from './types';
export declare const useTheme: () => ThemeContextType;
interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: string;
    enableDarkMode?: boolean;
    onThemeChange?: (e: ThemeChangeEvent) => void;
}
export declare const ThemeProvider: ({ children, defaultTheme, enableDarkMode, onThemeChange, }: ThemeProviderProps) => import("react/jsx-runtime").JSX.Element;
/** Émet un event DOM custom à chaque changement de thème */
export declare const useThemeEvents: () => void;
/** Accès rapide aux variables CSS du thème */
export declare const useThemeVariables: () => {
    theme: Theme;
    isDark: boolean;
    glass: (layer: string) => {
        background: string;
        backdropFilter: string;
        border: string;
        boxShadow: string;
    };
    color: (path: string) => string;
    space: (k: string) => string;
    radius: (k: string) => string;
    shadow: (k: string) => string;
    fs: (k: string) => string;
};
export {};
//# sourceMappingURL=theme-context.d.ts.map