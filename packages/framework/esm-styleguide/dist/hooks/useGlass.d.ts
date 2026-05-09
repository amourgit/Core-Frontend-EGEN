type GlassLayer = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'card' | 'sidebar' | 'header' | 'modal' | 'dropdown' | 'toast';
interface GlassStyle {
    background: string;
    backdropFilter: string;
    WebkitBackdropFilter: string;
    border: string;
    boxShadow: string;
    borderRadius?: string;
    transition?: string;
}
/**
 * Retourne un style object React inline pour appliquer le Glass Morphism.
 *
 * Usage :
 *   const glassCard = useGlass('card');
 *   <div style={glassCard}>...</div>
 *
 * Ou avec Tailwind className + style inline pour backdrop-filter :
 *   const { style, className } = useGlass('card', { withRadius: 'xl', withTransition: true });
 */
export declare function useGlass(layer?: GlassLayer, options?: {
    withRadius?: keyof typeof radiusMap;
    withTransition?: boolean;
}): GlassStyle;
/**
 * Retourne les classes Tailwind + style inline pour le Glass Morphism.
 * Utile quand on veut combiner Tailwind avec le glass custom.
 */
export declare function useGlassClass(layer?: GlassLayer): {
    style: GlassStyle;
    className: string;
};
declare const radiusMap: {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    full: number;
};
export {};
//# sourceMappingURL=useGlass.d.ts.map