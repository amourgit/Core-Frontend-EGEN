import { useState, useCallback } from 'react';
/**
 * Persistance dans le localStorage avec typage fort.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 */
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch {
            return initialValue;
        }
    });
    const setValue = useCallback((value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error(`useLocalStorage: impossible d'écrire "${key}"`, error);
        }
    }, [key]);
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            window.localStorage.removeItem(key);
        }
        catch (error) {
            console.error(`useLocalStorage: impossible de supprimer "${key}"`, error);
        }
    }, [key, initialValue]);
    return [storedValue, setValue, removeValue];
}
