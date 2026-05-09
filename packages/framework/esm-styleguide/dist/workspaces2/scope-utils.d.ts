/**
 * Determines whether workspaces should close based on a scope pattern and URL change.
 *
 * @param scopePattern - A regex pattern defining the scope. May include capture groups.
 * @param oldUrl - The URL being navigated away from.
 * @param newUrl - The URL being navigated to.
 * @returns `true` if the workspace should close, `false` if it should stay open.
 */
export declare function shouldCloseOnUrlChange(scopePattern: string, oldUrl: string, newUrl: string): boolean;
//# sourceMappingURL=scope-utils.d.ts.map