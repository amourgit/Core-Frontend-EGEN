/**
 * Persistance dans le localStorage avec typage fort.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 */
export declare function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void];
//# sourceMappingURL=useLocalStorage.d.ts.map