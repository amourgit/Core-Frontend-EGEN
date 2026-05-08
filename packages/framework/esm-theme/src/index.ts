// ============================================================
// @egen/esm-theme — Theme System Package
//
// Usage :
//   import { ThemeProvider, useTheme, themeUtils } from '@egen/esm-theme';
//   import '@egen/esm-theme/globals.css';
// ============================================================

// Types
export type {
  Theme, ThemeColors, ThemeGlass, ThemeGlass as GlassTheme,
  GlassLayer, GlassPalette, ThemeTypography, ThemeSpacing,
  ThemeLayout, ThemeAnimation, ThemeEffects, ThemeComponents,
  ThemeContextType, ThemeChangeEvent, ThemeStorage,
  ColorScale, SurfaceMode, BorderMode, FontSize, ThemeTenant,
} from './types';

// Provider & hooks
export { ThemeProvider, useTheme, useThemeEvents, useThemeVariables } from './theme-context';

// SSR anti-FOUC script
export { ThemeInitScript } from './theme-init-script';

// UI switcher components
export { ThemeSwitcher, DarkModeToggle, ThemeColorPreview } from './theme-switcher';

// Core loader service
export { ThemeLoader } from './theme-loader';

// Convenience hooks
export { useTheme as useThemeHook } from './use-theme';
export { useGlass }                  from './use-glass';

// Utilities
export const themeUtils = {
  hexToRgb(hex: string) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : null;
  },
  glassStyle(layer: 'xs'|'sm'|'md'|'lg'|'xl'|'card'|'sidebar'|'header'|'modal'|'dropdown'|'toast') {
    return {
      background:           `var(--glass-${layer}-bg)`,
      backdropFilter:       `var(--glass-${layer}-blur)`,
      WebkitBackdropFilter: `var(--glass-${layer}-blur)`,
      border:               `var(--glass-${layer}-border)`,
      boxShadow:            `var(--glass-${layer}-shadow)`,
    };
  },
};
