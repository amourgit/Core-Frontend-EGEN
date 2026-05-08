# @egen/esm-theme

Système de thème dynamique pour le Core EGEN.

## Architecture

```
src/
├── types.ts              # Theme, ColorScale, GlassPalette, etc.
├── theme-context.tsx     # ThemeProvider + useTheme hook
├── theme-loader.ts       # ThemeLoader (singleton, fetch + CSS inject)
├── theme-init-script.tsx # SSR anti-FOUC script
├── theme-switcher.tsx    # UI: ThemeSwitcher, DarkModeToggle
├── use-theme.ts          # Convenience hook
├── use-glass.ts          # Glass morphism utilities
├── globals.css           # Variables CSS de base + reset
└── index.ts              # Barrel export
```

## Usage

```tsx
// Dans main.tsx du CORE
import { ThemeProvider, ThemeInitScript } from '@egen/esm-theme';
import '@egen/esm-theme/globals.css';

// Dans index.html (anti-FOUC SSR)
const { ThemeLoader } = await import('@egen/esm-theme');
const script = ThemeLoader.getInstance().buildSSRScript();

// Dans un composant
import { useTheme, themeUtils } from '@egen/esm-theme';

function MyComponent() {
  const { isDark, toggleDarkMode, theme } = useTheme();
  const glassStyle = themeUtils.glassStyle('card');
  return <div style={glassStyle}>...</div>;
}
```

## Thèmes

Les fichiers de thème sont des JSON dans `/public/themes/*.json`.
Format : voir `src/types.ts` (interface `Theme`).
