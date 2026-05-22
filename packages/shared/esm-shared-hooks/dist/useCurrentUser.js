import { useState, useEffect } from 'react';
/**
 * Hook pour accéder à l'utilisateur courant depuis le store egen.
 *
 * @example
 * const { user, isAuthenticated } = useCurrentUser();
 */
export function useCurrentUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const store = window.__EGEN_AUTH_STORE__;
        if (!store) {
            setIsLoading(false);
            return;
        }
        const update = () => {
            const state = store.getState?.();
            setUser(state?.user ?? null);
            setIsLoading(false);
        };
        update();
        // S'abonner aux changements du store Zustand
        const unsub = store.subscribe?.(update);
        return () => unsub?.();
    }, []);
    return { user, isLoading, isAuthenticated: !!user };
}
