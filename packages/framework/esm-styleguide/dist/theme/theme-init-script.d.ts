/**
 * Rendu côté serveur uniquement.
 * Injecte un <script> synchrone qui :
 *   1. Lit les prefs theme dans localStorage
 *   2. Applique dark/light class sur <html>
 *   3. Injecte des variables CSS minimales AVANT le premier paint
 *
 * Résultat : ZÉRO flash blanc/noir au chargement, ZÉRO FOUC.
 */
export declare function ThemeInitScript(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=theme-init-script.d.ts.map