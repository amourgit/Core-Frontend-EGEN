/**
 * Adds an SVG to the global SVG sprite container, making it available for use
 * throughout the application via SVG use references.
 *
 * @param htmlId The HTML ID to assign to the SVG element. This ID can be referenced
 *   in other parts of the application using `<svg><use href="#htmlId"></use></svg>`.
 * @param svgString The SVG markup as a string to be added to the sprite container.
 *
 * @category UI
 */
export declare function addSvg(htmlId: string, svgString: string): void;
//# sourceMappingURL=svg-utils.d.ts.map