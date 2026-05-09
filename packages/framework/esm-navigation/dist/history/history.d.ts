/**
 * Initialize history from sessionStorage. If history  is empty, add
 * document.referrer if available.
 *
 * @internal
 */
export declare function setupHistory(): void;
/**
 * Returns a list of URLs representing the history of the current window session.
 */
export declare function getHistory(): Array<string>;
/**
 * Rolls back the history to the specified point and navigates to that URL.
 *
 * @param toUrl: The URL in the history to navigate to. History after that index
 * will be deleted. If the URL is not found in the history, an error will be
 * thrown.
 */
export declare function goBackInHistory({ toUrl }: {
    toUrl: string;
}): void;
/**
 * Clears the history from sessionStorage. This should be done when the user
 * logs out.
 */
export declare function clearHistory(): void;
//# sourceMappingURL=history.d.ts.map